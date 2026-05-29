import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	ORG_REF,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title:
		"RDEディスカバリ — 業務フロー再設計の起点をつくる | Reinvention Deployed Engineering | Kuu株式会社",
	description:
		"Kuuのファネル 02。Reinvention Deployed Engineering（RDE）が業務・既存システム・データに深く入り込み、AI前提で業務フローごと再設計する仮説と機会を抽出。Obsidian / Notion / Claude / ChatGPT / Gemini を組み合わせる変革型ディスカバリ。",
	path: "/services/rde/",
	keywords: [
		"RDE",
		"Reinvention Deployed Engineering",
		"ディスカバリ",
		"業務フロー再設計",
		"AIネイティブ",
		"FDE",
		"AIer",
		"Claude",
		"ChatGPT",
		"Gemini",
		"MCP",
		"Obsidian",
		"Notion",
		"Genspark",
		"Manus",
		"AIロードマップ",
		"AIコンサルティング",
		"Kuu株式会社",
	],
});

const faqs = [
	{
		q: "RDEとFDEは何が違うのですか？",
		a: "FDE（Forward Deployed Engineer）は Palantir 発祥の役割で「製品ができることと顧客が必要とすることのギャップを埋める人間」と定義されます。RDE（Reinvention Deployed Engineering）はアクセンチュアが掲げる概念で、「業務フローごと AI 前提に再設計する変革実装」に重きを置きます。Kuu では RDE を Stage 02 のディスカバリ（仮説と機会の抽出）、FDE を Stage 03 の実装フェーズに割り当て、両輪で運用します。",
	},
	{
		q: "RDEディスカバリだけ単発で依頼することは可能ですか？",
		a: "可能です。実装パートナーが別途決まっているケースや、まず業務フローを解像してから内製判断したいケースなど、ディスカバリ単発のご依頼にも対応します。ただし Kuu は後続の実装・運用まで自社で担えるため、ディスカバリの設計時点から「実装可能性」を織り込めるのが強みです。",
	},
	{
		q: "期間と費用感の目安は？",
		a: "対象業務の範囲によりますが、ディスカバリ単独で 3〜6 週間、初期費用 80 万円〜が目安です。複数部門にまたがる大規模ディスカバリの場合は別途お見積もりとなります。RDE + FDE の通しでご依頼いただく場合はディスカバリ費用を実装フェーズで一部相殺するプランもあります。",
	},
	{
		q: "業務フローを再設計するというのは、現場が抵抗しませんか？",
		a: "抵抗は前提です。RDE では「AI を業務に乗せる」のではなく「業務フローを AI 前提で組み替える」ため、現場の業務観そのものに介入します。Kuu では現場リーダーを巻き込んだワークショップ形式でディスカバリを進め、再設計の根拠を共有しながら合意形成を行います。経営層の意思決定がないまま現場に下ろすことはしません。",
	},
	{
		q: "対応業種に制限はありますか？",
		a: "食産業を除く全業種に対応します（食産業はグループ会社 UMEZOO が担当）。小売・EC、不動産、医療・ヘルスケア、教育、製造業、サービス業、IT・SaaS が主な対象です。",
	},
];

const rdeJsonLd = [
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
		name: "RDEディスカバリ",
		description:
			"Reinvention Deployed Engineering で業務・既存システム・データに深く入り込み、AI前提で業務フローごと再設計する仮説と機会を抽出する変革型ディスカバリ。",
		provider: ORG_REF,
		serviceType: "AI実装ディスカバリ",
		areaServed: "JP",
		url: `${BASE_URL}/services/rde/`,
		keywords: [
			"RDE",
			"Reinvention Deployed Engineering",
			"FDE",
			"ディスカバリ",
			"業務フロー再設計",
			"AIネイティブ",
			"Obsidian",
			"Notion",
			"Genspark",
			"Manus",
		],
	},
	buildBreadcrumb([
		{ name: "ホーム", path: "/" },
		{ name: "Service", path: "/services/" },
		{ name: "RDEディスカバリ", path: "/services/rde/" },
	]),
];

export default function RdePage() {
	return (
		<>
			<JsonLd data={rdeJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

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
						<Link href="/services/" style={{ color: "var(--gray-medium)" }}>
							Service
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>RDEディスカバリ</span>
					</nav>

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
						STAGE 02 · DISCOVERY
					</div>

					<h1 className="page-title fade-in">
						RDEディスカバリ
						<br />
						（業務フロー再設計の起点をつくる）
					</h1>

					{/* Problem */}
					<section style={{ marginBottom: "5rem" }}>
						<div className="approach-lede fade-in">
							<p className="approach-headline">
								AI
								のボトルネックは性能ではなく、業務フローへの実装可能性に移った。
							</p>
							<p className="approach-body">
								モデルの賢さはもう十分です。それでも企業の現場では「データがサイロ化して
								LLM に食わせられない」「PoC は動くが本番に乗らない」「現行業務に
								AI を載せただけで何も変わらない」という壁にぶつかります。a16z
								が「テック界で最もホットな職種」と呼ぶ FDE
								が急増しているのは、まさにこのギャップが顕在化したからです。Kuu
								の RDE ディスカバリは、Reinvention Deployed Engineering
								の名のとおり、業務フローそのものを AI
								前提で再設計するための「変革型ディスカバリ」です。
							</p>
						</div>

						<div
							className="fade-in"
							style={{
								marginTop: "2.5rem",
								padding: "2rem",
								border: "1px solid var(--gray-dark)",
								borderRadius: "4px",
								maxWidth: "720px",
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
								こんな停滞に心当たりは？
							</p>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									margin: 0,
									fontSize: "0.85rem",
									color: "var(--gray-medium)",
									lineHeight: 2,
								}}
							>
								<li>
									・ ChatGPT / Claude / Gemini
									を入れたが、業務の生産性指標は変わらなかった
								</li>
								<li>・ PoC は動いたが、本番フェーズでスケールせず立ち消えた</li>
								<li>
									・ 業務フローを変えずに AI
									を載せたため、人間がチェックする工程が増えた
								</li>
								<li>
									・
									業界知識を持つコンサルと、コードを書けるエンジニアが分断していて、提案が業務とズレる
								</li>
								<li>
									・
									「どこから自動化すべきか」のディスカバリが表層に留まり、再設計に踏み込めていない
								</li>
							</ul>
						</div>
					</section>

					{/* RDE 4 つの価値 */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">RDEが提供する4つの価値</h2>
						<p
							className="fade-in"
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: 1.9,
								maxWidth: "720px",
								marginBottom: "2.5rem",
							}}
						>
							Reinvention Deployed Engineering
							は、エリートのエンジニア人材と業界知見を掛け合わせ、パイロットから成果へ一気に引き上げる方法論です。FDE
							が「製品と現場のギャップ」を埋めるのに対し、RDE
							は「変革そのものを現場に実装する」と位置づけられます。
						</p>

						<div
							className="fade-in-stagger"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "1.25rem",
							}}
						>
							{[
								{
									num: "01",
									title: "Build AI at the core",
									jp: "業務環境に直接 AI を組み込む",
									desc: "サイロ化したデータと既存システムを横断し、AI を業務の「あとから乗せる機能」ではなく「中核」として組み込みます。",
								},
								{
									num: "02",
									title: "Reengineer processes",
									jp: "業務プロセスを AI 前提で再設計",
									desc: "AI を前提とした業務フローを描き直し、人間とエージェントの役割分担、ハンドオフ、例外処理を設計します。",
								},
								{
									num: "03",
									title: "Fast-track AI adoption",
									jp: "実証済みプラットフォームで導入を加速",
									desc: "Claude / ChatGPT / Gemini など実証済みプラットフォームと Kuu のハーネス基盤を組み合わせ、導入リードタイムを短縮します。",
								},
								{
									num: "04",
									title: "Create lasting value",
									jp: "再利用可能なプレイブックとガバナンスで価値を持続",
									desc: "ディスカバリで作った「業務フロー再設計図」を再利用可能な資産化し、9軸評価と継続的ガバナンスで価値を持続させます。",
								},
							].map((item) => (
								<div
									key={item.num}
									className="fade-in-item"
									style={{
										padding: "1.75rem 1.5rem",
										border: "1px solid var(--gray-dark)",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: "0.7rem",
											letterSpacing: "0.15em",
											color: "var(--gray-dim)",
											marginBottom: "0.75rem",
										}}
									>
										{item.num}
									</div>
									<div
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: "0.95rem",
											color: "var(--white)",
											marginBottom: "0.25rem",
										}}
									>
										{item.title}
									</div>
									<div
										style={{
											fontSize: "0.75rem",
											color: "var(--gray-light)",
											marginBottom: "0.75rem",
										}}
									>
										{item.jp}
									</div>
									<p
										style={{
											fontSize: "0.78rem",
											color: "var(--gray-medium)",
											lineHeight: 1.85,
											margin: 0,
										}}
									>
										{item.desc}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Process */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">Process</h2>
						<ol
							className="fade-in-stagger"
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem",
							}}
						>
							{[
								{
									step: "01",
									title: "現場ヒアリング・観察",
									dur: "1〜2週間",
									desc: "経営層と現場の両軸でヒアリングし、業務フロー・既存システム・データ資産・人的依存関係を可視化します。Obsidian / Notion でナレッジを一元化。",
								},
								{
									step: "02",
									title: "業務フロー解像・ボトルネック特定",
									dur: "1〜2週間",
									desc: "AS-IS のフローを可視化し、自動化可能ポイント、ハンドオフロス、属人化リスクをマッピング。再設計の対象範囲を経営層と合意します。",
								},
								{
									step: "03",
									title: "AI 前提の TO-BE 設計",
									dur: "2〜3週間",
									desc: "Claude / ChatGPT / Gemini と MCP・サブエージェント・Routine を組み合わせた TO-BE フローを設計。人間とエージェントの役割分担を明示します。",
								},
								{
									step: "04",
									title: "実装可能性とROIの検証",
									dur: "1週間",
									desc: "ハーネス接続コスト、ガバナンス要件、想定 ROI を試算。次フェーズ（FDE 実装）へのスムーズなハンドオフ計画を作成します。",
								},
							].map((step) => (
								<li
									key={step.step}
									className="fade-in-item"
									style={{
										display: "grid",
										gridTemplateColumns: "80px 1fr 120px",
										gap: "1.5rem",
										padding: "1.5rem 0",
										borderTop: "1px solid var(--gray-dark)",
										alignItems: "start",
									}}
								>
									<div
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: "1.5rem",
											color: "var(--gray-light)",
											letterSpacing: "0.05em",
										}}
									>
										{step.step}
									</div>
									<div>
										<div
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: "1rem",
												color: "var(--white)",
												marginBottom: "0.5rem",
											}}
										>
											{step.title}
										</div>
										<p
											style={{
												fontSize: "0.8rem",
												color: "var(--gray-medium)",
												lineHeight: 1.85,
												margin: 0,
											}}
										>
											{step.desc}
										</p>
									</div>
									<div
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: "0.7rem",
											color: "var(--gray-dim)",
											letterSpacing: "0.05em",
											textAlign: "right",
										}}
									>
										{step.dur}
									</div>
								</li>
							))}
						</ol>
					</section>

					{/* FAQ */}
					<section style={{ marginBottom: "5rem" }}>
						<h2 className="section-label fade-in">FAQ</h2>
						<div
							className="fade-in-stagger"
							style={{ display: "flex", flexDirection: "column" }}
						>
							{faqs.map((faq) => (
								<div
									key={faq.q}
									className="fade-in-item"
									style={{
										padding: "1.5rem 0",
										borderTop: "1px solid var(--gray-dark)",
									}}
								>
									<div
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: "0.9rem",
											color: "var(--white)",
											marginBottom: "0.75rem",
											letterSpacing: "0.02em",
										}}
									>
										Q. {faq.q}
									</div>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: 1.9,
											margin: 0,
										}}
									>
										{faq.a}
									</p>
								</div>
							))}
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
								業務フローを AI
								前提で組み替えるには、まず現状を解像することから始まります。
							</p>
							<Link
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
							</Link>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</>
	);
}
