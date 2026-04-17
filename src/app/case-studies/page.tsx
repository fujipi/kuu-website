import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCaseStudies } from "@/lib/caseStudies";
import { generateMetadata as seoMetadata } from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/managed-agents/", label: "Managed Agents" },
	{ href: "/pricing/", label: "Pricing" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export const metadata: Metadata = seoMetadata({
	title: "導入事例 | AIエージェントガバナンス・Managed Agents 活用例 | Kuu株式会社",
	description:
		"製造業・士業・EC小売など、中小企業のAIエージェント導入事例。工数削減・品質改善・CVR向上など定量成果を事例ごとに公開しています。",
	path: "/case-studies/",
});

export default function CaseStudiesIndexPage() {
	const cases = getAllCaseStudies();
	const url = `${BASE_URL}/case-studies/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "Kuu株式会社 導入事例",
			description:
				"中小企業におけるAIエージェント・Managed Agents 導入の定量成果を紹介する事例集。",
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
					position: i + 1,
					url: `${BASE_URL}/case-studies/${c.slug}/`,
					name: c.title,
				})),
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{ "@type": "ListItem", position: 2, name: "導入事例", item: url },
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
					<h1 className="page-title fade-in">Case Studies</h1>
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
						KuuがAIエージェント導入・Managed
						Agents運用で支援した中小企業の事例を、業種・規模・課題別に紹介します。工数削減・品質改善・顧客満足度向上など、定量成果にフォーカスしています。
					</p>

					{cases.length === 0 ? (
						<p
							className="fade-in"
							style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
						>
							事例を準備中です。
						</p>
					) : (
						<div className="fade-in-stagger blog-list" style={{ maxWidth: "720px" }}>
							{cases.map((c) => (
								<Link
									key={c.slug}
									href={`/case-studies/${c.slug}/`}
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
										{[c.clientIndustry, c.companySize]
											.filter(Boolean)
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
										{c.title}
									</h2>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
											maxWidth: "600px",
											marginBottom: "0.75rem",
										}}
									>
										{c.description}
									</p>
									{c.resultMetrics.length > 0 && (
										<ul
											style={{
												listStyle: "none",
												padding: 0,
												margin: 0,
												display: "flex",
												flexDirection: "column",
												gap: "0.25rem",
											}}
										>
											{c.resultMetrics.slice(0, 3).map((m) => (
												<li
													key={m}
													style={{
														fontSize: "0.75rem",
														color: "var(--gray-light)",
														fontFamily: "var(--font-heading)",
														letterSpacing: "0.02em",
													}}
												>
													▸ {m}
												</li>
											))}
										</ul>
									)}
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
