import type { Metadata } from "next";
import Link from "next/link";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getEnNav } from "@/lib/navigation";
import {
	BASE_URL,
	buildBreadcrumb,
	ORG_REF,
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "RDE — Reinvention Deployed Engineering | Kuu Inc.",
	description:
		"Stage 02 of the Kuu funnel: engineers embed deep in your operations, systems and data to extract hypotheses for redesigning workflows AI-first. Transformation-grade discovery for enterprise environments.",
	path: "/en/services/rde/",
	lang: "en",
	languages: { ja: "/services/rde/", en: "/en/services/rde/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "RDE — Reinvention Deployed Engineering",
		provider: ORG_REF,
		areaServed: "JP",
		availableLanguage: ["ja", "en"],
		url: `${BASE_URL}/en/services/rde/`,
		description:
			"Transformation-grade discovery: engineers embed in operations, systems and data to find AI-first workflow redesign opportunities.",
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Services", path: "/en/services/" },
		{ name: "RDE", path: "/en/services/rde/" },
	]),
];

const points = [
	{
		title: "Deep embedding, not interviews",
		body: "RDE engineers work inside your operations, existing systems and data — the opportunities that matter are rarely visible from a slide deck.",
	},
	{
		title: "AI-first workflow redesign",
		body: "Instead of automating today's process as-is, we extract hypotheses for re-designing the workflow itself on the assumption that agents do the work.",
	},
	{
		title: "Enterprise-grade discovery",
		body: "Multi-team environments, IAM/SSO, data residency, procurement and vendor-risk constraints are part of the discovery, not an afterthought.",
	},
];

export default function EnRdePage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

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
						<Link href="/en/services/" style={{ color: "var(--gray-medium)" }}>
							Services
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>RDE</span>
					</nav>

					<h1 className="page-title fade-in">
						RDE — Reinvention Deployed Engineering
					</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							lineHeight: "2",
							maxWidth: "640px",
							marginBottom: "3rem",
						}}
					>
						Stage 02 of the Kuu funnel. Where conventional discovery produces a
						requirements list, RDE produces transformation hypotheses: where an
						AI-first redesign of the workflow itself — not just task automation
						— changes the economics of your operation.
					</p>

					<section style={{ marginBottom: "4rem", maxWidth: "720px" }}>
						<h2 className="section-label fade-in">How it works</h2>
						<div className="fade-in-stagger">
							{points.map((d) => (
								<div
									key={d.title}
									className="fade-in-item"
									style={{
										borderTop: "1px solid var(--gray-dark)",
										padding: "1.5rem 0",
									}}
								>
									<h3
										style={{
											fontSize: "0.95rem",
											fontWeight: 500,
											color: "var(--white)",
											marginBottom: "0.5rem",
										}}
									>
										{d.title}
									</h3>
									<p
										style={{
											fontSize: "0.85rem",
											color: "var(--gray-medium)",
											lineHeight: "1.9",
										}}
									>
										{d.body}
									</p>
								</div>
							))}
							<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
						</div>
					</section>

					<section className="fade-in" style={{ maxWidth: "640px" }}>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--gray-medium)",
								lineHeight: "1.9",
								marginBottom: "1.25rem",
							}}
						>
							Discovery hands over directly into{" "}
							<Link
								href="/en/services/ai-ops/"
								style={{ color: "var(--gray-light)" }}
							>
								agent implementation & governance
							</Link>{" "}
							without losing context.
						</p>
						<Link
							href="/en/contact/"
							style={{
								display: "inline-block",
								fontSize: "0.85rem",
								color: "var(--white)",
								border: "1px solid var(--white)",
								padding: "0.7rem 1.75rem",
								fontFamily: "var(--font-heading)",
								letterSpacing: "0.05em",
							}}
						>
							Contact us
						</Link>
					</section>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
