import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASE_DIR = path.join(process.cwd(), "content/case");

export interface CaseMetric {
	value: string;
	label: string;
}

export interface CaseProfileRow {
	label: string;
	value: string;
}

export interface CasePersonaVoice {
	quote: string;
	attribution: string;
}

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
	fictional: boolean;
	objectives: string[];
	measures: string[];
	effects: string[];
	metrics: CaseMetric[];
	companyProfile: CaseProfileRow[];
	personaVoice?: CasePersonaVoice;
	modelsUsed: string[];
	sources: string[];
	futureOutlook?: string;
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

function strArray(v: unknown): string[] {
	return Array.isArray(v)
		? v.filter((x): x is string => typeof x === "string")
		: [];
}

function metricArray(v: unknown): CaseMetric[] {
	if (!Array.isArray(v)) return [];
	return v
		.filter(
			(m): m is { value: unknown; label: unknown } =>
				typeof m === "object" && m !== null,
		)
		.map((m) => ({
			value: typeof m.value === "string" ? m.value : String(m.value ?? ""),
			label: typeof m.label === "string" ? m.label : String(m.label ?? ""),
		}))
		.filter((m) => m.value && m.label);
}

function profileArray(v: unknown): CaseProfileRow[] {
	if (!Array.isArray(v)) return [];
	return v
		.filter(
			(m): m is { label: unknown; value: unknown } =>
				typeof m === "object" && m !== null,
		)
		.map((m) => ({
			label: typeof m.label === "string" ? m.label : String(m.label ?? ""),
			value: typeof m.value === "string" ? m.value : String(m.value ?? ""),
		}))
		.filter((m) => m.label && m.value);
}

function personaVoice(v: unknown): CasePersonaVoice | undefined {
	if (typeof v !== "object" || v === null) return undefined;
	const o = v as { quote?: unknown; attribution?: unknown };
	if (typeof o.quote !== "string" || !o.quote) return undefined;
	return {
		quote: o.quote,
		attribution: typeof o.attribution === "string" ? o.attribution : "",
	};
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
			tags: strArray(data.tags),
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
		tags: strArray(data.tags),
		industry: typeof data.industry === "string" ? data.industry : undefined,
		useCase: typeof data.use_case === "string" ? data.use_case : undefined,
		source: typeof data.source === "string" ? data.source : undefined,
		fictional: data.fictional !== false,
		objectives: strArray(data.objectives),
		measures: strArray(data.measures),
		effects: strArray(data.effects),
		metrics: metricArray(data.metrics),
		companyProfile: profileArray(data.company_profile ?? data.companyProfile),
		personaVoice: personaVoice(data.persona_voice ?? data.personaVoice),
		modelsUsed: strArray(data.models_used ?? data.modelsUsed),
		sources: strArray(data.sources),
		futureOutlook:
			typeof data.future_outlook === "string"
				? data.future_outlook
				: typeof data.futureOutlook === "string"
					? data.futureOutlook
					: undefined,
		content,
	};
}
