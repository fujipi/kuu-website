import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import {
	type CaseEntryMeta,
	getAllCaseSlugs,
	getAllCases,
	getCaseBySlug,
} from "@/lib/case";
import { mdToHtml } from "@/lib/mdToHtml";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return getAllCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const c = getCaseBySlug(slug);
	if (!c) return { title: "ユースケースが見つかりません" };
	return seoMetadata({
		title: `${c.title} | Case | Kuu株式会社`,
		description: c.description,
		path: `/case/${slug}/`,
	});
}

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

const summaryGroups: {
	key: "objectives" | "measures" | "effects";
	label: string;
}[] = [
	{ key: "objectives", label: "想定する課題" },
	{ key: "measures", label: "アプローチ" },
	{ key: "effects", label: "期待できること" },
];

export default async function CaseDetailPage({ params }: Props) {
	const { slug } = await params;
	const c = getCaseBySlug(slug);
	if (!c) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<h1 className="page-title">ユースケースが見つかりません</h1>
						<Link href="/case/">← Case 一覧</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const url = `${BASE_URL}/case/${slug}/`;
	const html = mdToHtml(c.content);
	const related: CaseEntryMeta[] = getAllCases()
		.filter((x) => x.slug !== slug)
		.slice(0, 5);

	const hasSummary =
		c.objectives.length > 0 || c.measures.length > 0 || c.effects.length > 0;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: c.title,
			description: c.description,
			url,
			inLanguage: "ja",
			datePublished: c.date,
			dateModified: c.lastModified || c.date,
			keywords: c.tags.join(", "),
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
			mainEntityOfPage: { "@type": "WebPage", "@id": url },
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "Case", path: "/case/" },
			{ name: c.title, path: `/case/${slug}/` },
		]),
	];

	return (
		<>
			<JsonLd data={jsonLd} />
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
						<Link href="/case/" style={{ color: "var(--gray-medium)" }}>
							Case
						</Link>
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
						{c.title}
					</h1>

					<p
						className="fade-in"
						style={{
							fontSize: "0.75rem",
							color: "var(--gray-dim)",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							marginBottom: "1.5rem",
						}}
					>
						{formatDate(c.date)}
						{c.industry ? ` · ${c.industry}` : ""}
					</p>

					{c.tags.length > 0 && (
						<div
							className="fade-in"
							style={{
								display: "flex",
								gap: "0.5rem",
								flexWrap: "wrap",
								marginBottom: "2.5rem",
							}}
						>
							{c.tags.map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: "0.65rem",
										color: "var(--gray-dim)",
										border: "1px solid var(--gray-dark)",
										borderRadius: "2px",
										padding: "0.2rem 0.6rem",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
									}}
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{/* 想定企業プロフィール */}
					{c.companyProfile.length > 0 && (
						<section className="fade-in" style={{ marginBottom: "3rem" }}>
							<h2 className="section-label">想定される導入シーン</h2>
							<div className="about-table case-profile">
								{c.companyProfile.map((row) => (
									<div key={row.label} className="about-row">
										<div className="about-label">{row.label}</div>
										<div className="about-value">{row.value}</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* 目的 / 施策 / 想定効果 */}
					{hasSummary && (
						<section className="fade-in" style={{ marginBottom: "3rem" }}>
							<div className="case-summary-grid">
								{summaryGroups.map((g) => {
									const items = c[g.key];
									if (items.length === 0) return null;
									return (
										<div key={g.key} className="case-summary-card">
											<div className="case-summary-heading">{g.label}</div>
											<ul>
												{items.map((it) => (
													<li key={it}>{it}</li>
												))}
											</ul>
										</div>
									);
								})}
							</div>
						</section>
					)}

					{/* KPIメトリクス */}
					{c.metrics.length > 0 && (
						<section className="fade-in" style={{ marginBottom: "3.5rem" }}>
							<div className="case-metric-grid">
								{c.metrics.map((m) => (
									<div key={m.label} className="case-metric-card">
										<div className="case-metric-value">{m.value}</div>
										<div className="case-metric-label">{m.label}</div>
									</div>
								))}
							</div>
							<p className="case-metric-note">
								※
								数値は一般的な公開情報をもとにした目安であり、特定の実績を示すものではありません。
							</p>
						</section>
					)}

					{/* 本文 */}
					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "3rem" }}
					>
						<section
							// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time markdown
							dangerouslySetInnerHTML={{ __html: html }}
							suppressHydrationWarning
						/>
					</article>

					{/* 想定される現場の声 */}
					{c.personaVoice && (
						<section
							className="fade-in"
							style={{ maxWidth: "760px", marginBottom: "3rem" }}
						>
							<h2 className="section-label">現場で想定されるニーズ</h2>
							<blockquote className="case-quote">
								<p>{c.personaVoice.quote}</p>
								{c.personaVoice.attribution && (
									<cite>— {c.personaVoice.attribution}</cite>
								)}
							</blockquote>
						</section>
					)}

					{/* 活用した最新モデル・機能 */}
					{c.modelsUsed.length > 0 && (
						<section
							className="fade-in"
							style={{ maxWidth: "760px", marginBottom: "3rem" }}
						>
							<h2 className="section-label">活用した最新モデル・機能</h2>
							<div className="case-models">
								{c.modelsUsed.map((m) => (
									<span key={m} className="case-model-chip">
										{m}
									</span>
								))}
							</div>
						</section>
					)}

					{/* 今後の展望 */}
					{c.futureOutlook && (
						<section
							className="fade-in"
							style={{ maxWidth: "760px", marginBottom: "3rem" }}
						>
							<h2 className="section-label">今後の展望</h2>
							<p
								style={{
									fontSize: "0.875rem",
									color: "var(--gray-medium)",
									lineHeight: "2",
								}}
							>
								{c.futureOutlook}
							</p>
						</section>
					)}

					{/* 調査の出典・需要根拠 */}
					{c.sources.length > 0 && (
						<section
							className="fade-in"
							style={{ maxWidth: "760px", marginBottom: "3.5rem" }}
						>
							<h2 className="section-label">調査の出典・需要根拠</h2>
							<ul className="case-sources">
								{c.sources.map((s) => (
									<li key={s}>{s}</li>
								))}
							</ul>
						</section>
					)}

					{/* CTA */}
					<section
						className="fade-in"
						style={{
							maxWidth: "760px",
							padding: "2rem",
							border: "1px solid var(--gray-dark)",
							borderRadius: "6px",
							marginBottom: "3rem",
						}}
					>
						<h2
							style={{
								fontSize: "1rem",
								color: "var(--white)",
								marginBottom: "1rem",
							}}
						>
							こうした活用を自社で検討する
						</h2>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: "1.9",
								marginBottom: "1.25rem",
							}}
						>
							ここで挙げた使い方は、多くの企業でそのまま応用できます。自社の業務にどう落とし込めるか・費用感は、無料相談（15〜30分）でご提案します。
						</p>
						<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
							<Link
								href="/contact/"
								style={{
									fontSize: "0.8rem",
									color: "var(--white)",
									border: "1px solid var(--white)",
									padding: "0.6rem 1.5rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								無料相談
							</Link>
						</div>
					</section>

					{related.length > 0 && (
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
								OTHER CASES
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{related.map((x) => (
									<Link
										key={x.slug}
										href={`/case/${x.slug}/`}
										style={{
											padding: "1rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.9rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{x.title}
									</Link>
								))}
								<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
							</div>
						</section>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}
