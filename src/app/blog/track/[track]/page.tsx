import type { Metadata } from "next";
import Link from "next/link";
import CtaBox from "@/components/CtaBox";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getAllPosts } from "@/lib/mdx";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";
import {
	isTrackSlug,
	resolveTrack,
	TRACK_INFO,
	TRACK_SLUGS,
	type TrackSlug,
} from "@/lib/taxonomy";

interface Props {
	params: Promise<{ track: string }>;
}

export async function generateStaticParams() {
	return TRACK_SLUGS.map((track) => ({ track }));
}

function getTrackPosts(track: TrackSlug) {
	return getAllPosts().filter((p) => resolveTrack(p.slug, p.track) === track);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { track } = await params;
	if (!isTrackSlug(track)) return { title: "カテゴリが見つかりません" };
	const info = TRACK_INFO[track];
	const posts = getTrackPosts(track);
	return seoMetadata({
		title: `${info.label}の技術記事一覧 (${posts.length}件) | Kuu株式会社ブログ`,
		description: info.description,
		path: `/blog/track/${track}/`,
	});
}

function formatDate(d: string): string {
	const dt = new Date(d);
	if (Number.isNaN(dt.getTime())) return d;
	return dt.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function TrackArchivePage({ params }: Props) {
	const { track } = await params;

	if (!isTrackSlug(track)) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							カテゴリが見つかりません。
						</p>
						<Link
							href="/blog/"
							style={{ color: "var(--white)", fontSize: "0.85rem" }}
						>
							← ブログ一覧へ
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const info = TRACK_INFO[track];
	const posts = getTrackPosts(track);
	const url = `${BASE_URL}/blog/track/${track}/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `${info.label}の技術記事一覧`,
			description: info.description,
			url,
			isPartOf: {
				"@type": "WebSite",
				url: BASE_URL,
				name: "Kuu株式会社",
			},
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: posts.length,
				itemListElement: posts.map((p, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: `${BASE_URL}/blog/${p.slug}/`,
					name: p.title,
				})),
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "ブログ", path: "/blog/" },
			{ name: info.label, path: `/blog/track/${track}/` },
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
						<Link href="/blog/" style={{ color: "var(--gray-medium)" }}>
							Blog
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>Track: {info.label}</span>
					</nav>

					<h1 className="page-title fade-in">{info.label}</h1>
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
						{info.description}
					</p>

					{/* 他トラックへの横断リンク */}
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
						{TRACK_SLUGS.map((t) => (
							<Link
								key={t}
								href={`/blog/track/${t}/`}
								aria-current={t === track ? "page" : undefined}
								style={{
									fontSize: "0.65rem",
									color: t === track ? "var(--white)" : "var(--gray-dim)",
									border: `1px solid ${
										t === track ? "var(--gray-medium)" : "var(--gray-dark)"
									}`,
									borderRadius: "2px",
									padding: "0.2rem 0.6rem",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								{TRACK_INFO[t].label}
							</Link>
						))}
					</div>

					{posts.length === 0 ? (
						<p
							className="fade-in"
							style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
						>
							このカテゴリの記事を準備中です。
						</p>
					) : (
						<div
							className="fade-in-stagger blog-list"
							style={{ maxWidth: "720px" }}
						>
							{posts.map((post) => (
								<Link
									key={post.slug}
									href={`/blog/${post.slug}/`}
									className="blog-list-item fade-in-item"
								>
									<time
										dateTime={post.date}
										style={{
											fontSize: "0.7rem",
											color: "var(--gray-dim)",
											fontFamily: "var(--font-heading)",
											letterSpacing: "0.05em",
											display: "block",
											marginBottom: "0.5rem",
										}}
									>
										{formatDate(post.date)}
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
										{post.title}
									</h2>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
											maxWidth: "600px",
										}}
									>
										{post.description}
									</p>
								</Link>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					)}

					<div style={{ marginTop: "3rem" }}>
						<CtaBox track={track} />
					</div>

					<div className="fade-in">
						<Link
							href="/blog/"
							style={{
								fontSize: "0.8rem",
								color: "var(--gray-medium)",
								borderBottom: "1px solid var(--gray-dark)",
								paddingBottom: "0.2rem",
							}}
						>
							← ブログ一覧へ戻る
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
