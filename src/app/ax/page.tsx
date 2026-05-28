import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllPosts } from "@/lib/mdx";
import {
	BASE_URL,
	buildBreadcrumb,
	ORG_REF,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/", label: "Service" },
	{ href: "/ai-governance/", label: "Agent Governance" },
	{ href: "/glossary/", label: "Glossary" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/contact/", label: "Contact" },
];

const PAGE_URL = `${BASE_URL}/ax/`;

export const metadata: Metadata = seoMetadata({
	title:
		"AX（エージェントトランスフォーメーション）とは——中小企業向け完全ガイド | Kuu株式会社",
	description:
		"AXはAIエージェントが業務を自律的に動かす段階への組織変革。DXとの違い、中小企業に必要な理由、3段階の導入プロセス、推進体制まで実装目線で完全解説。",
	path: "/ax/",
});

const tocItems = [
	{ id: "definition", label: "AXとは" },
	{ id: "vs-dx", label: "DXとAXの違い" },
	{ id: "why-sme", label: "中小企業にAXが必要な理由" },
	{ id: "phases", label: "AX導入の3フェーズ" },
	{ id: "team", label: "AX推進体制と人材要件" },
	{ id: "faq", label: "よくある質問" },
];

const faqs = [
	{
		q: "AXとDXの違いは何ですか？",
		a: "DX（デジタルトランスフォーメーション）が業務のデジタル化全般を指すのに対し、AX（エージェントトランスフォーメーション）はAIエージェントが業務を自律的に遂行する段階への移行を意味します。DXが「紙→デジタル、手作業→システム化」だとすれば、AXは「システム化された業務を、エージェントが意思決定の一部とともに担う」段階です。",
	},
	{
		q: "DXが終わっていない中小企業もAXに進めますか？",
		a: "進められます。むしろDXとAXを並行進化させる方が現実的です。クラウド化やSaaS導入が一定進んでいれば、その上にAIエージェントを乗せる形で AX を始められます。完全な「DX完了」を待つ必要はなく、AIで自律化できる業務から段階的に着手するのが推奨です。",
	},
	{
		q: "AXの導入期間はどれくらいですか？",
		a: "戦略・ディスカバリ段階で2-4週間、最初のエージェントを本番に乗せるまで2-3ヶ月、3-5本のエージェントが運用に乗るまで6-12ヶ月が典型的です。一気に全社展開するより、優先業務から段階的に進めることがリスクとROIの両面で合理的です。",
	},
	{
		q: "中小企業でも費用対効果は出ますか？",
		a: "出ます。中小企業の方が意思決定が速く、組織の柔軟性が高いため、AXの効果が早く現れます。重要なのは「全業務をAI化する」ではなく、エージェントが最も効果を発揮する業務を1-2件から始めること。Managed Agentsモデルを使えば初期投資も月額数十万円から始められます。",
	},
	{
		q: "AXを始めるのに専任のAI人材は必要ですか？",
		a: "不要です。むしろ社内にAI専任を置くより、外部のFDE型実装パートナーと組む方が早く確実に成果が出ます。社内側で必要なのは、業務理解と意思決定権を持つ推進担当者です。技術面はパートナーに任せ、現場との橋渡しと事業判断を内製する分業が現実的です。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline:
			"AX（エージェントトランスフォーメーション）とは——中小企業向け完全ガイド",
		description:
			"AXの定義、DXとの違い、中小企業に必要な理由、3段階の導入プロセス、推進体制まで完全解説。",
		author: ORG_REF,
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
		mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
		url: PAGE_URL,
		inLanguage: "ja",
		articleSection: "Pillar",
		keywords:
			"AX, エージェントトランスフォーメーション, DX, 中小企業, AIエージェント, 組織変革, FDE, Managed Agents",
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
		name: "AX導入 3フェーズ",
		description: "中小企業がAXを段階的に進めるための実践プロセス",
		step: [
			{
				"@type": "HowToStep",
				position: 1,
				name: "戦略フェーズ",
				text: "経営課題から逆算したAXロードマップを設計。どの業務をエージェント化するか、KPIと評価軸を経営層と合意する。",
			},
			{
				"@type": "HowToStep",
				position: 2,
				name: "ディスカバリフェーズ",
				text: "FDE型に現場業務と既存システムを深掘り、実装可能な優先ユースケースを特定する。",
			},
			{
				"@type": "HowToStep",
				position: 3,
				name: "ハーネス実装フェーズ",
				text: "エージェントハーネスを構築し、エージェントを既存システムに接続。9軸評価で運用を継続改善する。",
			},
		],
	},
	buildBreadcrumb([
		{ name: "ホーム", path: "/" },
		{ name: "AX（エージェントトランスフォーメーション）", path: "/ax/" },
	]),
];

export default function AxPillarPage() {
	const allPosts = getAllPosts();
	const relatedSlugs = [
		"ax-dx-difference-guide",
		"agent-governance-framework",
		"ai-agent-managed-intro",
		"why-agent-governance",
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
						<span>AX</span>
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
						AX（エージェントトランスフォーメーション）とは——
						<br />
						中小企業向け完全ガイド
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
							AXはAIエージェントが業務を自律的に遂行する段階への組織変革です。DXが「業務のデジタル化」だとすれば、AXは「業務の自律化」。中小企業の場合、優先業務1-2件から段階的に始め、6-12ヶ月で3-5本のエージェントが運用に乗る規模感が現実的です。
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
						<h2 id="definition">AXとは</h2>
						<p>
							AX（エージェントトランスフォーメーション）は、AIエージェントが業務を
							<strong>自律的に遂行する状態</strong>
							への組織変革です。RPAやチャットボットのような「人間の指示通りに動く自動化」から、
							<strong>
								目標を与えればエージェントが計画・実行・検証まで完結する
							</strong>
							段階への移行を指します。
						</p>
						<p>
							用語の正式な定義は{" "}
							<Link href="/glossary/agent-transformation/">
								エージェントトランスフォーメーション (AX)
							</Link>{" "}
							を参照してください。
						</p>

						<h2 id="vs-dx">DXとAXの違い</h2>
						<p>
							両者は段階の違いで、断絶ではありません。DX が一定進んでいなければ
							AX は乗りません。
						</p>
						<ul>
							<li>
								<strong>DX</strong>:
								紙→デジタル、手作業→システム化。意思決定は人間が行い、システムはそれを支える
							</li>
							<li>
								<strong>AX</strong>:
								システム化された業務を、エージェントが意思決定の一部とともに担う。人間は監督・承認・例外対応に集中する
							</li>
						</ul>
						<p>
							具体例：契約書チェックを考えると、DX段階では「Wordで電子化＋承認ワークフロー」。AX段階では「エージェントが条文を解析し、リスク箇所を指摘し、修正案まで提示」。人間は最終承認のみ。
						</p>

						<h2 id="why-sme">中小企業にAXが必要な理由</h2>
						<p>
							大企業より、むしろ中小企業の方が AX
							の効果が早く現れます。理由は3つあります。
						</p>
						<ul>
							<li>
								<strong>人材不足の構造的解決</strong>:
								限られた人員で業務量を捌くには、自律化が現実解。採用難の今、エージェントは「もう一人の社員」として機能する
							</li>
							<li>
								<strong>意思決定の速さ</strong>: 中小企業はトップダウンで AX
								導入を即決できる。大企業の稟議地獄を経由しない
							</li>
							<li>
								<strong>競争差別化</strong>: 同業他社が DX 止まりの間に AX
								を進められれば、生産性で 2-3倍の差がつく
							</li>
						</ul>
						<p>
							一方、「すべての業務をAI化する」発想は危険です。エージェントが効果を発揮しない業務に無理に入れると、コストだけ膨らんで価値が出ません。
							<strong>どの業務にエージェントを入れるか、入れないか</strong>
							の判断こそが AX の最初のハードルです。
						</p>

						<h2 id="phases">AX導入の3フェーズ</h2>
						<p>
							Kuu株式会社が中小企業向けに推奨する AX
							導入プロセスは、戦略・ディスカバリ・ハーネス実装の3段階です。
						</p>
						<ol>
							<li>
								<strong>戦略フェーズ（2-3週間）</strong>: 経営課題から逆算した
								AX
								ロードマップを設計。どの業務をエージェント化するか、KPIと評価軸を経営層と合意
							</li>
							<li>
								<strong>ディスカバリフェーズ（2-4週間）</strong>:{" "}
								<Link href="/fde/">FDE型ディスカバリ</Link>{" "}
								で現場業務と既存システムを深掘り、実装可能な優先ユースケースを特定
							</li>
							<li>
								<strong>ハーネス実装フェーズ（4-8週間〜継続）</strong>:{" "}
								<Link href="/glossary/agent-harness/">
									エージェントハーネス
								</Link>{" "}
								を構築し、エージェントを既存システムに接続。
								<Link href="/glossary/nine-axis-evaluation/">9軸評価</Link>{" "}
								で運用を継続改善
							</li>
						</ol>

						<h2 id="team">AX推進体制と人材要件</h2>
						<p>
							中小企業が AX
							を進める際の体制設計には、以下の3つの役割が必要です。
						</p>
						<ul>
							<li>
								<strong>推進責任者</strong>:
								社長または経営層直下のマネジャー。業務理解と意思決定権を持つ。専任である必要はない
							</li>
							<li>
								<strong>現場担当者</strong>:
								対象業務を実際に行う担当者。AIに置き換える業務の暗黙知を持つ
							</li>
							<li>
								<strong>実装パートナー</strong>: 技術面を担う外部パートナー。FDE
								型の経験があり、自社の既存システムと統合できる
							</li>
						</ul>
						<p>
							社内に AI 専任を置く必要はありません。むしろ
							<strong>業務理解と意思決定は内製、技術実装は外部</strong>
							という分業の方が、中小企業のリソースに合います。Kuuは外部パートナー側を担います。
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
							AX は DX
							の延長にある、AIエージェントによる業務自律化の段階です。中小企業こそ意思決定の速さと組織柔軟性で先行できる領域であり、優先業務1-2件から段階的に始めるのが現実解です。
						</p>
						<p>
							Kuu の AX 戦略支援については{" "}
							<Link href="/services/ax-dx/">AX/DX戦略・現場ディスカバリ</Link>、{" "}
							<Link href="/services/ai-ops/">エージェント実装・ガバナンス</Link>
							、 <Link href="/contact/">無料相談</Link> を参照してください。
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
									href: "/fde/",
									label: "FDE（Forward Deployed Engineer）とは",
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
