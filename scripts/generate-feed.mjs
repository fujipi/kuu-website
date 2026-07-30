#!/usr/bin/env node
/**
 * Build RSS 2.0, Atom 1.0, and JSON Feed from content/blog/*.mdx and content/case/*.mdx
 * Writes to public/{feed,atom}.xml, public/feed.json (blog) and
 * public/{feed-case,atom-case}.xml, public/feed-case.json (case).
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

function loadPosts(contentDir, defaultAuthor) {
	return fs
		.readdirSync(path.join(ROOT, contentDir))
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const raw = fs.readFileSync(path.join(ROOT, contentDir, f), "utf-8");
			const { data, content } = matter(raw);
			return {
				slug,
				title: data.title ?? slug,
				description: data.description ?? "",
				date: data.date ?? new Date().toISOString().slice(0, 10),
				lastModified:
					data.lastModified ??
					data.date ??
					new Date().toISOString().slice(0, 10),
				tags: Array.isArray(data.tags) ? data.tags : [],
				author: data.author ?? defaultAuthor,
				content,
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1))
		.slice(0, FEED_LIMIT);
}

/**
 * 1セクション分の RSS/Atom/JSON Feed を生成して書き出す。
 * feed の URL・XML 構造は従来の blog フィードとバイト互換を保つこと
 * （既存購読者の guid/id が変わると全記事が未読として再配信されるため）。
 */
function generateFeeds({
	contentDir,
	urlPrefix, // e.g. "blog" -> https://kuucorp.com/blog/{slug}/
	homePath, // e.g. "/blog/"
	titleSuffix, // e.g. "Blog"
	description,
	defaultAuthor,
	atomId, // Atom の <id>（blog は従来互換で SITE ルート）
	files, // { rss, atom, json } 出力ファイル名
}) {
	const posts = loadPosts(contentDir, defaultAuthor);
	const latest =
		posts[0]?.lastModified ?? new Date().toISOString().slice(0, 10);
	const feedTitle = `${SITE_NAME} ${titleSuffix}`;

	/* ---------- RSS 2.0 ---------- */
	const rssItems = posts
		.map((p) => {
			const url = `${SITE}/${urlPrefix}/${p.slug}/`;
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
    <title>${xmlEscape(feedTitle)}</title>
    <link>${SITE}${homePath}</link>
    <description>${xmlEscape(description)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/${files.rss}" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>
`;

	/* ---------- Atom 1.0 ---------- */
	const atomEntries = posts
		.map((p) => {
			const url = `${SITE}/${urlPrefix}/${p.slug}/`;
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
  <title>${xmlEscape(feedTitle)}</title>
  <link href="${SITE}/${files.atom}" rel="self" />
  <link href="${SITE}${homePath}" />
  <id>${atomId}</id>
  <updated>${new Date(latest).toISOString()}</updated>
  <subtitle>${xmlEscape(description)}</subtitle>${atomEntries}
</feed>
`;

	/* ---------- JSON Feed 1.1 ---------- */
	const jsonFeed = {
		version: "https://jsonfeed.org/version/1.1",
		title: feedTitle,
		home_page_url: `${SITE}${homePath}`,
		feed_url: `${SITE}/${files.json}`,
		description,
		language: "ja",
		icon: `${SITE}/images/favicon-192.png`,
		items: posts.map((p) => {
			const html = contentHtml(p.content);
			return {
				id: `${SITE}/${urlPrefix}/${p.slug}/`,
				url: `${SITE}/${urlPrefix}/${p.slug}/`,
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

	writeBoth(files.rss, rss);
	writeBoth(files.atom, atom);
	writeBoth(files.json, JSON.stringify(jsonFeed, null, 2));

	return posts.length;
}

const blogCount = generateFeeds({
	contentDir: "content/blog",
	urlPrefix: "blog",
	homePath: "/blog/",
	titleSuffix: "Blog",
	description:
		"AIエージェントガバナンス専門会社Kuu株式会社の公式ブログ。AX/DX戦略、Managed Agents、中小企業のAI導入実践を発信。",
	defaultAuthor: "Kuu株式会社編集部",
	atomId: `${SITE}/`,
	files: { rss: "feed.xml", atom: "atom.xml", json: "feed.json" },
});

const caseCount = generateFeeds({
	contentDir: "content/case",
	urlPrefix: "case",
	homePath: "/case/",
	titleSuffix: "Case",
	description:
		"Kuu株式会社のAIエージェント活用ユースケース集。業種・業務別に「こういう使い方もできる」実装イメージを提案。",
	defaultAuthor: "Kuu株式会社編集部",
	atomId: `${SITE}/case/`,
	files: {
		rss: "feed-case.xml",
		atom: "atom-case.xml",
		json: "feed-case.json",
	},
});

const target = fs.existsSync(OUT_DIR_NEXT) ? "public/+out/" : "public/";
console.log(
	`[feed] generated blog=${blogCount} case=${caseCount} items (full content: ${mdToHtml ? "yes" : "no"}) -> ${target}{feed,atom,feed-case,atom-case}.{xml,json}`,
);
