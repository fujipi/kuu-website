#!/usr/bin/env node
/**
 * Case の sources URL の疎通チェック（content/case/*.mdx）
 *
 * **任意実行**。CI の必須ゲートにはしない。外部サイトの一時的な 503・レート制限・
 * ボット遮断でサイト全体のデプロイが止まるのは割に合わないため、
 * scripts/validate-case.mjs（hard gate）とは分けてある。
 * 定期的に手で回して、リンク切れを見つけたら差し替える運用を想定する。
 *
 * ## User-Agent について（重要）
 *
 * `curl` の既定 UA や "compatible; link-check" のようなボットっぽい UA を送ると、
 * 政府系サイト（meti.go.jp 等）が **403 を返す**。ページは生きているのに
 * 死んでいると誤判定するため、実ブラウザ相当の UA を送る。
 *
 * それでも 403 を返すサイトはある（Cloudflare 等）。403 は「ボット遮断の可能性が高く、
 * 死んだとは断定できない」として **BLOCKED** に分類し、404/410 の **DEAD** と区別する。
 * exit コードを左右するのは DEAD のみ。
 *
 * ## e-Gov について（重要）
 *
 * `laws.e-gov.go.jp/law/{id}` は SPA で、**存在しない法令IDでも 200 を返す**。
 * ステータスコードだけ見ると誤った法令IDが素通りするため、e-Gov のURLは
 * 法令APIで実在と正式名称を確認する。
 *
 * ## 使い方
 *
 *   node scripts/check-case-sources.mjs          # 全件
 *   node scripts/check-case-sources.mjs --slug contract-review-agent
 *
 * 依存: gray-matter（package.json に既存）。Node 18+ の fetch を使う。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CASE_DIR = path.join(ROOT, "content/case");

/** src/lib/case.ts の SOURCE_URL と同じ意図（行のどこにあっても拾う） */
const SOURCE_URL = /https?:\/\/[^\s"'<>）)」』】]+/;

const BROWSER_UA =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;

const slugFilter = (() => {
	const i = process.argv.indexOf("--slug");
	return i >= 0 ? process.argv[i + 1] : null;
})();

if (!fs.existsSync(CASE_DIR)) {
	console.error(`[check-case-sources] FATAL: ${CASE_DIR} が存在しません`);
	process.exit(2);
}

/** 全 case から URL を集める → [{ file, url }] （URLは重複排除） */
function collectUrls() {
	const seen = new Set();
	const out = [];
	const files = fs
		.readdirSync(CASE_DIR)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.filter((f) => !slugFilter || f.startsWith(`${slugFilter}.`));

	for (const file of files) {
		const { data } = matter(
			fs.readFileSync(path.join(CASE_DIR, file), "utf-8"),
		);
		if (!Array.isArray(data.sources)) continue;
		for (const raw of data.sources) {
			if (typeof raw !== "string") continue;
			const m = SOURCE_URL.exec(raw);
			if (!m) continue;
			const url = m[0].replace(/[.,、。]+$/, "");
			if (seen.has(url)) continue;
			seen.add(url);
			out.push({ file, url });
		}
	}
	return out;
}

async function fetchStatus(url) {
	const ctl = new AbortController();
	const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: ctl.signal,
			headers: {
				"User-Agent": BROWSER_UA,
				Accept: "text/html,application/xhtml+xml,application/pdf,*/*",
				"Accept-Language": "ja,en;q=0.8",
			},
		});
		return { status: res.status };
	} catch (e) {
		return {
			status: 0,
			error: e.name === "AbortError" ? "timeout" : e.message,
		};
	} finally {
		clearTimeout(timer);
	}
}

/**
 * e-Gov の法令URLは SPA で常に 200 を返すため、法令APIで実在を確認する。
 * 実在すれば正式名称を返す。
 */
async function checkEgov(url) {
	const m = /laws\.e-gov\.go\.jp\/law\/([A-Za-z0-9]+)/.exec(url);
	if (!m) return null;
	const res = await fetchText(`https://laws.e-gov.go.jp/api/1/lawdata/${m[1]}`);
	if (!res) return { ok: false, id: m[1] };
	const t = /<LawTitle[^>]*>([^<]+)</.exec(res);
	return t ? { ok: true, id: m[1], name: t[1] } : { ok: false, id: m[1] };
}

async function fetchText(url) {
	const ctl = new AbortController();
	const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			signal: ctl.signal,
			headers: { "User-Agent": BROWSER_UA },
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

/** items を CONCURRENCY 本で並列処理 */
async function mapLimit(items, limit, fn) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, async () => {
			while (true) {
				const i = next++;
				if (i >= items.length) return;
				results[i] = await fn(items[i]);
			}
		}),
	);
	return results;
}

const targets = collectUrls();
console.log(
	`[check-case-sources] ${targets.length} 件のユニークURLを検査します（並列 ${CONCURRENCY}）…`,
);

const results = await mapLimit(targets, CONCURRENCY, async (t) => {
	const egov = await checkEgov(t.url);
	if (egov) {
		return egov.ok
			? { ...t, kind: "OK", note: `e-Gov: ${egov.name}` }
			: { ...t, kind: "DEAD", note: `e-Gov に法令ID ${egov.id} が存在しない` };
	}
	const { status, error } = await fetchStatus(t.url);
	if (status >= 200 && status < 300) return { ...t, kind: "OK", note: status };
	if (status === 403 || status === 429)
		return { ...t, kind: "BLOCKED", note: status };
	if (status === 0) return { ...t, kind: "ERROR", note: error };
	return { ...t, kind: "DEAD", note: status };
});

const by = (k) => results.filter((r) => r.kind === k);
const dead = by("DEAD");
const blocked = by("BLOCKED");
const errored = by("ERROR");

for (const r of [...dead, ...errored, ...blocked]) {
	const tag =
		r.kind === "DEAD" ? "✗ DEAD" : r.kind === "ERROR" ? "? ERROR" : "- BLOCKED";
	console.log(`  ${tag} [${r.note}] ${r.file}\n           ${r.url}`);
}

console.log(
	`\n[check-case-sources] OK ${by("OK").length} / BLOCKED ${
		blocked.length
	} / ERROR ${errored.length} / DEAD ${dead.length}`,
);
if (blocked.length > 0) {
	console.log(
		`  BLOCKED は 403/429（ボット遮断の可能性が高い）。死んだとは断定できないため exit には影響しません。`,
	);
}
if (errored.length > 0) {
	console.log(
		`  ERROR は接続失敗・タイムアウト。ネットワーク都合のこともあるので再実行して確認してください。`,
	);
}

process.exit(dead.length > 0 ? 1 : 0);
