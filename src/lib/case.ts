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

/**
 * frontmatter `sources` の1行を「表示ラベル」と「URL」に分解する。
 *
 * 実コーパスには3つの形が混在している:
 *   1. 裸のURL              `https://www.mlit.go.jp/...`
 *   2. タイトル + URL       `国土交通省「重要事項説明書〜」https://www.mlit.go.jp/...`
 *   3. URL 無しの散文       `契約レビュー業務の工数に関する一般的な業界傾向（公開情報）`
 *
 * 先頭一致（`/^https?:/`）で判定すると 2 を「URL 無し」と取りこぼし、
 * citation JSON-LD にも出典リンクにも載らない。URL は行のどこにあっても拾う。
 *
 * 複数 URL を含む行は最初の1件を採用する（出典1件＝1リンクの想定）。
 */
export interface ParsedSource {
	/** 画面に出す文字列。タイトルがあればタイトル、無ければ URL か原文そのまま */
	label: string;
	/** 抽出できた URL。無ければ undefined */
	url?: string;
}

// 末尾の句読点・閉じ括弧は URL に含めない（日本語本文に URL を直書きすると付きやすい）
const SOURCE_URL = /https?:\/\/[^\s"'<>）)」』】]+/;

export function parseSource(raw: string): ParsedSource {
	const text = raw.trim();
	const m = SOURCE_URL.exec(text);
	if (!m) return { label: text };

	const url = m[0].replace(/[.,、。]+$/, "");
	const title = text
		.slice(0, m.index)
		.trim()
		.replace(/[-—–:：]+$/, "")
		.trim();
	return { label: title || url, url };
}

/** sources のうち URL を持つものだけを URL 文字列として返す（citation 用） */
export function sourceUrls(sources: string[]): string[] {
	return sources
		.map((s) => parseSource(s).url)
		.filter((u): u is string => Boolean(u));
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
