import { describe, expect, it } from "vitest";
import type { BlogPostMeta } from "@/lib/mdx";
import { getRelatedPosts, getSeriesPosts } from "@/lib/related";

const post = (
	over: Partial<BlogPostMeta> & { slug: string },
): BlogPostMeta => ({
	title: over.slug,
	description: "",
	date: "2026-01-01",
	lastModified: "2026-01-01",
	tags: [],
	author: "kuu-editorial",
	...over,
});

describe("getRelatedPosts", () => {
	it("weights series > pillar > track > shared tags", () => {
		const current = post({
			slug: "current",
			tags: ["MCP"],
			pillar: "ai-governance",
			series: "intro",
			track: "protocols",
		});
		const bySeries = post({ slug: "by-series", series: "intro" });
		const byPillar = post({ slug: "by-pillar", pillar: "ai-governance" });
		const byTrack = post({ slug: "by-track", track: "protocols" });
		const byTag = post({ slug: "by-tag", tags: ["MCP"] });
		const unrelated = post({ slug: "unrelated" });

		const related = getRelatedPosts(current, [
			unrelated,
			byTag,
			byTrack,
			byPillar,
			bySeries,
		]);
		expect(related.map((p) => p.slug)).toEqual([
			"by-series",
			"by-pillar",
			"by-track",
			"by-tag",
		]);
	});

	it("excludes the current post and unrelated posts", () => {
		const current = post({ slug: "current", tags: ["MCP"] });
		const related = getRelatedPosts(current, [
			current,
			post({ slug: "other" }),
		]);
		expect(related).toHaveLength(0);
	});

	it("respects the limit", () => {
		const current = post({ slug: "current", tags: ["MCP"] });
		const candidates = Array.from({ length: 10 }, (_, i) =>
			post({ slug: `c${i}`, tags: ["MCP"] }),
		);
		expect(getRelatedPosts(current, candidates)).toHaveLength(4);
	});

	it("matches track via slug heuristics when frontmatter track is absent", () => {
		const current = post({ slug: "mcp-oauth-design" });
		const sameTrack = post({ slug: "a2a-protocol-comparison" });
		const related = getRelatedPosts(current, [sameTrack]);
		expect(related.map((p) => p.slug)).toEqual(["a2a-protocol-comparison"]);
	});
});

describe("getSeriesPosts", () => {
	it("orders by series_order then date", () => {
		const posts = [
			post({ slug: "s3", series: "x", date: "2026-03-01" }),
			post({ slug: "s1", series: "x", seriesOrder: 1 }),
			post({ slug: "s2", series: "x", seriesOrder: 2 }),
			post({ slug: "other", series: "y" }),
		];
		expect(getSeriesPosts("x", posts).map((p) => p.slug)).toEqual([
			"s1",
			"s2",
			"s3",
		]);
	});
});
