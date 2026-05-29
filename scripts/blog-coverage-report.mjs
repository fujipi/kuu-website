#!/usr/bin/env node
/**
 * Blog coverage report (read-only, stdout only — no files written).
 *
 * 技術ブログのカバレッジを track × audience のマトリクスで可視化し、
 * 執筆ギャップ（空き）と重複リスク（過密）を把握するための診断ツール。
 *
 * - 既存記事は frontmatter の `track` / `audience` を優先。
 *   未設定の記事（移行前の93記事など）は slug ヒューリスティックで暫定分類する。
 * - 業務・業種・ROI 寄りの記事は「business（Case候補）」として別集計する
 *   （ブログのスコープ外。/case/・/case-studies/ の領域）。
 * - topic-queue.json の queued / keyword_bank の在庫も併せて表示する。
 *
 * 依存は既存の gray-matter のみ（新規依存なし）。
 * 使い方: node scripts/blog-coverage-report.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

const TRACKS = [
	"architecture",
	"protocols",
	"security",
	"evaluation",
	"platform-infra",
	"governance-tech",
	"model-capability",
];
const AUDIENCES = ["smb", "enterprise", "both"];

/** slug → track の暫定分類（frontmatter に track が無い記事向け）。先勝ち。 */
const TRACK_HEURISTICS = [
	["protocols", /(mcp|a2a|protocol|model-context|function-calling)/],
	[
		"security",
		/(security|permission|audit-log|red-team|injection|iam|sandbox|secret|shadow-ai|data-clean-room|leak)/,
	],
	[
		"evaluation",
		/(observability|eval|nine-axis|9-?axis|kpi|regression|golden|metric)/,
	],
	[
		"platform-infra",
		/(gateway|finops|vpc|sso|scim|tenant|platform|infra|bedrock|vertex|deploy)/,
	],
	[
		"governance-tech",
		/(governance|policy|guardrail|iso-?42001|eu-ai-act|hallucination|compliance|checklist)/,
	],
	[
		"architecture",
		/(architecture|harness|multi-agent|orchestration|memory|context|rag|workflow|continuous-improvement)/,
	],
	[
		"model-capability",
		/(opus|sonnet|haiku|model|claude-api|codex|gemini|manus|cowork|genspark)/,
	],
];

/** slug → business（Case候補）判定。ブログのスコープ外コンテンツ。 */
const BUSINESS_RE =
	/(manufacturing|retail|real-estate|medical|healthcare|restaurant|food-service|education|edtech|construction|logistics|warehouse|human-resource|hr-ops|legal-professional|service-industry|cost|roi|investment|talent|recruitment|dx-failure|dx-success|board-meeting|chatbot-cost|nocode|marketing-automation|knowledge-management|document-automation|customer-support|business-automation|ceo-decision|getting-started|strategy-roadmap|fde|rde|ax-|ax-vs|difference|comparison-sme|sme-dx|startup-ai-team)/;

/** keyword/slug の語彙から audience を推定（frontmatter に無い場合）。 */
const ENTERPRISE_RE =
	/(enterprise|vpc|sso|scim|tenant|gateway|finops|residency|procurement|multi-team|platform|エンタープライズ|大企業|レジデンシー|ゲートウェイ)/i;

function readCollection(dir) {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) return [];
	return fs
		.readdirSync(abs)
		.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
		.map((f) => {
			const slug = f.replace(/\.(mdx|md)$/, "");
			const { data } = matter(fs.readFileSync(path.join(abs, f), "utf-8"));
			return { slug, data };
		});
}

function classifyTrack(slug, data) {
	if (data.track && TRACKS.includes(data.track)) {
		return { track: data.track, inferred: false };
	}
	if (BUSINESS_RE.test(slug)) return { track: "business", inferred: true };
	for (const [track, re] of TRACK_HEURISTICS) {
		if (re.test(slug)) return { track, inferred: true };
	}
	return { track: "unclassified", inferred: true };
}

function classifyAudience(slug, data) {
	if (data.audience && AUDIENCES.includes(data.audience)) {
		return { audience: data.audience, inferred: false };
	}
	const hay = `${slug} ${(data.tags || []).join(" ")}`;
	return {
		audience: ENTERPRISE_RE.test(hay) ? "enterprise" : "smb",
		inferred: true,
	};
}

const posts = readCollection("content/blog");

// track × audience カウント
const matrix = {};
for (const t of [...TRACKS, "business", "unclassified"]) {
	matrix[t] = { smb: 0, enterprise: 0, both: 0 };
}
let inferredCount = 0;
const businessPosts = [];
for (const p of posts) {
	const { track, inferred: ti } = classifyTrack(p.slug, p.data);
	const { audience, inferred: ai } = classifyAudience(p.slug, p.data);
	matrix[track][audience] += 1;
	if (ti || ai) inferredCount += 1;
	if (track === "business") businessPosts.push(p.slug);
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log(`\n=== Blog Coverage Report ===`);
console.log(
	`総記事数: ${posts.length}（うち ${inferredCount} 件は frontmatter 未設定でヒューリスティック暫定分類）\n`,
);

// マトリクス出力
const COLW = 16;
console.log(
	pad("track", COLW) +
		AUDIENCES.map((a) => padL(a, 12)).join("") +
		padL("計", 8),
);
console.log("-".repeat(COLW + 12 * AUDIENCES.length + 8));
for (const t of [...TRACKS, "business", "unclassified"]) {
	const row = matrix[t];
	const total = AUDIENCES.reduce((n, a) => n + row[a], 0);
	if (total === 0 && t !== "business" && !TRACKS.includes(t)) continue;
	const marker = TRACKS.includes(t) && total === 0 ? "  ← GAP" : "";
	console.log(
		pad(t, COLW) +
			AUDIENCES.map((a) => padL(row[a] || "·", 12)).join("") +
			padL(total, 8) +
			marker,
	);
}

// GAP（技術トラック内で記事0の track×audience セル）を提示
console.log(`\n--- 執筆ギャップ（技術トラックで記事0の track × audience）---`);
const gaps = [];
for (const t of TRACKS) {
	for (const a of AUDIENCES) {
		if (matrix[t][a] === 0) gaps.push(`${t} × ${a}`);
	}
}
console.log(gaps.length ? gaps.map((g) => `  - ${g}`).join("\n") : "  （なし）");

// business（Case候補）一覧
if (businessPosts.length) {
	console.log(
		`\n--- business（Case/Case Studies 領域・ブログのスコープ外）: ${businessPosts.length} 件 ---`,
	);
	console.log(
		"  ※ forward-only 方針により移行はしない（既存URL維持）。新規はブログに作らない。",
	);
}

// topic-queue.json の queued / keyword_bank 在庫
const queuePath = path.join(ROOT, "content/blog/topic-queue.json");
if (fs.existsSync(queuePath)) {
	const q = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
	const queued = (q.topics || []).filter((t) => t.status === "queued");
	console.log(`\n--- topic-queue: queued ${queued.length} 件 ---`);
	for (const t of queued) {
		console.log(
			`  - ${pad(t.track || "?", 16)} ${pad(t.audience || "?", 12)} ${t.slug}`,
		);
	}
	const bank = q.keyword_bank || {};
	if (!Array.isArray(bank) && typeof bank === "object") {
		console.log(`\n--- keyword_bank 在庫（track別）---`);
		for (const t of TRACKS) {
			const n = Array.isArray(bank[t]) ? bank[t].length : 0;
			console.log(`  - ${pad(t, 16)} ${padL(n, 3)} 語`);
		}
	}
}

console.log(
	`\nヒント: GAP セルや keyword_bank 在庫の多いトラックから次トピックを選ぶと、重複を避けつつ網羅性を上げられます。\n`,
);
