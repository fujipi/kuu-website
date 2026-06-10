import type { Metadata } from "next";
import Link from "next/link";
import CtaBox from "@/components/CtaBox";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import ReadingTime from "@/components/ReadingTime";
import Redirect from "@/components/Redirect";
import SeriesNav from "@/components/SeriesNav";
import Stars from "@/components/Stars";
import TableOfContents from "@/components/TableOfContents";
import { getAuthorBySlug } from "@/lib/authors";
import { BLOG_REDIRECTS } from "@/lib/blog-redirects";
import { mdToHtml } from "@/lib/mdToHtml";
import { getAllPostSlugs, getAllPosts, getPostBySlug } from "@/lib/mdx";
import { getMainNav } from "@/lib/navigation";
import { readingTimeMinutes } from "@/lib/readingTime";
import { getRelatedPosts, getSeriesPosts } from "@/lib/related";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";
import { slugifyTag } from "@/lib/tags";
import { buildToc } from "@/lib/toc";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = new Set([...getAllPostSlugs(), ...Object.keys(BLOG_REDIRECTS)]);
	return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const redirectTarget = BLOG_REDIRECTS[slug];
	if (redirectTarget) {
		const to = `/blog/${redirectTarget}/`;
		return {
			...seoMetadata({
				title: "記事を移動しました",
				description:
					"この記事は統合されました。最新の内容は移動先の記事をご覧ください。",
				path: `/blog/${slug}/`,
			}),
			alternates: { canonical: `${BASE_URL}${to}` },
			robots: { index: false, follow: true },
		};
	}
	const post = getPostBySlug(slug);
	if (!post) {
		return { title: "記事が見つかりません" };
	}
	const author = getAuthorBySlug(post.author);
	return seoMetadata({
		title: post.title,
		description: post.description,
		path: `/blog/${slug}/`,
		article: {
			publishedTime: post.date,
			modifiedTime: post.lastModified,
			authors: [author.name],
			tags: post.tags,
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

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;

	const redirectTarget = BLOG_REDIRECTS[slug];
	if (redirectTarget) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<Redirect to={`/blog/${redirectTarget}/`} />
				</main>
				<Footer />
			</>
		);
	}

	const post = getPostBySlug(slug);

	if (!post) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							記事が見つかりません。
						</p>
						<Link
							href="/blog/"
							style={{ color: "var(--white)", fontSize: "0.85rem" }}
						>
							← ブログ一覧へ
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	// 前後記事・関連記事
	const allPosts = getAllPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === slug);
	const prevPost =
		currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
	const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

	const relatedPosts = getRelatedPosts(post, allPosts);
	const seriesPosts = post.series ? getSeriesPosts(post.series, allPosts) : [];

	// TOC 構築（H2/H3 の id 対応）
	const { toc, idMap } = buildToc(post.content);
	// 読了時間
	const minutes = readingTimeMinutes(post.content);
	// 著者メタ
	const author = getAuthorBySlug(post.author);

	// ローカルMDXファイル（外部入力なし）をビルド時に変換したHTML
	const contentHtml = mdToHtml(post.content, idMap);

	const articleJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: post.title,
			description: post.description,
			author: {
				"@type": "Person",
				name: author.name,
				jobTitle: author.role,
				url: `https://kuucorp.com/authors/${author.slug}/`,
				knowsAbout: author.expertise,
				worksFor: {
					"@type": "Organization",
					name: "Kuu株式会社",
					url: "https://kuucorp.com",
				},
			},
			publisher: {
				"@type": "Organization",
				name: "Kuu株式会社",
				url: "https://kuucorp.com",
				logo: {
					"@type": "ImageObject",
					url: "https://kuucorp.com/images/favicon-192.png",
				},
			},
			datePublished: post.date,
			dateModified: post.lastModified,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `https://kuucorp.com/blog/${slug}/`,
			},
			url: `https://kuucorp.com/blog/${slug}/`,
			wordCount: post.content.length,
			articleSection: post.tags[0] ?? "AIエージェント",
			keywords: post.tags.join(", "),
			inLanguage: "ja",
			speakable: {
				"@type": "SpeakableSpecification",
				cssSelector: [".answer-block"],
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "ブログ", path: "/blog/" },
			{ name: post.title, path: `/blog/${slug}/` },
		]),
	];

	return (
		<>
			<JsonLd data={articleJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content">
					{/* パンくず */}
					<nav
						className="fade-in"
						style={{
							fontSize: "0.7rem",
							color: "var(--gray-dim)",
							marginBottom: "2.5rem",
							fontFamily: "var(--font-heading)",
						}}
					>
						<Link href="/blog/" style={{ color: "var(--gray-medium)" }}>
							Blog
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{post.title}</span>
					</nav>

					{/* 記事ヘッダー */}
					<div style={{ maxWidth: "720px", marginBottom: "2rem" }}>
						<div
							className="fade-in"
							style={{
								display: "flex",
								alignItems: "center",
								flexWrap: "wrap",
								marginBottom: "1rem",
							}}
						>
							<time
								dateTime={post.date}
								style={{
									fontSize: "0.7rem",
									color: "var(--gray-dim)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								{formatDate(post.date)}
							</time>
							<ReadingTime minutes={minutes} />
						</div>
						<h1
							data-pagefind-body
							data-pagefind-meta="title"
							className="fade-in"
							style={{
								fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
								fontWeight: 500,
								lineHeight: "1.6",
								letterSpacing: "0.02em",
								marginBottom: "1rem",
							}}
						>
							{post.title}
						</h1>
						<div
							className="fade-in"
							style={{
								fontSize: "0.75rem",
								color: "var(--gray-dim)",
								marginBottom: "1rem",
							}}
						>
							by{" "}
							<Link
								href={`/authors/${author.slug}/`}
								style={{ color: "var(--gray-medium)" }}
							>
								{author.name}
							</Link>
							{post.lastModified && post.lastModified !== post.date && (
								<>
									{" · 更新日 "}
									<time dateTime={post.lastModified}>
										{formatDate(post.lastModified)}
									</time>
								</>
							)}
						</div>
						{post.tags.length > 0 && (
							<div
								className="fade-in"
								style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
							>
								{post.tags.map((tag) => (
									<Link
										key={tag}
										href={`/blog/tags/${slugifyTag(tag)}/`}
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
									</Link>
								))}
							</div>
						)}
					</div>

					<TableOfContents items={toc} />

					{post.series ? (
						<SeriesNav
							currentSlug={slug}
							series={post.series}
							posts={seriesPosts}
						/>
					) : null}

					{/* 記事本文: ビルド時変換済みHTML（ローカルファイルのみ・外部入力なし） */}
					<article
						data-pagefind-body
						className="blog-content fade-in"
						style={{ maxWidth: "720px", marginBottom: "5rem" }}
						// Content is static markdown from local files, no external user input possible.
						// This is safe as it's rendered at build time (output: 'export').
						// eslint-disable-next-line react/no-danger
						// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time markdown
						dangerouslySetInnerHTML={{ __html: contentHtml }}
					/>

					<CtaBox audience={post.audience} track={post.track} />

					{/* 前後ナビゲーション */}
					<nav
						className="fade-in"
						style={{
							maxWidth: "720px",
							borderTop: "1px solid var(--gray-dark)",
							paddingTop: "2rem",
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "1rem",
							marginBottom: "3rem",
						}}
					>
						{prevPost ? (
							<Link
								href={`/blog/${prevPost.slug}/`}
								style={{
									display: "block",
									fontSize: "0.75rem",
									color: "var(--gray-medium)",
									lineHeight: "1.6",
								}}
							>
								<span
									style={{
										display: "block",
										fontSize: "0.65rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.25rem",
									}}
								>
									← 前の記事
								</span>
								{prevPost.title}
							</Link>
						) : (
							<div />
						)}
						{nextPost ? (
							<Link
								href={`/blog/${nextPost.slug}/`}
								style={{
									display: "block",
									fontSize: "0.75rem",
									color: "var(--gray-medium)",
									lineHeight: "1.6",
									textAlign: "right",
								}}
							>
								<span
									style={{
										display: "block",
										fontSize: "0.65rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.25rem",
									}}
								>
									次の記事 →
								</span>
								{nextPost.title}
							</Link>
						) : (
							<div />
						)}
					</nav>

					{/* 関連記事 */}
					{relatedPosts.length > 0 && (
						<section
							className="fade-in"
							style={{
								maxWidth: "720px",
								marginBottom: "3rem",
							}}
						>
							<h2
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-light)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.1em",
									marginBottom: "1.5rem",
								}}
							>
								関連記事
							</h2>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								{relatedPosts.map((rp) => (
									<Link
										key={rp.slug}
										href={`/blog/${rp.slug}/`}
										style={{
											display: "block",
											padding: "1rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{rp.title}
									</Link>
								))}
								<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
							</div>
						</section>
					)}

					{/* ブログ一覧へ */}
					<div className="fade-in" style={{ maxWidth: "720px" }}>
						<Link
							href="/blog/"
							style={{
								fontSize: "0.8rem",
								color: "var(--gray-medium)",
								borderBottom: "1px solid var(--gray-dark)",
								paddingBottom: "0.2rem",
							}}
						>
							← ブログ一覧へ戻る
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
