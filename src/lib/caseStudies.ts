import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "content/case-studies");

export interface CaseStudy {
	slug: string;
	title: string;
	client: string;
	clientIndustry: string;
	companySize: string;
	challenge: string;
	solution: string;
	resultMetrics: string[];
	duration: string;
	services: string[];
	description: string;
	date: string;
	lastModified: string;
	content: string;
}

export interface CaseStudyMeta {
	slug: string;
	title: string;
	client: string;
	clientIndustry: string;
	companySize: string;
	resultMetrics: string[];
	description: string;
	date: string;
}

const toStringArr = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export function getAllCaseStudySlugs(): string[] {
	if (!fs.existsSync(CASE_STUDIES_DIR)) return [];
	return fs
		.readdirSync(CASE_STUDIES_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllCaseStudies(): CaseStudyMeta[] {
	return getAllCaseStudySlugs()
		.map((slug) => {
			const base = path.join(CASE_STUDIES_DIR, slug);
			const filePath = fs.existsSync(`${base}.mdx`)
				? `${base}.mdx`
				: `${base}.md`;
			const { data } = matter(fs.readFileSync(filePath, "utf-8"));
			return {
				slug,
				title: data.title ?? slug,
				client: data.client ?? "",
				clientIndustry: data.client_industry ?? "",
				companySize: data.company_size ?? "",
				resultMetrics: toStringArr(data.result_metrics),
				description: data.description ?? "",
				date: data.date ?? "",
			} satisfies CaseStudyMeta;
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
	const base = path.join(CASE_STUDIES_DIR, slug);
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
		client: data.client ?? "",
		clientIndustry: data.client_industry ?? "",
		companySize: data.company_size ?? "",
		challenge: data.challenge ?? "",
		solution: data.solution ?? "",
		resultMetrics: toStringArr(data.result_metrics),
		duration: data.duration ?? "",
		services: toStringArr(data.services),
		description: data.description ?? "",
		date: data.date ?? "",
		lastModified: data.lastModified ?? data.date ?? "",
		content,
	} satisfies CaseStudy;
}
