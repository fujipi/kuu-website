import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllAuthors, getAuthorBySlug } from "@/lib/authors";
import { getAllPosts } from "@/lib/mdx";
import { generateMetadata as seoMetadata } from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/contact/", label: "Contact" },
];

export async function generateStaticParams() {
	return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const author = getAuthorBySlug(slug);
	return seoMetadata({
		title: `${author.name} の執筆記事 | Kuu株式会社`,
		description: author.bio,
		path: `/authors/${slug}/`,
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

export default async function AuthorPage({ params }: Props) {
	const { slug } = await params;
	const author = getAuthorBySlug(slug);
	const posts = getAllPosts().filter((p) => p.author === slug);
	const url = `https://kuucorp.com/authors/${slug}/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "ProfilePage",
			mainEntity: {
				"@type": "Person",
				name: author.name,
				jobTitle: author.role,
				description: author.bio,
				url,
				knowsAbout: author.expertise,
				sameAs: author.sameAs,
				worksFor: {
					"@type": "Organization",
					name: "Kuu株式会社",
					url: "https://kuucorp.com",
				},
			},
			hasPart: {
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
					name: "著者一覧",
					item: "https://kuucorp.com/authors/",
				},
				{ "@type": "ListItem", position: 3, name: author.name, item: url },
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
					<h1 className="page-title fade-in">{author.name}</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.8rem",
							color: "var(--gray-dim)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							marginBottom: "1.5rem",
						}}
					>
						{author.role}
					</p>
					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							maxWidth: "640px",
							lineHeight: "1.9",
							marginBottom: "2rem",
						}}
					>
						{author.bio}
					</p>
					<div
						className="fade-in"
						style={{
							display: "flex",
							gap: "0.5rem",
							flexWrap: "wrap",
							marginBottom: "3rem",
						}}
					>
						{author.expertise.map((e) => (
							<span
								key={e}
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
								{e}
							</span>
						))}
					</div>

					<h2
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-light)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.1em",
							marginBottom: "1.5rem",
						}}
					>
						EXECUTED ARTICLES ({posts.length})
					</h2>

					<div
						className="fade-in-stagger blog-list"
						style={{ maxWidth: "720px" }}
					>
						{posts.length === 0 ? (
							<p style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}>
								この著者名義で公開中の記事はまだありません。
							</p>
						) : (
							posts.map((post) => (
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
									<h3
										style={{
											fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
											fontWeight: 500,
											color: "var(--white)",
											marginBottom: "0.5rem",
											lineHeight: "1.6",
										}}
									>
										{post.title}
									</h3>
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
							))
						)}
						<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
