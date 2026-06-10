import type { Metadata } from "next";
import CaseListView from "@/components/CaseListView";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCases } from "@/lib/case";
import { paginateCases } from "@/lib/case-pagination";
import { getCasesByIndustry } from "@/lib/industries";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "Case | 最新のAIエージェント・ユースケースを毎日 | Kuu株式会社",
	description:
		"Webや企業発表から最新のAIエージェント・自動化のユースケースを日々まとめ、自社の業務へどう実装するかを具体的に書き起こします。",
	path: "/case/",
});

export default function CaseListPage() {
	const allCases = getAllCases();
	const { page, totalPages, cases } = paginateCases(allCases, 1);
	const industries = getCasesByIndustry().map(({ group, cases: cs }) => ({
		slug: group.slug,
		label: group.label,
		count: cs.length,
	}));

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "Case | 最新のユースケース集 | Kuu株式会社",
			url: `${BASE_URL}/case/`,
			description:
				"AIエージェント・自動化・FDE型実装に関する最新ユースケースを継続的に集約。",
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				itemListElement: cases.map((c, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/case/${c.slug}/`,
					name: c.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "Case", path: "/case/" },
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
					<CaseListView
						cases={cases}
						industries={industries}
						page={page}
						totalPages={totalPages}
					/>
				</div>
			</main>

			<Footer />
		</>
	);
}
