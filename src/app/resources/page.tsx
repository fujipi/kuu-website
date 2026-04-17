import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllResources } from "@/lib/resources";
import { generateMetadata as seoMetadata } from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/case-studies/", label: "Cases" },
	{ href: "/pricing/", label: "Pricing" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export const metadata: Metadata = seoMetadata({
	title: "リソースセンター | 生成AI規程・チェックリスト・テンプレート | Kuu株式会社",
	description:
		"生成AI利用規程テンプレート・エージェントガバナンスチェックリスト・EU AI Act対応資料など、中小企業がすぐ使える実務資料を無料提供。",
	path: "/resources/",
});

export default function ResourcesIndexPage() {
	const resources = getAllResources();
	const url = `${BASE_URL}/resources/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "Kuu株式会社 リソースセンター",
			description:
				"生成AI・エージェントガバナンスに関する実務テンプレート・チェックリストを無料提供するリソースセンター。",
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				itemListElement: resources.map((r, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/resources/${r.slug}/`,
					name: r.title,
				})),
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{
					"@type": "ListItem",
					position: 2,
					name: "リソースセンター",
					item: url,
				},
			],
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Resources</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							lineHeight: "1.9",
							maxWidth: "640px",
							marginBottom: "3rem",
						}}
					>
						生成AI利用規程テンプレート、エージェントガバナンス・チェックリスト、EU
						AI Act
						対応資料など、中小企業の経営者・IT担当者がすぐに使える実務資料を無料で公開しています。お問い合わせ経由でテンプレート本体をお送りします。
					</p>

					{resources.length === 0 ? (
						<p
							className="fade-in"
							style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
						>
							資料を準備中です。
						</p>
					) : (
						<div className="fade-in-stagger blog-list" style={{ maxWidth: "720px" }}>
							{resources.map((r) => (
								<Link
									key={r.slug}
									href={`/resources/${r.slug}/`}
									className="blog-list-item fade-in-item"
								>
									<div
										style={{
											display: "flex",
											gap: "0.6rem",
											flexWrap: "wrap",
											marginBottom: "0.5rem",
										}}
									>
										{[r.category, r.format, r.pages ? `${r.pages} pages` : null]
											.filter((x): x is string => !!x)
											.map((tag) => (
												<span
													key={tag}
													style={{
														fontSize: "0.65rem",
														color: "var(--gray-dim)",
														border: "1px solid var(--gray-dark)",
														borderRadius: "2px",
														padding: "0.2rem 0.6rem",
														fontFamily: "var(--font-heading)",
														letterSpacing: "0.05em",
													}}
												>
													{tag}
												</span>
											))}
									</div>
									<h2
										style={{
											fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
											fontWeight: 500,
											color: "var(--white)",
											marginBottom: "0.5rem",
											lineHeight: "1.6",
										}}
									>
										{r.title}
									</h2>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
											maxWidth: "600px",
										}}
									>
										{r.description}
									</p>
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}
