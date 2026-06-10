import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { BASE_URL, buildBreadcrumb, generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "お問い合わせ | Kuu株式会社 - AI導入のご相談",
	description:
		"Kuu株式会社へのお問い合わせ。AIエージェント導入・AX/DX戦略のご相談、業務提携、採用など。通常1〜2営業日以内にご返信いたします。",
	path: "/contact/",
});

const contactJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "お問い合わせ | Kuu株式会社",
		url: `${BASE_URL}/contact/`,
		description:
			"Kuu株式会社へのお問い合わせフォーム。AIエージェント導入・DX戦略のご相談はこちら。",
		isPartOf: {
			"@type": "WebSite",
			url: BASE_URL,
			name: "Kuu株式会社",
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Kuu株式会社",
		url: BASE_URL,
		contactPoint: [
			{
				"@type": "ContactPoint",
				contactType: "customer service",
				url: `${BASE_URL}/contact/`,
				availableLanguage: "Japanese",
				contactOption: "TollFree",
			},
			{
				"@type": "ContactPoint",
				contactType: "sales",
				url: `${BASE_URL}/contact/`,
				availableLanguage: "Japanese",
			},
		],
	},
	buildBreadcrumb([
		{ name: "ホーム", path: "/" },
		{ name: "お問い合わせ", path: "/contact/" },
	]),
];

export default function ContactPage() {
	return (
		<>
			<JsonLd data={contactJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Contact</h1>

					<div className="fade-in">
						<ContactForm />
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
