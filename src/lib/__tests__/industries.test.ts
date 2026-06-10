import { describe, expect, it } from "vitest";
import {
	getCasesByIndustry,
	getIndustryGroupBySlug,
	INDUSTRY_GROUPS,
	resolveIndustryGroup,
} from "@/lib/industries";

describe("resolveIndustryGroup", () => {
	it("normalizes notation variants into the same group", () => {
		expect(resolveIndustryGroup("医療・介護・ヘルスケア")?.slug).toBe(
			"healthcare",
		);
		expect(resolveIndustryGroup("医療・ヘルスケア")?.slug).toBe("healthcare");
	});

	it("groups professional service variants", () => {
		expect(resolveIndustryGroup("士業・法律事務所")?.slug).toBe(
			"professional-services",
		);
		expect(resolveIndustryGroup("士業・会計事務所")?.slug).toBe(
			"professional-services",
		);
	});

	it("returns null for unknown or missing industries (build stays safe)", () => {
		expect(resolveIndustryGroup("未知の業種カテゴリ")).toBe(null);
		expect(resolveIndustryGroup(undefined)).toBe(null);
	});
});

describe("INDUSTRY_GROUPS", () => {
	it("has unique slugs", () => {
		const slugs = INDUSTRY_GROUPS.map((g) => g.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("looks up groups by slug", () => {
		expect(getIndustryGroupBySlug("healthcare")?.label).toContain("医療");
		expect(getIndustryGroupBySlug("nope")).toBe(null);
	});
});

describe("getCasesByIndustry (real content)", () => {
	it("returns only groups that have at least one case", () => {
		const groups = getCasesByIndustry();
		expect(groups.length).toBeGreaterThan(0);
		for (const { cases } of groups) {
			expect(cases.length).toBeGreaterThan(0);
		}
	});
});
