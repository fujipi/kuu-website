import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASE_DIR = path.join(process.cwd(), "content/case");

export interface CaseEntry {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	industry?: string;
	useCase?: string;
	source?: string;
	content: string;
}

export interface CaseEntryMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	lastModified: string;
	tags: string[];
	industry?: string;
	useCase?: string;
	source?: string;
}

function readEntry(slug: string) {
	const mdxPath = path.join(CASE_DIR, `${slug}.mdx`);
	const mdPath = path.join(CASE_DIR, `${slug}.md`);
	const filePath = fs.existsSync(mdxPath)
		? mdxPath
		: fs.existsSync(mdPath)
			? mdPath
			: null;
	if (!filePath) return null;
	const raw = fs.readFileSync(filePath, "utf-8");
	return matter(raw);
}

export function getAllCaseSlugs(): string[] {
	if (!fs.existsSync(CASE_DIR)) return [];
	return fs
		.readdirSync(CASE_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllCases(): CaseEntryMeta[] {
	const slugs = getAllCaseSlugs();
	const items: CaseEntryMeta[] = [];
	for (const slug of slugs) {
		const parsed = readEntry(slug);
		if (!parsed) continue;
		const { data } = parsed;
		items.push({
			slug,
			title: data.title ?? "",
			description: data.description ?? "",
			date: data.date ?? "",
			lastModified: data.lastModified ?? data.date ?? "",
			tags: Array.isArray(data.tags) ? data.tags : [],
			industry: typeof data.industry === "string" ? data.industry : undefined,
			useCase: typeof data.use_case === "string" ? data.use_case : undefined,
			source: typeof data.source === "string" ? data.source : undefined,
		});
	}
	items.sort((a, b) => (a.date < b.date ? 1 : -1));
	return items;
}

export function getCaseBySlug(slug: string): CaseEntry | null {
	const parsed = readEntry(slug);
	if (!parsed) return null;
	const { data, content } = parsed;
	return {
		slug,
		title: data.title ?? "",
		description: data.description ?? "",
		date: data.date ?? "",
		lastModified: data.lastModified ?? data.date ?? "",
		tags: Array.isArray(data.tags) ? data.tags : [],
		industry: typeof data.industry === "string" ? data.industry : undefined,
		useCase: typeof data.use_case === "string" ? data.use_case : undefined,
		source: typeof data.source === "string" ? data.source : undefined,
		content,
	};
}
