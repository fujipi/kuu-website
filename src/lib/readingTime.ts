/**
 * Rough reading-time estimator for Japanese + English mixed content.
 * - Japanese: ~500 chars/min (adult, non-fiction)
 * - English: ~230 words/min
 * Returns minutes, minimum 1.
 */
export function readingTimeMinutes(markdown: string): number {
	if (!markdown) return 1;
	const stripped = markdown
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`[^`]+`/g, "")
		.replace(/!\[[^\]]*\]\([^)]+\)/g, "")
		.replace(/\[[^\]]*\]\([^)]+\)/g, "");
	const jpChars = (stripped.match(/[\u3040-\u30ff\u4e00-\u9faf]/g) ?? [])
		.length;
	const enWords = (stripped.match(/[A-Za-z]+/g) ?? []).length;
	const minutes = jpChars / 500 + enWords / 230;
	return Math.max(1, Math.round(minutes));
}
