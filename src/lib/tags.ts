import { type BlogPostMeta, getAllPosts } from "@/lib/mdx";

export function slugifyTag(tag: string): string {
	return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"));
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

export function getPostsByTagSlug(slug: string): {
	tag: string | null;
	posts: BlogPostMeta[];
} {
	const decoded = decodeURIComponent(slug);
	const posts = getAllPosts();
	const matched: BlogPostMeta[] = [];
	let canonicalTag: string | null = null;
	for (const p of posts) {
		for (const t of p.tags) {
			if (slugifyTag(t) === slug || t.toLowerCase() === decoded.toLowerCase()) {
				canonicalTag = t;
				matched.push(p);
				break;
			}
		}
	}
	return { tag: canonicalTag, posts: matched };
}
