import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseListView from "@/components/CaseListView";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCases } from "@/lib/case";
import { CASES_PER_PAGE, paginateCases } from "@/lib/case-pagination";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export async function generateStaticParams() {
	const total = getAllCases().length;
	const totalPages = Math.max(1, Math.ceil(total / CASES_PER_PAGE));
	// page 1 is served by /case/ — only generate 2..N
	const params: { page: string }[] = [];
	for (let i = 2; i <= totalPages; i++) {
		params.push({ page: String(i) });
	}
	// `output: export` requires a dynamic route to emit at least one path. When
	// there is only a single page of cases (≤9 items → totalPages === 1) the loop
	// yields nothing, so emit page 2 as a placeholder that the component resolves
	// to notFound() (paginateCases clamps it back to page 1). Once a 10th case is
	// added the loop produces a real page 2 and this fallback is skipped.
	if (params.length === 0) params.push({ page: "2" });
	return params;
}

export const dynamicParams = false;

interface PageProps {
	params: Promise<{ page: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { page: pageStr } = await params;
	const page = Number(pageStr);
	return seoMetadata({
		title: `Case（${page}ページ目）| 最新のAIエージェント・ユースケース | Kuu株式会社`,
		description: `AIエージェント・自動化・FDE型実装に関する業務別ユースケースを継続的に集約。${page}ページ目。`,
		path: `/case/page/${page}/`,
	});
}

export default async function CaseListPaginatedPage({ params }: PageProps) {
	const { page: pageStr } = await params;
	const pageNum = Number(pageStr);
	if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

	const allCases = getAllCases();
	const { page, totalPages, cases } = paginateCases(allCases, pageNum);

	if (page !== pageNum) notFound();

	const url = `${BASE_URL}/case/page/${page}/`;
	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `Case（${page}ページ目）| 最新のユースケース集`,
			description:
				"AIエージェント・自動化・FDE型実装に関する最新ユースケースを継続的に集約。",
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				itemListElement: cases.map((c, i) => ({
					"@type": "ListItem",
					position: (page - 1) * CASES_PER_PAGE + i + 1,
					url: `${BASE_URL}/case/${c.slug}/`,
					name: c.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "Case", path: "/case/" },
			{ name: `${page}ページ目`, path: `/case/page/${page}/` },
		]),
	];

	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content">
					<CaseListView cases={cases} page={page} totalPages={totalPages} />
				</div>
			</main>

			<Footer />
		</>
	);
}
