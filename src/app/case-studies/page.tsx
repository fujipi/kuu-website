import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Redirect from "@/components/Redirect";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { BASE_URL, generateMetadata as seoMetadata } from "@/lib/seo";

const DEST = "/case/";

export const metadata: Metadata = {
	...seoMetadata({
		title: "Case | Kuu株式会社",
		description:
			"導入事例・ユースケースは Case ページに統合しました。最新の活用イメージはこちらをご覧ください。",
		path: "/case-studies/",
	}),
	alternates: { canonical: `${BASE_URL}${DEST}` },
	robots: { index: false, follow: true },
};

export default function CaseStudiesRedirectPage() {
	return (
		<>
			<Stars />
			<Header navLinks={getMainNav()} />
			<main>
				<Redirect to={DEST} />
			</main>
			<Footer />
		</>
	);
}
