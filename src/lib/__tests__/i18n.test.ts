import { describe, expect, it } from "vitest";
import {
	EN_TO_JA,
	LOCALE_PAIRS,
	localeFromPath,
	switchLocalePath,
} from "@/lib/i18n";

describe("localeFromPath", () => {
	it("detects /en/ subtree as en, everything else as ja", () => {
		expect(localeFromPath("/en/")).toBe("en");
		expect(localeFromPath("/en/about/")).toBe("en");
		expect(localeFromPath("/")).toBe("ja");
		expect(localeFromPath("/english-school/")).toBe("ja");
	});
});

describe("switchLocalePath", () => {
	it("maps paired pages to their counterpart", () => {
		expect(switchLocalePath("/about/")).toBe("/en/about/");
		expect(switchLocalePath("/en/about/")).toBe("/about/");
		expect(switchLocalePath("/")).toBe("/en/");
		expect(switchLocalePath("/en/")).toBe("/");
	});

	it("falls back to the counterpart top page when unpaired", () => {
		expect(switchLocalePath("/blog/what-is-ai-agent/")).toBe("/en/");
		expect(switchLocalePath("/en/unpaired/")).toBe("/");
	});

	it("normalizes missing trailing slashes", () => {
		expect(switchLocalePath("/about")).toBe("/en/about/");
	});
});

describe("LOCALE_PAIRS integrity", () => {
	it("all EN paths live under /en/ and reverse map is consistent", () => {
		for (const [ja, en] of Object.entries(LOCALE_PAIRS)) {
			expect(en.startsWith("/en/")).toBe(true);
			expect(EN_TO_JA[en]).toBe(ja);
		}
	});
});
