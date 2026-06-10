import { describe, expect, it } from "vitest";
import { autoLinkGlossary } from "@/lib/autoLinkGlossary";

const TERMS = [
	{ slug: "agent-governance", term: "エージェントガバナンス" },
	{ slug: "agent-harness", term: "エージェントハーネス" },
	{ slug: "mcp", term: "MCP", english: "Model Context Protocol" },
	{ slug: "shadow-ai", term: "シャドーAI", english: "Shadow AI" },
];

describe("autoLinkGlossary", () => {
	it("links the first occurrence of a term in plain text", () => {
		const html = "<p>エージェントガバナンスの設計が重要です。</p>";
		expect(autoLinkGlossary(html, TERMS)).toBe(
			'<p><a href="/glossary/agent-governance/">エージェントガバナンス</a>の設計が重要です。</p>',
		);
	});

	it("links each term at most once", () => {
		const html = "<p>MCPの話。MCPは便利。</p>";
		const out = autoLinkGlossary(html, TERMS);
		expect(out.match(/href="\/glossary\/mcp\/"/g)).toHaveLength(1);
	});

	it("respects the per-page max link budget", () => {
		const html =
			"<p>エージェントガバナンスとエージェントハーネスとMCPとシャドーAI。</p>";
		const out = autoLinkGlossary(html, TERMS, { maxLinks: 2 });
		expect(out.match(/href="\/glossary\//g)).toHaveLength(2);
	});

	it("skips terms inside existing anchors", () => {
		const html = '<p><a href="/blog/x/">エージェントガバナンス入門</a></p>';
		expect(autoLinkGlossary(html, TERMS)).toBe(html);
	});

	it("skips code, pre and headings", () => {
		const html =
			"<h2>エージェントガバナンスとは</h2><pre>MCP</pre><p><code>MCP</code>を使う。</p>";
		const out = autoLinkGlossary(html, TERMS);
		expect(out).toContain("<h2>エージェントガバナンスとは</h2>");
		expect(out).toContain("<pre>MCP</pre>");
		expect(out).toContain("<code>MCP</code>");
		// 本文中の「を使う」直前の MCP は code 内なのでリンクされない
		expect(out.match(/href="\/glossary\/mcp\/"/g)).toBeNull();
	});

	it("skips Direct-Answer blocks (answer-block)", () => {
		const html =
			'<blockquote class="answer-block"><p>エージェントガバナンスは重要です。</p></blockquote><p>本文のエージェントガバナンス。</p>';
		const out = autoLinkGlossary(html, TERMS);
		// answer-block 内はリンクされず、本文側の初出がリンクされる
		expect(out).toContain(
			'<blockquote class="answer-block"><p>エージェントガバナンスは重要です。</p></blockquote>',
		);
		expect(out).toContain('<a href="/glossary/agent-governance/">');
	});

	it("does not auto-link a term that is already manually linked on the page", () => {
		const html =
			'<p>冒頭の<a href="/glossary/mcp/">MCP</a>解説。後段でもMCPに触れる。</p>';
		const out = autoLinkGlossary(html, TERMS);
		expect(out.match(/href="\/glossary\/mcp\/"/g)).toHaveLength(1);
	});

	it("prefers longer terms on overlapping matches (CJK substring collision)", () => {
		const terms = [
			...TERMS,
			{ slug: "agent", term: "エージェント" }, // 仮に短い用語があっても
		];
		const html = "<p>エージェントガバナンスを導入する。</p>";
		const out = autoLinkGlossary(html, terms);
		expect(out).toContain('href="/glossary/agent-governance/"');
		// 「エージェントガバナンス」の内部が agent にリンクされない
		expect(out).not.toContain(
			'<a href="/glossary/agent/">エージェント</a>ガバナンス',
		);
	});

	it("requires word boundaries for ASCII terms", () => {
		const terms = [{ slug: "rag", term: "RAG" }];
		const html = "<p>STORAGEの話とRAGの話。</p>";
		const out = autoLinkGlossary(html, terms);
		expect(out).toContain("STORAGEの話");
		expect(out).toContain('<a href="/glossary/rag/">RAG</a>の話');
	});

	it("excludes the page's own term via selfSlug", () => {
		const html = "<p>MCPの定義。</p>";
		const out = autoLinkGlossary(html, TERMS, { selfSlug: "mcp" });
		expect(out).toBe(html);
	});

	it("links english aliases", () => {
		const html = "<p>Model Context Protocol を採用する。</p>";
		const out = autoLinkGlossary(html, TERMS);
		expect(out).toContain(
			'<a href="/glossary/mcp/">Model Context Protocol</a>',
		);
	});

	it("ignores terms of 2 characters or fewer", () => {
		const terms = [{ slug: "ax", term: "AX" }];
		const html = "<p>AXの推進。</p>";
		expect(autoLinkGlossary(html, terms)).toBe(html);
	});
});
