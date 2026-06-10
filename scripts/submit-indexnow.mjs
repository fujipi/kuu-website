#!/usr/bin/env node
/**
 * IndexNow 送信（Bing / Copilot 系検索エンジンへの更新即時通知）。
 *
 * デプロイ成功後（deploy.yml の indexnow job）に実行し、本番 sitemap から
 * 「lastmod が直近 N 日以内」の URL を抽出して https://api.indexnow.org へ
 * POST する。lastmod は next-sitemap.config.js が frontmatter から出力する
 * 実日付（毎ビルド now ではない）であることが前提。
 *
 * - 依存ゼロ（global fetch のみ）— CI の indexnow job で pnpm install 不要
 * - key は public/ 直下の {hex}.txt（IndexNow 仕様: 公開必須・秘密ではない）
 * - 失敗してもデプロイ自体に影響させない（常に exit 0）
 *
 * 使い方:
 *   node scripts/submit-indexnow.mjs            # 抽出して送信
 *   node scripts/submit-indexnow.mjs --dry-run  # 送信せず URL 一覧を表示
 *   INDEXNOW_WINDOW_DAYS=7 node scripts/...     # 抽出窓を変更（既定 2 日）
 */
import fs from "node:fs";
import path from "node:path";

const HOST = "kuucorp.com";
const SITE = `https://${HOST}`;
const WINDOW_DAYS = Number(process.env.INDEXNOW_WINDOW_DAYS || 2);
const DRY_RUN = process.argv.includes("--dry-run");

function findKey() {
	const dir = path.join(process.cwd(), "public");
	for (const f of fs.readdirSync(dir)) {
		if (!/^[a-f0-9]{32,64}\.txt$/.test(f)) continue;
		const body = fs.readFileSync(path.join(dir, f), "utf8").trim();
		if (body === f.replace(/\.txt$/, "")) return body;
	}
	return null;
}

async function fetchText(url) {
	const res = await fetch(url, { redirect: "follow" });
	if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
	return res.text();
}

/** sitemap（index なら子も辿る）から {loc, lastmod} を収集 */
async function collectSitemapEntries(rootUrl) {
	const entries = [];
	const visited = new Set();
	const queue = [rootUrl];
	while (queue.length > 0) {
		const url = queue.shift();
		if (visited.has(url)) continue; // 自己参照・循環ガード
		visited.add(url);
		const xml = await fetchText(url);
		if (/<sitemapindex[\s>]/.test(xml)) {
			for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
				queue.push(m[1].trim());
			}
			continue;
		}
		for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
			const block = m[1];
			const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1]?.trim();
			const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1]?.trim();
			if (loc) entries.push({ loc, lastmod });
		}
	}
	return entries;
}

async function main() {
	const key = findKey();
	if (!key) {
		console.log(
			"::warning::[indexnow] public/ に key ファイル（{hex}.txt）が見つからないためスキップ",
		);
		return;
	}

	let entries;
	try {
		entries = await collectSitemapEntries(`${SITE}/sitemap.xml`);
	} catch (err) {
		console.log(`::warning::[indexnow] sitemap 取得失敗: ${err.message}`);
		return;
	}

	const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;
	const urlList = entries
		.filter((e) => {
			if (!e.lastmod) return false;
			const t = Date.parse(e.lastmod);
			return !Number.isNaN(t) && t >= cutoff;
		})
		.map((e) => e.loc)
		// IndexNow は 1 リクエスト最大 10,000 URL（実運用では数件/日のはず）
		.slice(0, 10000);

	console.log(
		`[indexnow] sitemap ${entries.length} URLs 中、直近 ${WINDOW_DAYS} 日以内の更新 ${urlList.length} 件`,
	);
	if (urlList.length === 0) {
		console.log("[indexnow] 送信対象なし");
		return;
	}
	for (const u of urlList) console.log(`  - ${u}`);
	if (DRY_RUN) {
		console.log("[indexnow] --dry-run のため送信せず終了");
		return;
	}

	try {
		const res = await fetch("https://api.indexnow.org/indexnow", {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify({ host: HOST, key, urlList }),
		});
		if (res.status === 200 || res.status === 202) {
			console.log(
				`[indexnow] OK: HTTP ${res.status}（${urlList.length} URLs 送信）`,
			);
		} else {
			const body = await res.text().catch(() => "");
			console.log(
				`::warning::[indexnow] HTTP ${res.status}: ${body.slice(0, 300)}`,
			);
		}
	} catch (err) {
		console.log(`::warning::[indexnow] 送信失敗: ${err.message}`);
	}
}

await main();
