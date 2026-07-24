import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SECTION_DIRS = [
	{ section: "blog" as const, dir: path.join(process.cwd(), "content/blog") },
	{ section: "case" as const, dir: path.join(process.cwd(), "content/case") },
];

export interface MentioningPost {
	slug: string;
	section: "blog" | "case";
	href: string;
	title: string;
	description: string;
	date: string;
}

export function getPostsMentioningTerm(termSlug: string): MentioningPost[] {
	const pattern = new RegExp(
		`\\(/glossary/${termSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?\\)`,
	);
	const mentions: MentioningPost[] = [];
	for (const { section, dir } of SECTION_DIRS) {
		if (!fs.existsSync(dir)) continue;
		for (const file of fs.readdirSync(dir)) {
			if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
			const raw = fs.readFileSync(path.join(dir, file), "utf-8");
			if (!pattern.test(raw)) continue;
			const { data } = matter(raw);
			const slug = file.replace(/\.(mdx|md)$/, "");
			mentions.push({
				slug,
				section,
				href: `/${section}/${slug}/`,
				title: data.title ?? "",
				description: data.description ?? "",
				date: data.date ?? "",
			});
		}
	}
	return mentions.sort((a, b) => (a.date < b.date ? 1 : -1));
}
