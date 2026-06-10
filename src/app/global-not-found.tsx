// 複数ルートレイアウト（(ja)/(en)）構成のためのグローバル404。
// 通常のレンダリングを経由しないため、スタイル・フォントを自前で読み込む。
// GitHub Pages は out/404.html を全未マッチURLに使うため、日英併記にする。
import type { Metadata } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	display: "swap",
});

const outfit = Outfit({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

export const metadata: Metadata = {
	title: "ページが見つかりません | Kuu株式会社",
	description:
		"お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからお探しのコンテンツをご覧ください。",
	robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
	return (
		<html
			lang="ja"
			className={`${notoSansJP.variable} ${outfit.variable}`}
			style={
				{
					"--font-body": "var(--font-noto-sans-jp), sans-serif",
					"--font-heading": "var(--font-outfit), sans-serif",
				} as React.CSSProperties
			}
		>
			<body>
				<main>
					<div className="page-content error-page">
						<h1 className="page-title">404</h1>
						<p className="error-message">
							お探しのページは見つかりませんでした。
						</p>
						<p className="error-message" lang="en">
							The page you are looking for could not be found.
						</p>
						<p style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
							<a href="/" className="error-link">
								トップページへ戻る
							</a>
							<a href="/en/" className="error-link" lang="en">
								Go to English top
							</a>
						</p>
					</div>
				</main>
			</body>
		</html>
	);
}
