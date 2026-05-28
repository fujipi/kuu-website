import {
	BookOpen,
	Compass,
	Flag,
	Hammer,
	Network,
	Search,
	Shield,
	ShieldCheck,
	Workflow,
	Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClaudeMark, OpenAiMark } from "@/components/icons/ServiceIcons";
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
				url: `${BASE_URL}/services/rde/`,
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

type BentoSize = "hero" | "tall" | "half" | "full";

type ServiceCard = {
	stage: string;
	title: string;
	desc: string;
	products?: string;
	href?: string;
	icon: React.ReactNode;
	size: BentoSize;
	accent?: "claude" | "openai";
};

const SERVICE_CARDS: ServiceCard[] = [
	{
		stage: "Stage 01 · Strategy",
		title: "AX/DX戦略コンサルティング",
		desc: "経営課題から逆算した AX/DX ロードマップを設計し、実装可能な計画に落とします。Claude / ChatGPT / Gemini など適切な LLM 選定から、Codex・Skills・MCP を組み合わせた実装計画まで一気通貫で。戦略パワポで終わらせない理由は、Kuu がこの先の実装・運用まで自社で担うからです。",
		products: "Claude · ChatGPT · Gemini · Codex · Skills · MCP",
		href: "/services/ax-dx/",
		icon: <Compass size={48} strokeWidth={1.4} />,
		size: "hero",
	},
	{
		stage: "Stage 02 · Discovery",
		title: "RDEディスカバリ",
		desc: "Reinvention Deployed Engineering で業務・既存システム・データ資産に深く入り込み、業務フローごと AI 前提で再設計する仮説と機会を抽出します。",
		products: "Obsidian · Notion · Genspark",
		href: "/services/rde/",
		icon: <Search size={32} strokeWidth={1.4} />,
		size: "tall",
	},
	{
		stage: "Stage 03 · Harness",
		title: "AIエージェント実装・FDE",
		desc: "FDE が顧客環境に常駐し、Claude Code・Codex・Manus・Genspark を組み合わせて MCP・サブエージェント・Routine 設計まで実装と運用を一気通貫で担います。",
		products: "Claude Code · Codex · Manus · Genspark",
		href: "/services/ai-ops/",
		icon: <Wrench size={32} strokeWidth={1.4} />,
		size: "tall",
	},
	{
		stage: "Stage 04 · Governance",
		title: "AIエージェントガバナンス運用",
		desc: "9軸評価・AIレッドチーミング・シャドーAI対策で品質・コスト・安全性を継続統治。エージェントを動かし続ける統治の仕組みを組織に埋め込みます。",
		products: "9軸評価 · Red Teaming · Audit Log",
		href: "/services/ai-ops/",
		icon: <ShieldCheck size={32} strokeWidth={1.4} />,
		size: "half",
	},
	{
		stage: "Product · Anthropic",
		title: "Claude 法人導入・活用支援",
		desc: "Enterprise / Cowork / Code / API（Bedrock）。Anthropic Claude の製品選定から Skills・MCP・サブエージェント設計、社内定着までワンストップで支援。",
		products: "Enterprise · Cowork · Code · API",
		icon: <ClaudeMark size={40} />,
		size: "half",
		accent: "claude",
	},
	{
		stage: "Integration · Foundation",
		title: "エージェントハーネス設計・MCP連携",
		desc: "Model Context Protocol、Skills、プラグイン、サブエージェント、Routine、オーケストレーションを組み合わせ、エージェントを動かし続ける経営基盤を設計します。",
		products: "MCP · Skills · Routine",
		icon: <Network size={32} strokeWidth={1.4} />,
		size: "half",
	},
	{
		stage: "Product · OpenAI",
		title: "ChatGPT / Codex 法人活用支援",
		desc: "ChatGPT Business・Codex の業務組込みから社内規程・ガバナンス整備、Custom GPTs・AgentKit の構築まで支援。",
		products: "ChatGPT Business · Codex · AgentKit",
		icon: <OpenAiMark size={40} />,
		size: "half",
		accent: "openai",
	},
	{
		stage: "Adjacent · Creative",
		title: "Yota mangaコンテンツ",
		desc: "AI を活用したマンガ制作。企画・シナリオから作画まで、物語で伝える高品質なコンテンツを提供します。",
		icon: <BookOpen size={32} strokeWidth={1.4} />,
		size: "full",
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
		icon: <Flag size={14} strokeWidth={1.6} />,
		items: [
			"AX/DX戦略コンサル",
			"RDEディスカバリ",
			"現場ヒアリング",
			"ロードマップ設計",
		],
	},
	{
		head: "実装・統合",
		icon: <Hammer size={14} strokeWidth={1.6} />,
		items: [
			"FDE実装",
			"エージェントハーネス",
			"MCP連携",
			"サブエージェント設計",
		],
	},
	{
		head: "ガバナンス・運用",
		icon: <Shield size={14} strokeWidth={1.6} />,
		items: [
			"9軸評価",
			"AI監査ログ",
			"AIレッドチーミング",
			"シャドーAI対策",
		],
	},
	{
		head: "周辺・コンテンツ",
		icon: <Workflow size={14} strokeWidth={1.6} />,
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
						<div className="service-bento fade-in-stagger">
							{SERVICE_CARDS.map((card) => {
								const sizeClass = `service-bento-${card.size}`;
								const accentClass = card.accent
									? ` service-bento-accent-${card.accent}`
									: "";
								const className = `service-bento-card ${sizeClass}${accentClass} fade-in-item`;
								const content = (
									<>
										<div className="service-bento-icon">{card.icon}</div>
										<div className="service-bento-stage">{card.stage}</div>
										<h3 className="service-bento-title">{card.title}</h3>
										<p className="service-bento-desc">{card.desc}</p>
										{card.products ? (
											<div className="service-bento-products">
												{card.products}
											</div>
										) : null}
										{card.href ? (
											<span className="service-bento-arrow">→</span>
										) : null}
									</>
								);
								return card.href ? (
									<Link
										key={card.title}
										href={card.href}
										className={className}
									>
										{content}
									</Link>
								) : (
									<div key={card.title} className={className}>
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
