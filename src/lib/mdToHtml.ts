/**
 * Lightweight Markdown → HTML renderer for MDX source bodies.
 * Shared by blog / case / news / resources / glossary detail pages.
 * Handles: H1-H4 (with optional TOC id map), bold/italic/inline code, links,
 * tables, Direct-Answer blockquotes, horizontal rules, ordered/unordered
 * lists (including mixed label+list blocks), and paragraphs.
 *
 * Content is read from local content/ files at build time — no external
 * user input reaches this function.
 *
 * @param md  MDX body string (frontmatter already stripped)
 * @param idMap optional Map keyed `${level}:${heading text}` → anchor id
 *              (the format produced by buildToc in src/lib/toc.ts)
 */
export function mdToHtml(md: string, idMap?: Map<string, string>): string {
	const rawBlocks = md.split(/\n\n+/);
	const out: string[] = [];

	const inline = (s: string) =>
		s
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.+?)\*/g, "<em>$1</em>")
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
			.replace(/`([^`]+)`/g, "<code>$1</code>");

	const heading = (level: 1 | 2 | 3 | 4, text: string): string => {
		const id = idMap?.get(`${level}:${text.trim()}`);
		const idAttr = id ? ` id="${id}"` : "";
		return `<h${level}${idAttr}>${text}</h${level}>`;
	};

	const isListLine = (l: string) => /^[-*] /.test(l) || /^\d+\. /.test(l);

	const listHtml = (listLines: string[]): string => {
		const ordered = listLines.some((l) => /^\d+\. /.test(l));
		const tag = ordered ? "ol" : "ul";
		const items = listLines
			.map(
				(l) =>
					`<li>${inline(l.replace(/^[-*] /, "").replace(/^\d+\. /, ""))}</li>`,
			)
			.join("\n");
		return `<${tag}>\n${items}\n</${tag}>`;
	};

	for (const rawBlock of rawBlocks) {
		const block = rawBlock.trim();
		if (!block) continue;

		// Table (very simple: pipe-delimited with separator row)
		if (/^\|.+\|$/m.test(block) && /^\|[\s|:-]+\|$/m.test(block)) {
			const lines = block.split("\n").filter((l) => l.trim());
			const header = lines[0]
				.split("|")
				.slice(1, -1)
				.map((c) => c.trim());
			const rows = lines.slice(2).map((l) =>
				l
					.split("|")
					.slice(1, -1)
					.map((c) => c.trim()),
			);
			const thead = `<thead><tr>${header
				.map((h) => `<th>${inline(h)}</th>`)
				.join("")}</tr></thead>`;
			const tbody = `<tbody>${rows
				.map(
					(r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`,
				)
				.join("")}</tbody>`;
			out.push(`<table>${thead}${tbody}</table>`);
			continue;
		}

		// Horizontal rule
		if (/^---$/.test(block)) {
			out.push("<hr />");
			continue;
		}

		// Direct-Answer Block (blockquote): `> ...` で始まる塊
		const bqLines = block.split("\n");
		if (bqLines.every((l) => /^>\s?/.test(l) || l.trim() === "")) {
			const inner = bqLines
				.filter((l) => /^>\s?/.test(l))
				.map((l) => l.replace(/^>\s?/, ""))
				.join(" ")
				.trim();
			out.push(
				`<blockquote class="answer-block"><p>${inline(inner)}</p></blockquote>`,
			);
			continue;
		}

		// Heading block
		if (/^#{1,4} /.test(block)) {
			out.push(
				inline(
					block
						.replace(/^#### (.+)$/gm, (_m, t) => heading(4, t))
						.replace(/^### (.+)$/gm, (_m, t) => heading(3, t))
						.replace(/^## (.+)$/gm, (_m, t) => heading(2, t))
						.replace(/^# (.+)$/gm, (_m, t) => heading(1, t)),
				),
			);
			continue;
		}

		const lines = block.split("\n");

		// Pure list block (ordered/unordered)
		if (
			lines.every((l) => isListLine(l) || l.trim() === "") &&
			lines.some(isListLine)
		) {
			out.push(listHtml(lines.filter(isListLine)));
			continue;
		}

		// Mixed block: label paragraph + list lines in the same block
		if (lines.some(isListLine)) {
			let i = 0;
			while (i < lines.length) {
				const line = lines[i].trim();
				if (!line) {
					i++;
					continue;
				}
				if (isListLine(line)) {
					const listLines: string[] = [];
					while (i < lines.length && isListLine(lines[i])) {
						listLines.push(lines[i]);
						i++;
					}
					out.push(listHtml(listLines));
				} else {
					out.push(`<p>${inline(line)}</p>`);
					i++;
				}
			}
			continue;
		}

		// Paragraph
		out.push(`<p>${inline(block).replace(/\n/g, "<br />")}</p>`);
	}

	return out.join("\n");
}
