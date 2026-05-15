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
	{ href: "/services/", label: "Service" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/glossary/", label: "Glossary" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";
const URL = `${BASE_URL}/fde/`;

export const metadata: Metadata = seoMetadata({
	title:
		"FDE（Forward Deployed Engineer）とは——日本企業のAIエージェント導入における新しい役割 | Kuu株式会社",
	description:
		"FDEは顧客現場に深く入り自社製品を実装可能な形に翻訳する実装責任者。日本企業のAIエージェント導入で必要になる理由、SI・コンサルとの違い、進め方、人材調達まで完全ガイド。",
	path: "/fde/",
});

const tocItems = [
	{ id: "definition", label: "FDEとは" },
	{ id: "why-japan", label: "なぜ日本企業にFDEが必要か" },
	{ id: "vs-si", label: "FDEとSI・コンサルの違い" },
	{ id: "process", label: "FDE型ディスカバリの進め方" },
	{ id: "recruitment", label: "FDE人材の調達——採用・内製・委託" },
	{ id: "faq", label: "よくある質問" },
];

const faqs = [
	{
		q: "FDEは何の略ですか？",
		a: "Forward Deployed Engineer の略です。直訳すると「前線配備エンジニア」。Palantirが2010年代に確立した役割で、顧客現場に深く入り込んで自社製品を実装可能な形まで翻訳する実装責任者を指します。OpenAI・Anthropic等の主要AIスタートアップが2024年以降に大規模採用を開始しています。",
	},
	{
		q: "FDEとSIエンジニア、コンサルタントの違いは？",
		a: "SIエンジニアは顧客の要件定義に従って中立的に作る存在です。コンサルタントは戦略を書くが実装はしません。FDEは自社製品（AIエージェント等）を前提に、顧客のユースケースを翻訳し、戦略から実装まで通して動くものを残す点が特徴です。3者の中間に位置する役割と言えます。",
	},
	{
		q: "日本企業もFDEを採用すべきですか？",
		a: "全企業に必要ではなく、AIエージェントを「製品として売る」企業や「複数顧客に深く実装する」事業者には必須に近づきます。一方、自社内でAIを使う一般企業は、FDE的な役割を担える外部パートナーを選ぶ方が現実的です。Kuuは後者向けにFDE型ディスカバリを提供しています。",
	},
	{
		q: "FDEを採用するには何が必要ですか？",
		a: "技術力（AI/LLM・既存システム統合・データ）と顧客ドメイン理解の両方が求められるため、採用は極めて困難です。年収レンジは1500-3000万円が中心。多くの日本企業にとっては、FDE型の実装ができる外部パートナーと組む方が現実的な選択です。",
	},
	{
		q: "FDE型ディスカバリには何日かかりますか？",
		a: "規模により異なりますが、Kuuの場合は典型的に2-4週間です。経営層・現場・IT部門のヒアリング、業務フローと既存システムの調査、優先ユースケースの特定、実装可能性評価までを含みます。この段階で「実装してはいけない領域」も明らかにします。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline:
			"FDE（Forward Deployed Engineer）とは——日本企業のAIエージェント導入における新しい役割",
		description:
			"FDEの定義、日本での必要性、SI・コンサルとの違い、進め方、人材調達まで完全解説。",
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
		datePublished: "2026-05-14",
		dateModified: "2026-05-14",
		mainEntityOfPage: { "@type": "WebPage", "@id": URL },
		url: URL,
		inLanguage: "ja",
		articleSection: "Pillar",
		keywords:
			"FDE, Forward Deployed Engineer, 日本, 中小企業, AIエージェント, 実装, ディスカバリ, Palantir, OpenAI, Anthropic",
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
		name: "FDE型ディスカバリ 5ステップ",
		description:
			"FDE型に顧客の業務とシステムに深く入り、実装可能な計画に落とすまでの実践プロセス",
		step: [
			{
				"@type": "HowToStep",
				position: 1,
				name: "経営課題と事業目標のヒアリング",
				text: "経営層と直接対話し、AIエージェント導入で達成したい事業KPIを定義する。",
			},
			{
				"@type": "HowToStep",
				position: 2,
				name: "現場業務フローの観察",
				text: "実際の業務担当者の作業を観察し、暗黙知・例外処理・現行踏襲の要請を把握する。",
			},
			{
				"@type": "HowToStep",
				position: 3,
				name: "既存システムの調査",
				text: "API有無・データ構造・認証方式・運用主体を確認し、接続可能性を評価する。",
			},
			{
				"@type": "HowToStep",
				position: 4,
				name: "優先ユースケースの特定と実装可能性評価",
				text: "費用対効果と実装難易度の二軸で候補をスコアリングし、最初に手をつける1-2件を選ぶ。",
			},
			{
				"@type": "HowToStep",
				position: 5,
				name: "実装計画とPoCスコープの確定",
				text: "4-8週間のPoCで何を検証するかを定義し、本格展開への移行基準を経営層と合意する。",
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
				name: "FDE（Forward Deployed Engineer）",
				item: URL,
			},
		],
	},
];

export default function FdePillarPage() {
	const allPosts = getAllPosts();
	const relatedSlugs = [
		"ax-dx-difference-guide",
		"agent-governance-framework",
		"why-agent-governance",
		"ai-agent-managed-intro",
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
						<span>FDE</span>
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
						FDE（Forward Deployed Engineer）とは——
						<br />
						日本企業のAIエージェント導入における新しい役割
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
						Last updated: 2026-05-14 · 約 11 分で読めます
					</p>

					<div
						className="fade-in answer-block"
						style={{ marginBottom: "3rem", maxWidth: "760px" }}
					>
						<p>
							FDEは顧客現場に深く入り自社製品を実装可能な形に翻訳する実装責任者です。Palantir発祥でOpenAI・Anthropicが2024年から大規模採用を開始。日本企業のAIエージェント導入では、SIでもコンサルでもない「動くものを届ける」役割としてKuuがFDE型ディスカバリを提供しています。
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
						<h2 id="definition">FDEとは</h2>
						<p>
							FDE（Forward Deployed Engineer）は、自社製品を
							<strong>
								顧客の業務とシステムに「実装可能な形」まで翻訳する
							</strong>
							実装責任者です。直訳すれば「前線配備エンジニア」。Palantirが2010年代にこの役割を確立し、ビッグデータプラットフォームを米国政府機関や大企業に実装する際の標準的職種としました。
						</p>
						<p>
							2024年以降、OpenAI・Anthropic・Sierraなど主要AIスタートアップが
							FDE
							の大規模採用を開始。LLM/エージェント製品が「モデルの優秀さだけでは売れない」段階に入ったことが背景です。詳しい定義は用語集の{" "}
							<Link href="/glossary/forward-deployed-engineer/">
								Forward Deployed Engineer
							</Link>{" "}
							を参照してください。
						</p>

						<h2 id="why-japan">なぜ日本企業にFDEが必要か</h2>
						<p>
							AIエージェントの導入は「モデルが優秀だから売れる」段階を終えました。コモディティ化したAI製品は、
							<strong>顧客の業務とレガシーシステムにどう接続するか</strong>
							というラストワンマイル問題に焦点が移っています。
						</p>
						<p>
							これは新しい話ではなく、30年以上前から IBM・富士通・日立といった
							SI
							ベンダーが歩んだ道です。製品がコモディティ化する→マス向け営業では売れなくなる→エンタープライズ特化と「ラストワンマイル」を解く組織が必要になる→特定顧客の特定ユースケースを深掘りして動くもんを作る役割が立ち上がる、というパターン。
						</p>
						<p>
							日本企業のAIエージェント導入で重要なのは、現場が
							<strong>「現行踏襲、でもいい感じにしてくれ」</strong>
							と求めることです。最新AIの優秀さを語る FDE ではなく、
							<strong>
								顧客の腐ったレガシーシステムを理解して泥まみれで動くもの
							</strong>
							を作れる FDE が必要になります。
						</p>

						<h2 id="vs-si">FDEとSI・コンサルの違い</h2>
						<p>3者の役割を比較すると、FDE の独自性が見えます。</p>
						<ul>
							<li>
								<strong>SIエンジニア</strong>:
								顧客の要件定義に従って中立的に作る。製品は要件次第。納品で関係終了
							</li>
							<li>
								<strong>コンサルタント</strong>:
								戦略を書く。実装はしない。パワポと提案書で終わる
							</li>
							<li>
								<strong>FDE</strong>:
								自社製品（AIエージェント等）を前提に、顧客のユースケースを翻訳。戦略から実装まで通して動くものを残す
							</li>
						</ul>
						<p>
							典型的なFDEのワークフローは：顧客とのキックオフ → 業務観察 →
							既存システム理解 → ユースケース特定 → PoC実装 → 本番展開 →
							運用引き継ぎ。コンサルとSIの仕事の「中間にある仕事」を一人で担います。
						</p>

						<h2 id="process">FDE型ディスカバリの進め方</h2>
						<p>
							Kuu株式会社が中小企業向けに提供する FDE
							型ディスカバリは、以下の5ステップで進めます。
						</p>
						<ol>
							<li>
								<strong>経営課題と事業目標のヒアリング</strong>:
								経営層と直接対話し、AI導入で達成すべき事業KPIを定義
							</li>
							<li>
								<strong>現場業務フローの観察</strong>:
								実際の作業を観察し、暗黙知・例外・現行踏襲の要請を把握
							</li>
							<li>
								<strong>既存システムの調査</strong>:
								API・データ構造・認証方式・運用主体を確認し、接続可能性を評価
							</li>
							<li>
								<strong>優先ユースケースの特定</strong>:
								費用対効果と実装難易度の二軸で候補をスコアリング
							</li>
							<li>
								<strong>実装計画とPoCスコープの確定</strong>:
								4-8週間のPoCで何を検証するか、本格展開への移行基準を経営層と合意
							</li>
						</ol>
						<p>
							この段階で
							<strong>「実装してはいけない領域」も明らかに</strong>
							します。AIで自動化すべきでない業務、データ整備が先に必要な業務、組織変革が先行すべき業務などを線引きすることが、後段の実装成功率を大きく左右します。
						</p>

						<h2 id="recruitment">FDE人材の調達——採用・内製・委託</h2>
						<p>
							FDE
							人材は、技術力（AI/LLM・既存システム統合・データ）と顧客ドメイン理解の両方が求められるため、採用は極めて困難です。年収レンジは米国で約25-50万ドル、日本でも1500-3000万円が中心。中小企業が単独採用するのは現実的ではありません。
						</p>
						<p>選択肢は3つあります。</p>
						<ul>
							<li>
								<strong>採用</strong>:
								自社で雇う。年収レンジが高く、複数案件をこなせるシニアでないとペイしない
							</li>
							<li>
								<strong>内製育成</strong>:
								既存のITメンバーをFDE的役割に育てる。AI技術習得と顧客ドメイン両面の育成が必要で、2-3年のリードタイム
							</li>
							<li>
								<strong>外部委託</strong>:
								FDE型の実装パートナーと組む。導入初期は最も現実的
							</li>
						</ul>
						<p>
							Kuu株式会社は、戦略フェーズから実装・運用まで一社で担う{" "}
							<Link href="/services/">伴走実装パートナー</Link>
							として、中小企業向けに FDE 型ディスカバリを提供しています。
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
							FDE は AI
							エージェントの導入をラストワンマイルまで届けるための新しい役割です。中小企業が単独採用するより、FDE
							型の実装ができる外部パートナーと組む方が現実的な選択になります。
						</p>
						<p>
							Kuu の FDE 型ディスカバリと実装支援については{" "}
							<Link href="/services/ax-dx/">AX/DX戦略・現場ディスカバリ</Link>、{" "}
							<Link href="/services/ai-ops/">エージェント実装・ガバナンス</Link>
							、 <Link href="/contact/">無料相談</Link> をご覧ください。
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
							RELATED PILLARS
						</h2>
						<div style={{ display: "flex", flexDirection: "column" }}>
							{[
								{
									href: "/ax/",
									label: "AX（エージェントトランスフォーメーション）とは",
								},
								{
									href: "/ai-governance/",
									label: "エージェントガバナンスとは——中小企業向け完全ガイド",
								},
								{
									href: "/managed-agents/",
									label: "Managed Agents（マネージドエージェント）",
								},
							].map((p) => (
								<Link
									key={p.href}
									href={p.href}
									style={{
										padding: "1rem 0",
										borderTop: "1px solid var(--gray-dark)",
										fontSize: "0.9rem",
										color: "var(--gray-medium)",
										lineHeight: "1.7",
									}}
								>
									{p.label}
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>

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
