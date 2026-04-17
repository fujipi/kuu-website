import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata as seoMetadata } from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export const metadata: Metadata = seoMetadata({
	title:
		"料金・プラン | AIエージェントガバナンス / Managed Agents | Kuu株式会社",
	description:
		"Kuu株式会社のAIエージェントガバナンス・Managed Agents の料金プラン。SMB向け・Enterprise向けの価格帯と含まれる支援範囲、初期費用の目安を公開しています。",
	path: "/pricing/",
});

interface PricingPlan {
	name: string;
	tagline: string;
	initial: string;
	monthly: string;
	scope: string[];
	fit: string;
	cta: string;
}

const plans: PricingPlan[] = [
	{
		name: "Starter",
		tagline: "まず1本のエージェントで効果を確かめたい中小企業向け",
		initial: "30万円〜",
		monthly: "月額 20万円〜",
		scope: [
			"1業務 × 1エージェントのパイロット設計",
			"9軸評価フレームワークでの初期診断",
			"月次レビュー (1時間)",
			"簡易ガイドラインテンプレート提供",
		],
		fit: "AI導入経験がなく、まず1つの業務で効果を体感したい組織",
		cta: "Starter を相談する",
	},
	{
		name: "Standard",
		tagline: "複数エージェントを統合運用したい中堅企業向け",
		initial: "80万円〜",
		monthly: "月額 40万円〜",
		scope: [
			"3〜5業務のエージェント設計と本番運用",
			"エージェントガバナンス体制の構築",
			"9軸評価 + 四半期レビュー",
			"社内規程・利用ガイドラインのカスタム策定",
			"Slack / Notion / kintone 等の連携実装",
		],
		fit: "複数エージェントを一元管理し、全社的に活用を広げたい組織",
		cta: "Standard を相談する",
	},
	{
		name: "Enterprise",
		tagline: "ISO 42001 / EU AI Act を意識した本格的な体制整備",
		initial: "個別見積",
		monthly: "個別見積",
		scope: [
			"全社AI利用規程の策定支援",
			"AI-BCP (事業継続計画) の設計",
			"ISO/IEC 42001 相当のマネジメントシステム設計",
			"EU AI Act / 関連法令対応チェック",
			"専任コンサルタントのアサイン",
		],
		fit: "監査対応や取引先説明が必要な組織、グローバル展開予定の組織",
		cta: "Enterprise を相談する",
	},
];

const faqs = [
	{
		q: "提示価格は税込ですか？",
		a: "記載金額は税抜表示です。正式な見積書では消費税を別途計上します。",
	},
	{
		q: "最低契約期間はありますか？",
		a: "Starter は3ヶ月、Standard は6ヶ月、Enterprise は12ヶ月を推奨しています。継続運用を前提とするサービスのため、短期単発の契約は原則お受けしていません。",
	},
	{
		q: "途中でプランを変更できますか？",
		a: "できます。運用して1〜2ヶ月で必要規模が見えてくることが多いため、Starter から Standard への途中アップグレードは実運用でもよくあるパターンです。",
	},
	{
		q: "補助金の活用はできますか？",
		a: "IT導入補助金、事業再構築補助金などの活用実績があります。見積段階で対象可否を整理した資料を提供できますのでお問い合わせください。",
	},
	{
		q: "初期の相談は有料ですか？",
		a: "初回の60分オンライン相談は無料です。現状と課題をヒアリングし、概算見積と進め方の提案までを無償で実施しています。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Kuu株式会社 AIエージェントガバナンス・Managed Agents 料金プラン",
		description:
			"AIエージェントの設計・導入・運用・ガバナンスを包括するマネージドサービスの料金プラン",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "AIエージェントガバナンス",
		areaServed: "JP",
		url: `${BASE_URL}/pricing/`,
		offers: plans.map((p) => ({
			"@type": "Offer",
			name: p.name,
			description: p.tagline,
			priceCurrency: "JPY",
			priceSpecification: {
				"@type": "UnitPriceSpecification",
				name: p.monthly,
				price: p.monthly,
				priceCurrency: "JPY",
			},
			availability: "https://schema.org/InStock",
			url: `${BASE_URL}/contact/`,
		})),
	},
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: { "@type": "Answer", text: f.a },
		})),
	},
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
			{
				"@type": "ListItem",
				position: 2,
				name: "料金",
				item: `${BASE_URL}/pricing/`,
			},
		],
	},
];

export default function PricingPage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Pricing</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.95rem",
							color: "var(--gray-medium)",
							lineHeight: "1.9",
							maxWidth: "640px",
							marginBottom: "1.5rem",
						}}
					>
						AIエージェントガバナンスと Managed Agents
						の料金プランを、想定される組織規模別に公開しています。いずれも単発の構築ではなく、継続運用とガバナンスを含む月額モデルです。
					</p>
					<p
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-dim)",
							lineHeight: "1.8",
							maxWidth: "640px",
							marginBottom: "3rem",
						}}
					>
						正確な金額は業務規模・連携範囲・監督要件によって調整されます。まずは無料の60分相談で、貴社に最適なプランをご提案します。
					</p>

					<div
						className="fade-in-stagger"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
							gap: "1.5rem",
							maxWidth: "1100px",
							marginBottom: "4rem",
						}}
					>
						{plans.map((p) => (
							<div
								key={p.name}
								className="fade-in-item"
								style={{
									border: "1px solid var(--gray-dark)",
									borderRadius: "6px",
									padding: "1.75rem 1.5rem",
									background: "rgba(255,255,255,0.02)",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<h2
									style={{
										fontSize: "1.1rem",
										fontWeight: 500,
										color: "var(--white)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.25rem",
									}}
								>
									{p.name}
								</h2>
								<p
									style={{
										fontSize: "0.75rem",
										color: "var(--gray-dim)",
										marginBottom: "1.25rem",
										lineHeight: "1.6",
									}}
								>
									{p.tagline}
								</p>
								<div
									style={{
										borderTop: "1px solid var(--gray-dark)",
										borderBottom: "1px solid var(--gray-dark)",
										padding: "0.9rem 0",
										marginBottom: "1.25rem",
									}}
								>
									<div
										style={{
											fontSize: "0.65rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.1em",
											marginBottom: "0.3rem",
										}}
									>
										INITIAL
									</div>
									<div
										style={{
											fontSize: "0.95rem",
											color: "var(--gray-light)",
											marginBottom: "0.6rem",
										}}
									>
										{p.initial}
									</div>
									<div
										style={{
											fontSize: "0.65rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.1em",
											marginBottom: "0.3rem",
										}}
									>
										MONTHLY
									</div>
									<div
										style={{
											fontSize: "0.95rem",
											color: "var(--gray-light)",
										}}
									>
										{p.monthly}
									</div>
								</div>
								<ul
									style={{
										listStyle: "none",
										padding: 0,
										margin: "0 0 1.25rem 0",
										flex: 1,
									}}
								>
									{p.scope.map((s) => (
										<li
											key={s}
											style={{
												fontSize: "0.8rem",
												color: "var(--gray-medium)",
												lineHeight: "1.7",
												paddingLeft: "1rem",
												position: "relative",
												marginBottom: "0.35rem",
											}}
										>
											<span
												style={{
													position: "absolute",
													left: 0,
													color: "var(--gray-dim)",
												}}
											>
												·
											</span>
											{s}
										</li>
									))}
								</ul>
								<p
									style={{
										fontSize: "0.75rem",
										color: "var(--gray-dim)",
										lineHeight: "1.7",
										marginBottom: "1rem",
									}}
								>
									{p.fit}
								</p>
								<Link
									href="/contact/"
									style={{
										display: "inline-block",
										fontSize: "0.78rem",
										color: "var(--white)",
										borderBottom: "1px solid var(--white)",
										paddingBottom: "0.2rem",
										alignSelf: "flex-start",
									}}
								>
									{p.cta} →
								</Link>
							</div>
						))}
					</div>

					<section
						className="fade-in"
						style={{ maxWidth: "760px", marginBottom: "4rem" }}
					>
						<h2
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-light)",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.1em",
								marginBottom: "1.5rem",
							}}
						>
							FAQ
						</h2>
						<div>
							{faqs.map((f) => (
								<div
									key={f.q}
									style={{
										borderTop: "1px solid var(--gray-dark)",
										padding: "1.25rem 0",
									}}
								>
									<div
										style={{
											fontSize: "0.9rem",
											color: "var(--gray-light)",
											marginBottom: "0.5rem",
											fontWeight: 500,
										}}
									>
										Q. {f.q}
									</div>
									<div
										style={{
											fontSize: "0.82rem",
											color: "var(--gray-medium)",
											lineHeight: "1.8",
										}}
									>
										{f.a}
									</div>
								</div>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>

					<div className="fade-in">
						<Link
							href="/contact/"
							style={{
								display: "inline-block",
								fontSize: "0.85rem",
								color: "var(--white)",
								borderBottom: "1px solid var(--white)",
								paddingBottom: "0.2rem",
							}}
						>
							無料相談を申し込む →
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
