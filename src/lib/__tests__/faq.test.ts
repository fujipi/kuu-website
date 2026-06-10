import { describe, expect, it } from "vitest";
import { buildFaqJsonLd, extractFaqPairs } from "@/lib/faq";

const md = (...sections: string[]) => sections.join("\n\n");

describe("extractFaqPairs", () => {
	it("extracts question headings with DAB answers", () => {
		const pairs = extractFaqPairs(
			md(
				"## AIエージェントとは何か",
				"> 自律的に計画・実行するAIシステムです。",
				"本文。",
				"## ガバナンスは必要か？",
				"> 3本目のエージェントから必要になります。",
			),
		);
		expect(pairs).toHaveLength(2);
		expect(pairs?.[0]).toEqual({
			question: "AIエージェントとは何か",
			answer: "自律的に計画・実行するAIシステムです。",
		});
	});

	it("falls back to the first paragraph when no DAB exists", () => {
		const pairs = extractFaqPairs(
			md(
				"## 導入すべきか",
				"- リスト項目はスキップ",
				"段落が回答になります。",
				"## 費用はいくらですか",
				"**目安**は[こちら](/blog/x/)です。",
			),
		);
		expect(pairs?.[0].answer).toBe("段落が回答になります。");
		expect(pairs?.[1].answer).toBe("目安はこちらです。");
	});

	it("returns null when fewer than 2 pairs", () => {
		expect(extractFaqPairs("## 一つだけとは\n\n> 回答。")).toBe(null);
		expect(extractFaqPairs("## 質問なし見出し\n\n本文。")).toBe(null);
	});

	it("caps at 6 pairs", () => {
		const sections: string[] = [];
		for (let i = 1; i <= 8; i++) {
			sections.push(`## 質問${i}ですか`, `> 回答${i}。`);
		}
		expect(extractFaqPairs(md(...sections))).toHaveLength(6);
	});

	it("deduplicates identical questions", () => {
		const pairs = extractFaqPairs(
			md(
				"## 必要ですか",
				"> 回答A。",
				"## 必要ですか",
				"> 回答B。",
				"## 別の質問とは",
				"> 回答C。",
			),
		);
		expect(pairs).toHaveLength(2);
	});

	it("excludes まとめ/参考 headings even if question-shaped", () => {
		const pairs = extractFaqPairs(
			md(
				"## まとめ：導入すべきか",
				"> まとめ回答。",
				"## 評価とは",
				"> 回答1。",
				"## 監査ログは必要か？",
				"> 回答2。",
			),
		);
		expect(pairs?.map((p) => p.question)).toEqual([
			"評価とは",
			"監査ログは必要か？",
		]);
	});

	it("ignores headings and quotes inside code fences", () => {
		const pairs = extractFaqPairs(
			md(
				"## 設定方法とは",
				"```\n## 偽の見出しとは\n> 偽の引用\n```",
				"実際の回答段落。",
				"## もう一つの質問か？",
				"> 回答。",
			),
		);
		expect(pairs).toHaveLength(2);
		expect(pairs?.[0].answer).toBe("実際の回答段落。");
	});

	it("clamps long answers at a sentence boundary past 160 chars", () => {
		const s1 = `${"あ".repeat(100)}。`;
		const s2 = `${"い".repeat(100)}。`;
		const s3 = `${"う".repeat(100)}。`;
		const pairs = extractFaqPairs(
			md("## 長い回答とは", `> ${s1}${s2}${s3}`, "## 二つ目か？", "> 短い。"),
		);
		// 160字を跨いだ s2 の文末までを含み、s3 は含まない
		expect(pairs?.[0].answer).toBe(`${s1}${s2}`);
	});

	it("skips question headings that have no answer content", () => {
		const pairs = extractFaqPairs(
			md(
				"## 回答がない質問か？",
				"## 次の質問とは",
				"> 回答1。",
				"## さらに質問か？",
				"> 回答2。",
			),
		);
		expect(pairs?.map((p) => p.question)).toEqual([
			"次の質問とは",
			"さらに質問か？",
		]);
	});
});

describe("buildFaqJsonLd", () => {
	it("builds a FAQPage with Question/Answer entities", () => {
		const ld = buildFaqJsonLd([{ question: "Q?", answer: "A." }]);
		expect(ld["@type"]).toBe("FAQPage");
		expect(ld.mainEntity[0]).toEqual({
			"@type": "Question",
			name: "Q?",
			acceptedAnswer: { "@type": "Answer", text: "A." },
		});
	});
});
