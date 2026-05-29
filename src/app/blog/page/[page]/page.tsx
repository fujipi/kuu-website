import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListView from "@/components/BlogListView";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { POSTS_PER_PAGE, paginatePosts } from "@/lib/blog-pagination";
import { getAllPosts } from "@/lib/mdx";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";
import { getAllTags } from "@/lib/tags";
import { getMainNav } from "@/lib/navigation";

export async function generateStaticParams() {
	const total = getAllPosts().length;
	const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
	// page 1 is served by /blog/ — only generate 2..N
	const params: { page: string }[] = [];
	for (let i = 2; i <= totalPages; i++) {
		params.push({ page: String(i) });
	}
	return params;
}

export const dynamicParams = false;

interface PageProps {
	params: Promise<{ page: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { page: pageStr } = await params;
	const page = Number(pageStr);
	return seoMetadata({
		title: `ブログ（${page}ページ目） | AIエージェント・DX戦略コラム | Kuu株式会社`,
		description: `AIエージェント導入・エージェントガバナンス・DX戦略に関するKuu株式会社のブログ ${page}ページ目。`,
		path: `/blog/page/${page}/`,
	});
}

export default async function BlogListPaginatedPage({ params }: PageProps) {
	const { page: pageStr } = await params;
	const pageNum = Number(pageStr);
	if (!Number.isInteger(pageNum) || pageNum < 2) notFound();

	const allPosts = getAllPosts();
	const tags = getAllTags().slice(0, 12);
	const { page, totalPages, posts } = paginatePosts(allPosts, pageNum);

	if (page !== pageNum) notFound();

	const url = `${BASE_URL}/blog/page/${page}/`;
	const blogListJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `ブログ（${page}ページ目） | AIエージェント・DX戦略コラム`,
			description: `AIエージェント導入・エージェントガバナンス・DX戦略に関する実践的な情報。${page}ページ目。`,
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				itemListElement: posts.map((post, i) => ({
					"@type": "ListItem",
					position: (page - 1) * POSTS_PER_PAGE + i + 1,
					url: `${BASE_URL}/blog/${post.slug}/`,
					name: post.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "ブログ", path: "/blog/" },
			{ name: `${page}ページ目`, path: `/blog/page/${page}/` },
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
						page={page}
						totalPages={totalPages}
					/>
				</div>
			</main>

			<Footer />
		</>
	);
}
