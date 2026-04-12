import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "会社情報 | Kuu株式会社 - AIエージェント運用のプロフェッショナル",
	description:
		"Kuu株式会社の会社情報。代表・藤平賢人が2022年に設立。AIエージェント導入支援・AX/DXコンサルを提供する東京のテクノロジー企業です。",
	path: "/about/",
});

const BASE_URL = "https://kuucorp.com";

const aboutJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: "会社情報 | Kuu株式会社",
		url: `${BASE_URL}/about/`,
		description: "Kuu株式会社の会社情報。",
		isPartOf: {
			"@type": "WebSite",
			url: BASE_URL,
			name: "Kuu株式会社",
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Kuu株式会社",
		url: BASE_URL,
		logo: `${BASE_URL}/images/favicon-192.png`,
		foundingDate: "2022",
		founder: {
			"@type": "Person",
			name: "藤平 賢人",
			jobTitle: "代表取締役",
		},
		numberOfEmployees: {
			"@type": "QuantitativeValue",
			minValue: 1,
			maxValue: 10,
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: "東神田一丁目13番14号",
			addressLocality: "千代田区",
			addressRegion: "東京都",
			addressCountry: "JP",
		},
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			url: `${BASE_URL}/contact/`,
			availableLanguage: "Japanese",
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "ホーム",
				item: BASE_URL,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "会社情報",
				item: `${BASE_URL}/about/`,
			},
		],
	},
];

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ai-ops/", label: "AI Ops" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

export default function AboutPage() {
	return (
		<>
			<JsonLd data={aboutJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">About</h1>

					{/* 会社概要 */}
					<section style={{ marginBottom: "4rem" }}>
						<h2 className="section-label fade-in">Company</h2>
						<div className="about-table fade-in">
							<div className="about-row">
								<div className="about-label">会社名</div>
								<div className="about-value">Kuu株式会社</div>
							</div>
							<div className="about-row">
								<div className="about-label">設立</div>
								<div className="about-value">2022年</div>
							</div>
							<div className="about-row">
								<div className="about-label">代表</div>
								<div className="about-value">藤平 賢人（Kento Fujihira）</div>
							</div>
							<div className="about-row">
								<div className="about-label">所在地</div>
								<div className="about-value">
									東京都千代田区東神田一丁目13番14号
								</div>
							</div>
							<div className="about-row">
								<div className="about-label">事業内容</div>
								<div className="about-value">
									AIエージェント導入支援・エージェントガバナンス（AI
									Ops）、AX/DX戦略コンサルティング、AI業務自動化
								</div>
							</div>
							<div className="about-row">
								<div className="about-label">連絡先</div>
								<div className="about-value">
									<a href="/contact/">お問い合わせフォーム</a>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</>
	);
}
