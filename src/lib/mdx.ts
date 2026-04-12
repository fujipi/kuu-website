import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	content: string;
}

export interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
}

export function getAllPostSlugs(): string[] {
	if (!fs.existsSync(BLOG_DIR)) return [];
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
	const slugs = getAllPostSlugs();
	const posts = slugs
		.map((slug) => {
			const filePath = fs.existsSync(path.join(BLOG_DIR, `${slug}.mdx`))
				? path.join(BLOG_DIR, `${slug}.mdx`)
				: path.join(BLOG_DIR, `${slug}.md`);
			const raw = fs.readFileSync(filePath, "utf-8");
			const { data } = matter(raw);
			return {
				slug,
				title: data.title ?? "",
				description: data.description ?? "",
				date: data.date ?? "",
				tags: Array.isArray(data.tags) ? data.tags : [],
			} satisfies BlogPostMeta;
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
	return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
	const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
	const mdPath = path.join(BLOG_DIR, `${slug}.md`);
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
		tags: Array.isArray(data.tags) ? data.tags : [],
		content,
	};
}
