#!/usr/bin/env node
/**
 * AIエージェント/LLMクローラー向けの Markdown ミラー生成（postbuild）。
 *
 * content/{blog,case,glossary,news,resources} の各記事を
 * out/{section}/{slug}/index.md として配信する。HTML 側は
 * <link rel="alternate" type="text/markdown"> でこの URL を案内する
 * （src/lib/seo.ts の markdownPath）。
 *
 * 出力先は out/ のみ（public/ には書かない — デプロイ要件・linkcheck は
 * out/ で満たせるため。og/feed の public+out 両書き方式とは目的が異なる）。
 * 実行順は postbuild チェーン内（pagefind より前）。後続の
 * check-internal-links.mjs が <link> の .md 実在を検証する。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const SITE = "https://kuucorp.com";

if (!fs.existsSync(OUT)) {
	console.error("[md-mirrors] out/ がありません。next build 後に実行します。");
	process.exit(1);
}

const SECTIONS = ["blog", "case", "glossary", "news", "resources"];

let written = 0;
let skipped = 0;

for (const section of SECTIONS) {
	const dir = path.join(ROOT, "content", section);
	if (!fs.existsSync(dir)) continue;
	const files = fs
		.readdirSync(dir)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
	for (const f of files) {
		const slug = f.replace(/\.(mdx|md)$/, "");
		const { data, content } = matter(
			fs.readFileSync(path.join(dir, f), "utf8"),
		);

		// 対応する HTML ページが無い場合は警告して skip
		// （content とルーティングの不整合検知。リダイレクト統合slug等）
		const pageDir = path.join(OUT, section, slug);
		if (!fs.existsSync(path.join(pageDir, "index.html"))) {
			console.warn(
				`[md-mirrors] WARN: out/${section}/${slug}/index.html が無いため skip`,
			);
			skipped++;
			continue;
		}

		const title = data.title ?? data.term ?? slug;
		const header = [
			`# ${title}`,
			"",
			...(data.description ? [`> ${data.description}`, ""] : []),
			`- Canonical: ${SITE}/${section}/${slug}/`,
			...(data.date ? [`- Date: ${data.date}`] : []),
			...(data.lastModified ? [`- Last modified: ${data.lastModified}`] : []),
			`- Publisher: Kuu株式会社 (${SITE})`,
			"",
			"---",
			"",
		].join("\n");

		fs.writeFileSync(
			path.join(pageDir, "index.md"),
			header + content.trim() + "\n",
		);
		written++;
	}
}

console.log(
	`[md-mirrors] generated ${written} markdown mirrors (skipped ${skipped}) -> out/{section}/{slug}/index.md`,
);
