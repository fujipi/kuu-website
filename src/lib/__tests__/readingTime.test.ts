import { describe, expect, it } from "vitest";
import { readingTimeMinutes } from "@/lib/readingTime";

describe("readingTimeMinutes", () => {
	it("returns at least 1 minute", () => {
		expect(readingTimeMinutes("")).toBe(1);
		expect(readingTimeMinutes("短い")).toBe(1);
	});

	it("estimates Japanese text at ~500 chars/min", () => {
		expect(readingTimeMinutes("あ".repeat(1500))).toBe(3);
	});

	it("estimates English text at ~230 words/min", () => {
		expect(readingTimeMinutes("word ".repeat(460))).toBe(2);
	});

	it("excludes code blocks from the estimate", () => {
		const code = `\`\`\`\n${"あ".repeat(5000)}\n\`\`\``;
		expect(readingTimeMinutes(code)).toBe(1);
	});
});
