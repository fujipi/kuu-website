#!/usr/bin/env node
/**
 * Build RSS 2.0, Atom 1.0, and JSON Feed from content/blog/*.mdx
 * Writes to public/feed.xml, public/atom.xml, public/feed.json
 * Runs as part of postbuild; no runtime deps beyond gray-matter.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR_NEXT = path.join(ROOT, "out");
const OUT_DIR = PUBLIC_DIR; // primary write target (for `next dev` and the next build's copy)
const SITE = "https://kuucorp.com";

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
	.sort((a, b) => (a.date < b.date ? 1 : -1));

const latest = posts[0]?.lastModified ?? new Date().toISOString().slice(0, 10);

/* ---------- RSS 2.0 ---------- */
const rssItems = posts
	.map((p) => {
		const url = `${SITE}/blog/${p.slug}/`;
		const pub = new Date(p.date).toUTCString();
		return `
    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description><![CDATA[${p.description}]]></description>
      ${p.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("\n      ")}
    </item>`;
	})
	.join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
		return `
  <entry>
    <title>${xmlEscape(p.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <updated>${new Date(p.lastModified).toISOString()}</updated>
    <published>${new Date(p.date).toISOString()}</published>
    <summary><![CDATA[${p.description}]]></summary>
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
	items: posts.map((p) => ({
		id: `${SITE}/blog/${p.slug}/`,
		url: `${SITE}/blog/${p.slug}/`,
		title: p.title,
		summary: p.description,
		date_published: new Date(p.date).toISOString(),
		date_modified: new Date(p.lastModified).toISOString(),
		tags: p.tags,
		authors: [{ name: p.author }],
	})),
};

writeBoth("feed.xml", rss);
writeBoth("atom.xml", atom);
writeBoth("feed.json", JSON.stringify(jsonFeed, null, 2));

const target = fs.existsSync(OUT_DIR_NEXT) ? "public/+out/" : "public/";
console.log(
	`[feed] generated ${posts.length} items -> ${target}{feed.xml, atom.xml, feed.json}`,
);
