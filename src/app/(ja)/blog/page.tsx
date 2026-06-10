import type { Metadata } from "next";
import BlogListView from "@/components/BlogListView";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { paginatePosts } from "@/lib/blog-pagination";
import { getAllPosts } from "@/lib/mdx";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";
import { getAllTags } from "@/lib/tags";
import { resolveTrack, TRACK_INFO, TRACK_SLUGS } from "@/lib/taxonomy";

export const metadata: Metadata = seoMetadata({
	title: "AIエージェント技術ブログ｜Kuu株式会社",
	description:
		"AIエージェントのアーキテクチャ、MCP/A2Aプロトコル、評価・可観測性、セキュリティ、ガバナンスを、設計判断とトレードオフまで掘り下げる技術ブログ。SMBからエンタープライズまでの実装者・技術者に向けて発信します。",
	path: "/blog/",
});

export default function BlogListPage() {
	const allPosts = getAllPosts();
	const tags = getAllTags().slice(0, 12);
	const tracks = TRACK_SLUGS.map((slug) => ({
		slug,
		label: TRACK_INFO[slug].label,
		count: allPosts.filter((p) => resolveTrack(p.slug, p.track) === slug)
			.length,
	})).filter((t) => t.count > 0);
	const { page, totalPages, posts } = paginatePosts(allPosts, 1);

	const blogListJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "AIエージェント技術ブログ",
			description:
				"AIエージェントのアーキテクチャ、MCP/A2Aプロトコル、評価・可観測性、セキュリティ、ガバナンスを設計判断とトレードオフまで掘り下げる技術ブログ。",
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
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content">
					<BlogListView
						posts={posts}
						tags={tags}
						tracks={tracks}
						page={page}
						totalPages={totalPages}
					/>
				</div>
			</main>

			<Footer />
		</>
	);
}
