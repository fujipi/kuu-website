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

const PAGE_URL = `${BASE_URL}/en/ai-governance/`;

export const metadata: Metadata = seoMetadata({
	title: "What is AI Agent Governance? — A Practical Guide | Kuu Inc.",
	description:
		"AI agent governance is the discipline of designing, evaluating and improving autonomous agents as a system: permissions, audit logs, 9-axis evaluation and human oversight. A practical guide by Kuu Inc.",
	path: "/en/ai-governance/",
	lang: "en",
	languages: { ja: "/ai-governance/", en: "/en/ai-governance/" },
});

const faqs = [
	{
		q: "How is agent governance different from traditional AI governance?",
		a: "Traditional AI governance focuses on model-level ethics and risk. Agent governance covers the operational control of autonomous agents: approval flows, permissions, audit logging and continuous improvement across the full operating lifecycle.",
	},
	{
		q: "When should a company start?",
		a: "Around the third agent. One or two agents can be managed informally, but designing governance before the third minimizes migration cost — retrofitting a framework after five or more agents requires re-auditing everything already in production.",
	},
	{
		q: "Do we need in-house AI engineers first?",
		a: "No. Governance is a management framework; implementation can be externalized through managed-agent style services. What it does require is commitment from decision makers.",
	},
];

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: "What is AI Agent Governance? — A Practical Guide",
		description:
			"Designing, evaluating and improving autonomous AI agents as a system: permissions, audit logs, 9-axis evaluation and human oversight.",
		author: ORG_REF,
		publisher: {
			"@type": "Organization",
			name: "Kuu株式会社",
			url: BASE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${BASE_URL}/images/favicon-192.png`,
			},
		},
		mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
		url: PAGE_URL,
		inLanguage: "en",
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".answer-block"],
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: { "@type": "Answer", text: f.a },
		})),
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Agent Governance", path: "/en/ai-governance/" },
	]),
];

export default function EnAiGovernancePage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

			<main>
				<div className="page-content" data-pagefind-body>
					<nav
						className="fade-in"
						style={{
							fontSize: "0.7rem",
							color: "var(--gray-dim)",
							marginBottom: "2rem",
							fontFamily: "var(--font-heading)",
						}}
					>
						<Link href="/en/" style={{ color: "var(--gray-medium)" }}>
							Home
						</Link>
						<span style={{ margin: "0 0.5rem" }}>/</span>
						<span>Agent Governance</span>
					</nav>

					<h1
						data-pagefind-meta="title"
						className="fade-in"
						style={{
							fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
							fontWeight: 500,
							lineHeight: "1.5",
							marginBottom: "2rem",
						}}
					>
						What is AI Agent Governance?
					</h1>

					<div
						className="fade-in answer-block"
						style={{ marginBottom: "3rem", maxWidth: "760px" }}
					>
						<p>
							AI agent governance is the systematic discipline of designing,
							operating, evaluating and improving the autonomous AI agents
							running inside an organization. It combines permissions, audit
							logs, evaluation axes and human oversight so that agents keep
							creating value as their number grows.
						</p>
					</div>

					<article
						className="blog-content fade-in"
						style={{ maxWidth: "760px", marginBottom: "4rem" }}
					>
						<h2>Why it matters now</h2>
						<p>
							A single agent can be managed by the person who built it. By the
							third agent, informal management starts to break: nobody can say
							which agent touched which data, quality drifts without anyone
							noticing, and every incident becomes an archaeology project.
							Governance is cheapest to install before that point — and
							dramatically more expensive after.
						</p>

						<h2>The four pillars</h2>
						<ul>
							<li>
								<strong>Permissions & identity</strong> — each agent runs with
								scoped credentials, not a human&apos;s account, and its blast
								radius is bounded by design.
							</li>
							<li>
								<strong>Audit & observability</strong> — every tool call and
								decision is logged in a tamper-evident way so incidents can be
								reconstructed.
							</li>
							<li>
								<strong>Evaluation</strong> — agents are scored continuously on
								axes such as accuracy, safety, speed and cost (we use a 9-axis
								framework), with regression tests before changes ship.
							</li>
							<li>
								<strong>Human oversight</strong> — approval flows define which
								decisions stay with people, and usage policy prevents shadow AI
								from growing in the dark.
							</li>
						</ul>

						<h2>How Kuu helps</h2>
						<p>
							Kuu Inc. implements this discipline as a service: forward deployed
							engineers build agents in your environment and operate them under
							continuous governance. See{" "}
							<Link href="/en/services/ai-ops/">
								Agent Implementation & Governance
							</Link>{" "}
							for the delivery model, or{" "}
							<Link href="/en/services/rde/">RDE</Link> for enterprise-scale
							transformation. The full Japanese guide with our 9-axis framework
							and regulatory mapping (EU AI Act, ISO/IEC 42001) is available at{" "}
							<Link href="/ai-governance/">the Japanese edition</Link> of this
							page.
						</p>

						<h2>FAQ</h2>
						{faqs.map((f) => (
							<div key={f.q}>
								<h3>{f.q}</h3>
								<p>{f.a}</p>
							</div>
						))}
					</article>

					<section className="fade-in" style={{ maxWidth: "640px" }}>
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
							Talk to us about agent governance
						</Link>
					</section>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
