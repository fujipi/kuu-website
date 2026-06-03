import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { mdToHtml } from "@/lib/mdToHtml";
import { getMainNav } from "@/lib/navigation";
import { getAllNews, getAllNewsSlugs, getNewsBySlug } from "@/lib/news";
import {
	BASE_URL,
	buildBreadcrumb,
	ORG_REF,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const item = getNewsBySlug(slug);
	if (!item) return { title: "お知らせが見つかりません" };
	return seoMetadata({
		title: `${item.title} | News | Kuu株式会社`,
		description: item.description,
		path: `/news/${slug}/`,
		article: {
			publishedTime: item.date,
			modifiedTime: item.lastModified,
			tags: item.tags,
		},
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

export default async function NewsDetailPage({ params }: Props) {
	const { slug } = await params;
	const item = getNewsBySlug(slug);
	if (!item) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<h1 className="page-title">お知らせが見つかりません</h1>
						<Link href="/news/">← News 一覧</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const url = `${BASE_URL}/news/${slug}/`;
	const html = mdToHtml(item.content);
	const related = getAllNews()
		.filter((x) => x.slug !== slug)
		.slice(0, 5);

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: item.title,
			description: item.description,
			url,
			inLanguage: "ja",
			datePublished: item.date,
			dateModified: item.lastModified || item.date,
			keywords: item.tags.join(", "),
			articleSection: item.category,
			author: ORG_REF,
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
			{ name: "News", path: "/news/" },
			{ name: item.title, path: `/news/${slug}/` },
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
						<Link href="/news/" style={{ color: "var(--gray-medium)" }}>
							News
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
						{item.title}
					</h1>

					<p
						className="fade-in"
						style={{
							fontSize: "0.75rem",
							color: "var(--gray-dim)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							marginBottom: "1.5rem",
						}}
					>
						<time dateTime={item.date}>{formatDate(item.date)}</time>
						{item.category ? ` · ${item.category}` : ""}
					</p>

					{item.tags.length > 0 && (
						<div
							className="fade-in"
							style={{
								display: "flex",
								gap: "0.5rem",
								flexWrap: "wrap",
								marginBottom: "2.5rem",
							}}
						>
							{item.tags.map((tag) => (
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
					)}

					{/* 本文 */}
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

					{/* CTA */}
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
							導入・活用について相談する
						</h2>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: "1.9",
								marginBottom: "1.25rem",
							}}
						>
							自社の業務にどう落とし込めるか・費用感や進め方は、無料相談（15〜30分）でご提案します。
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
								OTHER NEWS
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{related.map((x) => (
									<Link
										key={x.slug}
										href={`/news/${x.slug}/`}
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

					<div className="fade-in" style={{ maxWidth: "760px" }}>
						<Link
							href="/news/"
							style={{
								fontSize: "0.8rem",
								color: "var(--gray-medium)",
								borderBottom: "1px solid var(--gray-dark)",
								paddingBottom: "0.2rem",
							}}
						>
							← News 一覧へ戻る
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
