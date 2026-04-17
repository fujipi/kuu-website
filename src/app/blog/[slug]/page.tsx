import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import ReadingTime from "@/components/ReadingTime";
import Stars from "@/components/Stars";
import TableOfContents from "@/components/TableOfContents";
import { getAuthorBySlug } from "@/lib/authors";
import { getAllPostSlugs, getAllPosts, getPostBySlug } from "@/lib/mdx";
import { readingTimeMinutes } from "@/lib/readingTime";
import { slugifyTag } from "@/lib/tags";
import { buildToc } from "@/lib/toc";

interface Props {
	params: Promise<{ slug: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/contact/", label: "Contact" },
];

export async function generateStaticParams() {
	const slugs = getAllPostSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) {
		return { title: "記事が見つかりません" };
	}
	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: `https://kuucorp.com/blog/${slug}/` },
		openGraph: {
			title: `${post.title} | Kuu株式会社`,
			description: post.description,
			url: `https://kuucorp.com/blog/${slug}/`,
			type: "article",
			publishedTime: post.date,
			siteName: "Kuu株式会社",
			locale: "ja_JP",
			images: [
				{
					url: "/images/ogp.png",
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${post.title} | Kuu株式会社`,
			description: post.description,
			images: ["/images/ogp.png"],
		},
		robots: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large" as const,
			"max-video-preview": -1,
		},
	};
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

/**
 * MDX本文をシンプルなHTMLへ変換する。
 * コンテンツはビルド時にローカルの content/blog/ ディレクトリから読み込むため、
 * 外部ユーザー入力は一切含まない。XSSリスクはゼロ。
 * idMap を渡すと H2/H3 に id 属性を付与する (TOC ジャンプ用)。
 */
function mdToHtml(md: string, idMap?: Map<string, string>): string {
	// ブロック単位で処理するため、まず空行で分割
	// 各ブロック内でインライン変換を行う
	const rawBlocks = md.split(/\n\n+/);

	const processedBlocks: string[] = [];

	const headingReplace = (level: 2 | 3, text: string): string => {
		const id = idMap?.get(`${level}:${text.trim()}`);
		return id
			? `<h${level} id="${id}">${text}</h${level}>`
			: `<h${level}>${text}</h${level}>`;
	};

	for (const rawBlock of rawBlocks) {
		const block = rawBlock.trim();
		if (!block) continue;

		// 見出し
		if (/^#{1,4} /.test(block)) {
			const converted = block
				.replace(/^#### (.+)$/gm, "<h4>$1</h4>")
				.replace(/^### (.+)$/gm, (_m, t) => headingReplace(3, t))
				.replace(/^## (.+)$/gm, (_m, t) => headingReplace(2, t))
				.replace(/^# (.+)$/gm, "<h1>$1</h1>")
				.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
				.replace(/\*(.+?)\*/g, "<em>$1</em>")
				.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
				.replace(/`([^`]+)`/g, "<code>$1</code>");
			processedBlocks.push(converted);
			continue;
		}

		// 水平線
		if (/^---$/.test(block)) {
			processedBlocks.push("<hr />");
			continue;
		}

		// リストブロック（番号付き・番号なし混在対応）
		const lines = block.split("\n");
		const isListBlock = lines.every(
			(l) => /^[-*] /.test(l) || /^\d+\. /.test(l) || l.trim() === "",
		);
		if (
			isListBlock &&
			lines.some((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))
		) {
			const isOrdered = lines.some((l) => /^\d+\. /.test(l));
			const tag = isOrdered ? "ol" : "ul";
			const items = lines
				.filter((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))
				.map((l) => {
					const text = l.replace(/^[-*] /, "").replace(/^\d+\. /, "");
					const inline = text
						.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
						.replace(/\*(.+?)\*/g, "<em>$1</em>")
						.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
						.replace(/`([^`]+)`/g, "<code>$1</code>");
					return `<li>${inline}</li>`;
				})
				.join("\n");
			processedBlocks.push(`<${tag}>\n${items}\n</${tag}>`);
			continue;
		}

		// 混在ブロック（太字ラベル行 + リスト行 が同一ブロック内に混在するケースなど）
		// 行ごとに分解して再帰的に処理
		const hasListLine = lines.some(
			(l) => /^[-*] /.test(l) || /^\d+\. /.test(l),
		);
		if (hasListLine) {
			let i = 0;
			while (i < lines.length) {
				const line = lines[i].trim();
				if (!line) {
					i++;
					continue;
				}
				if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
					// 連続するリスト行をまとめる
					const listLines: string[] = [];
					const isOrdered = /^\d+\. /.test(line);
					while (
						i < lines.length &&
						(/^[-*] /.test(lines[i]) || /^\d+\. /.test(lines[i]))
					) {
						listLines.push(lines[i]);
						i++;
					}
					const tag = isOrdered ? "ol" : "ul";
					const items = listLines
						.map((l) => {
							const text = l.replace(/^[-*] /, "").replace(/^\d+\. /, "");
							const inline = text
								.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
								.replace(/\*(.+?)\*/g, "<em>$1</em>")
								.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
								.replace(/`([^`]+)`/g, "<code>$1</code>");
							return `<li>${inline}</li>`;
						})
						.join("\n");
					processedBlocks.push(`<${tag}>\n${items}\n</${tag}>`);
				} else {
					// 非リスト行はそのまま段落として処理
					const inline = line
						.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
						.replace(/\*(.+?)\*/g, "<em>$1</em>")
						.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
						.replace(/`([^`]+)`/g, "<code>$1</code>");
					processedBlocks.push(`<p>${inline}</p>`);
					i++;
				}
			}
			continue;
		}

		// 通常の段落
		const inline = block
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.+?)\*/g, "<em>$1</em>")
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
			.replace(/`([^`]+)`/g, "<code>$1</code>");
		processedBlocks.push(`<p>${inline.replace(/\n/g, "<br />")}</p>`);
	}

	return processedBlocks.join("\n");
}

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return (
			<>
				<Stars />
				<Header navLinks={navLinks} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							記事が見つかりません。
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

	// 前後記事・関連記事
	const allPosts = getAllPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === slug);
	const prevPost =
		currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
	const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

	const relatedPosts = allPosts
		.filter((p) => p.slug !== slug)
		.map((p) => ({
			...p,
			sharedTags: p.tags.filter((t) => post.tags.includes(t)).length,
		}))
		.filter((p) => p.sharedTags > 0)
		.sort((a, b) => b.sharedTags - a.sharedTags)
		.slice(0, 3);

	// TOC 構築（H2/H3 の id 対応）
	const { toc, idMap } = buildToc(post.content);
	// 読了時間
	const minutes = readingTimeMinutes(post.content);
	// 著者メタ
	const author = getAuthorBySlug(post.author);

	// ローカルMDXファイル（外部入力なし）をビルド時に変換したHTML
	const contentHtml = mdToHtml(post.content, idMap);

	const articleJsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: post.title,
			description: post.description,
			author: {
				"@type": "Person",
				name: author.name,
				jobTitle: author.role,
				url: `https://kuucorp.com/authors/${author.slug}/`,
				knowsAbout: author.expertise,
				worksFor: {
					"@type": "Organization",
					name: "Kuu株式会社",
					url: "https://kuucorp.com",
				},
			},
			publisher: {
				"@type": "Organization",
				name: "Kuu株式会社",
				url: "https://kuucorp.com",
				logo: {
					"@type": "ImageObject",
					url: "https://kuucorp.com/images/favicon-192.png",
				},
			},
			datePublished: post.date,
			dateModified: post.lastModified,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `https://kuucorp.com/blog/${slug}/`,
			},
			url: `https://kuucorp.com/blog/${slug}/`,
			wordCount: post.content.length,
			articleSection: post.tags[0] ?? "AIエージェント",
			keywords: post.tags.join(", "),
			inLanguage: "ja",
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "ホーム",
					item: "https://kuucorp.com",
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "ブログ",
					item: "https://kuucorp.com/blog/",
				},
				{
					"@type": "ListItem",
					position: 3,
					name: post.title,
					item: `https://kuucorp.com/blog/${slug}/`,
				},
			],
		},
	];

	return (
		<>
			<JsonLd data={articleJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					{/* パンくず */}
					<nav
						className="fade-in"
						style={{
							fontSize: "0.7rem",
							color: "var(--gray-dim)",
							marginBottom: "2.5rem",
							fontFamily: "var(--font-heading)",
						}}
					>
						<Link href="/blog/" style={{ color: "var(--gray-medium)" }}>
							Blog
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{post.title}</span>
					</nav>

					{/* 記事ヘッダー */}
					<div style={{ maxWidth: "720px", marginBottom: "2rem" }}>
						<div
							className="fade-in"
							style={{
								display: "flex",
								alignItems: "center",
								flexWrap: "wrap",
								marginBottom: "1rem",
							}}
						>
							<time
								dateTime={post.date}
								style={{
									fontSize: "0.7rem",
									color: "var(--gray-dim)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.05em",
								}}
							>
								{formatDate(post.date)}
							</time>
							<ReadingTime minutes={minutes} />
						</div>
						<h1
							className="fade-in"
							style={{
								fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
								fontWeight: 500,
								lineHeight: "1.6",
								letterSpacing: "0.02em",
								marginBottom: "1rem",
							}}
						>
							{post.title}
						</h1>
						<div
							className="fade-in"
							style={{
								fontSize: "0.75rem",
								color: "var(--gray-dim)",
								marginBottom: "1rem",
							}}
						>
							by{" "}
							<Link
								href={`/authors/${author.slug}/`}
								style={{ color: "var(--gray-medium)" }}
							>
								{author.name}
							</Link>
							{post.lastModified && post.lastModified !== post.date && (
								<>
									{" · 更新日 "}
									<time dateTime={post.lastModified}>
										{formatDate(post.lastModified)}
									</time>
								</>
							)}
						</div>
						{post.tags.length > 0 && (
							<div
								className="fade-in"
								style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
							>
								{post.tags.map((tag) => (
									<Link
										key={tag}
										href={`/blog/tags/${slugifyTag(tag)}/`}
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
									</Link>
								))}
							</div>
						)}
					</div>

					<TableOfContents items={toc} />

					{/* 記事本文: ビルド時変換済みHTML（ローカルファイルのみ・外部入力なし） */}
					<article
						className="blog-content fade-in"
						style={{ maxWidth: "720px", marginBottom: "5rem" }}
						// Content is static markdown from local files, no external user input possible.
						// This is safe as it's rendered at build time (output: 'export').
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: contentHtml }}
					/>

					{/* 前後ナビゲーション */}
					<nav
						className="fade-in"
						style={{
							maxWidth: "720px",
							borderTop: "1px solid var(--gray-dark)",
							paddingTop: "2rem",
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "1rem",
							marginBottom: "3rem",
						}}
					>
						{prevPost ? (
							<Link
								href={`/blog/${prevPost.slug}/`}
								style={{
									display: "block",
									fontSize: "0.75rem",
									color: "var(--gray-medium)",
									lineHeight: "1.6",
								}}
							>
								<span
									style={{
										display: "block",
										fontSize: "0.65rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.25rem",
									}}
								>
									← 前の記事
								</span>
								{prevPost.title}
							</Link>
						) : (
							<div />
						)}
						{nextPost ? (
							<Link
								href={`/blog/${nextPost.slug}/`}
								style={{
									display: "block",
									fontSize: "0.75rem",
									color: "var(--gray-medium)",
									lineHeight: "1.6",
									textAlign: "right",
								}}
							>
								<span
									style={{
										display: "block",
										fontSize: "0.65rem",
										color: "var(--gray-dim)",
										fontFamily: "var(--font-heading)",
										letterSpacing: "0.05em",
										marginBottom: "0.25rem",
									}}
								>
									次の記事 →
								</span>
								{nextPost.title}
							</Link>
						) : (
							<div />
						)}
					</nav>

					{/* 関連記事 */}
					{relatedPosts.length > 0 && (
						<section
							className="fade-in"
							style={{
								maxWidth: "720px",
								marginBottom: "3rem",
							}}
						>
							<h2
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-light)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.1em",
									marginBottom: "1.5rem",
								}}
							>
								関連記事
							</h2>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								{relatedPosts.map((rp) => (
									<Link
										key={rp.slug}
										href={`/blog/${rp.slug}/`}
										style={{
											display: "block",
											padding: "1rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{rp.title}
									</Link>
								))}
								<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
							</div>
						</section>
					)}

					{/* ブログ一覧へ */}
					<div className="fade-in" style={{ maxWidth: "720px" }}>
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
