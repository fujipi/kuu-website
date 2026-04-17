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
	{ href: "/managed-agents/", label: "Managed Agents" },
	{ href: "/resources/", label: "Resources" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";
const URL = `${BASE_URL}/eu-ai-act-jp/`;

export const metadata: Metadata = seoMetadata({
	title:
		"EU AI Act 日本企業対応ガイド——該当判定から必要対応まで | Kuu株式会社",
	description:
		"EU AI Actが日本の中小企業に与える影響、該当可能性の判定、リスク分類、必要な対応項目、ISO/IEC 42001 との関係を実務者向けに整理したピラーガイド。",
	path: "/eu-ai-act-jp/",
});

const tocItems = [
	{ id: "what", label: "EU AI Act とは" },
	{ id: "applicability", label: "日本企業への該当判定" },
	{ id: "risk-tiers", label: "リスク4分類" },
	{ id: "timeline", label: "施行タイムライン" },
	{ id: "actions", label: "取るべき対応 優先度別" },
	{ id: "iso-relation", label: "ISO/IEC 42001 との関係" },
	{ id: "faq", label: "よくある質問" },
];

const faqs = [
	{
		q: "日本国内で事業が完結していれば対応不要ですか？",
		a: "原則は対応不要ですが、EU居住の顧客・従業員に対してAI利用がある場合、EU取引先から監査・説明責任を問われる場合、将来的にEU市場進出を視野に入れる場合は、段階的な準備が合理的です。上場準備・大型資金調達での第三者デューデリジェンスでも論点化する可能性があります。",
	},
	{
		q: "中小企業は適用除外になるのですか？",
		a: "スタートアップ・中小企業向けの緩和措置は存在しますが「適用除外」ではありません。高リスク用途では規模に関わらず義務が発生します。限定リスク・最小リスク用途では透明性義務 (AI利用の明示) 等の軽量な要求が中心です。",
	},
	{
		q: "具体的にはいつまでに何をすればよいですか？",
		a: "禁止AIは2025年2月から適用済みです。汎用AI (GPAI) のルールは2025年8月から、高リスクAIの本格運用は2026年8月から段階施行されます。日本企業はまず該当可能性チェック、リスク分類判定、必要対応の優先順位付けの順で進めるのが現実的です。",
	},
	{
		q: "違反時の罰則はどのくらいですか？",
		a: "最も重い違反 (禁止AI利用) で最大3,500万EURまたは世界売上の7%、高リスクAIの違反で最大1,500万EURまたは世界売上の3%など、GDPRを上回る水準の罰則が設定されています。",
	},
	{
		q: "ISO 42001 を取れば EU AI Act 対応になりますか？",
		a: "完全には重ならないものの、ISO/IEC 42001 (AIマネジメントシステム) は EU AI Act が求める多くの要素 (リスク管理・ログ・監視・文書化) をカバーします。同時整備は効率的ですが、EU AI Act 固有の要件 (CE マーキング・適合性評価等) は別途対応が必要です。",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: "EU AI Act 日本企業対応ガイド",
		description:
			"EU AI Actの日本企業への影響と必要対応を実務者向けに解説するピラーガイド。",
		author: { "@type": "Organization", name: "Kuu株式会社", url: BASE_URL },
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
			"EU AI Act, 日本企業, ISO 42001, AI規制, 中小企業, 該当判定, リスク分類",
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
				name: "EU AI Act 対応",
				item: URL,
			},
		],
	},
];

export default function EuAiActPillarPage() {
	const allPosts = getAllPosts();
	const relatedSlugs = [
		"agent-governance-framework",
		"why-agent-governance",
		"ai-agent-managed-intro",
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
						<span>EU AI Act 対応</span>
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
						EU AI Act 日本企業対応ガイド
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
						Last updated: 2026-04-17 · 約 10 分で読めます
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
							EU AI Actは2024年8月発効の包括的AI規制で、2025-2027年に段階施行されます。日本の中小企業でも、EU顧客・EU取引先・上場準備がある場合は該当判定と対応整備が必要です。リスク分類に応じて透明性義務〜高リスクAIの適合性評価まで要求範囲が変わり、違反時は最大売上7%の罰金が科されます。ISO/IEC
							42001 と重なる部分が多いため同時整備が効率的です。
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
						<h2 id="what">EU AI Act とは</h2>
						<p>
							EU AI Act (EU人工知能法) は、欧州連合が2024年8月に発効させた世界初の包括的AI規制です。AIシステムを「許容不可」「高リスク」「限定リスク」「最小リスク」の4段階に分類し、分類に応じた義務を課す構造になっています。域外適用の仕組みにより、EU市場に製品・サービスを提供する日本企業も対象となります。用語の詳細は{" "}
							<Link href="/glossary/eu-ai-act/">EU AI Act (用語集)</Link>{" "}
							をご参照ください。
						</p>

						<h2 id="applicability">日本企業への該当判定</h2>
						<p>
							日本の中小企業でも、以下のいずれかに該当する場合は EU AI Act の対象となる可能性があります。
						</p>
						<ul>
							<li>EU居住の顧客・従業員に対してAI機能を提供している</li>
							<li>AI出力がEU市場の意思決定に使用されている</li>
							<li>欧州の親会社・取引先からコンプライアンス対応を要請されている</li>
							<li>越境ECや海外向けSaaSでEU域内に販売している</li>
							<li>将来的にEU市場進出を視野に入れている</li>
						</ul>
						<p>
							該当可能性の自己診断には{" "}
							<Link href="/resources/eu-ai-act-readiness-checklist/">
								EU AI Act 対応レディネス・チェックリスト
							</Link>{" "}
							をご活用ください。
						</p>

						<h2 id="risk-tiers">リスク4分類</h2>
						<ol>
							<li>
								<strong>許容不可 (Prohibited)</strong>:
								公共空間でのリアルタイム生体識別等。利用禁止
							</li>
							<li>
								<strong>高リスク (High-Risk)</strong>:
								採用・与信・医療・重要インフラ等。適合性評価・技術文書・監視等を義務化
							</li>
							<li>
								<strong>限定リスク (Limited Risk)</strong>:
								チャットボット・ディープフェイク等。透明性義務 (AI利用の明示)
							</li>
							<li>
								<strong>最小リスク (Minimal Risk)</strong>:
								スパムフィルタ・AIゲームAI等。特別な義務なし
							</li>
						</ol>

						<h2 id="timeline">施行タイムライン</h2>
						<ul>
							<li>
								<strong>2025年2月</strong>: 禁止AIの適用開始
							</li>
							<li>
								<strong>2025年8月</strong>: 汎用AI (GPAI) のルール適用
							</li>
							<li>
								<strong>2026年8月</strong>: 高リスクAIの本格規制開始 (大半の要求事項)
							</li>
							<li>
								<strong>2027年8月</strong>: 既存製品の高リスクAIへの全面適用
							</li>
						</ul>

						<h2 id="actions">取るべき対応 優先度別</h2>
						<p>
							まずは以下の順で進めるのが中小企業にとって現実的です。
						</p>
						<ol>
							<li>
								<strong>該当可能性チェック</strong>:
								上記の5項目で自社の該当性を評価
							</li>
							<li>
								<strong>エージェント台帳の棚卸し</strong>:
								利用中のAI・エージェントをリスク分類で整理
							</li>
							<li>
								<strong>高リスク用途の優先対応</strong>:
								該当がある場合は適合性評価・文書化の準備
							</li>
							<li>
								<strong>透明性義務の実装</strong>:
								限定リスク用途のAI利用明示
							</li>
							<li>
								<strong>ISO 42001 との統合</strong>:
								同時整備でコストを最適化
							</li>
						</ol>

						<h2 id="iso-relation">ISO/IEC 42001 との関係</h2>
						<p>
							ISO/IEC 42001 (AIマネジメントシステム) は EU AI Act の要求事項の多くをカバーします。リスク管理・ログ保管・監視・文書化・継続改善の観点では両者の要求が重なります。一方で EU AI Act
							固有の要件 (CEマーキング・適合性評価・EU代理人) は ISO 42001 でカバーされません。中小企業では、ガバナンス基盤として ISO
							42001 を整備しつつ、EU AI Act 固有要件を追加対応する形が効率的です。用語の詳細は{" "}
							<Link href="/glossary/iso-42001/">ISO/IEC 42001</Link> をご参照ください。
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
							EU AI Act は「EU事業のある大企業だけの話」ではなく、中小企業でも段階的な準備が必要な規制です。該当可能性の判定と ISO 42001 との同時整備から着手するのが現実解になります。
						</p>
						<p>
							関連ピラーは{" "}
							<Link href="/ai-governance/">エージェントガバナンス</Link>、
							実装相談は <Link href="/contact/">無料相談</Link>、サービス詳細は{" "}
							<Link href="/managed-agents/">Managed Agents</Link> からどうぞ。
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
