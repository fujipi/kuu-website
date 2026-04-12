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
		description: "Kuu株式会社の会社情報・ミッション・代表者情報。",
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

					{/* 代表メッセージ */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">Message</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<div
								style={{
									borderLeft: "1px solid var(--gray-dark)",
									paddingLeft: "2rem",
									marginBottom: "2rem",
								}}
							>
								<p
									style={{
										fontSize: "0.9rem",
										color: "var(--white)",
										lineHeight: "2",
										marginBottom: "1.5rem",
									}}
								>
									AIエージェントの時代が来ました。自律的に考え・動き・改善し続けるAIが、業務のあり方を根本から変えようとしています。
								</p>
								<p
									style={{
										fontSize: "0.9rem",
										color: "var(--gray-medium)",
										lineHeight: "2",
										marginBottom: "1.5rem",
									}}
								>
									しかし、ツールを導入するだけでは成果は出ません。AIエージェントが本当に価値を生み出すには、「設計・統治・継続改善」の仕組み——エージェントガバナンスが不可欠です。
								</p>
								<p
									style={{
										fontSize: "0.9rem",
										color: "var(--gray-medium)",
										lineHeight: "2",
										marginBottom: "1.5rem",
									}}
								>
									Kuuは、自社でこのガバナンスを実践しながら、その知見を企業へ届けます。「AIを正しく設計し、正しく動かし、正しく育てる」——これが私たちの仕事です。
								</p>
								<p
									style={{
										fontSize: "0.9rem",
										color: "var(--gray-medium)",
										lineHeight: "2",
									}}
								>
									AIの力で、より多くの企業が本来の強みに集中できる世界を作りたい。そのために、Kuuは最前線で動き続けます。
								</p>
							</div>
							<p
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-light)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								代表取締役　藤平 賢人
							</p>
						</div>
					</section>

					{/* ミッション・バリュー */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">Mission &amp; Values</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<div
								style={{
									marginBottom: "3rem",
									padding: "2rem",
									border: "1px solid var(--gray-dark)",
									borderRadius: "4px",
								}}
							>
								<p
									style={{
										fontSize: "0.7rem",
										color: "var(--gray-medium)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.15em",
										marginBottom: "0.75rem",
									}}
								>
									MISSION
								</p>
								<p
									style={{
										fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
										color: "var(--white)",
										lineHeight: "1.7",
										fontWeight: 500,
									}}
								>
									AIエージェントを正しく設計・統治・改善し続ける力を、あらゆる企業に届ける
								</p>
							</div>

							<div style={{ display: "flex", flexDirection: "column" }}>
								{[
									{
										label: "Design First",
										desc: "ツールの前に設計。目的・制約・評価軸を明確にしてから実装する。",
									},
									{
										label: "Govern to Scale",
										desc: "1つのエージェントから100のエージェントへ。ガバナンスはスケールの前提条件。",
									},
									{
										label: "Always Improving",
										desc: "AIは一度作って終わりではない。継続的な改善ループを持つ組織が勝つ。",
									},
									{
										label: "Human in the Loop",
										desc: "自動化と人間の判断の境界を意識的に設計する。AIに任せることと、人間が担うことを明確にする。",
									},
								].map((item, i) => (
									<div
										key={item.label}
										style={{
											display: "grid",
											gridTemplateColumns: "160px 1fr",
											gap: "1.5rem",
											padding: "1.5rem 0",
											borderTop: "1px solid var(--gray-dark)",
											...(i === 3
												? { borderBottom: "1px solid var(--gray-dark)" }
												: {}),
										}}
									>
										<p
											style={{
												fontSize: "0.75rem",
												color: "var(--white)",
												fontFamily: "var(--font-heading)",
												fontWeight: 500,
												letterSpacing: "0.05em",
												paddingTop: "0.1rem",
											}}
										>
											{item.label}
										</p>
										<p
											style={{
												fontSize: "0.85rem",
												color: "var(--gray-medium)",
												lineHeight: "1.8",
											}}
										>
											{item.desc}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

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
