import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { mdToHtml } from "@/lib/mdToHtml";
import {
	getAllResources,
	getAllResourceSlugs,
	getResourceBySlug,
} from "@/lib/resources";
import { generateMetadata as seoMetadata } from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/resources/", label: "Resources" },
	{ href: "/case-studies/", label: "Cases" },
	{ href: "/pricing/", label: "Pricing" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export async function generateStaticParams() {
	return getAllResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const r = getResourceBySlug(slug);
	if (!r) return { title: "資料が見つかりません" };
	return seoMetadata({
		title: `${r.title} | リソース | Kuu株式会社`,
		description: r.description,
		path: `/resources/${slug}/`,
	});
}

export default async function ResourceDetailPage({ params }: Props) {
	const { slug } = await params;
	const r = getResourceBySlug(slug);
	if (!r) {
		return (
			<>
				<Stars />
				<Header navLinks={navLinks} />
				<main>
					<div className="page-content">
						<h1 className="page-title">資料が見つかりません</h1>
						<Link href="/resources/">← リソース一覧</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const url = `${BASE_URL}/resources/${slug}/`;
	const contentHtml = mdToHtml(r.content);
	const related = getAllResources()
		.filter((x) => x.slug !== slug)
		.slice(0, 3);

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			"@id": `${url}#resource`,
			name: r.title,
			description: r.description,
			url,
			inLanguage: "ja",
			datePublished: r.date,
			dateModified: r.lastModified || r.date,
			encodingFormat: r.format,
			numberOfPages: r.pages || undefined,
			keywords: r.tags.join(", "),
			author: { "@type": "Organization", name: "Kuu株式会社", url: BASE_URL },
			publisher: { "@type": "Organization", name: "Kuu株式会社", url: BASE_URL },
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "JPY",
				availability: "https://schema.org/InStock",
				url: `${BASE_URL}/contact/`,
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
					name: "リソース",
					item: `${BASE_URL}/resources/`,
				},
				{ "@type": "ListItem", position: 3, name: r.title, item: url },
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
						<Link href="/resources/" style={{ color: "var(--gray-medium)" }}>
							Resources
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{r.category}</span>
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
						{r.title}
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
						{[
							r.category,
							r.format,
							r.pages ? `${r.pages} pages` : null,
							"無料",
						]
							.filter((x): x is string => !!x)
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

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "3rem" }}
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
							background: "rgba(255,255,255,0.02)",
						}}
					>
						<h2
							style={{
								fontSize: "1rem",
								color: "var(--white)",
								marginBottom: "1rem",
							}}
						>
							資料を受け取る
						</h2>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: "1.9",
								marginBottom: "1.25rem",
							}}
						>
							本資料はお問い合わせフォームからご請求いただけます。御社のご状況をヒアリングのうえ、最新版をメールでお送りします (数営業日以内)。
						</p>
						<Link
							href="/contact/"
							style={{
								display: "inline-block",
								fontSize: "0.85rem",
								color: "var(--white)",
								border: "1px solid var(--white)",
								padding: "0.7rem 1.75rem",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.05em",
							}}
						>
							資料請求・無料相談
						</Link>
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
								OTHER RESOURCES
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{related.map((x) => (
									<Link
										key={x.slug}
										href={`/resources/${x.slug}/`}
										style={{
											padding: "1rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.9rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{x.title}
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
