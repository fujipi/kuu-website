import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface MentioningPost {
	slug: string;
	title: string;
	description: string;
	date: string;
}

export function getPostsMentioningTerm(termSlug: string): MentioningPost[] {
	if (!fs.existsSync(BLOG_DIR)) return [];
	const pattern = new RegExp(
		`\\(/glossary/${termSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?\\)`,
	);
	const mentions: MentioningPost[] = [];
	for (const file of fs.readdirSync(BLOG_DIR)) {
		if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
		const filePath = path.join(BLOG_DIR, file);
		const raw = fs.readFileSync(filePath, "utf-8");
		if (!pattern.test(raw)) continue;
		const { data } = matter(raw);
		mentions.push({
			slug: file.replace(/\.(mdx|md)$/, ""),
			title: data.title ?? "",
			description: data.description ?? "",
			date: data.date ?? "",
		});
	}
	return mentions.sort((a, b) => (a.date < b.date ? 1 : -1));
}
