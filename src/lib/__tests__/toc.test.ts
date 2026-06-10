import { describe, expect, it } from "vitest";
import { buildToc } from "@/lib/toc";

describe("buildToc", () => {
	it("collects H2/H3 headings with levels", () => {
		const { toc } = buildToc("## はじめに\n\n本文\n\n### 詳細\n\n## まとめ");
		expect(toc).toHaveLength(3);
		expect(toc[0]).toMatchObject({ text: "はじめに", level: 2 });
		expect(toc[1]).toMatchObject({ text: "詳細", level: 3 });
	});

	it("ignores H1 and H4", () => {
		const { toc } = buildToc("# タイトル\n\n#### 細目");
		expect(toc).toHaveLength(0);
	});

	it("keys idMap by level:text", () => {
		const { toc, idMap } = buildToc("## エージェントとは");
		expect(idMap.get("2:エージェントとは")).toBe(toc[0].id);
	});

	it("deduplicates repeated heading ids", () => {
		const { toc } = buildToc("## 概要\n\n## 概要");
		expect(toc[0].id).not.toBe(toc[1].id);
	});

	it("falls back to 'section' for symbol-only headings", () => {
		const { toc } = buildToc("## ***");
		expect(toc[0].id).toBe("section");
	});
});
