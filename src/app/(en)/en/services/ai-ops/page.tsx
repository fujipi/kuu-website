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
	title: "Agent Implementation & Governance | Kuu Inc.",
	description:
		"Stage 03-04 of the Kuu funnel: forward deployed engineers build agents in your environment with Claude Code, Codex, MCP, Skills and orchestration — governed continuously with 9-axis evaluation and AI red teaming.",
	path: "/en/services/ai-ops/",
	lang: "en",
	languages: { ja: "/services/ai-ops/", en: "/en/services/ai-ops/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Agent Implementation & Governance",
		provider: ORG_REF,
		areaServed: "JP",
		availableLanguage: ["ja", "en"],
		url: `${BASE_URL}/en/services/ai-ops/`,
		description:
			"Forward deployed engineers build and continuously govern AI agents with 9-axis evaluation and AI red teaming.",
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Services", path: "/en/services/" },
		{ name: "Agent Implementation & Governance", path: "/en/services/ai-ops/" },
	]),
];

const points = [
	{
		title: "Forward deployed engineering",
		body: "FDEs work inside your environment and build agents against your real systems — combining Claude Code, Codex, MCP, Skills, sub-agents, routines and orchestration.",
	},
	{
		title: "Governance built in from day one",
		body: "Permissions, audit logs, approval flows and usage policies are part of the initial design, not retrofitted after an incident.",
	},
	{
		title: "Continuous 9-axis evaluation",
		body: "Accuracy, safety, speed, cost and more — each agent is scored on nine axes, red-teamed, and improved on a continuous cycle so quality holds as usage grows.",
	},
];

export default function EnAiOpsPage() {
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
						<span>Agent Implementation & Governance</span>
					</nav>

					<h1 className="page-title fade-in">
						Agent Implementation & Governance
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
						The back half of the Kuu funnel (Stage 03–04). We build the agents,
						and we keep them governed: implementation and operation are one
						service, because agents that are not continuously evaluated degrade
						quietly.
					</p>

					<section style={{ marginBottom: "4rem", maxWidth: "720px" }}>
						<h2 className="section-label fade-in">What we do</h2>
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
							For the principles behind this service, see{" "}
							<Link
								href="/en/ai-governance/"
								style={{ color: "var(--gray-light)" }}
							>
								our agent governance guide
							</Link>
							. For large-scale environments, see{" "}
							<Link
								href="/en/services/rde/"
								style={{ color: "var(--gray-light)" }}
							>
								RDE
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
