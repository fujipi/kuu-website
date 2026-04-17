import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllPosts } from "@/lib/mdx";
import { generateMetadata as seoMetadata } from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/pricing/", label: "Pricing" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";
const URL = `${BASE_URL}/managed-agents/`;

export const metadata: Metadata = seoMetadata({
	title: "Managed Agents 実装ガイド——中小企業のAIエージェント外部委託 | Kuu株式会社",
	description:
		"Managed Agentsとは何か、導入プロセス、SLA設計、内製との比較、費用相場、委託範囲の決め方まで。エンジニア不在の中小企業がAIエージェントを安全に運用するための実務ガイド。",
	path: "/managed-agents/",
});

const tocItems = [
	{ id: "definition", label: "Managed Agents とは" },
	{ id: "vs-inhouse", label: "内製 vs 外部委託の判断軸" },
	{ id: "scope", label: "委託範囲の分解方法" },
	{ id: "sla", label: "SLA設計の勘所" },
	{ id: "cost", label: "費用相場と内訳" },
	{ id: "adoption", label: "導入 6ステップ" },
	{ id: "faq", label: "よくある質問" },
];

const faqs = [
	{
		q: "Managed Agents と単なるAI開発外注は何が違いますか？",
		a: "AI開発外注は納品で関係が終わりますが、Managed Agents は「運用・評価・改善」までを継続契約で担う点が本質的な違いです。LLMバージョン更新・業務変化・規制改定に伴う継続的な再設計が必要なAIエージェントは、納品型では品質維持できないため、継続運用型のモデルが広がっています。",
	},
	{
		q: "社内にエンジニアがいなくても発注できますか？",
		a: "発注・評価の仕組みさえ整えば可能です。むしろ社内にAI人材がいない中小企業こそ Managed Agents の主要顧客層です。Kuuでは「発注側KPI」のテンプレートを提供し、非エンジニアの担当者でも品質評価と予算管理を回せる形にしています。",
	},
	{
		q: "費用はいくらくらいかかりますか？",
		a: "エージェントの複雑度と運用頻度で変動しますが、初期構築50-200万円、月額運用20-100万円が一般的な相場です。Kuuのプラン例は/pricing/をご確認ください。LLM API費は実費で別途、使用量に応じて変動します。",
	},
	{
		q: "委託すると社内にノウハウが残らないのでは？",
		a: "Kuuの契約では運用ドキュメント・設計仕様・プロンプト履歴が納品物として発注者側に帰属します。さらに月次レビューに発注者側担当者が参加する運用で、継続的にナレッジを内部に蓄積できる設計にしています。",
	},
	{
		q: "エージェントを自社運用に戻すことはできますか？",
		a: "可能です。契約終了時には運用マニュアル・モデル設定・監視スクリプトを引き渡します。2-3ヶ月の移行支援期間を設けるケースが一般的で、急な切り替えによるサービス断が発生しない形で段階移行できます。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: "Managed Agents 実装ガイド——中小企業のAIエージェント外部委託",
		description:
			"Managed Agentsの定義・内製比較・SLA設計・費用相場・導入ステップを中小企業向けに解説。",
		author: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
		},
		publisher: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${BASE_URL}/images/favicon-192.png`,
			},
		},
		datePublished: "2026-04-17",
		dateModified: "2026-04-17",
		mainEntityOfPage: { "@type": "WebPage", "@id": URL },
		url: URL,
		inLanguage: "ja",
		articleSection: "Pillar",
		keywords:
			"Managed Agents, AIエージェント 外部委託, AI運用 BPO, 中小企業, SLA, エージェントガバナンス",
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
		"@type": "HowTo",
		name: "Managed Agents 導入 6ステップ",
		description: "中小企業がManaged Agentsサービスを活用してAIエージェントを導入する実践ステップ",
		step: [
			{
				"@type": "HowToStep",
				position: 1,
				name: "業務プロセス棚卸し",
				text: "AIエージェント化の候補となる業務を洗い出し、頻度・難易度・機密度でスコアリングする。",
			},
			{
				"@type": "HowToStep",
				position: 2,
				name: "委託範囲の決定",
				text: "設計・開発・運用・改善のどこまでを外部に委ねるか、社内に残す判断ポイントを明文化する。",
			},
			{
				"@type": "HowToStep",
				position: 3,
				name: "SLAとKPI設定",
				text: "応答時間・精度・稼働率・セキュリティ要件・料金連動のSLAを双方合意で設計する。",
			},
			{
				"@type": "HowToStep",
				position: 4,
				name: "PoC実装と評価",
				text: "小規模業務で2-4週間のPoCを実施し、9軸評価スコアで効果を定量化する。",
			},
			{
				"@type": "HowToStep",
				position: 5,
				name: "本番運用開始",
				text: "監視体制・インシデント対応フロー・月次レビューを立ち上げ、本番エージェントを運用開始する。",
			},
			{
				"@type": "HowToStep",
				position: 6,
				name: "継続改善と拡張",
				text: "四半期ごとに効果検証とロードマップ見直し、追加エージェントの横展開を判断する。",
			},
		],
	},
	{
		"@context": "https://schema.org",
		"@type": "Service",
		serviceType: "Managed AI Agents",
		name: "Managed Agents",
		provider: { "@type": "Organization", name: "Kuu株式会社", url: BASE_URL },
		areaServed: { "@type": "Country", name: "Japan" },
		description:
			"AIエージェントの設計・開発・運用・改善を継続契約で外部委託する Managed Agents サービス。中小企業向け。",
		url: URL,
	},
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
			{
				"@type": "ListItem",
				position: 2,
				name: "Managed Agents",
				item: URL,
			},
		],
	},
];

export default function ManagedAgentsPillarPage() {
	const allPosts = getAllPosts();
	const relatedSlugs = [
		"ai-agent-managed-intro",
		"managed-agents-cost-benefit",
		"agent-governance-framework",
		"ai-agent-roi-measurement",
		"multi-agent-architecture-sme",
	];
	const cluster = relatedSlugs
		.map((s) => allPosts.find((p) => p.slug === s))
		.filter((p): p is NonNullable<typeof p> => !!p);

	return (
		<>
			<JsonLd data={jsonLd} />
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
						<span>Managed Agents</span>
					</nav>

					<h1
						className="fade-in"
						style={{
							fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
							fontWeight: 500,
							lineHeight: "1.5",
							marginBottom: "1rem",
						}}
					>
						Managed Agents 実装ガイド——中小企業のAIエージェント外部委託
					</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.75rem",
							color: "var(--gray-dim)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							marginBottom: "2.5rem",
						}}
					>
						Last updated: 2026-04-17 · 約 14 分で読めます
					</p>

					{/* Direct Answer Block (GEO) */}
					<div
						className="fade-in"
						style={{
							border: "1px solid var(--gray-dark)",
							padding: "1.5rem",
							borderRadius: "6px",
							marginBottom: "3rem",
							background: "rgba(255,255,255,0.02)",
							maxWidth: "760px",
						}}
					>
						<div
							style={{
								fontSize: "0.65rem",
								color: "var(--gray-dim)",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.1em",
								marginBottom: "0.75rem",
							}}
						>
							ANSWER
						</div>
						<p
							style={{
								fontSize: "0.95rem",
								color: "var(--gray-light)",
								lineHeight: "2",
							}}
						>
							Managed
							Agentsは、AIエージェントの設計・運用・改善を継続契約で外部委託する実装モデルです。社内にAI人材を持たない中小企業が、エージェントの品質劣化を防ぎながら安全に業務展開するための現実解として2025年以降急速に広がりました。初期50-200万円・月額20-100万円を相場に、SLAと9軸評価を組み合わせた発注が標準化しています。
						</p>
					</div>

					<nav
						className="fade-in"
						aria-label="目次"
						style={{
							border: "1px solid var(--gray-dark)",
							borderRadius: "4px",
							padding: "1.25rem 1.5rem",
							marginBottom: "3rem",
							maxWidth: "520px",
						}}
					>
						<div
							style={{
								fontSize: "0.65rem",
								color: "var(--gray-dim)",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.1em",
								marginBottom: "0.75rem",
							}}
						>
							TABLE OF CONTENTS
						</div>
						<ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
							{tocItems.map((i) => (
								<li
									key={i.id}
									style={{
										marginBottom: "0.4rem",
										fontSize: "0.82rem",
										lineHeight: "1.5",
									}}
								>
									<a href={`#${i.id}`} style={{ color: "var(--gray-light)" }}>
										{i.label}
									</a>
								</li>
							))}
						</ol>
					</nav>

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "4rem" }}
					>
						<h2 id="definition">Managed Agents とは</h2>
						<p>
							Managed Agentsは「AIエージェントのマネージドサービス」を表す概念で、設計・開発・運用・改善の全工程を外部パートナーが継続的に担います。SaaSが「パッケージ化されたソフトウェア」をサービスとして提供するのに対し、Managed
							Agentsは「個社固有の業務に最適化したエージェント」を、継続する運用責任付きで提供します。詳しい定義は用語集の{" "}
							<Link href="/glossary/managed-agents/">Managed Agents</Link>{" "}
							を参照してください。
						</p>
						<p>
							2024年までは大企業向けのBPO的文脈が中心でしたが、2025年以降は中小企業向けに標準プラン化が進み、社内にエンジニアがいない組織でも発注できる仕組みに成熟しています。背景には、LLMのバージョンアップ頻度が加速し、納品型の開発では品質維持できない現実があります。
						</p>

						<h2 id="vs-inhouse">内製 vs 外部委託の判断軸</h2>
						<p>
							内製と外部委託の選択は、以下の3軸で判断します。社内にAI人材がいない中小企業では、初期は外部委託が合理的です。
						</p>
						<ul>
							<li>
								<strong>業務の競争優位性</strong>:
								コアプロセスに直結する場合は内製志向。バックオフィス・定型業務は外部委託が合理的
							</li>
							<li>
								<strong>更新頻度</strong>:
								月次以上の継続改善が必要なら外部委託、年次以下なら納品型も選択肢
							</li>
							<li>
								<strong>社内AI人材の有無</strong>:
								0-1名なら外部委託、3名以上なら内製可能圏
							</li>
						</ul>
						<p>
							「全部内製」「全部外部」の二者択一ではなく、エージェント単位・業務単位でハイブリッド設計するのが実務の正解です。
						</p>

						<h2 id="scope">委託範囲の分解方法</h2>
						<p>
							Managed Agents の委託範囲は以下の6レイヤに分解して合意します。どこまでを外部、どこを社内に残すかを明示することで、契約後のトラブルを防げます。
						</p>
						<ol>
							<li>
								<strong>業務設計</strong>:
								何をAIエージェント化するか、成果指標は何か
							</li>
							<li>
								<strong>プロンプト/エージェント設計</strong>:
								LLM選定・プロンプト・ツール連携の実装
							</li>
							<li>
								<strong>インフラ運用</strong>:
								ホスティング・監視・ログ収集・インシデント対応
							</li>
							<li>
								<strong>品質評価</strong>:
								9軸スコアリング、回帰テスト、ユーザFB集約
							</li>
							<li>
								<strong>継続改善</strong>:
								プロンプト改訂、モデル更新、機能追加
							</li>
							<li>
								<strong>ガバナンス・監査</strong>:
								セキュリティ監査、規程整備、経営報告
							</li>
						</ol>

						<h2 id="sla">SLA設計の勘所</h2>
						<p>
							Managed AgentsのSLAは、従来のITサービスSLAとは異なる特殊性があります。AI出力の「品質」は一意に測れないため、複数指標の組み合わせで評価するのが標準です。
						</p>
						<ul>
							<li>
								<strong>応答時間</strong>: p95 レスポンスタイム
								(例: 5秒以内95%)
							</li>
							<li>
								<strong>稼働率</strong>: 月間稼働率 99.5%以上
							</li>
							<li>
								<strong>品質スコア</strong>:
								9軸平均3.5点以上。月次評価で料金連動の設計も可
							</li>
							<li>
								<strong>インシデント対応</strong>:
								重大障害1時間以内初動・4時間以内復旧
							</li>
							<li>
								<strong>セキュリティ</strong>:
								機密情報送信禁止・暗号化通信・監査ログ90日保管
							</li>
						</ul>

						<h2 id="cost">費用相場と内訳</h2>
						<p>
							2026年時点の中小企業向けManaged Agentsの相場は以下の通りです。エージェントの本数・複雑度・SLAレベルで変動します。
						</p>
						<ul>
							<li>
								<strong>初期構築</strong>: 50-200万円 (PoC含む)
							</li>
							<li>
								<strong>月額運用</strong>: 20-100万円
								(エージェント本数・KPIレビュー頻度で変動)
							</li>
							<li>
								<strong>LLM API費</strong>:
								実費別途。利用量連動で月額1-20万円程度が多い
							</li>
							<li>
								<strong>追加開発</strong>: 機能追加は都度見積または工数予算方式
							</li>
						</ul>
						<p>
							Kuuのプラン別料金は <Link href="/pricing/">料金プラン</Link>{" "}
							でご確認ください。詳細な費用対効果は{" "}
							<Link href="/blog/managed-agents-cost-benefit/">
								Managed Agents の費用対効果
							</Link>{" "}
							で解説しています。
						</p>

						<h2 id="adoption">導入 6ステップ</h2>
						<ol>
							<li>
								<strong>業務プロセス棚卸し</strong>:
								AI化候補業務の洗い出しとスコアリング
							</li>
							<li>
								<strong>委託範囲の決定</strong>:
								6レイヤでの内外分担を明文化
							</li>
							<li>
								<strong>SLA/KPI設定</strong>:
								応答時間・精度・稼働率・料金連動を合意
							</li>
							<li>
								<strong>PoC実装と評価</strong>:
								2-4週間の小規模検証、9軸で効果定量化
							</li>
							<li>
								<strong>本番運用開始</strong>:
								監視・インシデント対応・月次レビューの立ち上げ
							</li>
							<li>
								<strong>継続改善と拡張</strong>:
								四半期ロードマップ、追加エージェントの横展開
							</li>
						</ol>

						<h2 id="faq">よくある質問</h2>
						{faqs.map((f) => (
							<div key={f.q} style={{ marginBottom: "1.25rem" }}>
								<p>
									<strong>Q. {f.q}</strong>
								</p>
								<p>A. {f.a}</p>
							</div>
						))}

						<h2>まとめ</h2>
						<p>
							Managed Agentsは、AIエージェントの継続的な品質劣化を防ぎながら中小企業が現実的に運用するための標準モデルです。内製・外部委託を極端に捉えず、業務単位でハイブリッド設計する視点が成功の分かれ目になります。
						</p>
						<p>
							エージェントガバナンスとの関係は{" "}
							<Link href="/ai-governance/">エージェントガバナンス完全ガイド</Link>
							、サービス詳細は{" "}
							<Link href="https://kuucorp.com/services/ai-ops/">
								AIエージェントガバナンスサービス
							</Link>
							、個別相談は <Link href="/contact/">無料相談</Link>{" "}
							からお問い合わせください。
						</p>
					</article>

					<section
						className="fade-in"
						style={{ maxWidth: "760px", marginBottom: "3rem" }}
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
							RELATED ARTICLES
						</h2>
						<div style={{ display: "flex", flexDirection: "column" }}>
							{cluster.map((p) => (
								<Link
									key={p.slug}
									href={`/blog/${p.slug}/`}
									style={{
										padding: "1rem 0",
										borderTop: "1px solid var(--gray-dark)",
										fontSize: "0.9rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
									}}
								>
									{p.title}
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</>
	);
}
