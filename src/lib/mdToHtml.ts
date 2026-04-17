/**
 * Lightweight Markdown → HTML renderer for MDX source bodies.
 * Handles: H1-H4 (with optional id map), bold/italic/inline code, links,
 * ordered/unordered lists, and paragraphs. Tables not supported — use MDX for that.
 *
 * @param md  MDX body string (frontmatter already stripped)
 * @param idMap optional Map where keys are heading text and values are anchor ids
 */
export function mdToHtml(md: string, idMap?: Map<string, string>): string {
	const rawBlocks = md.split(/\n\n+/);
	const out: string[] = [];
	const headingIdAttr = (text: string) => {
		if (!idMap) return "";
		const id = idMap.get(text.trim());
		return id ? ` id="${id}"` : "";
	};

	const inline = (s: string) =>
		s
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.+?)\*/g, "<em>$1</em>")
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
			.replace(/`([^`]+)`/g, "<code>$1</code>");

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

		if (/^#{1,4} /.test(block)) {
			out.push(
				block
					.replace(/^#### (.+)$/gm, (_m, t) => `<h4${headingIdAttr(t)}>${inline(t)}</h4>`)
					.replace(/^### (.+)$/gm, (_m, t) => `<h3${headingIdAttr(t)}>${inline(t)}</h3>`)
					.replace(/^## (.+)$/gm, (_m, t) => `<h2${headingIdAttr(t)}>${inline(t)}</h2>`)
					.replace(/^# (.+)$/gm, (_m, t) => `<h1${headingIdAttr(t)}>${inline(t)}</h1>`),
			);
			continue;
		}

		const lines = block.split("\n");
		const isList = lines.every(
			(l) => /^[-*] /.test(l) || /^\d+\. /.test(l) || l.trim() === "",
		);
		if (isList && lines.some((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))) {
			const ordered = lines.some((l) => /^\d+\. /.test(l));
			const tag = ordered ? "ol" : "ul";
			const items = lines
				.filter((l) => /^[-*] /.test(l) || /^\d+\. /.test(l))
				.map((l) => `<li>${inline(l.replace(/^[-*] /, "").replace(/^\d+\. /, ""))}</li>`)
				.join("\n");
			out.push(`<${tag}>\n${items}\n</${tag}>`);
			continue;
		}

		out.push(`<p>${inline(block).replace(/\n/g, "<br />")}</p>`);
	}

	return out.join("\n");
}
