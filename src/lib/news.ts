import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NEWS_DIR = path.join(process.cwd(), "content/news");

export interface NewsItem {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	category: string;
	content: string;
}

export interface NewsItemMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	category: string;
}

export function getAllNewsSlugs(): string[] {
	if (!fs.existsSync(NEWS_DIR)) return [];
	return fs
		.readdirSync(NEWS_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllNews(): NewsItemMeta[] {
	const slugs = getAllNewsSlugs();
	const items = slugs
		.map((slug) => {
			const filePath = fs.existsSync(path.join(NEWS_DIR, `${slug}.mdx`))
				? path.join(NEWS_DIR, `${slug}.mdx`)
				: path.join(NEWS_DIR, `${slug}.md`);
			const raw = fs.readFileSync(filePath, "utf-8");
			const { data } = matter(raw);
			return {
				slug,
				title: data.title ?? "",
				description: data.description ?? "",
				date: data.date ?? "",
				lastModified: data.lastModified ?? data.date ?? "",
				tags: Array.isArray(data.tags) ? data.tags : [],
				category:
					typeof data.category === "string" ? data.category : "お知らせ",
			} satisfies NewsItemMeta;
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
	return items;
}

export function getNewsBySlug(slug: string): NewsItem | null {
	const mdxPath = path.join(NEWS_DIR, `${slug}.mdx`);
	const mdPath = path.join(NEWS_DIR, `${slug}.md`);
	const filePath = fs.existsSync(mdxPath)
		? mdxPath
		: fs.existsSync(mdPath)
			? mdPath
			: null;
	if (!filePath) return null;

	const raw = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(raw);
	return {
		slug,
		title: data.title ?? "",
		description: data.description ?? "",
		date: data.date ?? "",
		lastModified: data.lastModified ?? data.date ?? "",
		tags: Array.isArray(data.tags) ? data.tags : [],
		category: typeof data.category === "string" ? data.category : "お知らせ",
		content,
	};
}
