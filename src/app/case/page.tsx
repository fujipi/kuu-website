import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllCases } from "@/lib/case";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "Case | 最新のAIエージェント・ユースケースを毎日 | Kuu株式会社",
	description:
		"Webや企業発表から最新のAIエージェント・自動化のユースケースを日々まとめ、自社の業務へどう実装するかを具体的に書き起こします。",
	path: "/case/",
});

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default function CaseListPage() {
	const cases = getAllCases();

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "Case | 最新のユースケース集 | Kuu株式会社",
			url: `${BASE_URL}/case/`,
			description:
				"AIエージェント・自動化・FDE型実装に関する最新ユースケースを継続的に集約。",
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
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
					<h1 className="page-title fade-in">Case</h1>

					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							lineHeight: "1.95",
							maxWidth: "640px",
							marginBottom: "2.5rem",
						}}
					>
						Web の記事・X の投稿・企業の PR
						から見えてくる最新のユースケースをもとに、自社の業務にどう実装するかを具体的な形で書き起こすコーナーです。毎日継続的に追加していきます。
					</p>

					{cases.length === 0 ? (
						<p
							className="fade-in"
							style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
						>
							ユースケースを準備中です。
						</p>
					) : (
						<div
							className="fade-in-stagger blog-list"
							style={{ maxWidth: "720px" }}
						>
							{cases.map((c) => (
								<Link
									key={c.slug}
									href={`/case/${c.slug}/`}
									className="blog-list-item fade-in-item"
								>
									<time
										dateTime={c.date}
										style={{
											fontSize: "0.7rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.05em",
											display: "block",
											marginBottom: "0.5rem",
										}}
									>
										{formatDate(c.date)}
									</time>
									<h2
										style={{
											fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
											fontWeight: 500,
											color: "var(--white)",
											marginBottom: "0.5rem",
											lineHeight: "1.6",
										}}
									>
										{c.title}
									</h2>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
											maxWidth: "600px",
										}}
									>
										{c.description}
									</p>
									{c.tags.length > 0 ? (
										<div
											style={{
												display: "flex",
												gap: "0.5rem",
												marginTop: "0.75rem",
												flexWrap: "wrap",
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
									) : null}
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}
