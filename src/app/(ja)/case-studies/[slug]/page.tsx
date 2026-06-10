import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Redirect from "@/components/Redirect";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { BASE_URL, generateMetadata as seoMetadata } from "@/lib/seo";

interface Props {
	params: Promise<{ slug: string }>;
}

// 旧 /case-studies/{slug}/ を新しい /case/{slug}/ へ対応付け。
// 一致しないものは Case 一覧へ。
const SLUG_MAP: Record<string, string> = {
	"legal-firm-contract-triage": "contract-review-agent",
	"manufacturing-quality-assistant": "manufacturing-quality-report-agent",
	"retail-customer-support-agent": "ec-customer-support-agent",
};

export function generateStaticParams() {
	return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}

export const dynamicParams = false;

function dest(slug: string): string {
	const mapped = SLUG_MAP[slug];
	return mapped ? `/case/${mapped}/` : "/case/";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const to = dest(slug);
	return {
		...seoMetadata({
			title: "Case | Kuu株式会社",
			description:
				"このユースケースは Case ページに移動しました。最新の活用イメージはこちらをご覧ください。",
			path: `/case-studies/${slug}/`,
			// 旧slugのper-slug OG画像は生成されないため、セクション共通にフォールバック
			ogpImage: "/og/case-studies.png",
		}),
		alternates: { canonical: `${BASE_URL}${to}` },
		robots: { index: false, follow: true },
	};
}

export default async function CaseStudyRedirectPage({ params }: Props) {
	const { slug } = await params;
	return (
		<>
			<Stars />
			<Header navLinks={getMainNav()} />
			<main>
				<Redirect to={dest(slug)} />
			</main>
			<Footer />
		</>
	);
}
