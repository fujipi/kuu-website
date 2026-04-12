import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "プライバシーポリシー | Kuu株式会社",
	description:
		"Kuu株式会社のプライバシーポリシー。個人情報の取得目的・利用方法・第三者提供方針・安全管理措置・開示請求について記載しています。",
	path: "/privacy-policy/",
});

const BASE_URL = "https://kuucorp.com";

const privacyJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "プライバシーポリシー | Kuu株式会社",
		url: `${BASE_URL}/privacy-policy/`,
		description:
			"Kuu株式会社のプライバシーポリシー。個人情報の取り扱いについて。",
		isPartOf: {
			"@type": "WebSite",
			url: BASE_URL,
			name: "Kuu株式会社",
		},
		datePublished: "2026-03-08",
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
				name: "プライバシーポリシー",
				item: `${BASE_URL}/privacy-policy/`,
			},
		],
	},
];

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

export default function PrivacyPolicyPage() {
	return (
		<>
			<JsonLd data={privacyJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content privacy">
					<h1 className="page-title fade-in">Privacy Policy</h1>

					<div className="fade-in">
						<p>
							Kuu株式会社（以下「当社」）は、お客様の個人情報を適切に保護し、以下の方針に基づいて取り扱います。
						</p>

						<h2 className="privacy-heading">1. 取得する情報</h2>
						<p>
							お問い合わせ時にご提供いただく氏名、会社名、メールアドレス、相談内容等を取得します。
						</p>

						<h2 className="privacy-heading">2. 利用目的</h2>
						<p>
							お問い合わせへの回答、サービス提供・改善・新規企画の検討、セミナーやサービスに関するご案内に利用します。
						</p>

						<h2 className="privacy-heading">3. 第三者提供</h2>
						<p>
							法令に基づく場合を除き、ご本人の同意なく第三者へ提供しません。
						</p>

						<h2 className="privacy-heading">4. 安全管理</h2>
						<p>
							不正アクセス、漏えい、改ざん等を防止するために適切な安全管理措置を講じます。
						</p>

						<h2 className="privacy-heading">5. 開示・訂正・削除</h2>
						<p>ご本人からの請求に基づき、合理的な範囲で対応します。</p>

						<h2 className="privacy-heading">6. お問い合わせ窓口</h2>
						<p>
							Kuu株式会社 <a href="/contact/">お問い合わせフォーム</a>
							よりご連絡ください。
						</p>

						<p>
							制定日：<time dateTime="2026-03-08">2026年3月8日</time>
						</p>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
