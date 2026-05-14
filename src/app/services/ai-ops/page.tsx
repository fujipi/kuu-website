import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata as seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title:
		"AIエージェント実装・ガバナンス | ハーネス構築から9軸評価運用まで | Kuu株式会社",
	description:
		"Kuuのファネル後半（Stage 03–04）。自律エージェントの設計と既存システム接続（ハーネス）を実装し、9軸評価で品質・コスト・安全性を継続統治。エージェントを動かし続ける仕組みを組織に埋め込みます。",
	path: "/services/ai-ops/",
});

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

const faqs = [
	{
		q: "AIエージェントの導入に、どのくらいの期間がかかりますか？",
		a: "現状分析と戦略設計フェーズで2〜4週間、パイロット導入で4〜8週間、本格展開で2〜3ヶ月が目安です。業務規模やシステム連携の複雑さによって変動します。まずは無料相談で現状を共有いただければ、具体的なスケジュールをご提案します。",
	},
	{
		q: "エージェントガバナンスとは何ですか？なぜ必要なのですか？",
		a: "エージェントガバナンスとは、組織内で稼働するAIエージェントの設計・管理・評価・改善の仕組みです。AIが自律的に動く環境では、品質・セキュリティ・コストの管理を人間が意図的に設計しなければ、意図しない動作やコスト超過が発生します。Kuuの9軸評価フレームワークにより、エージェントの成熟度を定量的に把握し、継続改善できる体制を構築します。",
	},
	{
		q: "既存システムとの連携は可能ですか？",
		a: "はい。Slack・Notion・Salesforce・kintone・LINE・各種ERPなど主要業務ツールとのAPI連携実績があります。レガシーシステムとの連携についても、要件を確認したうえで最適な方法を提案します。",
	},
	{
		q: "費用の目安を教えてください。",
		a: "SMBプランは初期費用30万円〜＋月額運用費、EnterpriseプランはPoC設計から始まるカスタム見積もりになります。業務規模・自動化範囲・継続支援の範囲によって変わりますので、まずはお問い合わせください。",
	},
	{
		q: "社内にエンジニアがいなくても導入できますか？",
		a: "できます。Kuuは戦略設計から実装・運用定着まで一貫支援するため、クライアント側の技術リソースは不要です。運用フェーズでは担当者向けのオペレーションガイドも提供し、内製化を段階的に支援することも可能です。",
	},
];

const BASE_URL = "https://kuucorp.com";

const aiOpsJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.a,
			},
		})),
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
		serviceType: "AIエージェントガバナンス",
		areaServed: "JP",
		url: `${BASE_URL}/services/ai-ops/`,
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
				name: "AIエージェント実装・ガバナンス",
				item: `${BASE_URL}/services/ai-ops/`,
			},
		],
	},
];

export default function AiOpsPage() {
	return (
		<>
			<JsonLd data={aiOpsJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					{/* Stage indicator */}
					<div
						className="fade-in"
						style={{
							fontFamily: "var(--font-heading)",
							fontSize: "0.7rem",
							letterSpacing: "0.15em",
							color: "var(--gray-dim)",
							marginBottom: "1rem",
						}}
					>
						STAGE 03–04 · HARNESS &amp; GOVERNANCE
					</div>

					{/* H1 */}
					<h1 className="page-title fade-in">
						AIエージェント実装・ガバナンス
						<br />
						（ハーネス構築・9軸評価運用）
					</h1>

					{/* 課題提起 */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">課題</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "1.5rem",
								}}
							>
								戦略を引き、ユースケースを特定し、PoCも回した——にもかかわらず、エージェントが本番で動き続けないという段階で詰まる企業が増えています。問題はAIの優秀さではなく、エージェントを既存システムに繋ぎ、品質を測り続ける「実装と運用」の側にあります。
							</p>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "1.5rem",
								}}
							>
								Kuuが担うのは、ファネル後半の
								<strong style={{ color: "var(--white)" }}>
									ハーネス構築（Stage 03）
								</strong>
								と
								<strong style={{ color: "var(--white)" }}>
									ガバナンス運用（Stage 04）
								</strong>
								。エージェントを動かす経営基盤を顧客のシステムに埋め込み、9軸評価で動かし続ける統治機能を提供します。
							</p>
							<div
								style={{
									border: "1px solid var(--gray-dark)",
									borderRadius: "4px",
									padding: "1.5rem 2rem",
									marginTop: "2rem",
								}}
							>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--gray-light)",
										marginBottom: "1rem",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.1em",
									}}
								>
									よくある課題
								</p>
								<ul
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "0.75rem",
									}}
								>
									{[
										"PoC（概念実証）で止まり、本番導入に進めない",
										"AIが出す結果の品質を担保する仕組みがない",
										"部門ごとにバラバラなAIツールを導入し、コストが見えない",
										"エージェントが増えるほど、管理が属人化・複雑化している",
										"AIの活用成果を経営指標に落とし込めていない",
									].map((item) => (
										<li
											key={item}
											style={{
												fontSize: "0.85rem",
												color: "var(--gray-medium)",
												paddingLeft: "1rem",
												position: "relative",
											}}
										>
											<span
												style={{
													position: "absolute",
													left: 0,
													color: "var(--gray-dim)",
												}}
											>
												—
											</span>
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</section>

					{/* サービス概要 */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">サービス概要</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "1.5rem",
								}}
							>
								自律エージェントの実装と、それを「動かし続ける」ための統治機能をセットで提供します。AIガバナンスを単独のコンサル商品として切り売りしません——
								<strong style={{ color: "var(--white)" }}>
									ハーネス実装の中に統治レイヤを組み込む
								</strong>
								のがKuuのスタイルです。
							</p>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "2rem",
								}}
							>
								FDE型ディスカバリ（Stage
								02）で特定したユースケースを起点に、Managed
								Agentsを基盤としたエージェント設計、既存システム（Slack・Notion・Salesforce・kintone・各種ERP等）への接続、9軸評価による継続運用までを担います。「現行踏襲」を求める現場の制約を前提に、動くものを作って動かし続けます。
							</p>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
									gap: "1px",
									border: "1px solid var(--gray-dark)",
									borderRadius: "4px",
									overflow: "hidden",
								}}
							>
								{[
									{
										title: "戦略設計",
										desc: "エージェント活用戦略の策定とロードマップ設計",
									},
									{
										title: "ガバナンス構築",
										desc: "9軸評価ベースの統治フレームワーク設計",
									},
									{
										title: "実装支援",
										desc: "Managed Agentsを活用した実装・システム連携",
									},
									{
										title: "継続改善",
										desc: "KPI追跡・自己改善ループの設計・運用定着",
									},
								].map((item) => (
									<div
										key={item.title}
										style={{
											padding: "1.5rem",
											background: "var(--gray-deeper)",
										}}
									>
										<p
											style={{
												fontSize: "0.8rem",
												color: "var(--white)",
												fontWeight: 500,
												marginBottom: "0.5rem",
												fontFamily: "var(--font-heading)",
											}}
										>
											{item.title}
										</p>
										<p
											style={{
												fontSize: "0.75rem",
												color: "var(--gray-medium)",
												lineHeight: "1.7",
											}}
										>
											{item.desc}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* 具体的なプロセス */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">導入プロセス</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<div
								style={{ display: "flex", flexDirection: "column", gap: "0" }}
							>
								{[
									{
										step: "01",
										title: "現状分析・ヒアリング（1〜2週間）",
										desc: "業務フロー・既存ツール・組織体制・AIリテラシーを調査します。どの業務でAIエージェントが最も効果を発揮するかを特定し、優先順位を定めます。",
									},
									{
										step: "02",
										title: "エージェント戦略設計（2〜3週間）",
										desc: "現状分析をもとに、エージェントアーキテクチャと導入ロードマップを設計します。9軸評価フレームワーク（品質・効率・安全性・コスト等）をベースに、KPIと評価軸を定義します。",
									},
									{
										step: "03",
										title: "パイロット実装・検証（4〜8週間）",
										desc: "優先度の高い業務から小さく始めます。Anthropic Managed Agents等の最新プラットフォームを活用し、既存システムとのAPI連携を含めた実装を行います。動作を検証しながら改善します。",
									},
									{
										step: "04",
										title: "ガバナンスフレームワーク構築（並行）",
										desc: "エージェントの品質管理・セキュリティポリシー・コスト管理・人間による承認フローを設計します。エージェントが増えても管理できる「スケーラブルな統治の仕組み」を組織に埋め込みます。",
									},
									{
										step: "05",
										title: "本番展開・継続改善（継続）",
										desc: "本番環境への展開後も、KPI追跡・改善提案・エージェントのアップデートを継続支援します。月次レビューを通じてPDCAを回し、経営成果への貢献を可視化します。",
									},
								].map((item, i) => (
									<div
										key={item.step}
										style={{
											display: "grid",
											gridTemplateColumns: "48px 1fr",
											gap: "1.5rem",
											padding: "2rem 0",
											borderTop: "1px solid var(--gray-dark)",
											...(i === 4
												? { borderBottom: "1px solid var(--gray-dark)" }
												: {}),
										}}
									>
										<div
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: "0.75rem",
												color: "var(--gray-dim)",
												paddingTop: "0.2rem",
											}}
										>
											{item.step}
										</div>
										<div>
											<p
												style={{
													fontSize: "0.9rem",
													color: "var(--white)",
													fontWeight: 500,
													marginBottom: "0.5rem",
												}}
											>
												{item.title}
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
									</div>
								))}
							</div>
						</div>
					</section>

					{/* FAQ */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">FAQ</h2>
						<div className="fade-in-stagger" style={{ maxWidth: "720px" }}>
							{faqs.map((faq) => (
								<div
									key={faq.q}
									className="fade-in-item"
									style={{
										borderTop: "1px solid var(--gray-dark)",
										padding: "1.75rem 0",
									}}
								>
									<p
										style={{
											fontSize: "0.9rem",
											color: "var(--white)",
											fontWeight: 500,
											marginBottom: "0.75rem",
											lineHeight: "1.7",
										}}
									>
										Q. {faq.q}
									</p>
									<p
										style={{
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
											lineHeight: "1.9",
										}}
									>
										{faq.a}
									</p>
								</div>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>

					{/* CTA */}
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
								まずは現状をお聞かせください。無料でご相談を承っています。
							</p>
							<a
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
							</a>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</>
	);
}
