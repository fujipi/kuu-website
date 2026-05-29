import type { Metadata } from "next";
import BlogListView from "@/components/BlogListView";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { paginatePosts } from "@/lib/blog-pagination";
import { getAllPosts } from "@/lib/mdx";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";
import { getAllTags } from "@/lib/tags";

export const metadata: Metadata = seoMetadata({
	title: "ブログ | AIエージェント・DX戦略コラム | Kuu株式会社",
	description:
		"AIエージェント導入・エージェントガバナンス・DX戦略に関する実践的な情報を発信しています。中小企業のAI活用から最新のエージェント技術トレンドまで。",
	path: "/blog/",
});

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

export default function BlogListPage() {
	const allPosts = getAllPosts();
	const tags = getAllTags().slice(0, 12);
	const { page, totalPages, posts } = paginatePosts(allPosts, 1);

	const blogListJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "ブログ | AIエージェント・DX戦略コラム",
			description:
				"AIエージェント導入・エージェントガバナンス・DX戦略に関する実践的な情報を発信しています。",
			url: `${BASE_URL}/blog/`,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				itemListElement: posts.map((post, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/blog/${post.slug}/`,
					name: post.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "ブログ", path: "/blog/" },
		]),
	];

	return (
		<>
			<JsonLd data={blogListJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<BlogListView
						posts={posts}
						tags={tags}
						page={page}
						totalPages={totalPages}
					/>
				</div>
			</main>

			<Footer />
		</>
	);
}
