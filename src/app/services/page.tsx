import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
	BuildCatIcon,
	ClaudeMark,
	ContentCatIcon,
	DiscoveryIcon,
	FdeIcon,
	GovernanceIcon,
	HarnessIcon,
	MangaIcon,
	OpenAiMark,
	ShieldCatIcon,
	StrategyCatIcon,
	StrategyIcon,
} from "@/components/icons/ServiceIcons";
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
				name: "AX/DX戦略コンサルティング",
				url: `${BASE_URL}/services/ax-dx/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "RDEディスカバリ",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: "AIエージェント実装・FDE",
				url: `${BASE_URL}/services/ai-ops/`,
			},
			{
				"@type": "ListItem",
				position: 4,
				name: "AIエージェントガバナンス運用",
				url: `${BASE_URL}/services/ai-ops/`,
			},
			{
				"@type": "ListItem",
				position: 5,
				name: "Claude 法人導入・活用支援",
			},
			{
				"@type": "ListItem",
				position: 6,
				name: "ChatGPT / Codex 法人活用支援",
			},
			{
				"@type": "ListItem",
				position: 7,
				name: "エージェントハーネス設計・MCP連携",
			},
			{
				"@type": "ListItem",
				position: 8,
				name: "Yota mangaコンテンツ",
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

type ServiceCard = {
	title: string;
	desc: string;
	href?: string;
	icon: React.ReactNode;
	iconAccent?: "claude" | "openai";
};

const SERVICE_CARDS: ServiceCard[] = [
	{
		title: "AX/DX戦略コンサルティング",
		desc: "経営課題から逆算したAX/DXロードマップを設計し、実装可能な計画に落とします。戦略パワポで終わらせず、実装・運用まで自社で担います。",
		href: "/services/ax-dx/",
		icon: <StrategyIcon />,
	},
	{
		title: "RDEディスカバリ",
		desc: "Reinvention Deployed Engineering が業務・既存システム・データに深く入り込み、業務フローごとAI前提で再設計するための仮説と機会を抽出します。",
		icon: <DiscoveryIcon />,
	},
	{
		title: "AIエージェント実装・FDE",
		desc: "Forward Deployed Engineer が顧客環境に入り込み、AIエージェントの設計・ハーネス接続から運用定着まで一気通貫で担います。",
		href: "/services/ai-ops/",
		icon: <FdeIcon />,
	},
	{
		title: "AIエージェントガバナンス運用",
		desc: "9軸評価で品質・コスト・安全性を継続測定し、エージェントを「動かし続ける」統治の仕組みを組織に埋め込みます。",
		href: "/services/ai-ops/",
		icon: <GovernanceIcon />,
	},
	{
		title: "Claude 法人導入・活用支援",
		desc: "Enterprise / Cowork / Code / API（Bedrock）。Anthropic Claude の製品選定から定着までワンストップで支援します。",
		icon: <ClaudeMark />,
		iconAccent: "claude",
	},
	{
		title: "ChatGPT / Codex 法人活用支援",
		desc: "ChatGPT Business・Codex の業務組込みから社内規程・ガバナンス整備まで、OpenAI 製品の安全な企業活用を支援します。",
		icon: <OpenAiMark />,
		iconAccent: "openai",
	},
	{
		title: "エージェントハーネス設計・MCP連携",
		desc: "Model Context Protocol、サブエージェント、外部システム接続を経営基盤として設計。エージェントを動かし続ける土台を構築します。",
		icon: <HarnessIcon />,
	},
	{
		title: "Yota mangaコンテンツ",
		desc: "AIを活用したマンガ制作。企画・シナリオから作画まで、物語で伝える高品質なコンテンツを提供します。",
		icon: <MangaIcon />,
	},
];

type ServiceCategory = {
	head: string;
	icon: React.ReactNode;
	items: string[];
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
	{
		head: "戦略・ディスカバリ",
		icon: <StrategyCatIcon />,
		items: [
			"AX/DX戦略コンサル",
			"RDEディスカバリ",
			"現場ヒアリング",
			"ロードマップ設計",
		],
	},
	{
		head: "実装・統合",
		icon: <BuildCatIcon />,
		items: [
			"FDE実装",
			"エージェントハーネス",
			"MCP連携",
			"サブエージェント設計",
		],
	},
	{
		head: "ガバナンス・運用",
		icon: <ShieldCatIcon />,
		items: [
			"9軸評価",
			"AI監査ログ",
			"AIレッドチーミング",
			"シャドーAI対策",
		],
	},
	{
		head: "周辺・コンテンツ",
		icon: <ContentCatIcon />,
		items: [
			"Yota manga",
			"AI研修",
			"社内ポリシー策定",
			"AIer人材紹介",
		],
	},
];

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
						<div className="service-grid fade-in-stagger">
							{SERVICE_CARDS.map((card) => {
								const iconClass = card.iconAccent
									? `service-card-icon service-card-icon--accent-${card.iconAccent}`
									: "service-card-icon";
								const content = (
									<>
										<div className={iconClass}>{card.icon}</div>
										<div className="service-card-content">
											<h3 className="service-card-title">{card.title}</h3>
											<p className="service-card-desc">{card.desc}</p>
											{card.href ? (
												<span className="service-card-arrow">→</span>
											) : null}
										</div>
									</>
								);
								return card.href ? (
									<Link
										key={card.title}
										href={card.href}
										className="service-card fade-in-item"
									>
										{content}
									</Link>
								) : (
									<div
										key={card.title}
										className="service-card fade-in-item"
									>
										{content}
									</div>
								);
							})}
						</div>

						<div className="service-categories fade-in-stagger">
							{SERVICE_CATEGORIES.map((cat) => (
								<div
									key={cat.head}
									className="service-category-col fade-in-item"
								>
									<div className="service-category-head">
										{cat.icon}
										<span>{cat.head}</span>
									</div>
									{cat.items.map((item) => (
										<span key={item} className="service-category-link">
											<span>{item}</span>
											<span className="service-category-link-arrow">→</span>
										</span>
									))}
								</div>
							))}
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
