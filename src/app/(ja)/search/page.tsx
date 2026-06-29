import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Redirect from "@/components/Redirect";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";
import { BASE_URL, generateMetadata as seoMetadata } from "@/lib/seo";

// サイト内検索は専用ページを廃止し、Blog・Case の各一覧ページ上部の検索窓に移行した。
// 旧 /search/ はブックマーク・被リンク・Google サイトリンク Search ボックスを維持するため、
// /blog/ への client-side リダイレクトスタブとして残す（GitHub Pages は server 3xx を持たない）。
export const metadata: Metadata = {
	...seoMetadata({
		title: "ページを移動しました",
		description:
			"サイト内検索は Blog・Case の各一覧ページに移動しました。ページ上部の検索窓からご利用ください。",
		path: "/search/",
		// /search/ 用の OG 画像は生成していないため、移動先のセクション共通 OG にフォールバック
		ogpImage: "/og/blog.png",
	}),
	alternates: { canonical: `${BASE_URL}/blog/` },
	robots: { index: false, follow: true },
};

export default function SearchPage() {
	return (
		<>
			<Stars />
			<Header navLinks={getMainNav()} />
			<main>
				<Redirect to="/blog/" />
			</main>
			<Footer />
		</>
	);
}
