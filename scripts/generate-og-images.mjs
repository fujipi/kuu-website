#!/usr/bin/env node
/**
 * Generate OG images (1200x630 PNG) for:
 *  - /og/default.png (site default)
 *  - /og/blog/{slug}.png (each blog post)
 *  - /og/{pillar}.png (pillar pages, glossary, etc.)
 *
 * Runs at postbuild. Uses satori + @resvg/resvg-js.
 * Fonts are downloaded once into scripts/.cache/fonts/ and reused.
 */
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import satori from "satori";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");
const GLOSSARY_DIR = path.join(ROOT, "content/glossary");
const CASE_STUDIES_DIR = path.join(ROOT, "content/case-studies");
const RESOURCES_DIR = path.join(ROOT, "content/resources");
const OUT_DIR = path.join(ROOT, "public/og");
const FONT_CACHE = path.join(ROOT, "scripts/.cache/fonts");
const SITE = "Kuu株式会社";
const TAGLINE = "技術と物語を、あらゆる人に届ける";

/* ---------- Font loading ---------- */
async function loadFont(url, filename) {
	fs.mkdirSync(FONT_CACHE, { recursive: true });
	const cached = path.join(FONT_CACHE, filename);
	if (fs.existsSync(cached)) {
		return fs.readFileSync(cached);
	}
	console.log(`[og] downloading font ${filename}...`);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Font fetch failed: ${url}`);
	const buf = Buffer.from(await res.arrayBuffer());
	fs.writeFileSync(cached, buf);
	return buf;
}

async function getFonts() {
	// Google Fonts static TTF hosted on their CDN (requires weighted TTF).
	// Noto Sans JP static TTFs are released under SIL Open Font License 1.1.
	const regular = await loadFont(
		"https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf",
		"NotoSansJP-Regular.otf",
	);
	const bold = await loadFont(
		"https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf",
		"NotoSansJP-Bold.otf",
	);
	return [
		{ name: "Noto Sans JP", data: regular, weight: 400, style: "normal" },
		{ name: "Noto Sans JP", data: bold, weight: 700, style: "normal" },
	];
}

/* ---------- Template ---------- */
function template({ title, eyebrow }) {
	return {
		type: "div",
		props: {
			style: {
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "80px 96px",
				background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
				color: "#ffffff",
				fontFamily: "Noto Sans JP",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							fontSize: "28px",
							fontWeight: 400,
							color: "#8b95a8",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
						},
						children: eyebrow,
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							fontSize: title.length > 30 ? "56px" : "72px",
							fontWeight: 700,
							lineHeight: 1.3,
							color: "#ffffff",
							maxWidth: "1008px",
						},
						children: title,
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
							fontSize: "24px",
							color: "#8b95a8",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										fontWeight: 700,
										color: "#ffffff",
										letterSpacing: "0.05em",
									},
									children: SITE,
								},
							},
							{
								type: "div",
								props: {
									style: { display: "flex" },
									children: TAGLINE,
								},
							},
						],
					},
				},
			],
		},
	};
}

async function renderPng(title, eyebrow, fonts) {
	const svg = await satori(template({ title, eyebrow }), {
		width: 1200,
		height: 630,
		fonts,
	});
	const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
		.render()
		.asPng();
	return png;
}

/* ---------- Jobs ---------- */
function collectBlog() {
	if (!fs.existsSync(BLOG_DIR)) return [];
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
			return {
				out: path.join(OUT_DIR, "blog", `${slug}.png`),
				title: data.title ?? slug,
				eyebrow: "Blog",
			};
		});
}

function collectGlossary() {
	if (!fs.existsSync(GLOSSARY_DIR)) return [];
	return fs
		.readdirSync(GLOSSARY_DIR)
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => {
			const slug = f.replace(/\.mdx$/, "");
			const { data } = matter(
				fs.readFileSync(path.join(GLOSSARY_DIR, f), "utf-8"),
			);
			return {
				out: path.join(OUT_DIR, "glossary", `${slug}.png`),
				title: data.term ?? slug,
				eyebrow: "Glossary",
			};
		});
}

function collectCaseStudies() {
	if (!fs.existsSync(CASE_STUDIES_DIR)) return [];
	return fs
		.readdirSync(CASE_STUDIES_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const { data } = matter(
				fs.readFileSync(path.join(CASE_STUDIES_DIR, f), "utf-8"),
			);
			return {
				out: path.join(OUT_DIR, "case-studies", `${slug}.png`),
				title: data.title ?? slug,
				eyebrow: "Case Study",
			};
		});
}

function collectResources() {
	if (!fs.existsSync(RESOURCES_DIR)) return [];
	return fs
		.readdirSync(RESOURCES_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const { data } = matter(
				fs.readFileSync(path.join(RESOURCES_DIR, f), "utf-8"),
			);
			return {
				out: path.join(OUT_DIR, "resources", `${slug}.png`),
				title: data.title ?? slug,
				eyebrow: "Resource",
			};
		});
}

const STATIC_JOBS = [
	{ out: "default.png", title: SITE, eyebrow: TAGLINE },
	{
		out: "ai-governance.png",
		title: "エージェントガバナンスとは",
		eyebrow: "Pillar",
	},
	{
		out: "managed-agents.png",
		title: "Managed Agents 実装ガイド",
		eyebrow: "Pillar",
	},
	{
		out: "eu-ai-act-jp.png",
		title: "EU AI Act 日本企業対応",
		eyebrow: "Pillar",
	},
	{ out: "pricing.png", title: "料金プラン", eyebrow: "Pricing" },
	{ out: "glossary.png", title: "AI Agent Glossary", eyebrow: "Glossary" },
	{
		out: "case-studies.png",
		title: "AIエージェント導入事例",
		eyebrow: "Case Studies",
	},
	{
		out: "resources.png",
		title: "AIガバナンス資料・テンプレート",
		eyebrow: "Resources",
	},
	{ out: "blog.png", title: "Blog", eyebrow: SITE },
	{ out: "about.png", title: "About Kuu株式会社", eyebrow: SITE },
	{ out: "contact.png", title: "Contact", eyebrow: SITE },
];

/* ---------- Main ---------- */
async function main() {
	try {
		const fonts = await getFonts();
		fs.mkdirSync(OUT_DIR, { recursive: true });
		fs.mkdirSync(path.join(OUT_DIR, "blog"), { recursive: true });
		fs.mkdirSync(path.join(OUT_DIR, "glossary"), { recursive: true });
		fs.mkdirSync(path.join(OUT_DIR, "case-studies"), { recursive: true });
		fs.mkdirSync(path.join(OUT_DIR, "resources"), { recursive: true });

		const jobs = [
			...STATIC_JOBS.map((j) => ({ ...j, out: path.join(OUT_DIR, j.out) })),
			...collectBlog(),
			...collectGlossary(),
			...collectCaseStudies(),
			...collectResources(),
		];

		for (const job of jobs) {
			const png = await renderPng(job.title, job.eyebrow, fonts);
			fs.mkdirSync(path.dirname(job.out), { recursive: true });
			fs.writeFileSync(job.out, png);
		}

		// Also copy default.png to /images/ogp.png for backward compat
		const defaultPath = path.join(OUT_DIR, "default.png");
		const legacyPath = path.join(ROOT, "public/images/ogp.png");
		fs.copyFileSync(defaultPath, legacyPath);

		console.log(`[og] generated ${jobs.length} images -> public/og/`);
	} catch (err) {
		console.error("[og] failed:", err.message);
		console.error("[og] skipping OG image generation (non-fatal)");
	}
}

main();
