/**
 * mdToHtml が生成した HTML への後処理として、glossary 用語の初出を
 * /glossary/{slug}/ へ自動リンクする。mdToHtml 本体は汚さない
 * （4箇所で共用される純粋関数のため、適用箇所をページ側で明示選択する）。
 *
 * 誤リンク対策:
 * - <a>・<code>・<pre>・<h1>〜<h4>・answer-block 内はスキップ
 * - そのページに手動の /glossary/x/ リンクが既にある用語はスキップ
 * - 長い用語を優先マッチし、消費済みレンジ管理で CJK の部分語衝突を回避
 *   （例: 「エージェントガバナンス」⊂「エージェント」）
 * - ASCII 用語は前後が英数字なら不一致（"RAG" が "STORAGE" に当たらない）
 * - 1用語につき初出1回・1ページ最大 maxLinks 件・2文字以下の用語は対象外
 */

export interface GlossaryLinkTerm {
	slug: string;
	term: string;
	english?: string;
}

interface Options {
	/** 自分自身（glossary ページ等）の slug は除外 */
	selfSlug?: string;
	/** 1ページの自動リンク上限 */
	maxLinks?: number;
}

interface Candidate {
	slug: string;
	name: string;
}

const isWordChar = (ch: string | undefined): boolean =>
	!!ch && /[A-Za-z0-9]/.test(ch);

/** ASCII 主体の用語か（語境界チェックの要否判定） */
const isAsciiName = (name: string): boolean => /^[\x20-\x7e]+$/.test(name);

export function autoLinkGlossary(
	html: string,
	terms: GlossaryLinkTerm[],
	opts: Options = {},
): string {
	const maxLinks = opts.maxLinks ?? 5;

	// 手動リンク済みの用語 slug（自動リンクの対象から外す）
	const manuallyLinked = new Set<string>();
	for (const m of html.matchAll(/href="\/glossary\/([^/"]+)\/?"/g)) {
		manuallyLinked.add(m[1]);
	}

	const candidates: Candidate[] = terms
		.filter((t) => t.slug !== opts.selfSlug && !manuallyLinked.has(t.slug))
		.flatMap((t) => {
			const names = [t.term, t.english].filter(
				(n): n is string => !!n && n.trim().length > 2,
			);
			return names.map((name) => ({ slug: t.slug, name: name.trim() }));
		})
		// 長い用語を優先（部分語の衝突回避）
		.sort((a, b) => b.name.length - a.name.length);

	if (candidates.length === 0) return html;

	// タグとテキストに分割して走査
	const parts = html.split(/(<[^>]+>)/);
	const skipOpenRe = /^<(a|code|pre|h1|h2|h3|h4)(\s|>)/i;
	const skipCloseRe = /^<\/(a|code|pre|h1|h2|h3|h4)>/i;
	const bqOpenRe = /^<blockquote[^>]*class="[^"]*answer-block/i;
	const bqCloseRe = /^<\/blockquote>/i;

	let skipDepth = 0;
	let inAnswerBlock = false;
	let linkCount = 0;
	const linkedSlugs = new Set<string>();

	for (let i = 0; i < parts.length && linkCount < maxLinks; i++) {
		const part = parts[i];
		if (part.startsWith("<")) {
			if (skipOpenRe.test(part)) skipDepth++;
			else if (skipCloseRe.test(part)) skipDepth = Math.max(0, skipDepth - 1);
			else if (bqOpenRe.test(part)) inAnswerBlock = true;
			else if (bqCloseRe.test(part)) inAnswerBlock = false;
			continue;
		}
		if (skipDepth > 0 || inAnswerBlock || !part.trim()) continue;

		// このテキストセグメント内のマッチを収集（消費済みレンジ管理）
		const accepted: { start: number; end: number; cand: Candidate }[] = [];
		const overlaps = (s: number, e: number) =>
			accepted.some((a) => s < a.end && e > a.start);

		for (const cand of candidates) {
			if (linkCount + accepted.length >= maxLinks) break;
			if (linkedSlugs.has(cand.slug)) continue;
			if (accepted.some((a) => a.cand.slug === cand.slug)) continue;

			let from = 0;
			while (from <= part.length - cand.name.length) {
				const idx = part.indexOf(cand.name, from);
				if (idx === -1) break;
				const end = idx + cand.name.length;
				const boundaryOk =
					!isAsciiName(cand.name) ||
					(!isWordChar(part[idx - 1]) && !isWordChar(part[end]));
				if (!overlaps(idx, end) && boundaryOk) {
					accepted.push({ start: idx, end, cand });
					break;
				}
				from = idx + 1;
			}
		}

		if (accepted.length === 0) continue;

		// 後ろから差し込み（インデックスを保つ）
		accepted.sort((a, b) => b.start - a.start);
		let text = part;
		for (const { start, end, cand } of accepted) {
			text = `${text.slice(0, start)}<a href="/glossary/${cand.slug}/">${text.slice(start, end)}</a>${text.slice(end)}`;
			linkedSlugs.add(cand.slug);
			linkCount++;
		}
		parts[i] = text;
	}

	return parts.join("");
}
