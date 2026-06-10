import { describe, expect, it } from "vitest";
import { mdToHtml } from "@/lib/mdToHtml";

describe("mdToHtml", () => {
	it("renders headings H1-H4", () => {
		const html = mdToHtml("## 見出し2\n\n### 見出し3\n\n#### 見出し4");
		expect(html).toContain("<h2>見出し2</h2>");
		expect(html).toContain("<h3>見出し3</h3>");
		expect(html).toContain("<h4>見出し4</h4>");
	});

	it("applies idMap anchors using level:text keys (buildToc format)", () => {
		const idMap = new Map([
			["2:導入", "intro"],
			["3:詳細", "detail"],
		]);
		const html = mdToHtml("## 導入\n\n### 詳細", idMap);
		expect(html).toContain('<h2 id="intro">導入</h2>');
		expect(html).toContain('<h3 id="detail">詳細</h3>');
	});

	it("renders inline bold / italic / link / code", () => {
		const html = mdToHtml(
			"**強調**と*斜体*と[リンク](/blog/)と`code`を含む段落。",
		);
		expect(html).toContain("<strong>強調</strong>");
		expect(html).toContain("<em>斜体</em>");
		expect(html).toContain('<a href="/blog/">リンク</a>');
		expect(html).toContain("<code>code</code>");
	});

	it("renders Direct-Answer blockquote with answer-block class", () => {
		const html = mdToHtml("> AIエージェントは自律的に動くシステムです。");
		expect(html).toBe(
			'<blockquote class="answer-block"><p>AIエージェントは自律的に動くシステムです。</p></blockquote>',
		);
	});

	it("joins multi-line blockquotes into one paragraph", () => {
		const html = mdToHtml("> 一行目\n> 二行目");
		expect(html).toContain("<p>一行目 二行目</p>");
	});

	it("renders pipe tables", () => {
		const md = "| 項目 | 値 |\n|---|---|\n| A | 1 |\n| B | 2 |";
		const html = mdToHtml(md);
		expect(html).toContain("<table>");
		expect(html).toContain("<th>項目</th>");
		expect(html).toContain("<td>A</td>");
		expect(html).toContain("<td>2</td>");
	});

	it("renders horizontal rules", () => {
		expect(mdToHtml("前\n\n---\n\n後")).toContain("<hr />");
	});

	it("renders unordered and ordered lists", () => {
		const ul = mdToHtml("- 一つ\n- 二つ");
		expect(ul).toContain("<ul>");
		expect(ul).toContain("<li>一つ</li>");
		const ol = mdToHtml("1. 最初\n2. 次");
		expect(ol).toContain("<ol>");
		expect(ol).toContain("<li>最初</li>");
	});

	it("splits mixed label + list blocks", () => {
		const html = mdToHtml("**前提**:\n- 項目A\n- 項目B");
		expect(html).toContain("<p><strong>前提</strong>:</p>");
		expect(html).toContain("<li>項目A</li>");
	});

	it("converts single newlines in paragraphs to <br />", () => {
		expect(mdToHtml("一行目\n二行目")).toBe("<p>一行目<br />二行目</p>");
	});

	it("ignores empty blocks", () => {
		expect(mdToHtml("\n\n\n")).toBe("");
	});
});
