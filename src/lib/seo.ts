import type { Metadata } from "next";

const BASE_URL = "https://kuucorp.com";
const SITE_NAME = "Kuu株式会社";
const DEFAULT_OGP_IMAGE = "/images/ogp.png";

export type PageSeoProps = {
	title: string;
	description: string;
	path: string;
	ogpImage?: string;
	noIndex?: boolean;
};

/**
 * Resolve an OG image URL from a site path.
 *  - /blog/{slug}/   -> /og/blog/{slug}.png
 *  - /glossary/{s}/  -> /og/glossary/{s}.png
 *  - /ai-governance/ -> /og/ai-governance.png
 *  - /managed-agents/ -> /og/managed-agents.png
 *  - /pricing/, /about/, /contact/, /blog/, /glossary/ -> /og/{name}.png
 *  - else -> /og/default.png
 * Images are generated at build time by scripts/generate-og-images.mjs.
 */
export function resolveOgImage(pathname: string): string {
	const p = pathname.replace(/\/+$/, "");
	const blog = p.match(/^\/blog\/([^/]+)$/);
	if (blog) return `/og/blog/${blog[1]}.png`;
	const gloss = p.match(/^\/glossary\/([^/]+)$/);
	if (gloss) return `/og/glossary/${gloss[1]}.png`;
	const simple = p.match(
		/^\/(ai-governance|managed-agents|pricing|blog|glossary|about|contact)$/,
	);
	if (simple) return `/og/${simple[1]}.png`;
	return "/og/default.png";
}

export function generateMetadata({
	title,
	description,
	path,
	ogpImage,
	noIndex = false,
}: PageSeoProps): Metadata {
	const url = `${BASE_URL}${path}`;
	const image = ogpImage ?? resolveOgImage(path) ?? DEFAULT_OGP_IMAGE;

	return {
		// Use absolute to prevent layout.tsx template from appending "| Kuu株式会社" again
		title: { absolute: title },
		description,
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
		},
		openGraph: {
			title,
			description,
			url,
			siteName: SITE_NAME,
			locale: "ja_JP",
			type: "website",
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
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
	slogan: "技術と物語を、あらゆる人に届ける",
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
		"DXコンサルティング",
		"エージェントトランスフォーメーション",
		"Managed Agents",
		"LLM",
		"EU AI Act",
		"ISO/IEC 42001",
		"AI-BCP",
	],
	foundingDate: "2022",
	founder: {
		"@type": "Person",
		name: "藤平 賢人",
		jobTitle: "Kuu株式会社 代表取締役",
		url: `${BASE_URL}/authors/fujihira-kento/`,
	},
	sameAs: [`${BASE_URL}/about/`],
	numberOfEmployees: {
		minValue: 1,
		maxValue: 10,
	},
};
