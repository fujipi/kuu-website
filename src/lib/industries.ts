import { type CaseEntryMeta, getAllCases } from "./case";

/**
 * Case の industry（自由記述・表記ゆれあり）を業種グループへ正規化する。
 * 先勝ちマッチ。どのグループにも一致しない industry は業種別ページに
 * 収載されない（/case/ 一覧には通常どおり表示される）ため、
 * 新しい業種の自動生成 Case が増えてもビルドは壊れない。
 */
export interface IndustryGroup {
	slug: string;
	label: string;
	match: RegExp;
}

export const INDUSTRY_GROUPS: IndustryGroup[] = [
	{ slug: "manufacturing", label: "製造", match: /製造/ },
	{ slug: "retail-ec", label: "小売・EC", match: /小売|EC/ },
	{ slug: "wholesale", label: "卸売・流通", match: /卸売|流通|商社/ },
	{ slug: "real-estate", label: "不動産", match: /不動産/ },
	{
		slug: "healthcare",
		label: "医療・介護・ヘルスケア",
		match: /医療|介護|ヘルスケア/,
	},
	{
		slug: "professional-services",
		label: "士業・専門サービス",
		match: /士業|法律|会計|専門サービス/,
	},
	{
		slug: "finance-insurance",
		label: "金融・保険",
		match: /金融|保険|銀行|証券/,
	},
	{ slug: "food-service", label: "飲食", match: /飲食/ },
	{ slug: "logistics", label: "物流・倉庫", match: /物流|倉庫|運送|配送/ },
	{ slug: "construction", label: "建設", match: /建設|建築|工務/ },
	{ slug: "education", label: "教育・学習塾", match: /教育|学習塾|学校|研修/ },
	{
		slug: "travel",
		label: "旅行・宿泊・観光",
		match: /旅行|宿泊|観光|ホテル|旅館/,
	},
	{
		slug: "advertising",
		label: "広告・マーケティング",
		match: /広告|マーケティング/,
	},
	{ slug: "hr-recruiting", label: "人事・採用", match: /人事|採用/ },
	{
		slug: "cross-industry",
		label: "全業種共通",
		match: /全業種|業種共通|横断/,
	},
];

export function resolveIndustryGroup(
	industry: string | undefined,
): IndustryGroup | null {
	if (!industry) return null;
	for (const g of INDUSTRY_GROUPS) {
		if (g.match.test(industry)) return g;
	}
	return null;
}

export function getIndustryGroupBySlug(slug: string): IndustryGroup | null {
	return INDUSTRY_GROUPS.find((g) => g.slug === slug) ?? null;
}

/** 業種グループ別の Case 一覧（0件のグループは含めない） */
export function getCasesByIndustry(): {
	group: IndustryGroup;
	cases: CaseEntryMeta[];
}[] {
	const all = getAllCases();
	return INDUSTRY_GROUPS.map((group) => ({
		group,
		cases: all.filter(
			(c) => resolveIndustryGroup(c.industry)?.slug === group.slug,
		),
	})).filter((g) => g.cases.length > 0);
}
