import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Kuu株式会社",
		short_name: "Kuu",
		description:
			"AIエージェントガバナンス専門会社Kuu株式会社。AX/DX戦略コンサルティング、AIエージェント導入・運用管理サービスを提供。",
		start_url: "/",
		display: "browser",
		lang: "ja",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [
			{
				src: "/images/favicon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/images/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	};
}
