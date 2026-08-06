import { describe, expect, it } from "vitest";
import { getAllCaseSlugs, getCaseBySlug } from "@/lib/case";
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

	it("citable-URL coverage does not regress", () => {
		// 詳細ページは URL の sources だけを citation JSON-LD と外部リンクに変換する。
		// 2026-08 実測では 70 件中 45 件 (64%) が全件 URL、残る 25 件は
		// 「〜に関する一般的な業界傾向（公開情報）」のような散文のみで URL がゼロ。
		// 散文のみの記事は citation が付かず、引用の裏付けが機械可読にならない。
		// CLAUDE.md の Case チェックリストは「URL を貼る。曖昧記述で済ませない」と
		// 定めているため、この 25 件は本来この規約に反している（backfill 対象）。
		// ここでは現状からの後退だけを止める。
		const withUrl = cases.filter((c) =>
			c.sources.some((s) => /^https?:\/\//.test(s)),
		);
		expect(withUrl.length / cases.length).toBeGreaterThan(0.6);
	});

	it("sources are either all-URL or all-prose, never silently mixed", () => {
		// 混在が出てきたら、片方だけが citation に載る状態になる。現状は 45/25 で
		// きれいに分かれているため、混在の発生を検知できるようにしておく。
		for (const c of cases) {
			const urls = c.sources.filter((s) => /^https?:\/\//.test(s));
			expect(
				urls.length === 0 || urls.length === c.sources.length,
				`${c.slug}: sources に URL と散文が混在（URL ${urls.length}/${c.sources.length}）`,
			).toBe(true);
		}
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
