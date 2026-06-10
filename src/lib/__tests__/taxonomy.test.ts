import { describe, expect, it } from "vitest";
import {
	isTrackSlug,
	resolveTrack,
	TRACK_INFO,
	TRACK_SLUGS,
} from "@/lib/taxonomy";

describe("TRACK_SLUGS / TRACK_INFO", () => {
	it("defines the 7 tracks from CLAUDE.md with labels", () => {
		expect(TRACK_SLUGS).toHaveLength(7);
		for (const slug of TRACK_SLUGS) {
			expect(TRACK_INFO[slug].label).toBeTruthy();
			expect(TRACK_INFO[slug].description.length).toBeGreaterThan(20);
		}
	});
});

describe("resolveTrack", () => {
	it("prefers frontmatter track over heuristics", () => {
		expect(resolveTrack("mcp-server-implementation", "security")).toBe(
			"security",
		);
	});

	it("ignores invalid frontmatter track values", () => {
		expect(resolveTrack("mcp-server-implementation", "not-a-track")).toBe(
			"protocols",
		);
	});

	it("classifies business slugs before track heuristics", () => {
		expect(resolveTrack("manufacturing-quality-ai")).toBe("business");
		expect(resolveTrack("ai-investment-cost-guide")).toBe("business");
	});

	it("classifies by slug heuristics (first match wins)", () => {
		expect(resolveTrack("mcp-security-oauth-scope-design")).toBe("protocols");
		expect(resolveTrack("agent-iam-scoped-credentials-design")).toBe(
			"security",
		);
		expect(resolveTrack("agent-harness-architecture")).toBe("architecture");
	});

	it("returns null for unclassifiable slugs", () => {
		expect(resolveTrack("some-random-topic")).toBe(null);
	});
});

describe("isTrackSlug", () => {
	it("accepts valid tracks and rejects others", () => {
		expect(isTrackSlug("architecture")).toBe(true);
		expect(isTrackSlug("business")).toBe(false);
		expect(isTrackSlug("")).toBe(false);
	});
});
