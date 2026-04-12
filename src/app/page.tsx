import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "Kuu株式会社 | AIエージェント導入・運用支援 | AI業務自動化",
	description:
		"Kuu株式会社はAIエージェントの導入から運用までを一貫支援。エージェントガバナンス構築、AI業務自動化で中小企業のDX推進をサポートします。",
	path: "/",
});

const navLinks = [
	{ href: "/#service", label: "Service" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/#about", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

const homeJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Kuu株式会社",
		url: BASE_URL,
		logo: `${BASE_URL}/images/favicon-192.png`,
		description:
			"AIエージェントの導入から運用までを一貫支援。エージェントガバナンス構築、AI業務自動化で中小企業のDX推進をサポートします。",
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
		sameAs: [],
		founder: {
			"@type": "Person",
			name: "藤平 賢人",
		},
		foundingDate: "2022",
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Kuu株式会社",
		url: BASE_URL,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AIエージェント導入・運用支援（Kuu AI Ops）",
		description:
			"AIエージェントの設計・実装・ガバナンス構築・運用定着までを一貫支援。エージェントチームの構築と継続的改善をサポートします。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "AIエージェント導入支援",
		areaServed: "JP",
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AX・DXコンサルティング",
		description:
			"AI活用戦略の策定からDX推進計画の立案まで。事業目標に基づいたロードマップ設計と実行支援を行います。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "DXコンサルティング",
		areaServed: "JP",
	},
	{
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Kuu株式会社",
		url: BASE_URL,
		description:
			"AIエージェント導入・運用支援、AX/DX戦略コンサルティングを提供する東京のテクノロジー企業。",
		address: {
			"@type": "PostalAddress",
			streetAddress: "東神田一丁目13番14号",
			addressLocality: "千代田区",
			addressRegion: "東京都",
			addressCountry: "JP",
		},
	},
];

export default function Home() {
	return (
		<>
			<JsonLd data={homeJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<section className="hero">
					<div className="hero-content fade-in">
						<h1 className="hero-heading">技術と物語を、あらゆる人に届ける</h1>
						<p className="hero-sub">Technology &amp; Story for Everyone</p>
					</div>
				</section>

				<section className="section-service" id="service">
					<h2 className="section-label fade-in">Service</h2>
					<div className="service-list fade-in-stagger">
						<div className="service-item fade-in-item">
							<div className="service-name">AX / DX戦略コンサルティング</div>
							<div className="service-desc">
								AI活用戦略の策定からDX推進計画の立案まで。事業目標に基づいたロードマップ設計と実行支援を行います。
							</div>
							<Link
								href="/services/ax-dx/"
								style={{
									display: "inline-block",
									marginTop: "0.75rem",
									fontSize: "0.7rem",
									color: "var(--gray-dim)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.1rem",
									transition: "color 0.3s, border-color 0.3s",
								}}
							>
								詳しく見る →
							</Link>
						</div>

						<div className="service-item fade-in-item">
							<div className="service-name">AI業務自動化サービス（AI Ops）</div>
							<div className="service-desc">
								AIエージェントの設計・ガバナンス構築・継続改善まで。エージェントが正しく動き続ける仕組みをワンストップで支援します。
							</div>
							<Link
								href="/services/ai-ops/"
								style={{
									display: "inline-block",
									marginTop: "0.75rem",
									fontSize: "0.7rem",
									color: "var(--gray-dim)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.1rem",
									transition: "color 0.3s, border-color 0.3s",
								}}
							>
								詳しく見る →
							</Link>
						</div>

						<div className="service-item fade-in-item">
							<div className="service-name">Yota mangaサービス</div>
							<div className="service-desc">
								AIを活用したマンガ制作サービス。企画・シナリオから作画まで、高品質なマンガコンテンツを提供します。
							</div>
						</div>
					</div>
				</section>

				<section className="section-about" id="about">
					<h2 className="section-label fade-in">About</h2>
					<div className="about-table fade-in">
						<div className="about-row">
							<div className="about-label">会社名</div>
							<div className="about-value">Kuu株式会社</div>
						</div>
						<div className="about-row">
							<div className="about-label">役員</div>
							<div className="about-value">代表取締役 藤平賢人</div>
						</div>
						<div className="about-row">
							<div className="about-label">所在地</div>
							<div className="about-value">
								東京都千代田区東神田一丁目13番14号
							</div>
						</div>
						<div className="about-row">
							<div className="about-label">設立</div>
							<div className="about-value">2022年</div>
						</div>
						<div className="about-row">
							<div className="about-label">事業内容</div>
							<div className="about-value">
								インターネットビジネスの企画・開発・運営
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
