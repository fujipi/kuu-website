import type { BlogPostMeta } from "./mdx";

export const POSTS_PER_PAGE = 10;

export interface BlogPage {
	page: number;
	totalPages: number;
	posts: BlogPostMeta[];
}

export function paginatePosts(
	posts: BlogPostMeta[],
	page: number,
	perPage: number = POSTS_PER_PAGE,
): BlogPage {
	const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * perPage;
	return {
		page: safePage,
		totalPages,
		posts: posts.slice(start, start + perPage),
	};
}

export function buildPageUrl(page: number): string {
	return page <= 1 ? "/blog/" : `/blog/page/${page}/`;
}
