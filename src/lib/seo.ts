import type { Metadata } from "next";

export const BASE_URL = "https://kuucorp.com";
export const SITE_NAME = "Kuu株式会社";
const DEFAULT_OGP_IMAGE = "/images/ogp.png";
/** ロゴ（ImageObject 用 URL）。publisher.logo などで共有。 */
const LOGO_URL = `${BASE_URL}/images/favicon-192.png`;

/**
 * サイト全体で共有する正準エンティティの @id。
 * 各ページに散在する Organization / WebSite ノードを単一の実体に統合し、
 * Google ナレッジグラフ・AI(AEO) が「Kuu株式会社」を一貫した主体として認識できるようにする
 * （代表者 Person で実証済みのエンティティ統合パターンを企業にも適用）。
 */
export const ORG_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

/**
 * Organization への軽量参照（`provider` / `author` / `worksFor` 用）。
 * `@id` で正準ノード（BASE_ORG / トップページの Organization）に解決される。
 */
export const ORG_REF = {
	"@type": "Organization",
	"@id": ORG_ID,
	name: SITE_NAME,
	url: BASE_URL,
};

/**
 * 記事の `publisher` 用 Organization 参照。Article 系のリッチリザルト要件を満たすため
 * logo（ImageObject）を保持しつつ、`@id` で正準ノードへ統合する。
 */
export const ORG_PUBLISHER = {
	"@type": "Organization",
	"@id": ORG_ID,
	name: SITE_NAME,
	url: BASE_URL,
	logo: {
		"@type": "ImageObject",
		url: LOGO_URL,
	},
};

/** Build a schema.org BreadcrumbList from an ordered list of crumbs. */
export function buildBreadcrumb(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: `${BASE_URL}${it.path === "/" ? "" : it.path}`,
		})),
	};
}

export const DEFAULT_KEYWORDS = [
	"AIエージェント",
	"エージェントガバナンス",
	"エージェントハーネス",
	"FDE",
	"RDE",
	"AX",
	"DX",
	"AIコンサルティング",
	"AI戦略",
	"Claude",
	"ChatGPT",
	"Codex",
	"Gemini",
	"MCP",
	"Managed Agents",
	"Kuu株式会社",
];

export type PageSeoProps = {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
	ogpImage?: string;
	noIndex?: boolean;
	/** ページの言語（OGP locale に反映。既定 ja） */
	lang?: "ja" | "en";
	/** Markdown ミラーのパス（scripts/generate-md-mirrors.mjs が生成。
	 * <link rel="alternate" type="text/markdown"> として出力される） */
	markdownPath?: string;
	/** 対訳ページがある場合の hreflang（ja/en 双方のパスを渡す） */
	languages?: { ja: string; en: string };
	article?: {
		publishedTime: string;
		modifiedTime?: string;
		authors?: string[];
		tags?: string[];
	};
};

/**
 * Resolve an OG image URL from a site path.
 *  - /blog/{slug}/         -> /og/blog/{slug}.png
 *  - /glossary/{s}/        -> /og/glossary/{s}.png
 *  - /case-studies/{s}/    -> /og/case-studies/{s}.png
 *  - /resources/{s}/       -> /og/resources/{s}.png
 *  - /ai-governance/, /managed-agents/, /eu-ai-act-jp/ -> /og/{name}.png
 *  - /about/, /contact/, /blog/, /glossary/,
 *    /case-studies/, /resources/ -> /og/{name}.png
 *  - else -> /og/default.png
 * Images are generated at build time by scripts/generate-og-images.mjs.
 */
export function resolveOgImage(pathname: string): string {
	const p = pathname.replace(/\/+$/, "");
	// アーカイブ系ページ（track / industry）はセクション共通 OG にフォールバック
	if (p.startsWith("/blog/track/")) return "/og/blog.png";
	if (p.startsWith("/case/industry/")) return "/og/case.png";
	// news 詳細は per-slug OG を生成していないためセクション共通にフォールバック
	if (p.startsWith("/news/")) return "/og/news.png";
	const blog = p.match(/^\/blog\/([^/]+)$/);
	if (blog) return `/og/blog/${blog[1]}.png`;
	const gloss = p.match(/^\/glossary\/([^/]+)$/);
	if (gloss) return `/og/glossary/${gloss[1]}.png`;
	const cs = p.match(/^\/case-studies\/([^/]+)$/);
	if (cs) return `/og/case-studies/${cs[1]}.png`;
	const ca = p.match(/^\/case\/([^/]+)$/);
	if (ca) return `/og/case/${ca[1]}.png`;
	const res = p.match(/^\/resources\/([^/]+)$/);
	if (res) return `/og/resources/${res[1]}.png`;
	const simple = p.match(
		/^\/(ai-governance|managed-agents|eu-ai-act-jp|fde|ax|blog|glossary|about|contact|case-studies|case|news|resources|services)$/,
	);
	if (simple) return `/og/${simple[1]}.png`;
	return "/og/default.png";
}

export function generateMetadata({
	title,
	description,
	path,
	keywords,
	ogpImage,
	noIndex = false,
	lang = "ja",
	languages,
	markdownPath,
	article,
}: PageSeoProps): Metadata {
	const url = `${BASE_URL}${path}`;
	const image = ogpImage ?? resolveOgImage(path) ?? DEFAULT_OGP_IMAGE;
	const ogLocale = lang === "en" ? "en_US" : "ja_JP";

	const openGraph: Metadata["openGraph"] = article
		? {
				title,
				description,
				url,
				siteName: SITE_NAME,
				locale: ogLocale,
				type: "article",
				publishedTime: article.publishedTime,
				modifiedTime: article.modifiedTime,
				authors: article.authors,
				tags: article.tags,
				images: [{ url: image, width: 1200, height: 630, alt: title }],
			}
		: {
				title,
				description,
				url,
				siteName: SITE_NAME,
				locale: ogLocale,
				type: "website",
				images: [{ url: image, width: 1200, height: 630, alt: title }],
			};

	return {
		// Use absolute to prevent layout.tsx template from appending "| Kuu株式会社" again
		title: { absolute: title },
		description,
		keywords: keywords ?? DEFAULT_KEYWORDS,
		robots: noIndex
			? { index: false, follow: false }
			: {
					index: true,
					follow: true,
					"max-snippet": -1,
					"max-image-preview": "large" as const,
					"max-video-preview": -1,
				},
		alternates: {
			canonical: url,
			...(languages
				? {
						languages: {
							ja: `${BASE_URL}${languages.ja}`,
							en: `${BASE_URL}${languages.en}`,
							"x-default": `${BASE_URL}${languages.ja}`,
						},
					}
				: {}),
			...(markdownPath
				? { types: { "text/markdown": `${BASE_URL}${markdownPath}` } }
				: {}),
		},
		openGraph,
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
		},
	};
}

/**
 * 代表者（藤平 賢人）の正規 Person エンティティ。
 * UI には一切表示しない不可視の構造化データとして、サイト全体で同一の `@id` を共有し、
 * 外部の身元プロフィール（`sameAs`）とメディア掲載（`subjectOf`）を「一人の人物」に
 * 関連付ける（エンティティ統合）。Google ナレッジグラフ／AI(AEO) 向けのメタデータ。
 * `@id` を /about/#founder に置くことで、氏名を可視表示している /about/・/en/about/ と対応させる。
 * 各配列要素は個別の <script type="application/ld+json"> として出力されるため `@context` を持たせる。
 */
export const FOUNDER_ID = `${BASE_URL}/about/#founder`;

export const FOUNDER_PERSON: Record<string, unknown> = {
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": FOUNDER_ID,
	name: "藤平 賢人",
	alternateName: ["藤平賢人", "Kento Fujihira"],
	jobTitle: "代表取締役",
	description:
		"Kuu株式会社 代表取締役。LINE株式会社で LINE Pay の駅券売機チャージや小売領域のDXプロジェクトのプロジェクトマネージャーを務め、2022年に Kuu株式会社を設立。AIエージェントの実装とエージェントガバナンスを専門とする。",
	url: `${BASE_URL}/about/`,
	worksFor: { "@id": ORG_ID },
	knowsAbout: [
		"AIエージェント",
		"エージェントガバナンス",
		"DX戦略",
		"AX戦略",
		"FDE",
		"RDE",
		"エージェントハーネス",
		"Claude",
		"MCP",
	],
	// 身元プロフィール（同一人物を指すIDのみを列挙）。
	// J-GLOBAL は当該レコードが本人であることを確認のうえ掲載している。
	sameAs: [
		"https://github.com/fujipi",
		"https://jglobal.jst.go.jp/detail?JGLOBAL_ID=202303018101153810",
	],
	// メディア掲載（本人を扱う第三者コンテンツ）。確認できた事実のみ記載。
	subjectOf: [
		{
			"@type": "NewsArticle",
			name: "顧客体験をLINEで横断的につなぎ、小売のDXを促進する",
			url: "https://iotnews.jp/retail/194862/",
			datePublished: "2021-12-16",
			publisher: { "@type": "Organization", name: "IoT NEWS" },
		},
		{
			"@type": "NewsArticle",
			name: "券売機でLINE Payへの現金チャージが可能に──東急とLINE、異なる思惑",
			url: "https://www.businessinsider.jp/article/216584/",
			datePublished: "2020-07-15",
			publisher: { "@type": "Organization", name: "Business Insider Japan" },
		},
		{
			"@type": "NewsArticle",
			name: "東急、なくせない券売機の「ATM化」で狙う一石二鳥",
			url: "https://business.nikkei.com/atcl/gen/19/00148/071500007/",
			datePublished: "2020-07-15",
			publisher: { "@type": "Organization", name: "日経ビジネス" },
		},
		{
			"@type": "NewsArticle",
			name: "東急での駅券売機でのLINE Payの現金チャージがスタート、沿線のキャッシュレス化も視野に",
			url: "https://paymentnavi.com/paymentnews/96656.html",
			datePublished: "2020-07-16",
			publisher: { "@type": "Organization", name: "ペイメントナビ" },
		},
		{
			"@type": "NewsArticle",
			name: "減る券売機に出番あり　東急が電子決済の入金を開始",
			url: "https://www.tokyo-np.co.jp/article/44886",
			datePublished: "2020-07-26",
			publisher: { "@type": "Organization", name: "東京新聞" },
		},
		{
			"@type": "WebPage",
			name: "駅券売機でQR決済チャージ 広がるか 東急とLINE Payが開始 なぜ銀行口座を使わない？",
			url: "https://pex.jp/point_news/2064896f6372caf88ce97e8089c26004",
			datePublished: "2020-07-14",
			publisher: { "@type": "Organization", name: "乗りものニュース" },
		},
		{
			"@type": "WebPage",
			name: "デジタルイノベーション2019 関西 IoTスタートアップセミナー「キャッシュレスで生まれるビジネスチャンス」",
			url: "https://ers.nikkeibp.co.jp/user/contents/2019x0530odi/index.html",
			datePublished: "2019-05-31",
			publisher: { "@type": "Organization", name: "日経BP" },
		},
		{
			"@type": "WebPage",
			name: "LINE SMB Day",
			url: "https://linesmbday.com/",
		},
	],
};

export const BASE_ORG = {
	"@id": ORG_ID,
	url: BASE_URL,
	name: SITE_NAME,
	legalName: SITE_NAME,
	logo: LOGO_URL,
	slogan: "しくみが浸透し、あらゆる人の自由をつくる",
	address: {
		streetAddress: "東神田一丁目13番14号",
		addressLocality: "千代田区",
		addressRegion: "東京都",
		addressCountry: "JP",
	},
	contactPoint: {
		contactType: "customer service",
		url: `${BASE_URL}/contact/`,
		availableLanguage: "Japanese",
	},
	knowsAbout: [
		"AIエージェント",
		"エージェントガバナンス",
		"AI Agent Governance",
		"エージェントハーネス",
		"DXコンサルティング",
		"AXコンサルティング",
		"エージェントトランスフォーメーション",
		"Managed Agents",
		"LLM",
		"FDE (Forward Deployed Engineering)",
		"RDE (Reinvention Deployed Engineering)",
		"AIer",
		"Claude",
		"Anthropic Claude",
		"ChatGPT",
		"Codex",
		"Gemini",
		"Anthropic",
		"OpenAI",
		"MCP (Model Context Protocol)",
		"Claude Skills",
		"サブエージェント",
		"Routine",
		"オーケストレーション",
		"ルーティング",
		"コンテキストエンジニアリング",
		"プロンプト設計",
		"EU AI Act",
		"ISO/IEC 42001",
		"AI-BCP",
	],
	foundingDate: "2022",
	founder: { "@id": FOUNDER_ID },
	sameAs: [`${BASE_URL}/about/`],
	numberOfEmployees: {
		minValue: 1,
		maxValue: 10,
	},
};
