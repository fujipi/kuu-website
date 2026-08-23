import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/mdx";
import {
	getAllTags,
	getPostsByTagSlug,
	getTagCounts,
	slugifyTag,
	TAG_MIN_POSTS,
} from "@/lib/tags";

describe("slugifyTag", () => {
	it("lowercases and hyphenates whitespace", () => {
		expect(slugifyTag("Managed Agents")).toBe("managed-agents");
		expect(slugifyTag("MCP")).toBe("mcp");
	});

	it("hyphenates slashes so tag paths stay a single URL segment", () => {
		expect(slugifyTag("CI/CD")).toBe("ci-cd");
		expect(slugifyTag("AI/ML")).toBe("ai-ml");
	});

	it("keeps Japanese tags as-is", () => {
		expect(slugifyTag("エージェントガバナンス")).toBe("エージェントガバナンス");
	});
});

describe("getAllTags (real content)", () => {
	it("returns tags sorted by count descending with valid slugs", () => {
		const tags = getAllTags();
		expect(tags.length).toBeGreaterThan(0);
		for (let i = 1; i < tags.length; i++) {
			expect(tags[i - 1].count).toBeGreaterThanOrEqual(tags[i].count);
		}
		for (const t of tags) {
			expect(t.slug).toBe(slugifyTag(t.tag));
		}
	});

	it("never produces a slash in a slug (would break static tag routes)", () => {
		for (const t of getAllTags()) {
			expect(t.slug).not.toContain("/");
		}
	});
});

describe("getTagCounts (real content)", () => {
	// slug 単位で「その slug のアーカイブページに載る記事数」を1パスで数える。
	// getPostsByTagSlug は呼ぶたびに全記事を読み直すため、全 slug で回すと遅い。
	const expected = new Map<string, number>();
	for (const post of getAllPosts()) {
		for (const slug of new Set(post.tags.map(slugifyTag))) {
			expected.set(slug, (expected.get(slug) ?? 0) + 1);
		}
	}

	it("counts are summed per slug, not overwritten by表記ゆれ", () => {
		// 「Computer Use」と「computer use」は同じ slug に潰れる。合算しないと
		// リンク判定（getTagCounts）と noindex 判定（アーカイブの posts.length）が
		// ズレて、index 対象のタグページが内部リンクゼロの孤立ページになる。
		const counts = getTagCounts();
		expect(counts.size).toBe(expected.size);
		for (const [slug, n] of expected) {
			expect(counts.get(slug), slug).toBe(n);
		}
	});

	it("agrees with getPostsByTagSlug on slugs that merge multiple tag spellings", () => {
		const bySlug = new Map<string, Set<string>>();
		for (const { tag, slug } of getAllTags()) {
			if (!bySlug.has(slug)) bySlug.set(slug, new Set());
			bySlug.get(slug)?.add(tag);
		}
		const merged = [...bySlug]
			.filter(([, spellings]) => spellings.size > 1)
			.map(([slug]) => slug);
		const counts = getTagCounts();
		for (const slug of [...merged, getAllTags()[0].slug]) {
			expect(getPostsByTagSlug(slug).posts.length, slug).toBe(counts.get(slug));
		}
	});

	it("keeps at least one tag archive linkable (>= TAG_MIN_POSTS)", () => {
		const indexable = [...getTagCounts()].filter(([, c]) => c >= TAG_MIN_POSTS);
		expect(indexable.length).toBeGreaterThan(0);
	});
});
