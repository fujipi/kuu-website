/**
 * blog 記事の Markdown から FAQ ペアを抽出し FAQPage JSON-LD を生成する。
 *
 * 抽出ルール（コーパス実測に基づく。2026-06 時点で emit は4記事 — 閾値を
 * 無理に下げず、生成ガイドライン側で質問形見出しを推奨してカバレッジを
 * 前方互換に伸ばす方針）:
 * - H2/H3 が「？/?」「〜とは（何か）」「〜のか/べきか/ですか/ますか」終端
 *   なら質問とみなす（「まとめ」「参考」「おわりに」始まりは除外）
 * - 回答は見出し直後〜次見出し間の最初の DAB（> 引用）。無ければ最初の段落
 * - 2ペア未満なら null、最大6ペア
 */

export interface FaqPair {
	question: string;
	answer: string;
}

const QUESTION_RE = /(？|\?|とは(何か|なにか)?|のか|べきか|ですか|ますか)$/;
const EXCLUDE_RE = /^(まとめ|参考|おわりに)/;
const MAX_PAIRS = 6;
const ANSWER_TARGET_LEN = 160;

/** インライン記法を除去してプレーンテキスト化 */
function stripInline(s: string): string {
	return s
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.trim();
}

/** 文の区切り（。）を保ちながら目標長を跨いだ文末で打ち切る */
function clampToSentence(text: string, target: number): string {
	if (text.length <= target) return text;
	const sentences = text.split(/(?<=。)/);
	let out = "";
	for (const sentence of sentences) {
		out += sentence;
		if (out.length >= target) break;
	}
	return out.trim();
}

/**
 * 見出し直後〜次見出しまでのブロックから回答テキストを得る。
 * 優先: DAB（> 連続行の結合）→ 最初の段落。リスト・表・コードはスキップ。
 */
function extractAnswer(lines: string[]): string | null {
	let inFence = false;
	let i = 0;
	while (i < lines.length) {
		const line = lines[i].trim();
		if (line.startsWith("```")) {
			inFence = !inFence;
			i++;
			continue;
		}
		if (inFence || !line) {
			i++;
			continue;
		}
		// DAB: 連続する > 行を結合
		if (/^>\s?/.test(line)) {
			const parts: string[] = [];
			while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
				parts.push(lines[i].trim().replace(/^>\s?/, ""));
				i++;
			}
			const joined = stripInline(parts.join(" "));
			if (joined) return clampToSentence(joined, ANSWER_TARGET_LEN);
			continue;
		}
		// リスト・表・hr は段落候補から除外して次へ
		if (/^([-*] |\d+\. |\||---$)/.test(line)) {
			i++;
			continue;
		}
		// 段落: 連続する非空行を結合
		const parts: string[] = [];
		while (i < lines.length) {
			const l = lines[i].trim();
			if (!l || /^(#{1,4} |>|```|[-*] |\d+\. |\|)/.test(l)) break;
			parts.push(l);
			i++;
		}
		const joined = stripInline(parts.join(""));
		if (joined) return clampToSentence(joined, ANSWER_TARGET_LEN);
	}
	return null;
}

/** Markdown から FAQ ペアを抽出する。2ペア未満は null */
export function extractFaqPairs(markdown: string): FaqPair[] | null {
	const lines = markdown.split(/\r?\n/);

	// 見出し位置を収集（コードフェンス内は無視）
	const headings: { index: number; text: string }[] = [];
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim().startsWith("```")) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
		if (m) headings.push({ index: i, text: stripInline(m[2]) });
	}

	const pairs: FaqPair[] = [];
	const seen = new Set<string>();
	for (let h = 0; h < headings.length; h++) {
		const { index, text } = headings[h];
		if (EXCLUDE_RE.test(text) || !QUESTION_RE.test(text)) continue;
		const sectionEnd =
			h + 1 < headings.length ? headings[h + 1].index : lines.length;
		const answer = extractAnswer(lines.slice(index + 1, sectionEnd));
		if (!answer) continue;
		const key = text.replace(/\s+/g, "");
		if (seen.has(key)) continue;
		seen.add(key);
		pairs.push({ question: text, answer });
		if (pairs.length >= MAX_PAIRS) break;
	}

	return pairs.length >= 2 ? pairs : null;
}

/** FAQPage JSON-LD を構築する */
export function buildFaqJsonLd(pairs: FaqPair[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: pairs.map((p) => ({
			"@type": "Question",
			name: p.question,
			acceptedAnswer: { "@type": "Answer", text: p.answer },
		})),
	};
}
