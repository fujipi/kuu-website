const fs = require("node:fs");
const path = require("node:path");

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
  additionalPaths: async (config) => {
    const blogDir = path.join(process.cwd(), "content/blog");
    if (!fs.existsSync(blogDir)) return [];
    const slugs = fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map((f) => f.replace(/\.(mdx|md)$/, ""));
    return slugs.map((slug) => ({
      loc: `/blog/${slug}/`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};

module.exports = config;
