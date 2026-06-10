import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Redirect from "@/components/Redirect";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { BASE_URL, generateMetadata as seoMetadata } from "@/lib/seo";

// 旧 /authors/fujihira-kento/（著者アーカイブ）は廃止。
// 代表者情報のある /about/ へクライアント側リダイレクトする。
const DEST = "/about/";

export const metadata: Metadata = {
	...seoMetadata({
		title: "Kuu株式会社",
		description:
			"このページは移動しました。会社・代表者の情報は会社概要をご覧ください。",
		path: "/authors/fujihira-kento/",
	}),
	alternates: { canonical: `${BASE_URL}${DEST}` },
	robots: { index: false, follow: true },
};

export default function FujihiraAuthorRedirectPage() {
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
