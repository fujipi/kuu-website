import { describe, expect, it } from "vitest";
import type { BlogPostMeta } from "@/lib/mdx";
import {
	buildPillarItemListJsonLd,
	getPillarBySlug,
	getPillarForPost,
	getPostsForPillar,
	PILLARS,
} from "@/lib/pillars";

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

describe("getPillarForPost", () => {
	it("prefers explicit frontmatter pillar over inferred mapping", () => {
		const p = post({
			slug: "topic-overview",
			pillar: "fde",
			track: "security",
			tags: ["EU AI Act"],
		});
		expect(getPillarForPost(p)?.slug).toBe("fde");
	});

	it("maps by track when frontmatter pillar is absent", () => {
		expect(
			getPillarForPost(post({ slug: "t1", track: "security" }))?.slug,
		).toBe("ai-governance");
		expect(
			getPillarForPost(post({ slug: "t2", track: "architecture" }))?.slug,
		).toBe("managed-agents");
	});

	it("maps by high-signal tag when track is absent", () => {
		expect(
			getPillarForPost(
				post({ slug: "topic-overview", tags: ["Managed Agents"] }),
			)?.slug,
		).toBe("managed-agents");
	});

	it("evaluates pillars in priority order (eu-ai-act-jp before governance)", () => {
		const p = post({
			slug: "topic-overview",
			track: "security",
			tags: ["EU AI Act"],
		});
		expect(getPillarForPost(p)?.slug).toBe("eu-ai-act-jp");
	});

	it("returns null when nothing matches", () => {
		expect(getPillarForPost(post({ slug: "topic-overview" }))).toBeNull();
	});

	it("ignores an unknown explicit pillar and falls back to inference", () => {
		const p = post({ slug: "t3", pillar: "nonexistent", track: "evaluation" });
		expect(getPillarForPost(p)?.slug).toBe("ai-governance");
	});
});

describe("getPostsForPillar", () => {
	const posts = [
		post({ slug: "a", track: "security" }),
		post({ slug: "b", tags: ["Managed Agents"] }),
		post({ slug: "c", track: "evaluation" }),
	];

	it("returns posts belonging to the pillar, preserving order", () => {
		expect(
			getPostsForPillar("ai-governance", posts).map((p) => p.slug),
		).toEqual(["a", "c"]);
	});

	it("respects the limit", () => {
		expect(
			getPostsForPillar("ai-governance", posts, 1).map((p) => p.slug),
		).toEqual(["a"]);
	});
});

describe("getPillarBySlug", () => {
	it("resolves known pillars and rejects unknown/undefined", () => {
		expect(getPillarBySlug("ai-governance")?.url).toBe("/ai-governance/");
		expect(getPillarBySlug("nope")).toBeNull();
		expect(getPillarBySlug(undefined)).toBeNull();
	});
});

describe("buildPillarItemListJsonLd", () => {
	it("emits an ItemList with positioned blog URLs matching the visible list", () => {
		const pillar = PILLARS.find((p) => p.slug === "ai-governance");
		if (!pillar) throw new Error("ai-governance pillar fixture missing");
		const json = buildPillarItemListJsonLd(pillar, [
			{ slug: "x", title: "X" },
			{ slug: "y", title: "Y" },
		]);
		expect(json["@type"]).toBe("ItemList");
		expect(json.numberOfItems).toBe(2);
		expect(json.itemListElement).toEqual([
			{
				"@type": "ListItem",
				position: 1,
				url: "https://kuucorp.com/blog/x/",
				name: "X",
			},
			{
				"@type": "ListItem",
				position: 2,
				url: "https://kuucorp.com/blog/y/",
				name: "Y",
			},
		]);
	});
});
