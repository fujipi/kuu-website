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
