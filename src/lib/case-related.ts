import type { CaseEntryMeta } from "./case";
import { resolveIndustryGroup } from "./industries";

/**
 * 関連ユースケースの選定。同一業種グループ（resolveIndustryGroup で正規化）を
 * 優先し、残り枠は日付降順で補充する。allCases の並び（日付降順）を維持する。
 */
export function getRelatedCases(
	current: Pick<CaseEntryMeta, "slug" | "industry">,
	allCases: CaseEntryMeta[],
	limit = 5,
): CaseEntryMeta[] {
	const others = allCases.filter((c) => c.slug !== current.slug);
	const group = resolveIndustryGroup(current.industry);
	if (!group) return others.slice(0, limit);

	const sameIndustry = others.filter(
		(c) => resolveIndustryGroup(c.industry)?.slug === group.slug,
	);
	const rest = others.filter(
		(c) => resolveIndustryGroup(c.industry)?.slug !== group.slug,
	);
	return [...sameIndustry, ...rest].slice(0, limit);
}
