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
	title: "Services | Kuu Inc.",
	description:
		"Kuu Inc. services: AX/DX strategy consulting, RDE (Reinvention Deployed Engineering) discovery, AI agent implementation with FDEs, and continuous agent governance with 9-axis evaluation.",
	path: "/en/services/",
	lang: "en",
	languages: { ja: "/services/", en: "/en/services/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Kuu Services",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "AX/DX Strategy Consulting",
				url: `${BASE_URL}/en/services/ax-dx/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "RDE Discovery",
				url: `${BASE_URL}/en/services/rde/`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: "Agent Implementation & Governance",
				url: `${BASE_URL}/en/services/ai-ops/`,
			},
		],
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Services", path: "/en/services/" },
	]),
];

const stages = [
	{
		stage: "01",
		href: "/en/services/ax-dx/",
		title: "AX/DX Strategy Consulting",
		body: "Roadmaps built backwards from management goals. LLM selection across Claude, ChatGPT and Gemini, turned into implementation-ready plans with Codex, MCP and Skills.",
	},
	{
		stage: "02",
		href: "/en/services/rde/",
		title: "RDE — Reinvention Deployed Engineering",
		body: "Transformation-grade discovery. Engineers embed in your operations, systems and data to find where AI-first workflow redesign creates the most leverage.",
	},
	{
		stage: "03–04",
		href: "/en/services/ai-ops/",
		title: "Agent Implementation & Governance",
		body: "Forward deployed engineers build agents in your environment — Claude Code, Codex, MCP, Skills, sub-agents, orchestration — then govern them continuously with 9-axis evaluation and AI red teaming.",
	},
];

export default function EnServicesPage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Services</h1>
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
						One funnel, one partner: from strategy (Stage 01) through deep
						discovery (Stage 02) to implementation and continuous governance
						(Stage 03–04). Each service stands alone, but they are designed to
						hand over to each other without losing context.
					</p>

					<div className="fade-in-stagger" style={{ maxWidth: "760px" }}>
						{stages.map((s) => (
							<Link
								key={s.href}
								href={s.href}
								className="fade-in-item"
								style={{
									display: "block",
									borderTop: "1px solid var(--gray-dark)",
									padding: "1.75rem 0",
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
									STAGE {s.stage}
								</div>
								<h2
									style={{
										fontSize: "1.05rem",
										fontWeight: 500,
										color: "var(--white)",
										marginBottom: "0.6rem",
										lineHeight: "1.6",
									}}
								>
									{s.title}
								</h2>
								<p
									style={{
										fontSize: "0.85rem",
										color: "var(--gray-medium)",
										lineHeight: "1.9",
										maxWidth: "640px",
									}}
								>
									{s.body}
								</p>
							</Link>
						))}
						<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
					</div>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
