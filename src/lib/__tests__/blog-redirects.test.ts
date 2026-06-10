import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_REDIRECTS } from "@/lib/blog-redirects";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
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
});
