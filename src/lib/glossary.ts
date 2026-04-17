import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const GLOSSARY_DIR = path.join(process.cwd(), "content/glossary");

export interface GlossaryTerm {
	slug: string;
	term: string;
	reading?: string;
	english?: string;
	shortDefinition: string;
	description: string;
	relatedTerms: string[];
	sources: string[];
	content: string;
}

export interface GlossaryTermMeta {
	slug: string;
	term: string;
	reading?: string;
	english?: string;
	shortDefinition: string;
	description: string;
	relatedTerms: string[];
}

const toStringArr = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export function getAllGlossarySlugs(): string[] {
	if (!fs.existsSync(GLOSSARY_DIR)) return [];
	return fs
		.readdirSync(GLOSSARY_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getAllGlossaryTerms(): GlossaryTermMeta[] {
	return getAllGlossarySlugs()
		.map((slug) => {
			const base = path.join(GLOSSARY_DIR, slug);
			const filePath = fs.existsSync(`${base}.mdx`)
				? `${base}.mdx`
				: `${base}.md`;
			const { data } = matter(fs.readFileSync(filePath, "utf-8"));
			return {
				slug,
				term: data.term ?? data.title ?? slug,
				reading: typeof data.reading === "string" ? data.reading : undefined,
				english: typeof data.english === "string" ? data.english : undefined,
				shortDefinition:
					data.short_definition ??
					data.shortDefinition ??
					data.description ??
					"",
				description: data.description ?? "",
				relatedTerms: toStringArr(data.related_terms ?? data.relatedTerms),
			} satisfies GlossaryTermMeta;
		})
		.sort((a, b) => a.term.localeCompare(b.term, "ja"));
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | null {
	const base = path.join(GLOSSARY_DIR, slug);
	const filePath = fs.existsSync(`${base}.mdx`)
		? `${base}.mdx`
		: fs.existsSync(`${base}.md`)
			? `${base}.md`
			: null;
	if (!filePath) return null;
	const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
	return {
		slug,
		term: data.term ?? data.title ?? slug,
		reading: typeof data.reading === "string" ? data.reading : undefined,
		english: typeof data.english === "string" ? data.english : undefined,
		shortDefinition:
			data.short_definition ?? data.shortDefinition ?? data.description ?? "",
		description: data.description ?? "",
		relatedTerms: toStringArr(data.related_terms ?? data.relatedTerms),
		sources: toStringArr(data.sources),
		content,
	};
}
