#!/usr/bin/env node
/**
 * Case 自動生成コンテンツの安全ゲート（content/case/*.mdx）
 *
 * 二段防御の機械側コンポーネント:
 *   - pre-commit（主防御）: `pnpm validate:case` を Case 生成 routine の commit 前に実行
 *   - CI ゲート（バックストップ）: .github/workflows/deploy.yml の build 前ステップで実行
 *
 * 検出する高リスク違反（Margarete 指摘）:
 *   1. `fictional: true` 漏れ → 架空バッジ未表示で実績誤認
 *   2. deny-list 用語の混入 → 実在企業の当事者化（誤認・名誉毀損リスク）
 *
 * 補助スキーマチェック（CLAUDE.md Case バリデーション基準より一部）:
 *   - description が 120字以内
 *   - tags が 4個
 *
 * 違反は「ファイル名 + 違反内容」で列挙し、exit 1 で fail。全件 OK なら exit 0。
 *
 * 依存: gray-matter（package.json に既存）
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CASE_DIR = path.join(ROOT, "content/case");
const DENY_LIST_PATH = path.join(ROOT, "scripts/case-deny-list.json");

if (!fs.existsSync(CASE_DIR)) {
	console.error(`[validate-case] FATAL: ${CASE_DIR} が存在しません`);
	process.exit(2);
}
if (!fs.existsSync(DENY_LIST_PATH)) {
	console.error(`[validate-case] FATAL: ${DENY_LIST_PATH} が存在しません`);
	process.exit(2);
}

const denyConfig = JSON.parse(fs.readFileSync(DENY_LIST_PATH, "utf-8"));
const denyTerms = Array.isArray(denyConfig.terms)
	? denyConfig.terms.filter((t) => typeof t === "string" && t.length > 0)
	: [];

if (denyTerms.length === 0) {
	console.error(
		`[validate-case] FATAL: deny-list (${DENY_LIST_PATH}) の terms が空です`,
	);
	process.exit(2);
}

const files = fs
	.readdirSync(CASE_DIR)
	.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

const violations = []; // { file, kind, message }

/**
 * deny-list 用語の検出。frontmatter（YAML 全文として再シリアライズ）と本文を
 * 連結した全文に対し、部分一致で走査する。日本語の word boundary は機能しない
 * ため部分一致で十分（誤検知が出た用語は scripts/case-deny-list.json から削る）。
 */
function findDenyHits(rawFrontmatter, content) {
	const haystack = `${rawFrontmatter}\n${content}`;
	const hits = [];
	for (const term of denyTerms) {
		if (haystack.includes(term)) {
			hits.push(term);
		}
	}
	return hits;
}

for (const file of files) {
	const fullPath = path.join(CASE_DIR, file);
	const raw = fs.readFileSync(fullPath, "utf-8");

	let parsed;
	try {
		parsed = matter(raw);
	} catch (e) {
		violations.push({
			file,
			kind: "frontmatter_parse_error",
			message: `frontmatter のパースに失敗: ${e.message}`,
		});
		continue;
	}

	const { data, content, matter: rawFrontmatter } = parsed;

	// (1) fictional: true 必須
	if (data.fictional !== true) {
		violations.push({
			file,
			kind: "fictional_missing",
			message: `frontmatter に fictional: true が無い（現在の値: ${JSON.stringify(
				data.fictional,
			)}）。架空バッジ未表示で実績誤認のリスク。`,
		});
	}

	// (2) deny-list 用語の検出（frontmatter raw + 本文）
	const denyHits = findDenyHits(rawFrontmatter ?? "", content ?? "");
	if (denyHits.length > 0) {
		violations.push({
			file,
			kind: "deny_term_hit",
			message: `実在企業 deny-list 検出: ${denyHits.join(
				", ",
			)}（content/case で当事者化されると誤認リスク。scripts/case-deny-list.json を確認）`,
		});
	}

	// (3) 補助: description 120字以内
	if (typeof data.description !== "string" || data.description.length === 0) {
		violations.push({
			file,
			kind: "description_missing",
			message: `frontmatter の description が無い／空。`,
		});
	} else if (data.description.length > 120) {
		violations.push({
			file,
			kind: "description_too_long",
			message: `description が 120字超過（${data.description.length}字）。`,
		});
	}

	// (4) 補助: tags が 4個
	if (!Array.isArray(data.tags)) {
		violations.push({
			file,
			kind: "tags_missing",
			message: `frontmatter の tags が配列ではない。`,
		});
	} else if (data.tags.length !== 4) {
		violations.push({
			file,
			kind: "tags_count",
			message: `tags の数が 4個ではない（現在: ${data.tags.length}個）。`,
		});
	}
}

if (violations.length > 0) {
	console.error(
		`[validate-case] FAIL: ${violations.length} 件の違反を ${files.length} ファイル中で検出`,
	);
	for (const v of violations) {
		console.error(`  - ${v.file} [${v.kind}] ${v.message}`);
	}
	console.error(
		`[validate-case] 対応: 該当ファイルを修正するか、誤検知なら scripts/case-deny-list.json を更新してください。`,
	);
	process.exit(1);
}

console.log(
	`[validate-case] PASS: ${files.length} 件の case を検査（deny-list ${denyTerms.length} terms）`,
);
process.exit(0);
