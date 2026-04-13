import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "お問い合わせ | Kuu株式会社 - AI導入のご相談",
	description:
		"Kuu株式会社へのお問い合わせ。AIエージェント導入・AX/DX戦略のご相談、業務提携、採用など。通常1〜2営業日以内にご返信いたします。",
	path: "/contact/",
});

const BASE_URL = "https://kuucorp.com";

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
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "ホーム",
				item: BASE_URL,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "お問い合わせ",
				item: `${BASE_URL}/contact/`,
			},
		],
	},
];

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/about/", label: "About" },
];

export default function ContactPage() {
	return (
		<>
			<JsonLd data={contactJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content">
					<h1 className="page-title fade-in">Contact</h1>

					<div className="fade-in">
						<form
							className="contact-form"
							action="https://formspree.io/f/mojyqlak"
							method="POST"
						>
							<input
								type="text"
								name="_gotcha"
								style={{ display: "none" }}
								tabIndex={-1}
								autoComplete="off"
							/>
							<div className="form-group">
								<label htmlFor="company">
									会社名 <span className="required">*</span>
								</label>
								<input
									type="text"
									id="company"
									name="company"
									required
									placeholder="例：株式会社サンプル"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="name">
									お名前 <span className="required">*</span>
								</label>
								<input
									type="text"
									id="name"
									name="name"
									required
									placeholder="例：山田 太郎"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">
									メールアドレス <span className="required">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									placeholder="例：yamada@example.com"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="service">お問い合わせ種別</label>
								<select id="service" name="service">
									<option value="">選択してください</option>
									<option value="プロジェクトのご相談">
										プロジェクトのご相談
									</option>
									<option value="業務提携について">業務提携について</option>
									<option value="採用について">採用について</option>
									<option value="その他">その他</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="message">メッセージ</label>
								<textarea
									id="message"
									name="message"
									rows={6}
									placeholder="ご相談内容やご質問をご記入ください"
								/>
							</div>
							<button type="submit" className="btn-submit">
								送信する
							</button>
						</form>
						<p className="form-note">通常1〜2営業日以内にご返信いたします。</p>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
