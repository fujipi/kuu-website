const fs = require("node:fs");

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
		additionalSitemaps: ["https://kuucorp.com/sitemap.xml"],
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
	transform: async (_config, path) => {
		const p = path.replace(/\/$/, "") || "/";
		const now = new Date().toISOString();
		// Drop noindex pages (e.g. /case/page/N placeholder while cases ≤ one page).
		if (isNoindex(path)) return null;
		if (p === "/") {
			return { loc: path, changefreq: "weekly", priority: 1.0, lastmod: now };
		}
		if (
			p === "/ai-governance" ||
			p === "/managed-agents" ||
			p === "/eu-ai-act-jp" ||
			p === "/fde" ||
			p === "/ax"
		) {
			return { loc: path, changefreq: "monthly", priority: 0.95, lastmod: now };
		}
		if (p.startsWith("/services/")) {
			return { loc: path, changefreq: "monthly", priority: 0.9, lastmod: now };
		}
		if (p === "/case-studies") {
			return { loc: path, changefreq: "weekly", priority: 0.9, lastmod: now };
		}
		if (p.startsWith("/case-studies/")) {
			return { loc: path, changefreq: "monthly", priority: 0.85, lastmod: now };
		}
		if (p === "/case") {
			return { loc: path, changefreq: "daily", priority: 0.85, lastmod: now };
		}
		if (p.startsWith("/case/page/")) {
			return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: now };
		}
		if (p.startsWith("/case/industry/")) {
			return { loc: path, changefreq: "weekly", priority: 0.65, lastmod: now };
		}
		if (p.startsWith("/case/")) {
			return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: now };
		}
		if (p === "/news") {
			return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: now };
		}
		if (p.startsWith("/news/")) {
			return { loc: path, changefreq: "monthly", priority: 0.5, lastmod: now };
		}
		if (p === "/resources") {
			return { loc: path, changefreq: "weekly", priority: 0.85, lastmod: now };
		}
		if (p.startsWith("/resources/")) {
			return { loc: path, changefreq: "monthly", priority: 0.75, lastmod: now };
		}
		if (p === "/blog") {
			return { loc: path, changefreq: "weekly", priority: 0.8, lastmod: now };
		}
		if (p.startsWith("/blog/page/")) {
			return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: now };
		}
		if (p.startsWith("/blog/tags/")) {
			return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: now };
		}
		if (p.startsWith("/blog/track/")) {
			return { loc: path, changefreq: "weekly", priority: 0.65, lastmod: now };
		}
		if (p.startsWith("/blog/")) {
			return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: now };
		}
		if (p === "/glossary") {
			return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: now };
		}
		if (p.startsWith("/glossary/")) {
			return { loc: path, changefreq: "monthly", priority: 0.6, lastmod: now };
		}
		if (p.startsWith("/authors/")) {
			return { loc: path, changefreq: "monthly", priority: 0.6, lastmod: now };
		}
		if (p === "/contact") {
			return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: now };
		}
		if (p === "/about") {
			return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: now };
		}
		if (p === "/privacy-policy" || p === "/security") {
			return { loc: path, changefreq: "yearly", priority: 0.3, lastmod: now };
		}
		if (p === "/search") {
			return { loc: path, changefreq: "monthly", priority: 0.4, lastmod: now };
		}
		if (p === "/en") {
			return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: now };
		}
		if (p.startsWith("/en/services/")) {
			return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: now };
		}
		if (p.startsWith("/en/")) {
			return { loc: path, changefreq: "monthly", priority: 0.6, lastmod: now };
		}
		return { loc: path, changefreq: "weekly", priority: 0.7, lastmod: now };
	},
};

module.exports = config;
