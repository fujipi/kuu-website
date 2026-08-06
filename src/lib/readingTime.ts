/** \u30b3\u30fc\u30c9\u30d6\u30ed\u30c3\u30af\u30fb\u30a4\u30f3\u30e9\u30a4\u30f3\u30b3\u30fc\u30c9\u30fb\u753b\u50cf\u30fb\u30ea\u30f3\u30af\u8a18\u6cd5\u3092\u843d\u3068\u3057\u3066\u672c\u6587\u3060\u3051\u306b\u3059\u308b */
function stripMarkup(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`[^`]+`/g, "")
		.replace(/!\[[^\]]*\]\([^)]+\)/g, "")
		.replace(/\[[^\]]*\]\([^)]+\)/g, "");
}

/** \u672c\u6587\u306e\u65e5\u672c\u8a9e\u6587\u5b57\u6570\u3068\u82f1\u5358\u8a9e\u6570\u3092\u6570\u3048\u308b\uff08Markdown\u8a18\u6cd5\u306f\u9664\u5916\uff09 */
export function countTextUnits(markdown: string): {
	jpChars: number;
	enWords: number;
} {
	const stripped = stripMarkup(markdown);
	return {
		jpChars: (stripped.match(/[\u3040-\u30ff\u4e00-\u9faf]/g) ?? []).length,
		enWords: (stripped.match(/[A-Za-z]+/g) ?? []).length,
	};
}

/**
 * schema.org `wordCount` \u7528\u306e\u8a9e\u6570\u3002
 *
 * \u65e5\u672c\u8a9e\u306b\u306f\u8a9e\u5883\u754c\u304c\u7121\u3044\u305f\u3081\u3001CJK \u306f1\u6587\u5b57\uff1d1\u8a9e\u3068\u3057\u3066\u6570\u3048\u3001\u82f1\u5b57\u306f\u5358\u8a9e\u5358\u4f4d\u3067\u6570\u3048\u308b
 * \uff08\u65e5\u672c\u8a9e\u5f62\u614b\u7d20\u89e3\u6790\u5668\u306e\u304a\u304a\u3088\u305d\u306e\u6319\u52d5\u306b\u5408\u308f\u305b\u305f\u8fd1\u4f3c\uff09\u3002Markdown \u8a18\u6cd5\u306f\u6570\u3048\u306a\u3044\u3002
 *
 * \u751f\u306e `content.length` \u306f\u8a18\u6cd5\u8fbc\u307f\u306e\u6587\u5b57\u6570\u3067\u3001\u8a9e\u6570\u3068\u3057\u3066\u306f1\u6841\u904e\u5927\u306b\u306a\u308b\u305f\u3081\u4f7f\u308f\u306a\u3044\u3002
 */
export function wordCount(markdown: string): number {
	if (!markdown) return 0;
	const { jpChars, enWords } = countTextUnits(markdown);
	return jpChars + enWords;
}

/**
 * Rough reading-time estimator for Japanese + English mixed content.
 * - Japanese: ~500 chars/min (adult, non-fiction)
 * - English: ~230 words/min
 * Returns minutes, minimum 1.
 */
export function readingTimeMinutes(markdown: string): number {
	if (!markdown) return 1;
	const { jpChars, enWords } = countTextUnits(markdown);
	const minutes = jpChars / 500 + enWords / 230;
	return Math.max(1, Math.round(minutes));
}
