import { type BlogPostMeta, getAllPosts } from "@/lib/mdx";

/**
 * タグアーカイブを index / 内部リンク対象にする最小記事数。
 * これ未満のタグは noindex かつリンクを張らない（薄いアーカイブに
 * クロール予算を割かせないため。tags/[tag]/page.tsx と本数条件を共有する）。
 */
export const TAG_MIN_POSTS = 3;

export function slugifyTag(tag: string): string {
	return tag.toLowerCase().replace(/[\s/]+/g, "-");
}

/**
 * slug → その slug に解決される記事数。リンクを張るか（= TAG_MIN_POSTS 以上か）の判定に使う。
 * 表記ゆれ（"Computer Use" と "computer use"）は同じ slug に潰れ、アーカイブページも
 * getPostsByTagSlug が slug 一致でまとめて拾うため、ここでも slug 単位で合算する。
 */
let tagCountsCache: Map<string, number> | null = null;

export function getTagCounts(): Map<string, number> {
	if (tagCountsCache) return tagCountsCache;
	const counts = new Map<string, number>();
	for (const { slug, count } of getAllTags()) {
		counts.set(slug, (counts.get(slug) ?? 0) + count);
	}
	// 記事ページ 233 本すべてから呼ばれる一方 getAllPosts() は毎回 MDX を読み直すため、
	// ビルド時間が O(記事数^2) にならないよう結果を保持する（ビルドごとに新プロセス）。
	tagCountsCache = counts;
	return counts;
}

export function getAllTags(): { tag: string; slug: string; count: number }[] {
	const counter = new Map<string, number>();
	for (const p of getAllPosts()) {
		for (const t of p.tags) {
			counter.set(t, (counter.get(t) ?? 0) + 1);
		}
	}
	return [...counter.entries()]
		.map(([tag, count]) => ({ tag, slug: slugifyTag(tag), count }))
		.sort((a, b) => b.count - a.count);
}

function tryDecode(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

export function getPostsByTagSlug(slug: string): {
	tag: string | null;
	posts: BlogPostMeta[];
} {
	const normalized = tryDecode(slug);
	const posts = getAllPosts();
	const matched: BlogPostMeta[] = [];
	let canonicalTag: string | null = null;
	for (const p of posts) {
		for (const t of p.tags) {
			if (slugifyTag(t) === normalized) {
				canonicalTag = t;
				matched.push(p);
				break;
			}
		}
	}
	return { tag: canonicalTag, posts: matched };
}
