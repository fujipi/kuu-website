import type { CaseEntryMeta } from "./case";

export const CASES_PER_PAGE = 9;

export interface CasePage {
	page: number;
	totalPages: number;
	cases: CaseEntryMeta[];
}

export function paginateCases(
	cases: CaseEntryMeta[],
	page: number,
	perPage: number = CASES_PER_PAGE,
): CasePage {
	const totalPages = Math.max(1, Math.ceil(cases.length / perPage));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * perPage;
	return {
		page: safePage,
		totalPages,
		cases: cases.slice(start, start + perPage),
	};
}

export function buildCasePageUrl(page: number): string {
	return page <= 1 ? "/case/" : `/case/page/${page}/`;
}
