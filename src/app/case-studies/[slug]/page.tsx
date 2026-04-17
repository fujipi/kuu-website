import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import {
	getAllCaseStudies,
	getAllCaseStudySlugs,
	getCaseStudyBySlug,
} from "@/lib/caseStudies";
import { mdToHtml } from "@/lib/mdToHtml";
import { generateMetadata as seoMetadata } from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/managed-agents/", label: "Managed Agents" },
	{ href: "/case-studies/", label: "Cases" },
	{ href: "/pricing/", label: "Pricing" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export async function generateStaticParams() {
	return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const c = getCaseStudyBySlug(slug);
	if (!c) return { title: "事例が見つかりません" };
	return seoMetadata({
		title: `${c.title} | 導入事例 | Kuu株式会社`,
		description: c.description,
		path: `/case-studies/${slug}/`,
	});
}

export default async function CaseStudyDetailPage({ params }: Props) {
	const { slug } = await params;
	const c = getCaseStudyBySlug(slug);
	if (!c) {
		return (
			<>
				<Stars />
				<Header navLinks={navLinks} />
				<main>
					<div className="page-content">
						<h1 className="page-title">事例が見つかりません</h1>
						<Link href="/case-studies/">← 事例一覧</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const url = `${BASE_URL}/case-studies/${slug}/`;
	const contentHtml = mdToHtml(c.content);
	const related = getAllCaseStudies()
		.filter((x) => x.slug !== slug)
		.slice(0, 3);

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"@id": `${url}#article`,
			headline: c.title,
			description: c.description,
			datePublished: c.date,
			dateModified: c.lastModified || c.date,
			mainEntityOfPage: { "@type": "WebPage", "@id": url },
			url,
			inLanguage: "ja",
			articleSection: "Case Study",
			author: {
				"@type": "Organization",
				name: "Kuu株式会社",
				url: BASE_URL,
			},
			publisher: {
				"@type": "Organization",
				name: "Kuu株式会社",
				url: BASE_URL,
				logo: {
					"@type": "ImageObject",
					url: `${BASE_URL}/images/favicon-192.png`,
				},
			},
			about: [c.clientIndustry, ...c.services].filter(Boolean),
			keywords: [
				c.clientIndustry,
				c.companySize,
				"AIエージェント",
				"Managed Agents",
				"中小企業",
				...c.services,
			]
				.filter(Boolean)
				.join(", "),
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{
					"@type": "ListItem",
					position: 2,
					name: "導入事例",
					item: `${BASE_URL}/case-studies/`,
				},
				{ "@type": "ListItem", position: 3, name: c.title, item: url },
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
					<nav
						className="fade-in"
						style={{
							fontSize: "0.7rem",
							color: "var(--gray-dim)",
							marginBottom: "2rem",
							fontFamily: "var(--font-heading)",
						}}
					>
						<Link href="/" style={{ color: "var(--gray-medium)" }}>
							Home
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<Link href="/case-studies/" style={{ color: "var(--gray-medium)" }}>
							Case Studies
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{c.client || c.clientIndustry}</span>
					</nav>

					<h1
						className="fade-in"
						style={{
							fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
							fontWeight: 500,
							lineHeight: "1.5",
							marginBottom: "1rem",
						}}
					>
						{c.title}
					</h1>

					<div
						className="fade-in"
						style={{
							display: "flex",
							gap: "0.6rem",
							flexWrap: "wrap",
							marginBottom: "2rem",
						}}
					>
						{[c.clientIndustry, c.companySize, c.duration]
							.filter(Boolean)
							.map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-dim)",
										border: "1px solid var(--gray-dark)",
										borderRadius: "2px",
										padding: "0.25rem 0.7rem",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
									}}
								>
									{tag}
								</span>
							))}
					</div>

					{c.resultMetrics.length > 0 && (
						<div
							className="fade-in"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
								gap: "1rem",
								maxWidth: "760px",
								marginBottom: "3rem",
							}}
						>
							{c.resultMetrics.slice(0, 3).map((m) => (
								<div
									key={m}
									style={{
										border: "1px solid var(--gray-dark)",
										padding: "1.25rem",
										borderRadius: "4px",
										background: "rgba(255,255,255,0.02)",
									}}
								>
									<div
										style={{
											fontSize: "0.65rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.1em",
											marginBottom: "0.4rem",
										}}
									>
										RESULT
									</div>
									<div
										style={{
											fontSize: "0.9rem",
											color: "var(--white)",
											lineHeight: "1.6",
										}}
									>
										{m}
									</div>
								</div>
							))}
						</div>
					)}

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "4rem" }}
					>
						<section
							dangerouslySetInnerHTML={{ __html: contentHtml }}
							suppressHydrationWarning
						/>
					</article>

					<section
						className="fade-in"
						style={{
							maxWidth: "760px",
							padding: "2rem",
							border: "1px solid var(--gray-dark)",
							borderRadius: "6px",
							marginBottom: "3rem",
						}}
					>
						<h2
							style={{
								fontSize: "1rem",
								color: "var(--white)",
								marginBottom: "1rem",
							}}
						>
							類似事例のご相談
						</h2>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: "1.9",
								marginBottom: "1.25rem",
							}}
						>
							同業種・同規模でのAIエージェント導入は、業務棚卸しから1週間程度で費用感と効果試算をお出しできます。無料相談は15-30分のオンライン形式です。
						</p>
						<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
							<Link
								href="/contact/"
								style={{
									fontSize: "0.8rem",
									color: "var(--white)",
									border: "1px solid var(--white)",
									padding: "0.6rem 1.5rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								無料相談
							</Link>
							<Link
								href="/pricing/"
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-light)",
									border: "1px solid var(--gray-dark)",
									padding: "0.6rem 1.5rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								料金プラン
							</Link>
						</div>
					</section>

					{related.length > 0 && (
						<section
							className="fade-in"
							style={{ maxWidth: "760px", marginBottom: "3rem" }}
						>
							<h2
								style={{
									fontSize: "0.85rem",
									color: "var(--gray-light)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.1em",
									marginBottom: "1.5rem",
								}}
							>
								OTHER CASE STUDIES
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{related.map((r) => (
									<Link
										key={r.slug}
										href={`/case-studies/${r.slug}/`}
										style={{
											padding: "1rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.9rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{r.title}
									</Link>
								))}
								<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
							</div>
						</section>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}
