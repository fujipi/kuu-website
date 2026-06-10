#!/usr/bin/env node
/**
 * Build RSS 2.0, Atom 1.0, and JSON Feed from content/blog/*.mdx
 * Writes to public/feed.xml, public/atom.xml, public/feed.json
 * Runs as part of postbuild; no runtime deps beyond gray-matter.
 *
 * 全文配信: src/lib/mdToHtml.ts を Node の type stripping で直接 import する
 * （Node >= 22.18 必須。CI は node 22）。`package.json` に `"type":"module"` を
 * 追加してはならない（CJS の next-sitemap.config.js が壊れる）。
 * import に失敗した場合は description のみのフィードにフォールバックし、
 * フィード生成でデプロイを止めない。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR_NEXT = path.join(ROOT, "out");
const SITE = "https://kuucorp.com";

// フィードに載せる記事数（全件入れると肥大化するため最新のみ）
const FEED_LIMIT = 20;

let mdToHtml = null;
try {
	({ mdToHtml } = await import("../src/lib/mdToHtml.ts"));
} catch (err) {
	console.warn(
		`[feed] WARN: mdToHtml の読み込みに失敗（${err.message}）。全文なしで生成します`,
	);
}

// postbuild runs after `next build` has copied public/ -> out/, so writing
// only to public/ leaves out/ one build behind. Mirror to out/ when present.
function writeBoth(relPath, contents) {
	fs.mkdirSync(PUBLIC_DIR, { recursive: true });
	fs.writeFileSync(path.join(PUBLIC_DIR, relPath), contents);
	if (fs.existsSync(OUT_DIR_NEXT)) {
		fs.writeFileSync(path.join(OUT_DIR_NEXT, relPath), contents);
	}
}
const SITE_NAME = "Kuu株式会社";
const SITE_DESC =
	"AIエージェントガバナンス専門会社Kuu株式会社の公式ブログ。AX/DX戦略、Managed Agents、中小企業のAI導入実践を発信。";

const xmlEscape = (s = "") =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

// CDATA 内に "]]>" が含まれるとセクションが壊れるため分割エスケープする
const cdata = (s = "") => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** 記事本文をフィード用 HTML へ（相対リンクは絶対化） */
function contentHtml(markdown) {
	if (!mdToHtml) return null;
	return mdToHtml(markdown)
		.replace(/href="\//g, `href="${SITE}/`)
		.replace(/src="\//g, `src="${SITE}/`);
}

const posts = fs
	.readdirSync(BLOG_DIR)
	.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
	.map((f) => {
		const slug = f.replace(/\.(mdx|md)$/, "");
		const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
		const { data, content } = matter(raw);
		return {
			slug,
			title: data.title ?? slug,
			description: data.description ?? "",
			date: data.date ?? new Date().toISOString().slice(0, 10),
			lastModified:
				data.lastModified ?? data.date ?? new Date().toISOString().slice(0, 10),
			tags: Array.isArray(data.tags) ? data.tags : [],
			author: data.author ?? "Kuu株式会社編集部",
			content,
		};
	})
	.sort((a, b) => (a.date < b.date ? 1 : -1))
	.slice(0, FEED_LIMIT);

const latest = posts[0]?.lastModified ?? new Date().toISOString().slice(0, 10);

/* ---------- RSS 2.0 ---------- */
const rssItems = posts
	.map((p) => {
		const url = `${SITE}/blog/${p.slug}/`;
		const pub = new Date(p.date).toUTCString();
		const html = contentHtml(p.content);
		return `
    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${cdata(p.description)}</description>${
				html
					? `
      <content:encoded>${cdata(html)}</content:encoded>`
					: ""
			}
      ${p.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("\n      ")}
    </item>`;
	})
	.join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xmlEscape(SITE_NAME)} Blog</title>
    <link>${SITE}/blog/</link>
    <description>${xmlEscape(SITE_DESC)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>
`;

/* ---------- Atom 1.0 ---------- */
const atomEntries = posts
	.map((p) => {
		const url = `${SITE}/blog/${p.slug}/`;
		const html = contentHtml(p.content);
		return `
  <entry>
    <title>${xmlEscape(p.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <updated>${new Date(p.lastModified).toISOString()}</updated>
    <published>${new Date(p.date).toISOString()}</published>
    <summary>${cdata(p.description)}</summary>${
			html
				? `
    <content type="html">${cdata(html)}</content>`
				: ""
		}
    <author><name>${xmlEscape(p.author)}</name></author>
    ${p.tags.map((t) => `<category term="${xmlEscape(t)}" />`).join("\n    ")}
  </entry>`;
	})
	.join("");

const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlEscape(SITE_NAME)} Blog</title>
  <link href="${SITE}/atom.xml" rel="self" />
  <link href="${SITE}/blog/" />
  <id>${SITE}/</id>
  <updated>${new Date(latest).toISOString()}</updated>
  <subtitle>${xmlEscape(SITE_DESC)}</subtitle>${atomEntries}
</feed>
`;

/* ---------- JSON Feed 1.1 ---------- */
const jsonFeed = {
	version: "https://jsonfeed.org/version/1.1",
	title: `${SITE_NAME} Blog`,
	home_page_url: `${SITE}/blog/`,
	feed_url: `${SITE}/feed.json`,
	description: SITE_DESC,
	language: "ja",
	icon: `${SITE}/images/favicon-192.png`,
	items: posts.map((p) => {
		const html = contentHtml(p.content);
		return {
			id: `${SITE}/blog/${p.slug}/`,
			url: `${SITE}/blog/${p.slug}/`,
			title: p.title,
			summary: p.description,
			...(html ? { content_html: html } : {}),
			date_published: new Date(p.date).toISOString(),
			date_modified: new Date(p.lastModified).toISOString(),
			tags: p.tags,
			authors: [{ name: p.author }],
		};
	}),
};

writeBoth("feed.xml", rss);
writeBoth("atom.xml", atom);
writeBoth("feed.json", JSON.stringify(jsonFeed, null, 2));

const target = fs.existsSync(OUT_DIR_NEXT) ? "public/+out/" : "public/";
console.log(
	`[feed] generated ${posts.length} items (full content: ${mdToHtml ? "yes" : "no"}) -> ${target}{feed.xml, atom.xml, feed.json}`,
);
