import type { Metadata } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	display: "swap",
});

const outfit = Outfit({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "Kuu株式会社 | 技術と物語を、あらゆる人に届ける",
		template: "%s | Kuu株式会社",
	},
	description:
		"Kuu株式会社は、AX/DX戦略コンサルティング、AIエージェントガバナンスサービス、Yota mangaサービスを提供するテクノロジー企業です。インターネットビジネスの企画・開発・運営を通じて、技術と物語をあらゆる人に届けます。",
	metadataBase: new URL("https://kuucorp.com"),
	robots: {
		index: true,
		follow: true,
		"max-snippet": -1,
		"max-image-preview": "large" as const,
		"max-video-preview": -1,
	},
	openGraph: {
		siteName: "Kuu株式会社",
		locale: "ja_JP",
		type: "website",
		images: [
			{
				url: "/images/ogp.png",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: ["/images/ogp.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			<head>
				<link
					rel="icon"
					href="/images/favicon-32.png"
					type="image/png"
					sizes="32x32"
				/>
				<link
					rel="icon"
					href="/images/favicon-192.png"
					type="image/png"
					sizes="192x192"
				/>
				<link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
			</head>
			<body>{children}</body>
		</html>
	);
}
