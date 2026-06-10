/**
 * 多言語対応の最小基盤。本文はページ単位で書き分け（8ページ規模で
 * 辞書化は過剰設計）、共通UI文言と対訳パスのみをここで管理する。
 */
export type Locale = "ja" | "en";

/** JA パス → EN パス の対訳マップ（対訳が存在するページのみ登録） */
export const LOCALE_PAIRS: Record<string, string> = {
	"/": "/en/",
	"/about/": "/en/about/",
	"/contact/": "/en/contact/",
	"/services/": "/en/services/",
	"/services/ai-ops/": "/en/services/ai-ops/",
	"/services/ax-dx/": "/en/services/ax-dx/",
	"/services/rde/": "/en/services/rde/",
	"/ai-governance/": "/en/ai-governance/",
};

export const EN_TO_JA: Record<string, string> = Object.fromEntries(
	Object.entries(LOCALE_PAIRS).map(([ja, en]) => [en, ja]),
);

export function localeFromPath(path: string): Locale {
	return path === "/en" || path.startsWith("/en/") ? "en" : "ja";
}

/**
 * 言語切替リンクの遷移先。対訳ページがあれば相互リンク、
 * なければ相手言語のトップへ（route group 間の遷移は
 * フルリロードになるのは Next.js の仕様）。
 */
export function switchLocalePath(path: string): string {
	const norm = path.endsWith("/") ? path : `${path}/`;
	if (localeFromPath(norm) === "en") {
		return EN_TO_JA[norm] ?? "/";
	}
	return LOCALE_PAIRS[norm] ?? "/en/";
}
