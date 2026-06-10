import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import SearchClient from "@/components/SearchClient";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "サイト内検索 | Kuu株式会社",
	description:
		"Kuu株式会社の技術ブログ・ユースケース・用語集を全文検索できます。AIエージェント、MCP、エージェントガバナンスなどのキーワードで記事を探せます。",
	path: "/search/",
});

export default function SearchPage() {
	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "SearchResultsPage",
			name: "サイト内検索",
			url: `${BASE_URL}/search/`,
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "検索", path: "/search/" },
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
					<h1 className="page-title fade-in">Search</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-medium)",
							maxWidth: "640px",
							lineHeight: "1.8",
							marginBottom: "2rem",
						}}
					>
						ブログ・Case・用語集・リソースを横断して全文検索できます。
					</p>
					<SearchClient />
				</div>
			</main>

			<Footer />
		</>
	);
}
