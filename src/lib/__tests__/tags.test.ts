import { describe, expect, it } from "vitest";
import { getAllTags, slugifyTag } from "@/lib/tags";

describe("slugifyTag", () => {
	it("lowercases and hyphenates whitespace", () => {
		expect(slugifyTag("Managed Agents")).toBe("managed-agents");
		expect(slugifyTag("MCP")).toBe("mcp");
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
});
