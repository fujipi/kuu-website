import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Stars from "@/components/Stars";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
	title: "ブログ | AIエージェント・DX戦略コラム",
	description:
		"AIエージェント導入・エージェントガバナンス・DX戦略に関する実践的な情報を発信しています。中小企業のAI活用から最新のエージェント技術トレンドまで。",
	alternates: { canonical: "https://kuucorp.com/blog/" },
	openGraph: {
		title: "ブログ | AIエージェント・DX戦略コラム | Kuu株式会社",
		description:
			"AIエージェント導入・エージェントガバナンス・DX戦略に関する実践的な情報を発信しています。",
		url: "https://kuucorp.com/blog/",
	},
};

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/services/ax-dx/", label: "AX/DX" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default function BlogListPage() {
	const posts = getAllPosts();

	return (
		<>
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Blog</h1>

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
									{post.tags.length > 0 && (
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
									)}
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
