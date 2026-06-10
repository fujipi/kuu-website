import { describe, expect, it } from "vitest";
import {
	buildPageUrl,
	POSTS_PER_PAGE,
	paginatePosts,
} from "@/lib/blog-pagination";
import type { BlogPostMeta } from "@/lib/mdx";

const makePosts = (n: number): BlogPostMeta[] =>
	Array.from({ length: n }, (_, i) => ({
		slug: `post-${i}`,
		title: `Post ${i}`,
		description: "",
		date: "2026-01-01",
		lastModified: "2026-01-01",
		tags: [],
		author: "kuu-editorial",
	}));

describe("paginatePosts", () => {
	it("splits posts into pages of POSTS_PER_PAGE", () => {
		const result = paginatePosts(makePosts(25), 1);
		expect(result.totalPages).toBe(3);
		expect(result.posts).toHaveLength(POSTS_PER_PAGE);
	});

	it("returns the remainder on the last page", () => {
		const result = paginatePosts(makePosts(25), 3);
		expect(result.posts).toHaveLength(5);
		expect(result.posts[0].slug).toBe("post-20");
	});

	it("clamps out-of-range pages", () => {
		expect(paginatePosts(makePosts(5), 99).page).toBe(1);
		expect(paginatePosts(makePosts(5), 0).page).toBe(1);
	});

	it("handles empty input", () => {
		const result = paginatePosts([], 1);
		expect(result.totalPages).toBe(1);
		expect(result.posts).toHaveLength(0);
	});
});

describe("buildPageUrl", () => {
	it("maps page 1 to /blog/ and later pages to /blog/page/N/", () => {
		expect(buildPageUrl(1)).toBe("/blog/");
		expect(buildPageUrl(2)).toBe("/blog/page/2/");
	});
});
