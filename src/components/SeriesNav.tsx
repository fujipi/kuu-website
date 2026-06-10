import Link from "next/link";
import type { BlogPostMeta } from "@/lib/mdx";

interface Props {
	/** 現在表示中の記事 slug */
	currentSlug: string;
	/** シリーズ名（frontmatter `series`） */
	series: string;
	/** シリーズ内の記事（series_order 順） */
	posts: BlogPostMeta[];
}

/**
 * シリーズ記事のナビゲーション。series frontmatter を持つ記事が
 * 2本以上あるときのみ描画する（1本以下では何も出さない）。
 */
export default function SeriesNav({ currentSlug, series, posts }: Props) {
	if (posts.length < 2) return null;

	return (
		<nav
			className="fade-in"
			aria-label={`シリーズ: ${series}`}
			style={{
				maxWidth: "720px",
				border: "1px solid var(--gray-dark)",
				borderRadius: "4px",
				padding: "1.25rem 1.5rem",
				marginBottom: "2.5rem",
				background: "rgba(255,255,255,0.02)",
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
				SERIES: {series}
			</div>
			<ol
				style={{
					listStyle: "none",
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem",
				}}
			>
				{posts.map((p, i) => (
					<li key={p.slug} style={{ fontSize: "0.8rem", lineHeight: "1.6" }}>
						<span
							style={{
								color: "var(--gray-dim)",
								fontFamily: "var(--font-heading)",
								marginRight: "0.5rem",
							}}
						>
							{i + 1}.
						</span>
						{p.slug === currentSlug ? (
							<span aria-current="page" style={{ color: "var(--white)" }}>
								{p.title}
							</span>
						) : (
							<Link
								href={`/blog/${p.slug}/`}
								style={{ color: "var(--gray-medium)" }}
							>
								{p.title}
							</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
