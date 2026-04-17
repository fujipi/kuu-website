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

export function generateMetadata({
	title,
	description,
	path,
	ogpImage = DEFAULT_OGP_IMAGE,
	noIndex = false,
}: PageSeoProps): Metadata {
	const url = `${BASE_URL}${path}`;

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
					url: ogpImage,
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
			images: [ogpImage],
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
