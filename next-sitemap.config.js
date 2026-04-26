/** @type {import('next-sitemap').IConfig} */
const config = {
	siteUrl: "https://kuucorp.com",
	generateRobotsTxt: true,
	outDir: "out",
	trailingSlash: true,
	changefreq: "weekly",
	priority: 0.7,
	sitemapSize: 5000,
	exclude: [],
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
		if (p === "/") {
			return { loc: path, changefreq: "weekly", priority: 1.0, lastmod: now };
		}
		if (
			p === "/ai-governance" ||
			p === "/managed-agents" ||
			p === "/eu-ai-act-jp"
		) {
			return { loc: path, changefreq: "monthly", priority: 0.95, lastmod: now };
		}
		if (p.startsWith("/services/")) {
			return { loc: path, changefreq: "monthly", priority: 0.9, lastmod: now };
		}
		if (p === "/pricing") {
			return { loc: path, changefreq: "monthly", priority: 0.9, lastmod: now };
		}
		if (p === "/case-studies") {
			return { loc: path, changefreq: "weekly", priority: 0.9, lastmod: now };
		}
		if (p.startsWith("/case-studies/")) {
			return { loc: path, changefreq: "monthly", priority: 0.85, lastmod: now };
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
		if (p.startsWith("/blog/tags/")) {
			return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: now };
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
		if (p === "/privacy-policy") {
			return { loc: path, changefreq: "yearly", priority: 0.3, lastmod: now };
		}
		return { loc: path, changefreq: "weekly", priority: 0.7, lastmod: now };
	},
};

module.exports = config;
