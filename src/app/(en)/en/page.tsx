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
	generateMetadata as seoMetadata,
} from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
	title: "Kuu Inc. | AI Agent Governance from Japan",
	description:
		"Kuu Inc. is a Tokyo-based AI agent governance company. We design AX/DX strategy, implement AI agents with forward deployed engineers, and operate continuous agent governance.",
	path: "/en/",
	lang: "en",
	languages: { ja: "/", en: "/en/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Kuu Inc. | AI Agent Governance from Japan",
		url: `${BASE_URL}/en/`,
		inLanguage: "en",
		isPartOf: {
			"@type": "WebSite",
			url: BASE_URL,
			name: "Kuu株式会社",
		},
	},
	buildBreadcrumb([{ name: "Home", path: "/en/" }]),
];

const services = [
	{
		href: "/en/services/ax-dx/",
		title: "AX/DX Strategy Consulting",
		body: "We build DX/AX roadmaps backwards from management goals, select the right LLMs (Claude, ChatGPT, Gemini), and turn them into executable implementation plans.",
	},
	{
		href: "/en/services/rde/",
		title: "RDE — Reinvention Deployed Engineering",
		body: "Our engineers go deep into your operations, existing systems and data to extract hypotheses and opportunities for redesigning workflows on an AI-first basis.",
	},
	{
		href: "/en/services/ai-ops/",
		title: "Agent Implementation & Governance",
		body: "Forward deployed engineers design agents combining Claude Code, MCP, Skills and orchestration — then keep them governed with our 9-axis evaluation and AI red teaming.",
	},
];

export default function EnHomePage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

			<main>
				<div className="page-content">
					<section style={{ marginBottom: "4.5rem" }}>
						<h1
							className="fade-in"
							style={{
								fontSize: "clamp(1.5rem, 3.5vw, 2.3rem)",
								fontWeight: 500,
								lineHeight: "1.45",
								letterSpacing: "0.02em",
								marginBottom: "1.5rem",
								maxWidth: "760px",
							}}
						>
							AI Agent Governance from Japan
						</h1>
						<p
							className="fade-in"
							style={{
								fontSize: "0.95rem",
								color: "var(--gray-medium)",
								lineHeight: "2",
								maxWidth: "640px",
								marginBottom: "2rem",
							}}
						>
							Kuu Inc. is a Tokyo-based technology company specializing in AI
							agent governance. We take companies from AX/DX strategy through
							agent implementation to continuous governance — one partner, end
							to end. Our slogan: systems that permeate, creating freedom for
							everyone.
						</p>
						<div
							className="fade-in"
							style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}
						>
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
							<Link
								href="/en/ai-governance/"
								style={{
									fontSize: "0.85rem",
									color: "var(--gray-light)",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.2rem",
									alignSelf: "center",
								}}
							>
								What is agent governance?
							</Link>
						</div>
					</section>

					<section style={{ marginBottom: "4.5rem" }}>
						<h2 className="section-label fade-in">Services</h2>
						<div
							className="fade-in-stagger"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
								gap: "1.25rem",
								maxWidth: "960px",
							}}
						>
							{services.map((s) => (
								<Link
									key={s.href}
									href={s.href}
									className="fade-in-item"
									style={{
										display: "block",
										border: "1px solid var(--gray-dark)",
										borderRadius: "4px",
										padding: "1.5rem",
										background: "rgba(255,255,255,0.02)",
									}}
								>
									<h3
										style={{
											fontSize: "0.95rem",
											fontWeight: 500,
											color: "var(--white)",
											marginBottom: "0.75rem",
											lineHeight: "1.6",
										}}
									>
										{s.title}
									</h3>
									<p
										style={{
											fontSize: "0.8rem",
											color: "var(--gray-medium)",
											lineHeight: "1.8",
										}}
									>
										{s.body}
									</p>
								</Link>
							))}
						</div>
					</section>

					<section style={{ marginBottom: "4.5rem", maxWidth: "640px" }}>
						<h2 className="section-label fade-in">Why governance</h2>
						<p
							className="fade-in"
							style={{
								fontSize: "0.9rem",
								color: "var(--gray-medium)",
								lineHeight: "2",
								marginBottom: "1.25rem",
							}}
						>
							Autonomous AI agents only create durable value when they are
							designed, evaluated and improved as a system — with permissions,
							audit logs, evaluation axes and human oversight built in. That
							discipline is agent governance, and it is all we do.
						</p>
						<p className="fade-in">
							<Link
								href="/en/about/"
								style={{
									fontSize: "0.85rem",
									color: "var(--gray-light)",
									borderBottom: "1px solid var(--gray-dark)",
									paddingBottom: "0.2rem",
								}}
							>
								About Kuu Inc. →
							</Link>
						</p>
					</section>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
