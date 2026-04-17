import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RESOURCES_DIR = path.join(process.cwd(), "content/resources");

export interface Resource {
	slug: string;
	title: string;
	description: string;
	category: string;
	format: string;
	pages: number;
	date: string;
	lastModified: string;
	tags: string[];
	download: string | null;
	content: string;
}

export interface ResourceMeta {
	slug: string;
	title: string;
	description: string;
	category: string;
	format: string;
	pages: number;
	tags: string[];
	date: string;
}

const toStringArr = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export function getAllResourceSlugs(): string[] {
	if (!fs.existsSync(RESOURCES_DIR)) return [];
	return fs
		.readdirSync(RESOURCES_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllResources(): ResourceMeta[] {
	return getAllResourceSlugs()
		.map((slug) => {
			const base = path.join(RESOURCES_DIR, slug);
			const filePath = fs.existsSync(`${base}.mdx`) ? `${base}.mdx` : `${base}.md`;
			const { data } = matter(fs.readFileSync(filePath, "utf-8"));
			return {
				slug,
				title: data.title ?? slug,
				description: data.description ?? "",
				category: data.category ?? "",
				format: data.format ?? "PDF",
				pages: typeof data.pages === "number" ? data.pages : 0,
				tags: toStringArr(data.tags),
				date: data.date ?? "",
			} satisfies ResourceMeta;
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResourceBySlug(slug: string): Resource | null {
	const base = path.join(RESOURCES_DIR, slug);
	const filePath = fs.existsSync(`${base}.mdx`)
		? `${base}.mdx`
		: fs.existsSync(`${base}.md`)
			? `${base}.md`
			: null;
	if (!filePath) return null;
	const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
	return {
		slug,
		title: data.title ?? slug,
		description: data.description ?? "",
		category: data.category ?? "",
		format: data.format ?? "PDF",
		pages: typeof data.pages === "number" ? data.pages : 0,
		date: data.date ?? "",
		lastModified: data.lastModified ?? data.date ?? "",
		tags: toStringArr(data.tags),
		download: typeof data.download === "string" ? data.download : null,
		content,
	} satisfies Resource;
}
