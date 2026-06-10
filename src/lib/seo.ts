import type { Metadata } from "next";

export const BASE_URL = "https://kuucorp.com";
export const SITE_NAME = "Kuu株式会社";
const DEFAULT_OGP_IMAGE = "/images/ogp.png";

/** Reusable schema.org Organization reference for `provider` / `author` fields. */
export const ORG_REF = {
	"@type": "Organization",
	name: SITE_NAME,
	url: BASE_URL,
};

/** Build a schema.org BreadcrumbList from an ordered list of crumbs. */
export function buildBreadcrumb(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: `${BASE_URL}${it.path === "/" ? "" : it.path}`,
		})),
	};
}

export const DEFAULT_KEYWORDS = [
	"AIエージェント",
	"エージェントガバナンス",
	"エージェントハーネス",
	"FDE",
	"RDE",
	"AX",
	"DX",
	"AIコンサルティング",
	"AI戦略",
	"Claude",
	"ChatGPT",
	"Codex",
	"Gemini",
	"MCP",
	"Managed Agents",
	"Kuu株式会社",
];

export type PageSeoProps = {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
	ogpImage?: string;
	noIndex?: boolean;
	/** ページの言語（OGP locale に反映。既定 ja） */
	lang?: "ja" | "en";
	/** 対訳ページがある場合の hreflang（ja/en 双方のパスを渡す） */
	languages?: { ja: string; en: string };
	article?: {
		publishedTime: string;
		modifiedTime?: string;
		authors?: string[];
		tags?: string[];
	};
};

/**
 * Resolve an OG image URL from a site path.
 *  - /blog/{slug}/         -> /og/blog/{slug}.png
 *  - /glossary/{s}/        -> /og/glossary/{s}.png
 *  - /case-studies/{s}/    -> /og/case-studies/{s}.png
 *  - /resources/{s}/       -> /og/resources/{s}.png
 *  - /ai-governance/, /managed-agents/, /eu-ai-act-jp/ -> /og/{name}.png
 *  - /about/, /contact/, /blog/, /glossary/,
 *    /case-studies/, /resources/ -> /og/{name}.png
 *  - else -> /og/default.png
 * Images are generated at build time by scripts/generate-og-images.mjs.
 */
export function resolveOgImage(pathname: string): string {
	const p = pathname.replace(/\/+$/, "");
	// アーカイブ系ページ（track / industry）はセクション共通 OG にフォールバック
	if (p.startsWith("/blog/track/")) return "/og/blog.png";
	if (p.startsWith("/case/industry/")) return "/og/case.png";
	const blog = p.match(/^\/blog\/([^/]+)$/);
	if (blog) return `/og/blog/${blog[1]}.png`;
	const gloss = p.match(/^\/glossary\/([^/]+)$/);
	if (gloss) return `/og/glossary/${gloss[1]}.png`;
	const cs = p.match(/^\/case-studies\/([^/]+)$/);
	if (cs) return `/og/case-studies/${cs[1]}.png`;
	const ca = p.match(/^\/case\/([^/]+)$/);
	if (ca) return `/og/case/${ca[1]}.png`;
	const res = p.match(/^\/resources\/([^/]+)$/);
	if (res) return `/og/resources/${res[1]}.png`;
	const simple = p.match(
		/^\/(ai-governance|managed-agents|eu-ai-act-jp|fde|ax|blog|glossary|about|contact|case-studies|case|news|resources|services)$/,
	);
	if (simple) return `/og/${simple[1]}.png`;
	return "/og/default.png";
}

export function generateMetadata({
	title,
	description,
	path,
	keywords,
	ogpImage,
	noIndex = false,
	lang = "ja",
	languages,
	article,
}: PageSeoProps): Metadata {
	const url = `${BASE_URL}${path}`;
	const image = ogpImage ?? resolveOgImage(path) ?? DEFAULT_OGP_IMAGE;
	const ogLocale = lang === "en" ? "en_US" : "ja_JP";

	const openGraph: Metadata["openGraph"] = article
		? {
				title,
				description,
				url,
				siteName: SITE_NAME,
				locale: ogLocale,
				type: "article",
				publishedTime: article.publishedTime,
				modifiedTime: article.modifiedTime,
				authors: article.authors,
				tags: article.tags,
				images: [{ url: image, width: 1200, height: 630, alt: title }],
			}
		: {
				title,
				description,
				url,
				siteName: SITE_NAME,
				locale: ogLocale,
				type: "website",
				images: [{ url: image, width: 1200, height: 630, alt: title }],
			};

	return {
		// Use absolute to prevent layout.tsx template from appending "| Kuu株式会社" again
		title: { absolute: title },
		description,
		keywords: keywords ?? DEFAULT_KEYWORDS,
		robots: noIndex
			? { index: false, follow: false }
			: {
					index: true,
					follow: true,
					"max-snippet": -1,
					"max-image-preview": "large" as const,
					"max-video-preview": -1,
				},
		alternates: {
			canonical: url,
			...(languages
				? {
						languages: {
							ja: `${BASE_URL}${languages.ja}`,
							en: `${BASE_URL}${languages.en}`,
							"x-default": `${BASE_URL}${languages.ja}`,
						},
					}
				: {}),
		},
		openGraph,
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
		},
	};
}

export const BASE_ORG = {
	url: BASE_URL,
	name: SITE_NAME,
	legalName: SITE_NAME,
	logo: `${BASE_URL}/images/favicon-192.png`,
	slogan: "しくみが浸透し、あらゆる人の自由をつくる",
	address: {
		streetAddress: "東神田一丁目13番14号",
		addressLocality: "千代田区",
		addressRegion: "東京都",
		addressCountry: "JP",
	},
	contactPoint: {
		contactType: "customer service",
		url: `${BASE_URL}/contact/`,
		availableLanguage: "Japanese",
	},
	knowsAbout: [
		"AIエージェント",
		"エージェントガバナンス",
		"AI Agent Governance",
		"エージェントハーネス",
		"DXコンサルティング",
		"AXコンサルティング",
		"エージェントトランスフォーメーション",
		"Managed Agents",
		"LLM",
		"FDE (Forward Deployed Engineering)",
		"RDE (Reinvention Deployed Engineering)",
		"AIer",
		"Claude",
		"Anthropic Claude",
		"ChatGPT",
		"Codex",
		"Gemini",
		"Anthropic",
		"OpenAI",
		"MCP (Model Context Protocol)",
		"Claude Skills",
		"サブエージェント",
		"Routine",
		"オーケストレーション",
		"ルーティング",
		"コンテキストエンジニアリング",
		"プロンプト設計",
		"EU AI Act",
		"ISO/IEC 42001",
		"AI-BCP",
	],
	foundingDate: "2022",
	founder: {
		"@type": "Person",
		name: "藤平 賢人",
		jobTitle: "Kuu株式会社 代表取締役",
		url: `${BASE_URL}/about/`,
	},
	sameAs: [`${BASE_URL}/about/`],
	numberOfEmployees: {
		minValue: 1,
		maxValue: 10,
	},
};
