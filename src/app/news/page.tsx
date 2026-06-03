import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { getAllNews } from "@/lib/news";
import { BASE_URL, buildBreadcrumb, generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "News | Kuu株式会社",
	description:
		"Kuu株式会社からのお知らせ・プレスリリース。AIエージェント・AX/DX戦略・FDEに関する最新の動向を発信していきます。",
	path: "/news/",
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

export default function NewsPage() {
	const news = getAllNews();

	const newsJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: "News | Kuu株式会社",
			url: `${BASE_URL}/news/`,
			description: "Kuu株式会社のお知らせ・プレスリリース一覧。",
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			...(news.length > 0 && {
				mainEntity: {
					"@type": "ItemList",
					itemListElement: news.map((item, i) => ({
						"@type": "ListItem",
						position: i + 1,
						url: `${BASE_URL}/news/${item.slug}/`,
						name: item.title,
					})),
				},
			}),
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "News", path: "/news/" },
		]),
	];

	return (
		<>
			<JsonLd data={newsJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">News</h1>

					{news.length > 0 ? (
						<div
							className="fade-in"
							style={{
								maxWidth: "760px",
								display: "flex",
								flexDirection: "column",
							}}
						>
							{news.map((item) => (
								<Link
									key={item.slug}
									href={`/news/${item.slug}/`}
									style={{
										display: "block",
										padding: "1.5rem 0",
										borderTop: "1px solid var(--gray-dark)",
									}}
								>
									<div
										style={{
											fontSize: "0.7rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.05em",
											marginBottom: "0.5rem",
										}}
									>
										<time dateTime={item.date}>{formatDate(item.date)}</time>
										{item.category ? ` · ${item.category}` : ""}
									</div>
									<div
										style={{
											fontSize: "0.95rem",
											color: "var(--gray-light)",
											lineHeight: "1.6",
											marginBottom: "0.5rem",
										}}
									>
										{item.title}
									</div>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.8",
										}}
									>
										{item.description}
									</p>
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					) : (
						<div className="fade-in" style={{ maxWidth: "640px" }}>
							<p
								style={{
									fontSize: "0.9rem",
									color: "var(--gray-medium)",
									lineHeight: "1.95",
									marginBottom: "1.5rem",
								}}
							>
								Kuu株式会社からのお知らせ・プレスリリースを掲載予定です。現在準備中につき、最初のお知らせ公開までしばらくお待ちください。
							</p>
							<p
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-dim)",
									lineHeight: "1.95",
								}}
							>
								先行情報やサービスに関するお問い合わせは{" "}
								<a
									href="/contact/"
									style={{
										color: "var(--gray-light)",
										borderBottom: "1px solid var(--gray-dark)",
									}}
								>
									Contact
								</a>{" "}
								からどうぞ。
							</p>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}
