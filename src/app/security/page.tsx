import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Stars from "@/components/Stars";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
	title: "情報セキュリティ基本方針 | Kuu株式会社",
	description:
		"Kuu株式会社の情報セキュリティ基本方針。AI関連およびDXサービス事業者として情報資産を保護するための経営者責任・社内体制・従業員教育・法令遵守・事故対応の方針を公開しています。",
	path: "/security/",
});

const BASE_URL = "https://kuucorp.com";

const securityJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "情報セキュリティ基本方針 | Kuu株式会社",
		url: `${BASE_URL}/security/`,
		description:
			"Kuu株式会社の情報セキュリティ基本方針。情報資産の保護に関する経営者責任・体制整備・従業員教育・法令遵守・事故対応の方針。",
		isPartOf: {
			"@type": "WebSite",
			url: BASE_URL,
			name: "Kuu株式会社",
		},
		datePublished: "2026-05-20",
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
				name: "情報セキュリティ基本方針",
				item: `${BASE_URL}/security/`,
			},
		],
	},
];

const navLinks = [
	{ href: "/", label: "Top" },
	{ href: "/about/", label: "About" },
	{ href: "/contact/", label: "Contact" },
];

export default function SecurityPage() {
	return (
		<>
			<JsonLd data={securityJsonLd} />
			<Stars />
			<FadeInObserver />
			<Header navLinks={navLinks} />

			<main>
				<div className="page-content privacy">
					<h1 className="page-title fade-in">情報セキュリティ基本方針</h1>

					<div className="fade-in">
						<p>
							Kuu株式会社（以下、当社）は、AI関連およびDXサービスを提供する事業者として、事業活動において取り扱うすべての情報資産を適切に保護することが社会的責務であると認識しています。お客様からお預かりする情報および当社が保有する情報を、漏えい・改ざん・滅失等の脅威から守るため、ここに情報セキュリティ基本方針を定め、組織的かつ継続的に情報セキュリティ対策に取り組みます。
						</p>

						<h2 className="privacy-heading">1. 経営者の責任</h2>
						<p>
							当社は、経営者の主導のもとで情報セキュリティ対策を推進し、その実施に必要な経営資源を継続的に投入します。
						</p>

						<h2 className="privacy-heading">2. 社内体制の整備</h2>
						<p>
							当社は、情報セキュリティの維持および改善のために必要な社内体制を整備するとともに、情報セキュリティ対策を社内の正式な規則として明文化します。
						</p>

						<h2 className="privacy-heading">3. 従業員の取り組み</h2>
						<p>
							当社の従業員は、情報セキュリティの確保に必要な知識および技術を習得し、情報セキュリティへの取り組みを確実に実施します。
						</p>

						<h2 className="privacy-heading">
							4. 法令および契約上の要求事項の遵守
						</h2>
						<p>
							当社は、情報セキュリティに関する法令、規制、規範および契約上の義務を遵守するとともに、お客様の期待に応えます。
						</p>

						<h2 className="privacy-heading">5. 違反および事故への対応</h2>
						<p>
							当社は、情報セキュリティに関する法令違反、契約違反および事故が発生した場合には速やかかつ適切に対処し、その原因を究明して再発防止に努めます。
						</p>

						<p style={{ marginTop: "2.5rem" }}>
							制定日：<time dateTime="2026-05-20">2026年5月20日</time>
							<br />
							Kuu株式会社
							<br />
							代表取締役　藤平賢人
						</p>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
