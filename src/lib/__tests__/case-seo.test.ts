import { describe, expect, it } from "vitest";
import {
	getAllCaseSlugs,
	getCaseBySlug,
	parseSource,
	sourceUrls,
} from "@/lib/case";
import { extractFaqPairs } from "@/lib/faq";

/**
 * Case detail ページの AEO 出力が実コーパスに対して意図通り効いていることを
 * 固定する回帰テスト。src/app/(ja)/case/[slug]/page.tsx が使うのと同じ
 * ユーティリティを、同じ入力（content/case/*.mdx）に対して回している。
 */
const slugs = getAllCaseSlugs();
const cases = slugs.map((slug) => {
	const c = getCaseBySlug(slug);
	if (!c) throw new Error(`case not found: ${slug}`);
	return c;
});

describe("case corpus / FAQPage eligibility", () => {
	it("has a non-trivial corpus", () => {
		expect(cases.length).toBeGreaterThanOrEqual(70);
	});

	it("a majority of cases qualify for FAQPage", () => {
		// 2026-08 実測で 70 件中 47 件 (67%)。Case の H2 は「① 最新情報の調査：〜
		// でいま何ができるか」のように質問形で終わる規約になっているため、
		// これを大きく下回るときは本文テンプレートが崩れている。
		const eligible = cases.filter((c) => extractFaqPairs(c.content) !== null);
		expect(eligible.length / cases.length).toBeGreaterThan(0.5);
	});

	it("extracted FAQ answers are non-empty and bounded", () => {
		for (const c of cases) {
			const pairs = extractFaqPairs(c.content);
			if (!pairs) continue;
			expect(pairs.length, c.slug).toBeGreaterThanOrEqual(2);
			expect(pairs.length, c.slug).toBeLessThanOrEqual(6);
			for (const p of pairs) {
				expect(p.question.length, `${c.slug}: empty question`).toBeGreaterThan(
					0,
				);
				expect(p.answer.length, `${c.slug}: empty answer`).toBeGreaterThan(0);
			}
		}
	});
});

describe("case corpus / citation sources", () => {
	it("every case carries at least two sources", () => {
		for (const c of cases) {
			expect(c.sources.length, c.slug).toBeGreaterThanOrEqual(2);
		}
	});

	it("every source line carries a URL", () => {
		// 詳細ページは URL を持つ sources だけを citation JSON-LD と外部リンクに
		// 変換する。URL の無い行は「〜に関する一般的な業界傾向（公開情報）」のような
		// 検証不能な記述になり、引用の裏付けが機械可読にならない。
		// 2026-08 に全 70 件 210 行を URL 付きに揃えた（validate-case.mjs でも hard gate）。
		for (const c of cases) {
			const urls = sourceUrls(c.sources);
			expect(
				urls.length,
				`${c.slug}: URL を含まない sources 行がある（${urls.length}/${c.sources.length}）`,
			).toBe(c.sources.length);
		}
	});

	it("every case yields citations for its JSON-LD", () => {
		for (const c of cases) {
			expect(sourceUrls(c.sources).length, c.slug).toBeGreaterThanOrEqual(2);
		}
	});
});

describe("parseSource", () => {
	it("returns a bare URL as both label and url", () => {
		const s = parseSource("https://www.mlit.go.jp/foo/bar.html");
		expect(s.url).toBe("https://www.mlit.go.jp/foo/bar.html");
		expect(s.label).toBe("https://www.mlit.go.jp/foo/bar.html");
	});

	it("splits a title + URL line into label and url", () => {
		const s = parseSource(
			"国土交通省「重要事項説明書等の電磁的方法による提供」https://www.mlit.go.jp/a/b.html",
		);
		expect(s.url).toBe("https://www.mlit.go.jp/a/b.html");
		expect(s.label).toBe(
			"国土交通省「重要事項説明書等の電磁的方法による提供」",
		);
	});

	it("keeps prose with no URL as a plain label", () => {
		const s = parseSource("契約レビュー業務の工数に関する一般的な業界傾向");
		expect(s.url).toBeUndefined();
		expect(s.label).toBe("契約レビュー業務の工数に関する一般的な業界傾向");
	});

	it("does not swallow trailing punctuation or closing brackets into the URL", () => {
		expect(parseSource("出典（https://example.com/a）").url).toBe(
			"https://example.com/a",
		);
		expect(parseSource("参考 https://example.com/b。").url).toBe(
			"https://example.com/b",
		);
	});

	it("takes the first URL when a line contains more than one", () => {
		const s = parseSource("A https://example.com/1 と B https://example.com/2");
		expect(s.url).toBe("https://example.com/1");
	});

	it("sourceUrls drops lines without a URL", () => {
		expect(
			sourceUrls([
				"https://example.com/a",
				"散文のみ",
				"題 https://example.com/b",
			]),
		).toEqual(["https://example.com/a", "https://example.com/b"]);
	});
});

describe("case corpus / structured-data inputs", () => {
	it("every case has the fields that drive JSON-LD", () => {
		for (const c of cases) {
			expect(c.title, c.slug).toBeTruthy();
			expect(c.description, c.slug).toBeTruthy();
			expect(c.date, c.slug).toBeTruthy();
			expect(
				c.industry,
				`${c.slug}: industry drives schema.org about`,
			).toBeTruthy();
			expect(
				c.useCase,
				`${c.slug}: use_case drives schema.org audience`,
			).toBeTruthy();
		}
	});

	it("titles carry no brand suffix (SERP width)", () => {
		// 詳細ページは c.title をそのまま <title> に使う。frontmatter 側に
		// ブランド名が入っていると二重付与になり、SERP で実タイトルが切れる。
		for (const c of cases) {
			expect(c.title, c.slug).not.toContain("Kuu株式会社");
		}
	});
});
