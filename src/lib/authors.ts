import fs from "node:fs";
import path from "node:path";

const AUTHORS_DIR = path.join(process.cwd(), "content/authors");

export interface Author {
	slug: string;
	name: string;
	role: string;
	bio: string;
	expertise: string[];
	sameAs: string[];
}

const DEFAULT_AUTHOR: Author = {
	slug: "kuu-editorial",
	name: "Kuu株式会社 編集部",
	role: "Kuu株式会社 エージェントガバナンス編集部",
	bio: "Kuu株式会社の編集部。AIエージェントガバナンス、Managed Agents、AX/DX戦略に関する実践的な情報を発信しています。",
	expertise: [
		"AIエージェントガバナンス",
		"AX / DX 戦略",
		"中小企業DX",
		"生成AI 業務活用",
	],
	sameAs: ["https://kuucorp.com/about/"],
};

export function getAllAuthors(): Author[] {
	if (!fs.existsSync(AUTHORS_DIR)) return [DEFAULT_AUTHOR];
	return fs
		.readdirSync(AUTHORS_DIR)
		.filter((f) => f.endsWith(".json"))
		.map((f) => {
			const raw = fs.readFileSync(path.join(AUTHORS_DIR, f), "utf-8");
			return JSON.parse(raw) as Author;
		});
}

export function getAuthorBySlug(slug: string | undefined): Author {
	if (!slug) return DEFAULT_AUTHOR;
	const file = path.join(AUTHORS_DIR, `${slug}.json`);
	if (!fs.existsSync(file)) return DEFAULT_AUTHOR;
	return JSON.parse(fs.readFileSync(file, "utf-8")) as Author;
}

export const KUU_EDITORIAL_SLUG = "kuu-editorial";
