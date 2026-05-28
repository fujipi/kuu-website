import Link from "next/link";
import { buildPageUrl } from "@/lib/blog-pagination";
import type { BlogPostMeta } from "@/lib/mdx";

interface Tag {
	tag: string;
	slug: string;
	count: number;
}

interface Props {
	posts: BlogPostMeta[];
	tags: Tag[];
	page: number;
	totalPages: number;
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

export default function BlogListView({ posts, tags, page, totalPages }: Props) {
	const showHeader = page === 1;

	return (
		<>
			<h1 className="page-title fade-in">
				Blog
				{page > 1 ? (
					<span
						style={{
							fontFamily: "var(--font-heading)",
							fontSize: "0.6em",
							color: "var(--gray-dim)",
							letterSpacing: "0.1em",
							marginLeft: "1rem",
						}}
					>
						Page {page} / {totalPages}
					</span>
				) : null}
			</h1>

			{showHeader ? (
				<>
					<div
						className="fade-in"
						style={{
							display: "flex",
							gap: "1rem",
							fontSize: "0.7rem",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
							color: "var(--gray-dim)",
							marginBottom: "1.5rem",
							flexWrap: "wrap",
						}}
					>
						<a href="/feed.xml" style={{ color: "var(--gray-medium)" }}>
							RSS
						</a>
						<a href="/atom.xml" style={{ color: "var(--gray-medium)" }}>
							Atom
						</a>
						<a href="/feed.json" style={{ color: "var(--gray-medium)" }}>
							JSON Feed
						</a>
						<Link href="/glossary/" style={{ color: "var(--gray-medium)" }}>
							Glossary
						</Link>
						<Link
							href="/ai-governance/"
							style={{ color: "var(--gray-medium)" }}
						>
							Pillar
						</Link>
					</div>

					{tags.length > 0 ? (
						<div
							className="fade-in"
							style={{
								display: "flex",
								gap: "0.5rem",
								flexWrap: "wrap",
								marginBottom: "2rem",
								maxWidth: "720px",
							}}
						>
							{tags.map((t) => (
								<Link
									key={t.slug}
									href={`/blog/tags/${t.slug}/`}
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
									#{t.tag} ({t.count})
								</Link>
							))}
						</div>
					) : null}
				</>
			) : null}

			{posts.length === 0 ? (
				<p
					className="fade-in"
					style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
				>
					記事を準備中です。
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
							{post.tags.length > 0 ? (
								<div
									style={{
										display: "flex",
										gap: "0.5rem",
										marginTop: "0.75rem",
										flexWrap: "wrap",
									}}
								>
									{post.tags.map((tag) => (
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

			{totalPages > 1 ? (
				<Pagination page={page} totalPages={totalPages} />
			) : null}
		</>
	);
}

function Pagination({
	page,
	totalPages,
}: {
	page: number;
	totalPages: number;
}) {
	const prev = page > 1 ? buildPageUrl(page - 1) : null;
	const next = page < totalPages ? buildPageUrl(page + 1) : null;
	const numbers = pageNumbers(page, totalPages);

	return (
		<nav
			aria-label="ページネーション"
			className="blog-pagination fade-in"
			style={{ maxWidth: "720px" }}
		>
			<div className="blog-pagination-inner">
				<div className="blog-pagination-nav">
					{prev ? (
						<Link href={prev} rel="prev" className="blog-pagination-arrow">
							← 前のページ
						</Link>
					) : (
						<span className="blog-pagination-arrow blog-pagination-arrow-disabled">
							← 前のページ
						</span>
					)}
					{next ? (
						<Link href={next} rel="next" className="blog-pagination-arrow">
							次のページ →
						</Link>
					) : (
						<span className="blog-pagination-arrow blog-pagination-arrow-disabled">
							次のページ →
						</span>
					)}
				</div>
				<ul className="blog-pagination-numbers" aria-label="ページ番号">
					{numbers.map((n, i) =>
						n === "…" ? (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: static pagination gap, list does not reorder
								key={`gap-${i}`}
								className="blog-pagination-gap"
								aria-hidden="true"
							>
								…
							</li>
						) : n === page ? (
							<li
								key={n}
								aria-current="page"
								className="blog-pagination-current"
							>
								{n}
							</li>
						) : (
							<li key={n}>
								<Link href={buildPageUrl(n)}>{n}</Link>
							</li>
						),
					)}
				</ul>
			</div>
		</nav>
	);
}

function pageNumbers(current: number, total: number): (number | "…")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const set = new Set<number>([1, total, current, current - 1, current + 1]);
	const filtered = Array.from(set)
		.filter((n) => n >= 1 && n <= total)
		.sort((a, b) => a - b);
	const out: (number | "…")[] = [];
	for (let i = 0; i < filtered.length; i++) {
		out.push(filtered[i]);
		if (i < filtered.length - 1 && filtered[i + 1] - filtered[i] > 1) {
			out.push("…");
		}
	}
	return out;
}
