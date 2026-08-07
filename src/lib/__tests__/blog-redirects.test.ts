import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_REDIRECTS } from "@/lib/blog-redirects";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const SITEMAP_CONFIG = path.join(process.cwd(), "next-sitemap.config.js");
const existingSlugs = new Set(
	fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.mdx?$/, "")),
);

describe("BLOG_REDIRECTS integrity", () => {
	it("every redirect target is an existing blog post", () => {
		for (const [from, to] of Object.entries(BLOG_REDIRECTS)) {
			expect(existingSlugs.has(to), `${from} -> ${to} (missing target)`).toBe(
				true,
			);
		}
	});

	it("no redirect source collides with an existing post slug", () => {
		for (const from of Object.keys(BLOG_REDIRECTS)) {
			expect(existingSlugs.has(from), `${from} still exists as a post`).toBe(
				false,
			);
		}
	});

	it("no redirect chains (target must not itself be redirected)", () => {
		for (const to of Object.values(BLOG_REDIRECTS)) {
			expect(BLOG_REDIRECTS[to], `${to} is also a redirect source`).toBe(
				undefined,
			);
		}
	});

	// リダイレクト元 slug は noindex のスタブページとして出力されるため、sitemap から
	// 除外する必要がある。その除外リストは next-sitemap.config.js に手書きでコピーされて
	// おり、片方だけ更新される事故が起きうる。両者の一致をここで固定する。
	it("every redirect source is excluded from the sitemap config", () => {
		const config = fs.readFileSync(SITEMAP_CONFIG, "utf-8");
		const excluded = new Set(
			[...config.matchAll(/"\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]),
		);
		for (const from of Object.keys(BLOG_REDIRECTS)) {
			expect(
				excluded.has(from),
				`${from} is redirected but not in next-sitemap.config.js exclude[]`,
			).toBe(true);
		}
	});

	it("the sitemap config excludes no stale blog slugs", () => {
		const config = fs.readFileSync(SITEMAP_CONFIG, "utf-8");
		const excluded = [...config.matchAll(/"\/blog\/([a-z0-9-]+)"/g)].map(
			(m) => m[1],
		);
		for (const slug of excluded) {
			expect(
				slug in BLOG_REDIRECTS,
				`next-sitemap.config.js excludes /blog/${slug} but it is not a redirect source`,
			).toBe(true);
		}
	});
});
