/**
 * Build a table of contents from Markdown H2/H3 headings.
 * Also returns a mutated markdown string with { id="..." } anchors on each
 * heading via a transform that the renderer can pick up.
 */
export interface TocItem {
	id: string;
	text: string;
	level: 2 | 3;
}

const slugify = (text: string): string =>
	text
		.toLowerCase()
		.replace(/[`*_~[\]()#]/g, "")
		.replace(/\s+/g, "-")
		.replace(/[^\p{L}\p{N}-]/gu, "")
		.slice(0, 80) || "section";

export function buildToc(markdown: string): {
	toc: TocItem[];
	idMap: Map<string, string>;
} {
	const toc: TocItem[] = [];
	const idMap = new Map<string, string>();
	const used = new Map<string, number>();
	const lines = markdown.split(/\r?\n/);

	for (const line of lines) {
		const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
		if (!m) continue;
		const level = m[1].length as 2 | 3;
		const text = m[2].trim();
		let id = slugify(text);
		const prev = used.get(id) ?? 0;
		used.set(id, prev + 1);
		if (prev > 0) id = `${id}-${prev + 1}`;
		toc.push({ id, text, level });
		idMap.set(`${level}:${text}`, id);
	}
	return { toc, idMap };
}
