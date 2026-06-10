import type { Metadata } from "next";
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
	title: "About | Kuu Inc.",
	description:
		"Kuu Inc. is a Tokyo-based AI agent governance company founded in 2022 by Kento Fujihira. We plan, build and operate internet businesses with AI-native AX/DX strategy, agent implementation and governance.",
	path: "/en/about/",
	lang: "en",
	languages: { ja: "/about/", en: "/en/about/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: "About Kuu Inc.",
		url: `${BASE_URL}/en/about/`,
		inLanguage: "en",
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "About", path: "/en/about/" },
	]),
];

const rows = [
	{ label: "Company", value: "Kuu Inc. (Kuu株式会社)" },
	{ label: "Representative", value: "Kento Fujihira" },
	{
		label: "Address",
		value: "1-13-14 Higashi-Kanda, Chiyoda-ku, Tokyo, Japan",
	},
	{ label: "Founded", value: "2022" },
	{
		label: "Business",
		value: "Planning, development and operation of internet businesses",
	},
];

export default function EnAboutPage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">About</h1>
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
						Kuu Inc. is a Tokyo-based technology company specializing in AI
						agent governance. Founded in 2022, we cover the whole journey in one
						place: AI-native AX/DX strategy, deep operational discovery, agent
						implementation with forward deployed engineers, and continuous
						governance of the agents in production.
					</p>

					<section style={{ marginBottom: "4rem" }}>
						<h2 className="section-label fade-in">Company</h2>
						<div className="about-table fade-in">
							{rows.map((r) => (
								<div className="about-row" key={r.label}>
									<div className="about-label">{r.label}</div>
									<div className="about-value">{r.value}</div>
								</div>
							))}
						</div>
					</section>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
