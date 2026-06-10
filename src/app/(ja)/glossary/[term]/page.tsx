import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import {
	getAllGlossarySlugs,
	getGlossaryTermBySlug,
	getResolvedRelatedTerms,
} from "@/lib/glossary";
import { getPostsMentioningTerm } from "@/lib/glossaryMentions";
import { mdToHtml } from "@/lib/mdToHtml";
import { getMainNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

interface Props {
	params: Promise<{ term: string }>;
}

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

export default async function GlossaryTermPage({ params }: Props) {
	const { term: slug } = await params;
	const t = getGlossaryTermBySlug(slug);
	if (!t) {
		return (
			<>
				<Stars />
				<Header navLinks={getMainNav()} />
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

	const relatedEntries = getResolvedRelatedTerms(slug);
	const mentioningPosts = getPostsMentioningTerm(slug);

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
			speakable: {
				"@type": "SpeakableSpecification",
				cssSelector: [".short-def"],
			},
		},
		buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "用語集", path: "/glossary/" },
			{ name: t.term, path: `/glossary/${slug}/` },
		]),
	];

	const contentHtml = mdToHtml(t.content);

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
						<Link href="/glossary/" style={{ color: "var(--gray-medium)" }}>
							Glossary
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>{t.term}</span>
					</nav>

					<h1
						data-pagefind-body
						data-pagefind-meta="title"
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
							className="short-def"
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
						data-pagefind-body
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

					{mentioningPosts.length > 0 && (
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
								この用語に言及している記事
							</h2>
							<div style={{ display: "flex", flexDirection: "column" }}>
								{mentioningPosts.map((p) => (
									<Link
										key={p.slug}
										href={`/blog/${p.slug}/`}
										style={{
											padding: "0.75rem 0",
											borderTop: "1px solid var(--gray-dark)",
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
											lineHeight: "1.7",
										}}
									>
										{p.title}
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
