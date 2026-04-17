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
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/glossary/", label: "Glossary" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";
const URL = `${BASE_URL}/ai-governance/`;

export const metadata: Metadata = seoMetadata({
	title: "エージェントガバナンスとは——中小企業向け完全ガイド | Kuu株式会社",
	description:
		"AIエージェントガバナンスの定義から9軸評価、EU AI Act・ISO 42001 対応、体制構築5ステップまで。中小企業の経営者・IT担当者が実装に使える決定版ガイド。",
	path: "/ai-governance/",
});

const tocItems = [
	{ id: "definition", label: "エージェントガバナンスとは" },
	{ id: "why-now", label: "なぜ今、中小企業に必要か" },
	{ id: "9axis", label: "9軸評価フレームワーク" },
	{ id: "5steps", label: "体制構築の5ステップ" },
	{ id: "regulations", label: "EU AI Act / ISO 42001 との関係" },
	{ id: "faq", label: "よくある質問" },
];

const faqs = [
	{
		q: "エージェントガバナンスと従来のAIガバナンスの違いは？",
		a: "AIガバナンスがモデル単位の倫理・リスク管理を主眼とするのに対し、エージェントガバナンスは自律的に動く複数のAIエージェントの運用統制を含みます。承認フロー・権限・ログ監査・継続改善まで、運用ライフサイクル全体を扱う点が特徴です。",
	},
	{
		q: "社内にAI人材がいないとエージェントガバナンスは始められませんか？",
		a: "いいえ。ガバナンス自体は経営管理の枠組みであり、技術人材よりも意思決定者のコミットが重要です。実装部分は Managed Agents 型のサービス活用で外部化できます。中小企業の多くは外部パートナーと並走する形で体制を立ち上げています。",
	},
	{
		q: "エージェントの本数が少ないうちから必要ですか？",
		a: "1-2本では属人的な管理でも回りますが、「3本目」で設計しておくと移行コストが最小になります。5本を超えてから体制を後付けすると、既存エージェントの棚卸しと再設計に想定以上の工数がかかるのが実情です。",
	},
	{
		q: "ROI をどう示せば経営層に説明できますか？",
		a: "直接効果 (工数削減時間×時給) だけでなく、間接効果 (品質ばらつきの低減、属人化解消、インシデント予防) を定量化するのが鍵です。9軸評価のスコア推移をダッシュボード化すると、経営会議での定期報告がしやすくなります。",
	},
	{
		q: "EU AI Act や ISO 42001 への対応は必須ですか？",
		a: "国内で閉じたBtoC事業なら今すぐの必須ではありませんが、EU顧客・取引先・親会社がある場合や、上場・調達を視野に入れる場合は早期対応が合理的です。ガバナンス体制の設計要素はこれらの規制要件と大きく重なるため、同時に整備するのが効率的です。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: "エージェントガバナンスとは——中小企業向け完全ガイド",
		description:
			"AIエージェントガバナンスの定義・9軸評価・EU AI Act / ISO 42001 対応・体制構築5ステップを中小企業向けに解説。",
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
			"エージェントガバナンス, AIエージェント, Managed Agents, 中小企業, EU AI Act, ISO 42001",
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".answer-block"],
		},
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
		name: "エージェントガバナンス体制構築 5ステップ",
		description:
			"中小企業がエージェントガバナンス体制を構築するための実践的なステップ",
		step: [
			{
				"@type": "HowToStep",
				position: 1,
				name: "エージェント台帳の作成",
				text: "現在稼働中の全エージェント・生成AI利用を可視化し、業務・責任者・コストをまとめた台帳を作る。",
			},
			{
				"@type": "HowToStep",
				position: 2,
				name: "9軸評価の初期実施",
				text: "正確性・安全性・速度・コスト等の9軸でエージェントごとにスコアリングし、改善対象を特定する。",
			},
			{
				"@type": "HowToStep",
				position: 3,
				name: "利用規程と承認フローの策定",
				text: "シャドーAIを防ぐため、利用可能ツール・入力禁止情報・新規導入承認フローを明文化する。",
			},
			{
				"@type": "HowToStep",
				position: 4,
				name: "モニタリングと定例レビューの開始",
				text: "月次で利用量・品質指標・インシデントをレビューし、改善アクションを決める体制を回す。",
			},
			{
				"@type": "HowToStep",
				position: 5,
				name: "外部規格との接続",
				text: "ISO 42001・EU AI Act の要素を段階的に取り込み、取引先や監督官庁への説明力を高める。",
			},
		],
	},
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
			{
				"@type": "ListItem",
				position: 2,
				name: "エージェントガバナンス",
				item: URL,
			},
		],
	},
];

export default function AiGovernancePillarPage() {
	const allPosts = getAllPosts();
	const relatedSlugs = [
		"agent-governance-framework",
		"why-agent-governance",
		"ai-agent-managed-intro",
		"multi-agent-architecture-sme",
		"ai-agent-roi-measurement",
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
						<span>Agent Governance</span>
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
						エージェントガバナンスとは——中小企業向け完全ガイド
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
						Last updated: 2026-04-17 · 約 12 分で読めます
					</p>

					{/* Direct Answer Block (GEO/AEO: Speakable対象) */}
					<div
						className="fade-in answer-block"
						style={{ marginBottom: "3rem", maxWidth: "760px" }}
					>
						<p>
							エージェントガバナンスとは、組織内で稼働する複数のAIエージェントを設計・管理・評価・改善する体系的な仕組みです。中小企業では「3本目のエージェント」を導入する前後に整備を始めると、属人化と品質劣化を防ぎながら全社展開に進めます。Kuu株式会社は9軸評価フレームワークと
							Managed Agents
							モデルで、エンジニア不在の組織でも実装可能な体制構築を支援しています。
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
						<h2 id="definition">エージェントガバナンスとは</h2>
						<p>
							エージェントガバナンスは、組織内で稼働する複数のAIエージェントを一貫して統制・改善する経営機能です。AIエージェントは「入れっぱなし」では業務変化とモデル更新によって静かに劣化するため、品質・コスト・リスクを継続的に測定し、改善ループを回す必要があります。単発のツール導入ではなく、経営の定期議題に組み込まれる仕組みとして設計します。
						</p>
						<p>
							従来の「AIガバナンス」が主にモデル単位の倫理・安全性を扱うのに対し、エージェントガバナンスは自律的に動くエージェントの承認・権限・ログ監査・廃止判断までを含みます。詳しい定義は用語集の{" "}
							<Link href="/glossary/agent-governance/">
								エージェントガバナンス
							</Link>{" "}
							を参照してください。
						</p>

						<h2 id="why-now">なぜ今、中小企業に必要か</h2>
						<p>
							大企業向けの話に聞こえるかもしれませんが、中小企業こそ早期整備の効果が大きいテーマです。理由は3つあります。
						</p>
						<ul>
							<li>
								<strong>人的リソースが限られる</strong>
								ため、属人化したエージェント管理は担当者退職で一瞬で崩れる
							</li>
							<li>
								<strong>シャドーAI</strong>
								の発生率が高く、情報漏洩リスクが経営直結になる (
								<Link href="/glossary/shadow-ai/">用語集</Link>)
							</li>
							<li>
								<strong>取引先・補助金審査</strong>
								で「AI利用の統制状況」を問われるケースが2026年から増えている
							</li>
						</ul>
						<p>
							3本目のエージェントを導入する前後が、体制整備の最適なタイミングです。5本を超えてからの後付け整備は、既存資産の棚卸しと再設計に数ヶ月を要します。
						</p>

						<h2 id="9axis">9軸評価フレームワーク</h2>
						<p>
							Kuu株式会社が中小企業向けに提供する9軸評価は、エージェントを以下の観点でスコアリングします。
						</p>
						<ol>
							<li>正確性 (出力の正しさ)</li>
							<li>安全性 (情報漏洩・ハルシネーション)</li>
							<li>速度 (応答時間・スループット)</li>
							<li>コスト (API費 + 人的監視)</li>
							<li>可観測性 (ログ・モニタリング整備度)</li>
							<li>保守性 (プロンプト・仕様の文書化)</li>
							<li>スケーラビリティ (負荷耐性・水平展開)</li>
							<li>ユーザ受容性 (利用率・満足度)</li>
							<li>規制適合性 (EU AI Act / ISO 42001 対応度)</li>
						</ol>
						<p>
							各軸を1-5点でスコアリングし、経営ダッシュボードで推移を可視化します。詳細は{" "}
							<Link href="/blog/ai-agent-roi-measurement/">
								AIエージェントのROIをどう測るか
							</Link>{" "}
							で解説しています。
						</p>

						<h2 id="5steps">体制構築の5ステップ</h2>
						<ol>
							<li>
								<strong>エージェント台帳の作成</strong>:
								業務・責任者・コスト・接続先システムを一覧化
							</li>
							<li>
								<strong>9軸評価の初期実施</strong>:
								現状スコアを可視化し、改善対象を特定
							</li>
							<li>
								<strong>利用規程と承認フローの策定</strong>:
								シャドーAI防止と新規導入の標準化
							</li>
							<li>
								<strong>モニタリングと定例レビュー</strong>:
								月次・四半期の改善ループを回す
							</li>
							<li>
								<strong>外部規格との接続</strong>: ISO 42001 / EU AI Act
								要素を段階的に統合
							</li>
						</ol>

						<h2 id="regulations">EU AI Act / ISO 42001 との関係</h2>
						<p>
							2026年以降、EU AI Act の段階施行と ISO/IEC 42001
							認証の広がりで、AI利用企業への説明責任は急速に高まります。日本国内の中小企業でも、以下の場合は対応を求められます。
						</p>
						<ul>
							<li>EU域内の顧客・従業員に対しAIを提供・利用している</li>
							<li>
								欧州の親会社・取引先からコンプライアンス対応を求められている
							</li>
							<li>上場準備・大型調達で第三者のデューデリジェンスを受ける</li>
						</ul>
						<p>
							詳細は用語集の <Link href="/glossary/eu-ai-act/">EU AI Act</Link>{" "}
							と <Link href="/glossary/iso-42001/">ISO/IEC 42001</Link>{" "}
							を参照してください。
						</p>

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
							エージェントガバナンスは「後からでいい」テーマではなく、3本目のエージェント導入前後で始めるべき経営機能です。Kuu株式会社は9軸評価と
							Managed Agents
							モデルで、社内にAI人材を持たない中小企業でも現実的に体制を立ち上げられる設計にしています。
						</p>
						<p>
							具体的な導入方法、料金、サポート範囲については{" "}
							<Link href="/services/ai-ops/">サービス詳細</Link>、
							<Link href="/pricing/">料金プラン</Link>、または{" "}
							<Link href="/contact/">無料相談</Link> をご覧ください。
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
