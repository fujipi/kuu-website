import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readingTimeMinutes } from "./readingTime";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	author: string;
	pillar?: string;
	series?: string;
	seriesOrder?: number;
	track?: string;
	audience?: string;
	techDepth?: string;
	sources?: string[];
	content: string;
}

export interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	author: string;
	pillar?: string;
	series?: string;
	seriesOrder?: number;
	track?: string;
	audience?: string;
	techDepth?: string;
	/** 概算読了時間（分）。getAllPosts が本文から算出する */
	readingMinutes?: number;
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
			const { data, content } = matter(raw);
			return {
				slug,
				title: data.title ?? "",
				description: data.description ?? "",
				date: data.date ?? "",
				lastModified: data.lastModified ?? data.date ?? "",
				tags: Array.isArray(data.tags) ? data.tags : [],
				author: typeof data.author === "string" ? data.author : "kuu-editorial",
				pillar: typeof data.pillar === "string" ? data.pillar : undefined,
				series: typeof data.series === "string" ? data.series : undefined,
				seriesOrder:
					typeof data.series_order === "number"
						? data.series_order
						: typeof data.seriesOrder === "number"
							? data.seriesOrder
							: undefined,
				track: typeof data.track === "string" ? data.track : undefined,
				audience: typeof data.audience === "string" ? data.audience : undefined,
				techDepth:
					typeof data.tech_depth === "string" ? data.tech_depth : undefined,
				readingMinutes: readingTimeMinutes(content),
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
		lastModified: data.lastModified ?? data.date ?? "",
		tags: Array.isArray(data.tags) ? data.tags : [],
		author: typeof data.author === "string" ? data.author : "kuu-editorial",
		pillar: typeof data.pillar === "string" ? data.pillar : undefined,
		series: typeof data.series === "string" ? data.series : undefined,
		seriesOrder:
			typeof data.series_order === "number"
				? data.series_order
				: typeof data.seriesOrder === "number"
					? data.seriesOrder
					: undefined,
		track: typeof data.track === "string" ? data.track : undefined,
		audience: typeof data.audience === "string" ? data.audience : undefined,
		techDepth:
			typeof data.tech_depth === "string" ? data.tech_depth : undefined,
		sources: Array.isArray(data.sources)
			? data.sources.filter((s: unknown): s is string => typeof s === "string")
			: undefined,
		content,
	};
}
