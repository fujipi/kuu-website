#!/usr/bin/env node
/**
 * 内部リンク切れチェッカー（ビルド成果物 out/ に対する検証）。
 *
 * out/ 配下の全 HTML から href / src を抽出し、`/` 始まりの内部リンクが
 * 実在するページ（out/{path}/index.html）またはファイルに解決できるかを検証する。
 * trailingSlash: true（next.config.ts）前提で、`/foo/` → out/foo/index.html を正とする。
 *
 * 対象外: 外部 URL・mailto:・tel:・`#` フラグメントのみのリンク。
 * 失敗時は壊れたリンクの一覧を出力して exit 1（CI ゲート用）。
 *
 * 使い方: pnpm build && node scripts/check-internal-links.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

if (!fs.existsSync(OUT_DIR)) {
	console.error(
		"[check-internal-links] out/ がありません。先に `pnpm build` を実行してください。",
	);
	process.exit(1);
}

/** out/ 配下の .html を再帰列挙 */
function walkHtml(dir) {
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...walkHtml(full));
		} else if (entry.name.endsWith(".html")) {
			results.push(full);
		}
	}
	return results;
}

/** 内部リンク path が out/ 内で解決できるか */
function resolves(linkPath) {
	// クエリ・フラグメントを除去し、パーセントエンコードを実パスに戻す
	// （canonical / og:url は日本語タグパスをエンコード済みで出力するため）
	let clean = linkPath.split("#")[0].split("?")[0];
	try {
		clean = decodeURIComponent(clean);
	} catch {
		// 不正なエンコードはそのまま検査
	}
	if (!clean || clean === "/") {
		return fs.existsSync(path.join(OUT_DIR, "index.html"));
	}
	const rel = clean.replace(/^\//, "");
	const asFile = path.join(OUT_DIR, rel);
	// 1) 実ファイル（/images/x.png, /feed.xml, /og/... など）
	if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return true;
	// 2) ディレクトリ + index.html（trailingSlash ルート）
	if (fs.existsSync(path.join(asFile, "index.html"))) return true;
	// 3) /foo → foo.html（保険）
	if (fs.existsSync(`${asFile.replace(/\/$/, "")}.html`)) return true;
	return false;
}

const htmlFiles = walkHtml(OUT_DIR);
const attrRe = /\s(?:href|src)=["']([^"']+)["']/g;
// og:image / og:image:url / twitter:image の content も実在検証する
// （SNS/検索エンジンが取得する画像URLのリンク切れは href/src 検査では拾えない）
const metaImageRe =
	/<meta\s+(?:property=["']og:image(?::url)?["']|name=["']twitter:image["'])\s+content=["']([^"']+)["']/g;
const SITE_ORIGIN = "https://kuucorp.com";
const broken = new Map(); // link -> Set<sourceFile>
let checked = 0;
let metaChecked = 0;

/** 自サイト絶対URLは origin を strip して内部パスとして扱う */
function toInternalPath(link) {
	if (link.startsWith(SITE_ORIGIN + "/")) {
		return link.slice(SITE_ORIGIN.length);
	}
	if (link.startsWith("/") && !link.startsWith("//")) return link;
	return null; // 外部URL・プロトコル相対・data: 等は対象外
}

for (const file of htmlFiles) {
	const html = fs.readFileSync(file, "utf8");
	for (const m of html.matchAll(attrRe)) {
		const link = toInternalPath(m[1]);
		if (!link) continue;
		checked++;
		if (!resolves(link)) {
			if (!broken.has(link)) broken.set(link, new Set());
			broken.get(link).add(path.relative(OUT_DIR, file));
		}
	}
	for (const m of html.matchAll(metaImageRe)) {
		const link = toInternalPath(m[1]);
		if (!link) continue;
		metaChecked++;
		if (!resolves(link)) {
			if (!broken.has(link)) broken.set(link, new Set());
			broken.get(link).add(path.relative(OUT_DIR, file));
		}
	}
}

if (broken.size > 0) {
	console.error(
		`\n[check-internal-links] 壊れた内部リンク ${broken.size} 件:\n`,
	);
	for (const [link, sources] of [...broken.entries()].sort()) {
		const list = [...sources];
		const shown = list.slice(0, 3).join(", ");
		const more = list.length > 3 ? ` ほか${list.length - 3}ページ` : "";
		console.error(`  ${link}\n    ← ${shown}${more}`);
	}
	console.error("");
	process.exit(1);
}

console.log(
	`[check-internal-links] OK: ${htmlFiles.length} ページ / ${checked} リンク + og:image等 ${metaChecked} 件を検証、リンク切れなし`,
);
