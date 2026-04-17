import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { tagDescription } from "@/lib/tagDescriptions";
import { getAllTags, getPostsByTagSlug } from "@/lib/tags";

interface Props {
	params: Promise<{ tag: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/contact/", label: "Contact" },
];

export async function generateStaticParams() {
	return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { tag: slug } = await params;
	const { tag, posts } = getPostsByTagSlug(slug);
	if (!tag) return { title: "タグが見つかりません" };
	return seoMetadata({
		title: `${tag}に関する記事一覧 (${posts.length}件) | Kuu株式会社ブログ`,
		description: tagDescription(tag, posts.length),
		path: `/blog/tags/${slug}/`,
	});
}

function formatDate(d: string): string {
	const dt = new Date(d);
	if (Number.isNaN(dt.getTime())) return d;
	return dt.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function TagArchivePage({ params }: Props) {
	const { tag: slug } = await params;
	const { tag, posts } = getPostsByTagSlug(slug);

	if (!tag) {
		return (
			<>
				<Stars />
				<Header navLinks={navLinks} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							タグが見つかりません。
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

	const description = tagDescription(tag, posts.length);
	const url = `https://kuucorp.com/blog/tags/${slug}/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `${tag}に関する記事一覧`,
			description,
			url,
			isPartOf: {
				"@type": "WebSite",
				url: "https://kuucorp.com",
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: posts.length,
				itemListElement: posts.map((p, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `https://kuucorp.com/blog/${p.slug}/`,
					name: p.title,
				})),
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "ホーム",
					item: "https://kuucorp.com",
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "ブログ",
					item: "https://kuucorp.com/blog/",
				},
				{ "@type": "ListItem", position: 3, name: tag, item: url },
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
						<Link href="/blog/" style={{ color: "var(--gray-medium)" }}>
							Blog
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>Tag: {tag}</span>
					</nav>

					<h1 className="page-title fade-in">#{tag}</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-medium)",
							maxWidth: "640px",
							lineHeight: "1.8",
							marginBottom: "2.5rem",
						}}
					>
						{description}
					</p>

					<div
						className="fade-in-stagger blog-list"
						style={{ maxWidth: "720px" }}
					>
						{posts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}/`}
								className="blog-list-item fade-in-item"
							>
								<time
									dateTime={post.date}
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										display: "block",
										marginBottom: "0.5rem",
									}}
								>
									{formatDate(post.date)}
								</time>
								<h2
									style={{
										fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
										fontWeight: 500,
										color: "var(--white)",
										marginBottom: "0.5rem",
										lineHeight: "1.6",
									}}
								>
									{post.title}
								</h2>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
										maxWidth: "600px",
									}}
								>
									{post.description}
								</p>
							</Link>
						))}
						<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
					</div>

					<div className="fade-in" style={{ marginTop: "3rem" }}>
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
