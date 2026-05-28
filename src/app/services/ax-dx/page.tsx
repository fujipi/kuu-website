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
		"AX/DX戦略・現場ディスカバリ | 経営課題から実装可能な計画へ | Kuu株式会社",
	description:
		"Kuuのファネル前半（Stage 01–02）。経営課題から逆算したDX/AXロードマップを引き、Claude / ChatGPT / Gemini など適切なLLM選定と、Codex・MCP・Skills を組み合わせた実装可能な計画に落とし込みます。",
	path: "/services/ax-dx/",
	keywords: [
		"AX",
		"DX",
		"AX戦略",
		"DX戦略",
		"AIコンサルティング",
		"AI戦略",
		"AIロードマップ",
		"AIネイティブ",
		"エージェントトランスフォーメーション",
		"Claude",
		"ChatGPT",
		"Codex",
		"Gemini",
		"MCP",
		"Claude Skills",
		"現場ディスカバリ",
		"Kuu株式会社",
	],
});

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/", label: "Service" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

const faqs = [
	{
		q: "DX戦略とAX戦略の違いは何ですか？",
		a: "DX（デジタルトランスフォーメーション）は業務・ビジネスモデルのデジタル化全般を指します。AX（エージェントトランスフォーメーション）はその進化形で、AIエージェントが業務を自律的に遂行する状態への移行を意味します。現在のDX推進がRPAやクラウド化だとすれば、AXはAIエージェントが意思決定の一部を担う段階です。Kuuはこの両方を射程に入れたロードマップを設計します。",
	},
	{
		q: "コンサルだけでなく、実装まで対応してもらえますか？",
		a: "はい。Kuuは戦略立案から実装・運用定着まで一貫対応します。「戦略だけ作って終わり」という形は取りません。実装フェーズではKuuのエンジニアチームが直接参画し、クライアントの内製チームと協働することも可能です。",
	},
	{
		q: "業種の制限はありますか？",
		a: "食産業を除く全業種に対応しています。小売・EC、不動産、医療・ヘルスケア、教育、製造業、サービス業、IT・SaaS等が主な対象です。これはKuu社の方針で、食産業はグループ会社UMEZOOが専門的に担当しています。",
	},
	{
		q: "中小企業でも依頼できますか？",
		a: "もちろんです。Kuuはスタートアップから中堅企業まで幅広く支援します。規模に合わせたSMBプランをご用意しており、初期費用を抑えた小さな一歩から始めることができます。「AIを使い始めたいが何から手を付けるべきかわからない」という段階のご相談も歓迎します。",
	},
	{
		q: "既存のDX推進担当者と一緒に進めることはできますか？",
		a: "可能です。むしろ推奨しています。Kuuは丸投げを推奨せず、クライアント内に推進担当者を育てながら進める伴走スタイルを基本としています。プロジェクト終了後に内製化できる状態を目指して設計します。",
	},
];

const BASE_URL = "https://kuucorp.com";

const axDxJsonLd = [
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
		name: "AX/DX戦略・現場ディスカバリ",
		description:
			"経営課題から逆算したDX/AXロードマップ設計と、顧客の業務・既存システムに深く入る現場ディスカバリ。実装可能な計画に落とすまで。",
		provider: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		serviceType: "DXコンサルティング",
		areaServed: "JP",
		url: `${BASE_URL}/services/ax-dx/`,
		keywords: [
			"AX",
			"DX",
			"AI戦略",
			"AIコンサルティング",
			"Claude",
			"ChatGPT",
			"Codex",
			"Gemini",
			"MCP",
			"AIロードマップ",
		],
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
				name: "AX/DX戦略・現場ディスカバリ",
				item: `${BASE_URL}/services/ax-dx/`,
			},
		],
	},
];

export default function AxDxPage() {
	return (
		<>
			<JsonLd data={axDxJsonLd} />
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
						STAGE 01–02 · STRATEGY &amp; DISCOVERY
					</div>

					{/* H1 */}
					<h1 className="page-title fade-in">
						AX/DX戦略・現場ディスカバリ
						<br />
						（経営課題から実装可能な計画へ）
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
								DXやAIの戦略資料は世にあふれています。問題はそこではなく、戦略を「顧客の業務とレガシーシステムに落とせるか」です。AIモデルの優秀さを語るだけで動かないし、現場の業務を知らない外部コンサルが書いた絵は実装段階で破綻します。
							</p>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "1.5rem",
								}}
							>
								DXの失敗は、多くの場合
								<strong style={{ color: "var(--white)" }}>戦略の欠如</strong>
								ではなく
								<strong style={{ color: "var(--white)" }}>
									戦略と現場の断絶
								</strong>
								から始まります。「現行踏襲、でもいい感じにしてくれ」と求める現場と、「最新AI活用」を求める経営層の間には深い溝があり、ここを誰が泥まみれで埋めるかが本質的な問いです。
							</p>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "2rem",
								}}
							>
								Kuuが担うのは、ファネル前半の
								<strong style={{ color: "var(--white)" }}>
									DX/AX戦略（Stage 01）
								</strong>
								と
								<strong style={{ color: "var(--white)" }}>
									現場ディスカバリ（Stage 02）
								</strong>
								。FDE型に顧客の業務・既存システムに深く入り込み、実装可能な計画に落とすまでを担当します。
							</p>
							<div
								style={{
									border: "1px solid var(--gray-dark)",
									borderRadius: "4px",
									padding: "1.5rem 2rem",
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
										"DX戦略を作ったが、現場に浸透しない",
										"IT投資のROIが経営陣に説明できない",
										"AIツールを個別導入したが、連携できておらず非効率",
										"RPAを導入したが、例外処理で人手が離せない",
										"競合他社がAIで生産性を上げている中、自社だけ取り残されそう",
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
								<strong style={{ color: "var(--white)" }}>
									戦略パワポで終わらせない
								</strong>
								——これがKuuの{" "}
								<Link href="/ax/" style={{ color: "var(--gray-light)" }}>
									AX/DX戦略
								</Link>{" "}
								の出発点です。経営課題から逆算したロードマップを引き、
								<Link href="/fde/" style={{ color: "var(--gray-light)" }}>
									FDE型ディスカバリ
								</Link>
								で顧客の業務・既存システム・データ資産に深く入り、Stage
								03以降の実装可能な計画に落とします。
							</p>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "2rem",
								}}
							>
								Kuuがこの仕事を「作って終わり」にしない理由は、ファネル後半（Stage
								03–04：ハーネス実装・ガバナンス運用）も自社で担うからです。実装段階で破綻する計画は、書いた本人が困る。だから現場の制約と「現行踏襲」の要請を、計画段階から織り込みます。
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
										title: "AI活用戦略策定",
										desc: "事業目標を起点にAI活用のロードマップを設計",
									},
									{
										title: "DX推進計画",
										desc: "業務プロセス改革・システム統合の計画と実行",
									},
									{
										title: "AIエージェント活用",
										desc: "カスタマーサポート・文書処理・データ分析等のエージェント自動化",
									},
									{
										title: "内製化支援",
										desc: "担当者育成・ナレッジ移管で自走組織を構築",
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

					{/* 対象業務 */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">
							AIエージェント活用の対象範囲
						</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
									marginBottom: "2rem",
								}}
							>
								AIエージェントによる自動化は、ほぼすべてのバックオフィス・フロントオフィス業務に適用できます。Kuuが支援してきた主な業務領域は以下の通りです。
							</p>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "0",
								}}
							>
								{[
									"カスタマーサポートの自動応答・エスカレーション",
									"社内Q&A・ナレッジ検索の自動化",
									"契約書・報告書・提案書の自動生成",
									"データ入力・転記・集計の自動化",
									"マーケティングコンテンツの生成・配信",
									"採用・応募者スクリーニングの補助",
									"在庫・発注管理の予測・自動化",
									"社内承認フローの自動化",
								].map((item) => (
									<div
										key={item}
										style={{
											padding: "1rem 1.25rem",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{item}
									</div>
								))}
							</div>
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>

					{/* プロセス */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">進め方</h2>
						<div className="fade-in" style={{ maxWidth: "720px" }}>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{[
									{
										step: "01",
										title: "経営課題・事業目標のヒアリング",
										desc: "DXやAI活用の目的を事業目標に紐付けます。「売上○%向上」「業務工数○%削減」など、具体的なKPIを経営者・担当者と共に設定します。",
									},
									{
										step: "02",
										title: "現状の業務・システム分析",
										desc: "主要業務フロー・既存システム・データ資産を調査します。「AIが最も効果を発揮できる業務」を優先順位付けし、クイックウィンの機会を特定します。",
									},
									{
										step: "03",
										title: "AX/DX戦略・ロードマップ設計",
										desc: "調査結果をもとに3〜12ヶ月のロードマップを設計します。フェーズごとの投資・成果・リスクを明示し、経営陣が判断できる形で提示します。",
									},
									{
										step: "04",
										title: "パイロット実装・検証",
										desc: "優先度の高い業務から小さく実装し、効果を検証します。クライアントの担当者と協働し、現場の受け入れ体制を同時に整えます。",
									},
									{
										step: "05",
										title: "展開・内製化支援",
										desc: "成果を確認しながら本番展開を進めます。担当者向けのトレーニング・マニュアル整備・ナレッジ移管を通じて、自走できる組織体制を構築します。",
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
								DX・AI活用の方向性を一緒に考えます。まずはご相談ください。
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
