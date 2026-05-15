import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata as seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title:
		"Service — 戦略から運用まで、4段を横串に担う | AX時代の伴走実装パートナー | Kuu株式会社",
	description:
		"Kuu株式会社のサービス全体像。DX/AX戦略・現場ディスカバリ・エージェント実装（ハーネス）・ガバナンス運用の4段を一社で横串に担う伴走実装パートナー。個別サービスへの入口。",
	path: "/services/",
});

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";
const URL = `${BASE_URL}/services/`;

const servicesJsonLd = [
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
				name: "Service",
				item: URL,
			},
		],
	},
	{
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Kuu Services",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "AX / DX戦略・現場ディスカバリ",
				url: `${BASE_URL}/services/ax-dx/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "AIエージェント実装・ガバナンス",
				url: `${BASE_URL}/services/ai-ops/`,
			},
		],
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AX/DX戦略・現場ディスカバリ",
		description:
			"経営課題から逆算したDX/AXロードマップ設計と、顧客の業務・既存システムに深く入る現場ディスカバリ。実装可能な計画に落とすまで。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "DX/AX戦略・ディスカバリ",
		areaServed: "JP",
		url: `${BASE_URL}/services/ax-dx/`,
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AIエージェント実装・ガバナンス",
		description:
			"自律エージェントの設計と既存システム接続（ハーネス）を実装し、9軸評価で品質・コスト・安全性を継続統治。エージェントを動かし続ける仕組みを組織に埋め込みます。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "AIエージェント実装・運用",
		areaServed: "JP",
		url: `${BASE_URL}/services/ai-ops/`,
	},
];

const linkStyle = {
	display: "inline-block",
	marginTop: "0.75rem",
	fontSize: "0.7rem",
	color: "var(--gray-dim)",
	fontFamily: "var(--font-heading)",
	letterSpacing: "0.05em",
	borderBottom: "1px solid var(--gray-dark)",
	paddingBottom: "0.1rem",
	transition: "color 0.3s, border-color 0.3s",
} as const;

export default function ServicesIndexPage() {
	return (
		<>
			<JsonLd data={servicesJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<nav
						className="fade-in"
						style={{
							fontSize: "0.7rem",
							color: "var(--gray-dim)",
							marginBottom: "2rem",
							fontFamily: "var(--font-heading)",
						}}
					>
						<Link href="/" style={{ color: "var(--gray-medium)" }}>
							Home
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>Service</span>
					</nav>

					<h1 className="page-title fade-in">
						Service — 戦略から運用まで、
						<br />
						4段を横串に担う
					</h1>

					<section style={{ marginBottom: "5rem" }}>
						<div className="approach-lede fade-in">
							<p className="approach-headline">
								戦略から運用まで、4段を横串に担う実装パートナー。
							</p>
							<p className="approach-body">
								AIモデルの優秀さを語ることで売れる時代は、すでに終わりかけています。エージェント導入のボトルネックは、顧客の業務とレガシーシステムに深く入り、動くものを作って動かし続けるための地道な仕事——いわゆる「ラストワンマイル」にあります。Kuuはこの泥の部分を、戦略フェーズから運用統治まで一社で担います。
							</p>
						</div>

						<ol
							className="funnel fade-in-stagger"
							aria-label="サービスファネル"
						>
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

						<div
							className="fade-in"
							style={{
								marginTop: "2.5rem",
								display: "flex",
								flexWrap: "wrap",
								gap: "1.25rem",
								fontSize: "0.75rem",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.05em",
							}}
						>
							<Link
								href="/fde/"
								style={{
									color: "var(--gray-light)",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.15rem",
								}}
							>
								FDE型ディスカバリとは →
							</Link>
							<Link
								href="/ax/"
								style={{
									color: "var(--gray-light)",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.15rem",
								}}
							>
								AXとは（エージェントトランスフォーメーション） →
							</Link>
							<Link
								href="/ai-governance/"
								style={{
									color: "var(--gray-light)",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.15rem",
								}}
							>
								エージェントガバナンスとは →
							</Link>
						</div>
					</section>

					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">Offerings</h2>
						<div className="service-list fade-in-stagger">
							<div className="service-item fade-in-item">
								<div className="service-stage">
									Stage 01–02 · Strategy &amp; Discovery
								</div>
								<div className="service-name">
									AX / DX戦略・現場ディスカバリ
								</div>
								<div className="service-desc">
									経営課題から逆算したDX/AXロードマップを引き、顧客の業務・既存システムに入って実装可能な計画に落とします。戦略パワポで終わらせない理由は、Kuuがこの先の実装・運用まで自社で担うからです。
								</div>
								<Link href="/services/ax-dx/" style={linkStyle}>
									詳しく見る →
								</Link>
							</div>

							<div className="service-item fade-in-item">
								<div className="service-stage">
									Stage 03–04 · Harness &amp; Governance
								</div>
								<div className="service-name">
									AIエージェント実装・ガバナンス
								</div>
								<div className="service-desc">
									自律エージェントの設計と既存システム接続（ハーネス）を実装し、9軸評価で動かし続ける統治機能を組織に埋め込みます。AIガバナンスは「製品」ではなく、実装の中核に組み込む経営機能として提供します。
								</div>
								<Link href="/services/ai-ops/" style={linkStyle}>
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

					<section className="fade-in" style={{ marginBottom: "4rem" }}>
						<div
							style={{
								border: "1px solid var(--gray-dark)",
								borderRadius: "4px",
								padding: "3rem",
								maxWidth: "720px",
								textAlign: "center",
							}}
						>
							<p
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-medium)",
									marginBottom: "1rem",
								}}
							>
								どのStageから始めるべきか含めて、まずは現状をお聞かせください。
							</p>
							<Link
								href="/contact/"
								style={{
									display: "inline-block",
									padding: "0.75rem 2.5rem",
									background: "var(--white)",
									color: "var(--black)",
									borderRadius: "4px",
									fontSize: "0.85rem",
									fontWeight: 500,
									transition: "opacity 0.3s",
								}}
							>
								無料相談を申し込む
							</Link>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</>
	);
}
