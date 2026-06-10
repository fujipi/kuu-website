import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCases } from "@/lib/case";
import {
	getCasesByIndustry,
	getIndustryGroupBySlug,
	resolveIndustryGroup,
} from "@/lib/industries";
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
	// Case が1件以上ある業種グループのみ静的生成する
	return getCasesByIndustry().map(({ group }) => ({ slug: group.slug }));
}

function getGroupCases(slug: string) {
	return getAllCases().filter(
		(c) => resolveIndustryGroup(c.industry)?.slug === slug,
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const group = getIndustryGroupBySlug(slug);
	if (!group) return { title: "業種が見つかりません" };
	const cases = getGroupCases(slug);
	const meta = seoMetadata({
		title: `${group.label}業界のAIエージェント活用ユースケース (${cases.length}件)`,
		description: `${group.label}業界でのAIエージェント活用イメージを集めたユースケース一覧です。業務ボトルネックの特定からエージェント実装の設計イメージまで、導入検討の材料を提供します。`,
		path: `/case/industry/${slug}/`,
	});
	// 収載数が少ないうちは thin content として index させない（follow は維持し、
	// 件数が2件以上に増えたビルドから自動で index に切り替わる）
	if (cases.length < 2) {
		return { ...meta, robots: { index: false, follow: true } };
	}
	return meta;
}

export default async function CaseIndustryPage({ params }: Props) {
	const { slug } = await params;
	const group = getIndustryGroupBySlug(slug);

	if (!group) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							業種が見つかりません。
						</p>
						<Link
							href="/case/"
							style={{ color: "var(--white)", fontSize: "0.85rem" }}
						>
							← Case一覧へ
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const cases = getGroupCases(slug);
	const groups = getCasesByIndustry();
	const url = `${BASE_URL}/case/industry/${slug}/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `${group.label}業界のAIエージェント活用ユースケース`,
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: cases.length,
				itemListElement: cases.map((c, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/case/${c.slug}/`,
					name: c.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "Case", path: "/case/" },
			{ name: group.label, path: `/case/industry/${slug}/` },
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
						<Link href="/case/" style={{ color: "var(--gray-medium)" }}>
							Case
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{group.label}</span>
					</nav>

					<h1 className="page-title fade-in">{group.label}のユースケース</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.85rem",
							color: "var(--gray-medium)",
							maxWidth: "640px",
							lineHeight: "1.8",
							marginBottom: "1.5rem",
						}}
					>
						{group.label}
						業界の業務にAIエージェントをどう実装できるかを、公開情報をもとにした活用イメージとして書き起こしたユースケース集です。
					</p>

					{/* 他業種への横断リンク */}
					<div
						className="fade-in"
						style={{
							display: "flex",
							gap: "0.5rem",
							flexWrap: "wrap",
							marginBottom: "2.5rem",
							maxWidth: "720px",
						}}
					>
						{groups.map(({ group: g, cases: cs }) => (
							<Link
								key={g.slug}
								href={`/case/industry/${g.slug}/`}
								aria-current={g.slug === slug ? "page" : undefined}
								style={{
									fontSize: "0.65rem",
									color: g.slug === slug ? "var(--white)" : "var(--gray-dim)",
									border: `1px solid ${
										g.slug === slug ? "var(--gray-medium)" : "var(--gray-dark)"
									}`,
									borderRadius: "2px",
									padding: "0.2rem 0.6rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								{g.label} ({cs.length})
							</Link>
						))}
					</div>

					{cases.length === 0 ? (
						<p
							className="fade-in"
							style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
						>
							この業種のユースケースを準備中です。
						</p>
					) : (
						<div className="fade-in-stagger case-grid">
							{cases.map((c) => (
								<Link
									key={c.slug}
									href={`/case/${c.slug}/`}
									className="case-card fade-in-item"
								>
									{c.industry ? (
										<span className="case-card-industry">{c.industry}</span>
									) : null}
									<h2 className="case-card-title">{c.title}</h2>
									{c.tags.length > 0 ? (
										<div className="case-card-tags">
											{c.tags.map((tag) => (
												<span key={tag} className="case-card-tag">
													{tag}
												</span>
											))}
										</div>
									) : null}
								</Link>
							))}
						</div>
					)}

					<div className="fade-in" style={{ marginTop: "3rem" }}>
						<Link
							href="/case/"
							style={{
								fontSize: "0.8rem",
								color: "var(--gray-medium)",
								borderBottom: "1px solid var(--gray-dark)",
								paddingBottom: "0.2rem",
							}}
						>
							← Case一覧へ戻る
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
