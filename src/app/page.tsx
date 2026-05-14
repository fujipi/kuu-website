import type { Metadata } from "next";
import Link from "next/link";
import AuroraDrift from "@/components/AuroraDrift";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title:
		"Kuu株式会社 | AIエージェント時代の伴走実装パートナー | AX/DX戦略から運用まで",
	description:
		"Kuu株式会社は、AX/DX戦略・現場ディスカバリ・エージェント実装・ガバナンス運用までを一社で横串に担う実装パートナー。顧客の業務と既存システムに深く入り、エージェントを動かし続ける統治を組織に埋め込みます。",
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
		legalName: "Kuu株式会社",
		url: BASE_URL,
		logo: `${BASE_URL}/images/favicon-192.png`,
		description:
			"AX/DX戦略から現場ディスカバリ、エージェント実装、ガバナンス運用まで一社で横串に担う伴走実装パートナー。",
		slogan: "技術と物語を、あらゆる人に届ける",
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
		sameAs: ["https://github.com/fujipi"],
		knowsAbout: [
			"AIエージェント",
			"エージェントガバナンス",
			"AI Agent Governance",
			"DXコンサルティング",
			"エージェントトランスフォーメーション",
			"Managed Agents",
			"LLM",
		],
		founder: {
			"@type": "Person",
			name: "藤平 賢人",
			jobTitle: "代表取締役",
			knowsAbout: ["AIエージェント", "エージェントガバナンス", "DX戦略"],
		},
		foundingDate: "2022",
		numberOfEmployees: {
			"@type": "QuantitativeValue",
			minValue: 1,
			maxValue: 10,
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Kuu株式会社",
		url: BASE_URL,
		inLanguage: "ja",
		description:
			"AX/DX戦略・現場ディスカバリ・エージェント実装・ガバナンス運用までを一社で横串に担う伴走実装パートナー。",
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AIエージェント実装・ガバナンス（Kuu）",
		description:
			"自律エージェントの設計と既存システム接続（ハーネス）、9軸評価による品質・コスト・安全性の継続統治までを一貫実装。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "AIエージェント実装・運用",
		areaServed: "JP",
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AX・DX戦略・現場ディスカバリ",
		description:
			"経営課題から逆算したDX/AXロードマップ設計と、顧客の業務・既存システムに深く入る現場ディスカバリ。実装可能な計画に落とすまで。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "DX/AX戦略・ディスカバリ",
		areaServed: "JP",
	},
	{
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Kuu株式会社",
		url: BASE_URL,
		description:
			"AX/DX戦略から現場ディスカバリ、エージェント実装、ガバナンス運用までを横串に担う、東京の伴走実装パートナー。",
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
					<AuroraDrift />
					<div className="hero-content fade-in">
						<h1 className="hero-heading">技術と物語を、あらゆる人に届ける</h1>
						<p className="hero-sub">Technology &amp; Story for Everyone</p>
					</div>
				</section>

				<section className="section-service" id="service">
					<h2 className="section-label fade-in">Service</h2>

					<div className="approach-lede fade-in">
						<p className="approach-headline">
							戦略から運用まで、4段を横串に担う実装パートナー。
						</p>
						<p className="approach-body">
							AIモデルの優秀さを語ることで売れる時代は、すでに終わりかけています。エージェント導入のボトルネックは、顧客の業務とレガシーシステムに深く入り、動くものを作って動かし続けるための地道な仕事——いわゆる「ラストワンマイル」にあります。Kuuはこの泥の部分を、戦略フェーズから運用統治まで一社で担います。
						</p>
					</div>

					<ol className="funnel fade-in-stagger" aria-label="サービスファネル">
						<li className="funnel-step fade-in-item">
							<div className="funnel-step-num">01</div>
							<div className="funnel-step-en">Strategy</div>
							<div className="funnel-step-jp">DX / AX戦略</div>
							<p className="funnel-step-desc">
								経営課題から逆算したロードマップとKPI設計。「ツール導入の目的化」を避け、事業目標に紐付ける。
							</p>
						</li>
						<li className="funnel-step fade-in-item">
							<div className="funnel-step-num">02</div>
							<div className="funnel-step-en">Discovery</div>
							<div className="funnel-step-jp">現場ディスカバリ</div>
							<p className="funnel-step-desc">
								顧客の業務・既存システム・データ資産に深く入り、エージェントが本当に解くべきユースケースを特定する。
							</p>
						</li>
						<li className="funnel-step fade-in-item">
							<div className="funnel-step-num">03</div>
							<div className="funnel-step-en">Harness</div>
							<div className="funnel-step-jp">エージェント実装</div>
							<p className="funnel-step-desc">
								Managed
								Agentsを基盤に、自律エージェントを設計・統合し、既存システムに接続する経営基盤（ハーネス）を構築。
							</p>
						</li>
						<li className="funnel-step fade-in-item">
							<div className="funnel-step-num">04</div>
							<div className="funnel-step-en">Governance</div>
							<div className="funnel-step-jp">ガバナンス・運用</div>
							<p className="funnel-step-desc">
								9軸評価で品質・コスト・安全性を継続測定。エージェントを「動かし続ける」統治の仕組みを組織に埋め込む。
							</p>
						</li>
					</ol>

					<p className="approach-footnote fade-in">
						エージェントガバナンスはKuuの中核技術ですが、それ単体では売れない——という前提で設計しています。戦略の言葉とレガシーの現実を一本に通すために、4段すべてを自社で担うのがKuuのスタイルです。
					</p>

					<div className="service-offerings-label fade-in">Offerings</div>
					<div className="service-list fade-in-stagger">
						<div className="service-item fade-in-item">
							<div className="service-stage">
								Stage 01–02 · Strategy &amp; Discovery
							</div>
							<div className="service-name">AX / DX戦略・現場ディスカバリ</div>
							<div className="service-desc">
								経営課題から逆算したDX/AXロードマップを引き、顧客の業務・既存システムに入って実装可能な計画に落とします。戦略パワポで終わらせない理由は、Kuuがこの先の実装・運用まで自社で担うからです。
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
							<div className="service-stage">
								Stage 03–04 · Harness &amp; Governance
							</div>
							<div className="service-name">AIエージェント実装・ガバナンス</div>
							<div className="service-desc">
								自律エージェントの設計と既存システム接続（ハーネス）を実装し、9軸評価で動かし続ける統治機能を組織に埋め込みます。AIガバナンスは「製品」ではなく、実装の中核に組み込む経営機能として提供します。
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
							<div className="service-stage">Adjacent · Creative</div>
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
							<div className="about-label">代表者</div>
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
