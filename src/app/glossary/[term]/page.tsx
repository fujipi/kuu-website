import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import {
	getAllGlossarySlugs,
	getAllGlossaryTerms,
	getGlossaryTermBySlug,
} from "@/lib/glossary";
import { generateMetadata as seoMetadata } from "@/lib/seo";

interface Props {
	params: Promise<{ term: string }>;
}

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/blog/", label: "Blog" },
	{ href: "/services/ai-ops/", label: "Agent Governance" },
	{ href: "/contact/", label: "Contact" },
];

const BASE_URL = "https://kuucorp.com";

export async function generateStaticParams() {
	return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { term: slug } = await params;
	const t = getGlossaryTermBySlug(slug);
	if (!t) return { title: "用語が見つかりません" };
	const title = `${t.term}とは${t.english ? ` (${t.english})` : ""}——意味・使い方 | Kuu株式会社 用語集`;
	return seoMetadata({
		title,
		description: t.description || t.shortDefinition,
		path: `/glossary/${slug}/`,
	});
}

function mdToHtml(md: string): string {
	const rawBlocks = md.split(/\n\n+/);
	const out: string[] = [];
	for (const rawBlock of rawBlocks) {
		const block = rawBlock.trim();
		if (!block) continue;
		if (/^#{1,4} /.test(block)) {
			out.push(
				block
					.replace(/^#### (.+)$/gm, "<h4>$1</h4>")
					.replace(/^### (.+)$/gm, "<h3>$1</h3>")
					.replace(/^## (.+)$/gm, "<h2>$1</h2>")
					.replace(/^# (.+)$/gm, "<h1>$1</h1>")
					.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
					.replace(/\*(.+?)\*/g, "<em>$1</em>")
					.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
					.replace(/`([^`]+)`/g, "<code>$1</code>"),
			);
			continue;
		}
		const lines = block.split("\n");
		const isList = lines.every(
			(l) => /^[-*] /.test(l) || /^\d+\. /.test(l) || l.trim() === "",
		);
		if (isList && lines.some((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))) {
			const ordered = lines.some((l) => /^\d+\. /.test(l));
			const tag = ordered ? "ol" : "ul";
			const items = lines
				.filter((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))
				.map((l) => {
					const text = l.replace(/^[-*] /, "").replace(/^\d+\. /, "");
					return `<li>${text
						.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
						.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
						.replace(/`([^`]+)`/g, "<code>$1</code>")}</li>`;
				})
				.join("\n");
			out.push(`<${tag}>\n${items}\n</${tag}>`);
			continue;
		}
		const inline = block
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
			.replace(/`([^`]+)`/g, "<code>$1</code>");
		out.push(`<p>${inline.replace(/\n/g, "<br />")}</p>`);
	}
	return out.join("\n");
}

export default async function GlossaryTermPage({ params }: Props) {
	const { term: slug } = await params;
	const t = getGlossaryTermBySlug(slug);
	if (!t) {
		return (
			<>
				<Stars />
				<Header navLinks={navLinks} />
				<main>
					<div className="page-content">
						<p style={{ color: "var(--gray-medium)" }}>
							用語が見つかりません。
						</p>
						<Link
							href="/glossary/"
							style={{ color: "var(--white)", fontSize: "0.85rem" }}
						>
							← 用語集へ
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const all = getAllGlossaryTerms();
	const relatedEntries = t.relatedTerms
		.map((rslug) => all.find((x) => x.slug === rslug))
		.filter((x): x is NonNullable<typeof x> => !!x);

	const url = `${BASE_URL}/glossary/${slug}/`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "DefinedTerm",
			name: t.term,
			alternateName: t.english,
			description: t.shortDefinition,
			url,
			inDefinedTermSet: `${BASE_URL}/glossary/`,
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
				{
					"@type": "ListItem",
					position: 2,
					name: "用語集",
					item: `${BASE_URL}/glossary/`,
				},
				{ "@type": "ListItem", position: 3, name: t.term, item: url },
			],
		},
	];

	const contentHtml = mdToHtml(t.content);

	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

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
						<Link href="/glossary/" style={{ color: "var(--gray-medium)" }}>
							Glossary
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{t.term}</span>
					</nav>

					<h1
						className="fade-in"
						style={{
							fontSize: "clamp(1.2rem, 2.8vw, 1.7rem)",
							fontWeight: 500,
							lineHeight: "1.5",
							marginBottom: "0.5rem",
						}}
					>
						{t.term}
					</h1>
					{(t.reading || t.english) && (
						<p
							className="fade-in"
							style={{
								fontSize: "0.7rem",
								color: "var(--gray-dim)",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.05em",
								marginBottom: "2rem",
							}}
						>
							{t.reading ? `読み: ${t.reading}` : null}
							{t.reading && t.english ? " / " : null}
							{t.english ? `English: ${t.english}` : null}
						</p>
					)}

					<div
						className="fade-in"
						style={{
							border: "1px solid var(--gray-dark)",
							padding: "1.25rem 1.5rem",
							borderRadius: "4px",
							marginBottom: "2.5rem",
							background: "rgba(255,255,255,0.02)",
							maxWidth: "720px",
						}}
					>
						<div
							style={{
								fontSize: "0.65rem",
								color: "var(--gray-dim)",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.1em",
								marginBottom: "0.5rem",
							}}
						>
							SHORT DEFINITION
						</div>
						<p
							style={{
								fontSize: "0.9rem",
								color: "var(--gray-light)",
								lineHeight: "1.9",
							}}
						>
							{t.shortDefinition}
						</p>
					</div>

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "720px", marginBottom: "3rem" }}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time markdown
						dangerouslySetInnerHTML={{ __html: contentHtml }}
					/>

					{relatedEntries.length > 0 && (
						<section
							className="fade-in"
							style={{ maxWidth: "720px", marginBottom: "3rem" }}
						>
							<h2
								style={{
									fontSize: "0.8rem",
									color: "var(--gray-light)",
									fontFamily: "var(--font-heading)",
									letterSpacing: "0.1em",
									marginBottom: "1rem",
								}}
							>
								関連用語
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{relatedEntries.map((r) => (
									<Link
										key={r.slug}
										href={`/glossary/${r.slug}/`}
										style={{
											padding: "0.75rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
										}}
									>
										{r.term} — {r.shortDefinition}
									</Link>
								))}
								<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
							</div>
						</section>
					)}

					<div className="fade-in" style={{ maxWidth: "720px" }}>
						<Link
							href="/glossary/"
							style={{
								fontSize: "0.8rem",
								color: "var(--gray-medium)",
								borderBottom: "1px solid var(--gray-dark)",
								paddingBottom: "0.2rem",
							}}
						>
							← 用語集へ戻る
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
