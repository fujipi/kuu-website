import { describe, expect, it } from "vitest";
import type { CaseEntryMeta } from "@/lib/case";
import { getRelatedCases } from "@/lib/case-related";

const entry = (
	over: Partial<CaseEntryMeta> & { slug: string },
): CaseEntryMeta => ({
	title: over.slug,
	description: "",
	date: "2026-01-01",
	lastModified: "2026-01-01",
	tags: [],
	...over,
});

describe("getRelatedCases", () => {
	it("prefers same industry group, then fills by list order", () => {
		const current = entry({ slug: "current", industry: "製造業" });
		const sameA = entry({ slug: "same-a", industry: "製造" });
		const other = entry({ slug: "other", industry: "飲食" });
		const sameB = entry({ slug: "same-b", industry: "精密機器製造" });
		const related = getRelatedCases(current, [sameA, other, sameB], 3);
		expect(related.map((c) => c.slug)).toEqual(["same-a", "same-b", "other"]);
	});

	it("excludes the current case and respects the limit", () => {
		const current = entry({ slug: "current", industry: "製造" });
		const all = [
			current,
			entry({ slug: "a", industry: "製造" }),
			entry({ slug: "b", industry: "製造" }),
			entry({ slug: "c", industry: "製造" }),
		];
		const related = getRelatedCases(current, all, 2);
		expect(related.map((c) => c.slug)).toEqual(["a", "b"]);
	});

	it("falls back to list order when industry is missing or unmapped", () => {
		const current = entry({ slug: "current", industry: "宇宙開発" });
		const all = [entry({ slug: "a", industry: "飲食" }), entry({ slug: "b" })];
		expect(getRelatedCases(current, all, 5).map((c) => c.slug)).toEqual([
			"a",
			"b",
		]);
		expect(
			getRelatedCases(entry({ slug: "current" }), all, 5).map((c) => c.slug),
		).toEqual(["a", "b"]);
	});
});
