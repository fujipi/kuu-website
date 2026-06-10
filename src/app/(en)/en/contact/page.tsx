import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
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
	title: "Contact | Kuu Inc.",
	description:
		"Contact Kuu Inc. about AI agent implementation, AX/DX strategy, partnership or careers. We usually reply within 1-2 business days.",
	path: "/en/contact/",
	lang: "en",
	languages: { ja: "/contact/", en: "/en/contact/" },
});

const jsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contact | Kuu Inc.",
		url: `${BASE_URL}/en/contact/`,
		inLanguage: "en",
	},
	buildBreadcrumb([
		{ name: "Home", path: "/en/" },
		{ name: "Contact", path: "/en/contact/" },
	]),
];

export default function EnContactPage() {
	return (
		<>
			<JsonLd data={jsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getEnNav()} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Contact</h1>
					<p
						className="fade-in"
						style={{
							fontSize: "0.9rem",
							color: "var(--gray-medium)",
							lineHeight: "2",
							maxWidth: "640px",
							marginBottom: "2.5rem",
						}}
					>
						Tell us about your project — AI agent implementation, agent
						governance, AX/DX strategy, partnership or careers. We respond in
						English or Japanese.
					</p>
					<div className="fade-in">
						<ContactForm locale="en" />
					</div>
				</div>
			</main>

			<Footer locale="en" />
		</>
	);
}
