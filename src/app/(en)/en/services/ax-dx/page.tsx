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
	title: "AX/DX Strategy Consulting | Kuu Inc.",
	description:
		"Stage 01-02 of the Kuu funnel: DX/AX roadmaps built backwards from management goals, with LLM selection (Claude, ChatGPT, Gemini) turned into implementation-ready plans using Codex, MCP and Skills.",
	path: "/en/services/ax-dx/",
	lang: "en",
	languages: { ja: "/services/ax-dx/", en: "/en/services/ax-dx/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "AX/DX Strategy Consulting",
		provider: ORG_REF,
		areaServed: "JP",
		availableLanguage: ["ja", "en"],
		url: `${BASE_URL}/en/services/ax-dx/`,
		description:
			"DX/AX roadmaps built backwards from management goals, turned into implementation-ready plans.",
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Services", path: "/en/services/" },
		{ name: "AX/DX Strategy", path: "/en/services/ax-dx/" },
	]),
];

const deliverables = [
	{
		title: "Roadmap from management goals",
		body: "We start from business outcomes, not tools: which workflows to transform, in what order, with what payback horizon.",
	},
	{
		title: "LLM and platform selection",
		body: "Claude, ChatGPT or Gemini — and the surrounding stack (Codex, MCP, Skills) — selected against your security, data and cost constraints.",
	},
	{
		title: "Implementation-ready plans",
		body: "Plans that engineers can pick up directly: scope, architecture sketch, governance requirements and evaluation criteria are defined before the build starts.",
	},
];

export default function EnAxDxPage() {
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
						<span>AX/DX Strategy</span>
					</nav>

					<h1 className="page-title fade-in">AX/DX Strategy Consulting</h1>
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
						The front half of the Kuu funnel (Stage 01–02). We design the
						strategy for agent transformation (AX) and digital transformation
						(DX) — backwards from your management agenda, forwards into plans
						your team can actually build.
					</p>

					<section style={{ marginBottom: "4rem", maxWidth: "720px" }}>
						<h2 className="section-label fade-in">What you get</h2>
						<div className="fade-in-stagger">
							{deliverables.map((d) => (
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
							After strategy, most clients continue into{" "}
							<Link
								href="/en/services/rde/"
								style={{ color: "var(--gray-light)" }}
							>
								RDE discovery
							</Link>{" "}
							or directly into{" "}
							<Link
								href="/en/services/ai-ops/"
								style={{ color: "var(--gray-light)" }}
							>
								agent implementation & governance
							</Link>
							.
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
