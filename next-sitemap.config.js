const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// content/{dir} の .mdx/.md を読み slug → lastmod(YYYY-MM-DD) のマップを作る。
// lastmod は frontmatter の lastModified ?? date。どちらも無いものは含めない
// （sitemap 側で lastmod キーごと省略され <lastmod> 要素が出力されない）。
function loadContentDates(dir) {
	const abs = path.join(__dirname, "content", dir);
	const map = new Map();
	if (!fs.existsSync(abs)) return map;
	for (const f of fs.readdirSync(abs)) {
		if (!f.endsWith(".mdx") && !f.endsWith(".md")) continue;
		try {
			const { data } = matter(fs.readFileSync(path.join(abs, f), "utf8"));
			const d = data.lastModified ?? data.date;
			if (typeof d === "string" && d) {
				map.set(f.replace(/\.(mdx|md)$/, ""), d);
			}
		} catch {
			// frontmatter が読めないファイルは lastmod なしで扱う
		}
	}
	return map;
}

function maxDate(map) {
	let max = null;
	for (const d of map.values()) {
		if (!max || d > max) max = d;
	}
	return max;
}

// glossary は frontmatter に日付が無いため対象外（lastmod 省略）
const DATES = {
	blog: loadContentDates("blog"),
	case: loadContentDates("case"),
	news: loadContentDates("news"),
	resources: loadContentDates("resources"),
};
const SECTION_MAX = {
	blog: maxDate(DATES.blog),
	case: maxDate(DATES.case),
	news: maxDate(DATES.news),
	resources: maxDate(DATES.resources),
};

// Returns true when the exported HTML for a path carries a noindex robots meta.
// Used to keep noindex pages (e.g. the not-found placeholder emitted for an
// empty paginated route) out of the sitemap.
function isNoindex(urlPath) {
	const p = urlPath.replace(/\/$/, "");
	const htmlFile = p === "" ? "out/index.html" : `out${p}/index.html`;
	try {
		const html = fs.readFileSync(htmlFile, "utf8");
		return /name=["']robots["'][^>]*noindex/i.test(html);
	} catch {
		return false;
	}
}

/** @type {import('next-sitemap').IConfig} */
const config = {
	siteUrl: "https://kuucorp.com",
	generateRobotsTxt: true,
	outDir: "out",
	trailingSlash: true,
	changefreq: "weekly",
	priority: 0.7,
	sitemapSize: 5000,
	// /case-studies/* は Case へ統合済み。リダイレクト用スタブのみ残るため
	// sitemap からは除外（noindex 設定済み）。
	exclude: [
		"/case-studies",
		"/case-studies/*",
		// 旧 /authors/fujihira-kento/ は /about/ へのリダイレクトスタブ（noindex）。
		"/authors/fujihira-kento",
		"/authors/fujihira-kento/*",
		// 近接重複により統合した旧 blog 記事は /blog/<canonical>/ へのリダイレクトスタブ（noindex）。
		"/blog/ax-dx-difference-guide",
		"/blog/iso-42001-ai-management-sme",
		"/blog/shadow-ai-detection-governance",
		"/blog/agent-observability-evaluation-log",
		"/blog/ai-agent-prompt-injection-defense",
		"/blog/managed-agents-cost-benefit",
		"/blog/ai-chatbot-customer-support-cost",
		"/blog/ai-agent-cost-optimization-sme",
		"/blog/agent-online-evaluation-production-sampling",
		"/blog/chatgpt-usage-policy-template",
	],
	additionalSitemaps: [],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
			},
			{
				userAgent: "GPTBot",
				allow: "/",
			},
			{
				userAgent: "ClaudeBot",
				allow: "/",
			},
			{
				userAgent: "PerplexityBot",
				allow: "/",
			},
			{
				userAgent: "Google-Extended",
				allow: "/",
			},
			{
				userAgent: "Amazonbot",
				allow: "/",
			},
		],
	},
	transform: async (_config, urlPath) => {
		const p = urlPath.replace(/\/$/, "") || "/";
		// Drop noindex pages (e.g. /case/page/N placeholder while cases ≤ one page).
		if (isNoindex(urlPath)) return null;

		// lastmod は「実際に内容が変わった日」だけを主張する:
		// - コンテンツ詳細 → frontmatter の lastModified ?? date
		// - アーカイブ → 配下コンテンツの最新日付
		// - 静的ページ → lastmod 省略（毎ビルドで now を主張すると
		//   検索エンジンが lastmod を信用しなくなるため）
		const entry = (changefreq, priority, lastmod) => ({
			loc: urlPath,
			changefreq,
			priority,
			...(lastmod ? { lastmod } : {}),
		});

		// --- コンテンツ詳細 ---
		const blogDetail = p.match(/^\/blog\/(?!page\/|tags\/|track\/)([^/]+)$/);
		if (blogDetail) {
			return entry("monthly", 0.7, DATES.blog.get(blogDetail[1]));
		}
		const caseDetail = p.match(/^\/case\/(?!page\/|industry\/)([^/]+)$/);
		if (caseDetail) {
			return entry("monthly", 0.7, DATES.case.get(caseDetail[1]));
		}
		const newsDetail = p.match(/^\/news\/([^/]+)$/);
		if (newsDetail) {
			return entry("monthly", 0.5, DATES.news.get(newsDetail[1]));
		}
		const resDetail = p.match(/^\/resources\/([^/]+)$/);
		if (resDetail) {
			return entry("monthly", 0.75, DATES.resources.get(resDetail[1]));
		}

		// --- アーカイブ（タグ別の厳密maxは追わずセクション全体maxで代替。
		//     過大方向の誤差は実害が小さい） ---
		if (p === "/blog") return entry("weekly", 0.8, SECTION_MAX.blog);
		if (p.startsWith("/blog/page/")) {
			return entry("weekly", 0.6, SECTION_MAX.blog);
		}
		if (p.startsWith("/blog/tags/")) {
			return entry("weekly", 0.6, SECTION_MAX.blog);
		}
		if (p.startsWith("/blog/track/")) {
			return entry("weekly", 0.65, SECTION_MAX.blog);
		}
		if (p === "/case") return entry("daily", 0.85, SECTION_MAX.case);
		if (p.startsWith("/case/page/")) {
			return entry("weekly", 0.6, SECTION_MAX.case);
		}
		if (p.startsWith("/case/industry/")) {
			return entry("weekly", 0.65, SECTION_MAX.case);
		}
		if (p === "/news") return entry("weekly", 0.6, SECTION_MAX.news);
		if (p === "/resources") return entry("weekly", 0.85, SECTION_MAX.resources);

		// --- 静的ページ（lastmod 省略） ---
		if (p === "/") return entry("weekly", 1.0);
		if (
			p === "/ai-governance" ||
			p === "/managed-agents" ||
			p === "/eu-ai-act-jp" ||
			p === "/fde" ||
			p === "/ax"
		) {
			return entry("monthly", 0.95);
		}
		if (p.startsWith("/services/")) return entry("monthly", 0.9);
		if (p === "/case-studies") return entry("weekly", 0.9);
		if (p.startsWith("/case-studies/")) return entry("monthly", 0.85);
		if (p === "/glossary") return entry("monthly", 0.7);
		if (p.startsWith("/glossary/")) return entry("monthly", 0.6);
		if (p.startsWith("/authors/")) return entry("monthly", 0.6);
		if (p === "/contact") return entry("monthly", 0.8);
		if (p === "/about") return entry("monthly", 0.7);
		if (p === "/privacy-policy" || p === "/security") {
			return entry("yearly", 0.3);
		}
		if (p === "/search") return entry("monthly", 0.4);
		if (p === "/en") return entry("monthly", 0.8);
		if (p.startsWith("/en/services/")) return entry("monthly", 0.7);
		if (p.startsWith("/en/")) return entry("monthly", 0.6);
		return entry("weekly", 0.7);
	},
};

module.exports = config;
