import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import {
	type CaseEntryMeta,
	getAllCaseSlugs,
	getAllCases,
	getCaseBySlug,
} from "@/lib/case";
import { mdToHtml } from "@/lib/mdToHtml";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return getAllCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const c = getCaseBySlug(slug);
	if (!c) return { title: "ユースケースが見つかりません" };
	return seoMetadata({
		title: `${c.title} | Case | Kuu株式会社`,
		description: c.description,
		path: `/case/${slug}/`,
	});
}

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function CaseDetailPage({ params }: Props) {
	const { slug } = await params;
	const c = getCaseBySlug(slug);
	if (!c) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<h1 className="page-title">ユースケースが見つかりません</h1>
						<Link href="/case/">← Case 一覧</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const url = `${BASE_URL}/case/${slug}/`;
	const html = mdToHtml(c.content);
	const related: CaseEntryMeta[] = getAllCases()
		.filter((x) => x.slug !== slug)
		.slice(0, 5);

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: c.title,
			description: c.description,
			url,
			inLanguage: "ja",
			datePublished: c.date,
			dateModified: c.lastModified || c.date,
			keywords: c.tags.join(", "),
			author: { "@type": "Organization", name: "Kuu株式会社", url: BASE_URL },
			publisher: {
				"@type": "Organization",
				name: "Kuu株式会社",
				url: BASE_URL,
				logo: {
					"@type": "ImageObject",
					url: `${BASE_URL}/images/favicon-192.png`,
				},
			},
			mainEntityOfPage: { "@type": "WebPage", "@id": url },
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "Case", path: "/case/" },
			{ name: c.title, path: `/case/${slug}/` },
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
						<Link href="/case/" style={{ color: "var(--gray-medium)" }}>
							Case
						</Link>
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

					<p
						className="fade-in"
						style={{
							fontSize: "0.75rem",
							color: "var(--gray-dim)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							marginBottom: "2rem",
						}}
					>
						{formatDate(c.date)}
						{c.industry ? ` · ${c.industry}` : ""}
					</p>

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "3rem" }}
					>
						<section
							// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time markdown
							dangerouslySetInnerHTML={{ __html: html }}
							suppressHydrationWarning
						/>
					</article>

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
								OTHER CASES
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{related.map((x) => (
									<Link
										key={x.slug}
										href={`/case/${x.slug}/`}
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
