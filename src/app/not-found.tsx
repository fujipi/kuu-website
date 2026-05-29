import type { Metadata } from "next";
import FadeInObserver from "@/components/FadeInObserver";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Stars from "@/components/Stars";
import { getMainNav } from "@/lib/navigation";

export const metadata: Metadata = {
	title: "ページが見つかりません",
	description:
		"お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからお探しのコンテンツをご覧ください。",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<>
			<Stars />
			<FadeInObserver />
			<Header navLinks={getMainNav()} />

			<main>
				<div className="page-content error-page">
					<h1 className="page-title fade-in">404</h1>
					<p className="error-message fade-in">
						お探しのページは見つかりませんでした。
					</p>
					<a href="/" className="error-link fade-in">
						トップページへ戻る
					</a>
				</div>
			</main>

			<Footer />
		</>
	);
}
