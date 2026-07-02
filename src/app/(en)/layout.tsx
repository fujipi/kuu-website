import type { Metadata } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import Analytics from "@/components/Analytics";
import "../globals.css";

const notoSansJP = Noto_Sans_JP({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	display: "swap",
	preload: true,
});

const outfit = Outfit({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
	preload: true,
});

export const metadata: Metadata = {
	title: {
		default: "Kuu Inc. | AI Agent Governance from Japan",
		template: "%s | Kuu Inc.",
	},
	description:
		"Kuu Inc. is a Tokyo-based AI agent governance company. We provide AX/DX strategy consulting, AI agent implementation, and continuous agent governance services.",
	metadataBase: new URL("https://kuucorp.com"),
	robots: {
		index: true,
		follow: true,
		"max-snippet": -1,
		"max-image-preview": "large" as const,
		"max-video-preview": -1,
	},
	openGraph: {
		siteName: "Kuu Inc.",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/images/ogp.png",
				width: 1200,
				height: 630,
				alt: "Kuu Inc. | AI Agent Governance from Japan",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: "/images/ogp.png",
				alt: "Kuu Inc. | AI Agent Governance from Japan",
			},
		],
	},
	verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
		? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
		: undefined,
};

export default function EnRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
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
				<link
					rel="alternate"
					type="text/plain"
					title="LLM-friendly site index"
					href="/llms.txt"
				/>
			</head>
			<body>
				<Analytics />
				{children}
			</body>
		</html>
	);
}
