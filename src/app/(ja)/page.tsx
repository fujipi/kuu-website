import type { Metadata } from "next";
import Link from "next/link";
import Constellation from "@/components/Constellation";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCases } from "@/lib/case";
import { getAllPosts } from "@/lib/mdx";
import { getMainNav } from "@/lib/navigation";
import { PILLARS } from "@/lib/pillars";
import {
	BASE_ORG,
	BASE_URL,
	FOUNDER_PERSON,
	generateMetadata,
	ORG_ID,
	ORG_REF,
	WEBSITE_ID,
} from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "AX/DX戦略・Claude導入支援・エージェントガバナンス｜Kuu株式会社",
	description:
		"Kuu株式会社は、AX/DX戦略の立案から、ClaudeをはじめとするAIエージェントの導入・実装、9軸評価による継続的なエージェントガバナンスまでを一社で担う専門会社です。技術と運用の両面で企業のAI活用に伴走します。",
	path: "/",
	languages: { ja: "/", en: "/en/" },
	keywords: [
		"AIエージェント",
		"エージェントガバナンス",
		"エージェントハーネス",
		"AX",
		"DX",
		"FDE",
		"RDE",
		"AIer",
		"AIコンサルティング",
		"Claude",
		"ChatGPT",
		"Codex",
		"Gemini",
		"Anthropic",
		"OpenAI",
		"MCP",
		"Claude Skills",
		"サブエージェント",
		"Routine",
		"オーケストレーション",
		"Kuu株式会社",
	],
});

const homeJsonLd = [
	BASE_ORG,
	FOUNDER_PERSON,
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		name: "Kuu株式会社",
		url: BASE_URL,
		inLanguage: "ja",
		publisher: { "@id": ORG_ID },
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/blog/?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
		description:
			"AX/DX戦略・現場ディスカバリ・エージェント実装・ガバナンス運用までを一社で横串に担う伴走実装パートナー。",
		keywords: BASE_ORG.knowsAbout.join(", "),
		about: BASE_ORG.knowsAbout.slice(0, 12).map((name) => ({
			"@type": "Thing",
			name,
		})),
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AIエージェント実装・ガバナンス（Kuu）",
		description:
			"自律エージェントの設計と既存システム接続（ハーネス）、9軸評価による品質・コスト・安全性の継続統治までを一貫実装。",
		provider: ORG_REF,
		serviceType: "AIエージェント実装・運用",
		areaServed: "JP",
		keywords: [
			"AIエージェント",
			"エージェントガバナンス",
			"エージェントハーネス",
			"FDE",
			"MCP",
			"Claude Skills",
			"サブエージェント",
			"Routine",
			"9軸評価",
			"Managed Agents",
		],
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AX・DX戦略・現場ディスカバリ",
		description:
			"経営課題から逆算したDX/AXロードマップ設計と、顧客の業務・既存システムに深く入る現場ディスカバリ。実装可能な計画に落とすまで。",
		provider: ORG_REF,
		serviceType: "DX/AX戦略・ディスカバリ",
		areaServed: "JP",
		keywords: [
			"AX",
			"DX",
			"AI戦略",
			"AIコンサルティング",
			"RDE",
			"Claude",
			"ChatGPT",
			"Gemini",
			"エージェントトランスフォーメーション",
		],
	},
];

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
	const latestPosts = getAllPosts().slice(0, 3);
	const latestCases = getAllCases().slice(0, 3);
	return (
		<>
			<JsonLd data={homeJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav({ isHome: true })} />

			<main>
				<section className="hero">
					<Constellation />
					<div className="hero-content hero-reveal">
						<h1 className="hero-heading">
							しくみが浸透し、あらゆる人の自由をつくる
						</h1>
						<p className="hero-sub">Embedded Systems, Freedom for All</p>
					</div>
				</section>

				<section className="section-service" id="service">
					<h2 className="section-label fade-in">Service</h2>
					<div className="service-list fade-in-stagger">
						<div className="service-item fade-in-item">
							<div className="service-stage">Stage 01 · Strategy</div>
							<div className="service-name">AX/DX戦略コンサルティング</div>
							<div className="service-desc">
								経営課題から逆算したAX/DXロードマップを設計し、実装可能な計画に落とします。戦略パワポで終わらせない理由は、Kuuがこの先の実装・運用まで自社で担うからです。
							</div>
						</div>

						<div className="service-item fade-in-item">
							<div className="service-stage">
								Stage 03–04 · Harness &amp; Governance
							</div>
							<div className="service-name">
								AIエージェント実装・ガバナンスFDE
							</div>
							<div className="service-desc">
								FDE（Forward Deployed
								Engineer）が顧客環境に入り込み、AIエージェントの設計・ハーネス接続から9軸評価による継続ガバナンスまで、実装と運用を一気通貫で担います。
							</div>
						</div>

						<div className="service-item fade-in-item">
							<div className="service-stage">Stage 02 · Discovery</div>
							<div className="service-name">RDEディスカバリ</div>
							<div className="service-desc">
								RDE（Reinvention Deployed
								Engineering）が顧客の業務・既存システム・データ資産に深く入り込み、業務フローごとAI前提で再設計するための仮説と機会を抽出します。発見と再構想を両輪で進める変革型ディスカバリです。
							</div>
						</div>

						<div className="service-item fade-in-item">
							<div className="service-stage">Adjacent · Creative</div>
							<div className="service-name">Yota mangaコンテンツ</div>
							<div className="service-desc">
								AIを活用したマンガ制作。企画・シナリオから作画まで、物語で伝える高品質なコンテンツを提供します。
							</div>
						</div>
					</div>

					<Link href="/services/" className="service-overview-link fade-in">
						サービス概要を見る →
					</Link>
				</section>

				<section className="section-service" id="latest">
					<h2 className="section-label fade-in">Latest</h2>

					<div
						className="fade-in-stagger blog-list"
						style={{ maxWidth: "720px", marginTop: "3rem" }}
					>
						{latestPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}/`}
								className="blog-list-item fade-in-item"
							>
								<time
									dateTime={post.date}
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										display: "block",
										marginBottom: "0.5rem",
									}}
								>
									{formatDate(post.date)} · Blog
								</time>
								<h3
									style={{
										fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
										fontWeight: 500,
										color: "var(--white)",
										marginBottom: "0.5rem",
										lineHeight: "1.6",
									}}
								>
									{post.title}
								</h3>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
										maxWidth: "600px",
									}}
								>
									{post.description}
								</p>
							</Link>
						))}
						{latestCases.map((c) => (
							<Link
								key={c.slug}
								href={`/case/${c.slug}/`}
								className="blog-list-item fade-in-item"
							>
								<time
									dateTime={c.date}
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										display: "block",
										marginBottom: "0.5rem",
									}}
								>
									{formatDate(c.date)} · Case
								</time>
								<h3
									style={{
										fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
										fontWeight: 500,
										color: "var(--white)",
										marginBottom: "0.5rem",
										lineHeight: "1.6",
									}}
								>
									{c.title}
								</h3>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
										maxWidth: "600px",
									}}
								>
									{c.description}
								</p>
							</Link>
						))}
						<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
					</div>

					<div
						className="fade-in"
						style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}
					>
						<Link href="/blog/" className="service-overview-link">
							ブログ一覧を見る →
						</Link>
						<Link href="/case/" className="service-overview-link">
							ユースケース一覧を見る →
						</Link>
					</div>

					<div
						className="fade-in"
						style={{
							display: "flex",
							gap: "0.5rem",
							flexWrap: "wrap",
							marginTop: "2.5rem",
						}}
					>
						{PILLARS.map((pillar) => (
							<Link
								key={pillar.slug}
								href={pillar.url}
								style={{
									fontSize: "0.7rem",
									color: "var(--gray-medium)",
									border: "1px solid var(--gray-dark)",
									borderRadius: "2px",
									padding: "0.35rem 0.8rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								{pillar.label}
							</Link>
						))}
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
							<div className="about-value">藤平賢人</div>
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
