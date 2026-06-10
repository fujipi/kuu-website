/**
 * フォーム送信先（Formspree）。静的エクスポートのためサーバー処理は持てず、
 * すべてクライアント fetch + Formspree で完結させる。
 *
 * 現状は問い合わせ・ニュースレター・資料請求を同一フォーム ID に集約し、
 * `form_type` / `_subject` フィールドで振り分ける。専用フォームを
 * Formspree 側に作成したら、ここの定数を差し替えるだけで切り替わる。
 */
export const FORMSPREE_CONTACT = "https://formspree.io/f/mojyqlak";
export const FORMSPREE_NEWSLETTER = FORMSPREE_CONTACT;
export const FORMSPREE_RESOURCE = FORMSPREE_CONTACT;

/** GA4 イベント送出（gtag 未導入環境では何もしない） */
export function trackEvent(
	name: string,
	params?: Record<string, string>,
): void {
	if (typeof window === "undefined") return;
	const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
		.gtag;
	if (typeof gtag === "function") {
		gtag("event", name, params ?? {});
	}
}
