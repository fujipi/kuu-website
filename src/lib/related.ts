import type { BlogPostMeta } from "./mdx";
import { resolveTrack } from "./taxonomy";

/**
 * 関連記事のスコアリング。重み: series 10 > pillar 5 > track 3 > 共有タグ 1/個。
 * series は著者の明示的な意図、track は技術タクソノミ上の近さを表す。
 * 同点時は allPosts の並び（日付降順）を維持する（stable sort）。
 */
export function getRelatedPosts(
	post: BlogPostMeta,
	allPosts: BlogPostMeta[],
	limit = 4,
): BlogPostMeta[] {
	const postTrack = resolveTrack(post.slug, post.track);
	const hasTrack = postTrack !== null && postTrack !== "business";
	return allPosts
		.filter((p) => p.slug !== post.slug)
		.map((p) => {
			const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
			const samePillar = post.pillar && p.pillar === post.pillar ? 1 : 0;
			const sameSeries = post.series && p.series === post.series ? 1 : 0;
			const sameTrack =
				hasTrack && resolveTrack(p.slug, p.track) === postTrack ? 1 : 0;
			const score =
				sameSeries * 10 + samePillar * 5 + sameTrack * 3 + sharedTags;
			return { post: p, score };
		})
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((s) => s.post);
}

/** series 内の記事を series_order → 日付順で返す（SeriesNav 用） */
export function getSeriesPosts(
	series: string,
	allPosts: BlogPostMeta[],
): BlogPostMeta[] {
	return allPosts
		.filter((p) => p.series === series)
		.sort((a, b) => {
			const ao = a.seriesOrder ?? Number.MAX_SAFE_INTEGER;
			const bo = b.seriesOrder ?? Number.MAX_SAFE_INTEGER;
			if (ao !== bo) return ao - bo;
			return a.date < b.date ? -1 : 1;
		});
}
