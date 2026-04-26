import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllAuthors } from "@/lib/authors";
import { getAllPosts } from "@/lib/mdx";
import { generateMetadata as seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "著者一覧 | Kuu株式会社",
	description:
		"Kuu株式会社のブログ執筆陣。AIエージェントガバナンス、AX/DX戦略、Managed Agents の実務知見を発信しています。",
	path: "/authors/",
});

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export default function AuthorsIndexPage() {
	const authors = getAllAuthors();
	const allPosts = getAllPosts();
	const authorsWithCounts = authors.map((a) => ({
		...a,
		postCount: allPosts.filter((p) => p.author === a.slug).length,
	}));

	const url = `${BASE_URL}/authors/`;
	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "著者一覧 | Kuu株式会社",
			description:
				"Kuu株式会社のブログ執筆陣。AIエージェントガバナンス、AX/DX戦略の実務知見を発信しています。",
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: authorsWithCounts.length,
				itemListElement: authorsWithCounts.map((a, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/authors/${a.slug}/`,
					name: a.name,
				})),
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{ "@type": "ListItem", position: 2, name: "著者一覧", item: url },
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
					<h1 className="page-title fade-in">Authors</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-medium)",
							maxWidth: "640px",
							lineHeight: "1.8",
							marginBottom: "3rem",
						}}
					>
						Kuu株式会社のブログ執筆陣。AIエージェントガバナンス、Managed
						Agents、AX/DX 戦略に関する実務知見を発信しています。
					</p>

					<div
						className="fade-in-stagger blog-list"
						style={{ maxWidth: "720px" }}
					>
						{authorsWithCounts.map((a) => (
							<Link
								key={a.slug}
								href={`/authors/${a.slug}/`}
								className="blog-list-item fade-in-item"
							>
								<div
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.5rem",
									}}
								>
									{a.role}
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
									{a.name}（{a.postCount}記事）
								</h2>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
										maxWidth: "600px",
									}}
								>
									{a.bio}
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
