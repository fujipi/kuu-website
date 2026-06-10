import Link from "next/link";
import type { CaseEntryMeta } from "@/lib/case";
import { buildCasePageUrl } from "@/lib/case-pagination";

interface IndustryChip {
	slug: string;
	label: string;
	count: number;
}

interface Props {
	cases: CaseEntryMeta[];
	industries?: IndustryChip[];
	page: number;
	totalPages: number;
}

export default function CaseListView({
	cases,
	industries,
	page,
	totalPages,
}: Props) {
	const showHeader = page === 1;

	return (
		<>
			<h1 className="page-title fade-in">
				Case
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
					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							lineHeight: "1.95",
							maxWidth: "640px",
							marginBottom: "1.5rem",
						}}
					>
						Web の記事・X の投稿・企業の PR
						から見えてくる最新のユースケースをもとに、自社の業務にどう実装するかを具体的な形で書き起こすコーナーです。毎日継続的に追加していきます。
					</p>
					{industries && industries.length > 0 ? (
						<div
							className="fade-in"
							style={{
								display: "flex",
								gap: "0.5rem",
								flexWrap: "wrap",
								alignItems: "center",
								marginBottom: "2.5rem",
								maxWidth: "960px",
							}}
						>
							<span
								style={{
									fontSize: "0.65rem",
									color: "var(--gray-dim)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.1em",
								}}
							>
								INDUSTRY
							</span>
							{industries.map((ind) => (
								<Link
									key={ind.slug}
									href={`/case/industry/${ind.slug}/`}
									style={{
										fontSize: "0.65rem",
										color: "var(--gray-light)",
										border: "1px solid var(--gray-dark)",
										borderRadius: "2px",
										padding: "0.2rem 0.6rem",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
									}}
								>
									{ind.label} ({ind.count})
								</Link>
							))}
						</div>
					) : null}
				</>
			) : null}

			{cases.length === 0 ? (
				<p
					className="fade-in"
					style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}
				>
					ユースケースを準備中です。
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
	const prev = page > 1 ? buildCasePageUrl(page - 1) : null;
	const next = page < totalPages ? buildCasePageUrl(page + 1) : null;
	const numbers = pageNumbers(page, totalPages);

	return (
		<nav
			aria-label="ページネーション"
			className="blog-pagination fade-in"
			style={{ maxWidth: "1200px" }}
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
								<Link href={buildCasePageUrl(n)}>{n}</Link>
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
