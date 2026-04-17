import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { generateMetadata as seoMetadata } from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export const metadata: Metadata = seoMetadata({
	title: "AIエージェント・エージェントガバナンス用語集 | Kuu株式会社",
	description:
		"AIエージェント、Managed Agents、エージェントガバナンス、EU AI Act、ISO 42001 など、中小企業の経営者・IT担当者が知っておくべき用語を平易に解説します。",
	path: "/glossary/",
});

export default function GlossaryIndexPage() {
	const terms = getAllGlossaryTerms();
	const url = `${BASE_URL}/glossary/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "DefinedTermSet",
			name: "Kuu株式会社 AIエージェント用語集",
			description:
				"AIエージェント・エージェントガバナンス・AI規制に関する用語を中小企業の経営者向けに解説する用語集。",
			url,
			hasDefinedTerm: terms.map((t) => ({
				"@type": "DefinedTerm",
				name: t.term,
				description: t.shortDefinition,
				url: `${BASE_URL}/glossary/${t.slug}/`,
				inDefinedTermSet: url,
			})),
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{ "@type": "ListItem", position: 2, name: "用語集", item: url },
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
					<h1 className="page-title fade-in">Glossary</h1>
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
						AIエージェントとエージェントガバナンスの実務で頻出する用語を、中小企業の経営者・IT担当者が意思決定に使えるレベルで整理しました。生成AI規制・国際規格・技術プロトコルまで横断的にカバーしています。
					</p>

					<div className="fade-in-stagger" style={{ maxWidth: "720px" }}>
						{terms.map((t) => (
							<Link
								key={t.slug}
								href={`/glossary/${t.slug}/`}
								className="blog-list-item fade-in-item"
							>
								<div
									style={{
										display: "flex",
										alignItems: "baseline",
										gap: "0.75rem",
										marginBottom: "0.5rem",
										flexWrap: "wrap",
									}}
								>
									<h2
										style={{
											fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
											fontWeight: 500,
											color: "var(--white)",
											lineHeight: "1.5",
										}}
									>
										{t.term}
									</h2>
									{t.english && (
										<span
											style={{
												fontSize: "0.7rem",
												color: "var(--gray-dim)",
												fontFamily: "var(--font-heading)",
												letterSpacing: "0.05em",
											}}
										>
											{t.english}
										</span>
									)}
								</div>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-medium)",
										lineHeight: "1.8",
										maxWidth: "620px",
									}}
								>
									{t.shortDefinition}
								</p>
							</Link>
						))}
						<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
