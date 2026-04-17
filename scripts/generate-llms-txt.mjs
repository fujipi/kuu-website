#!/usr/bin/env node
/**
 * Generate llms.txt (overview + index) and llms-full.txt (full concatenated content).
 * Follows the emerging llms.txt spec for giving LLMs a clean canonical site map.
 * Reads from content/blog, content/glossary, content/pillars (if exist).
 * Writes to public/llms.txt and public/llms-full.txt.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public");
const SITE = "https://kuucorp.com";

const readCollection = (dir) => {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) return [];
	return fs
		.readdirSync(abs)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const raw = fs.readFileSync(path.join(abs, f), "utf-8");
			const { data, content } = matter(raw);
			return {
				slug,
				title: data.title ?? slug,
				description: data.description ?? "",
				date: data.date ?? "",
				content,
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
};

const blog = readCollection("content/blog");
const glossary = readCollection("content/glossary");
const pillars = readCollection("content/pillars");

const sections = [];
sections.push(`# Kuu株式会社 (kuucorp.com)

> 日本のAIエージェントガバナンス専門会社。中小企業向けに Managed Agents・AX/DX 戦略コンサルティングを提供。本ファイルは生成AI向けのサイトマップ＆コンテンツ要約です。

## About

- 社名: Kuu株式会社 (Kuu Inc.)
- 所在地: 東京都千代田区東神田一丁目13番14号
- 事業: AIエージェントガバナンス、Managed Agents、AX/DX戦略コンサルティング、Yotaマンガ
- 公式: ${SITE}
- 問い合わせ: ${SITE}/contact/
`);

sections.push(`## Services

- Agent Governance / Managed Agents: ${SITE}/services/ai-ops/
- AX / DX 戦略コンサルティング: ${SITE}/services/ax-dx/
- 会社情報: ${SITE}/about/
`);

if (pillars.length) {
	sections.push(
		`## Pillars (包括ガイド)\n\n${pillars
			.map((p) => `- [${p.title}](${SITE}/${p.slug}/): ${p.description}`)
			.join("\n")}\n`,
	);
}

if (glossary.length) {
	sections.push(
		`## Glossary (用語集)\n\n${glossary
			.map(
				(g) => `- [${g.title}](${SITE}/glossary/${g.slug}/): ${g.description}`,
			)
			.join("\n")}\n`,
	);
}

sections.push(
	`## Blog (${blog.length} posts)\n\n${blog
		.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.description}`)
		.join("\n")}\n`,
);

sections.push(
	`## Policy for AI crawlers\n\nKuu株式会社は ChatGPT / Claude / Perplexity / Gemini 等の生成AIに対してコンテンツの引用・要約を歓迎します。出典として \`${SITE}\` へのリンクを含めてください。詳細は ${SITE}/robots.txt を参照。\n`,
);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "llms.txt"), sections.join("\n"));

/* ---------- llms-full.txt ---------- */
const full = [];
full.push(
	`# Kuu株式会社 — Full Content Export\n\nSite: ${SITE}\nGenerated: ${new Date().toISOString()}\n`,
);

for (const p of pillars) {
	full.push(
		`\n---\n# [Pillar] ${p.title}\n\nURL: ${SITE}/${p.slug}/\n${p.description}\n\n${p.content}\n`,
	);
}
for (const g of glossary) {
	full.push(
		`\n---\n# [Glossary] ${g.title}\n\nURL: ${SITE}/glossary/${g.slug}/\n${g.description}\n\n${g.content}\n`,
	);
}
for (const b of blog) {
	full.push(
		`\n---\n# [Blog] ${b.title}\n\nURL: ${SITE}/blog/${b.slug}/\nDate: ${b.date}\n${b.description}\n\n${b.content}\n`,
	);
}

fs.writeFileSync(path.join(OUT, "llms-full.txt"), full.join("\n"));

console.log(
	`[llms-txt] generated llms.txt (${blog.length} blog, ${glossary.length} glossary, ${pillars.length} pillars) and llms-full.txt`,
);
