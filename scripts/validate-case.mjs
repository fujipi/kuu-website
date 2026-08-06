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
 * スキーマチェック（CLAUDE.md「Case バリデーション基準」に対応）:
 *   - description が 120字以内 / tags が 4個
 *   - industry / use_case / models_used / future_outlook / persona_voice の必須
 *   - objectives / measures / effects が各3項目、metrics 3枚、company_profile 4行
 *   - sources が 2件以上、かつ **各行が URL を含む**
 *   - 本文 H2 が 4個以上
 *   - slug（ファイル名）重複なし
 *
 * これらは 2026-08 時点で既存 70 件が 100% 満たしている。生成器の規律だけで
 * 保たれていた状態に機械的なバックストップを付ける趣旨であり、既存を落とさない。
 * 逆に言えば、ここを緩める前に既存が壊れていないかを必ず確認すること。
 *
 * あえて検査しないもの:
 *   - sources URL の疎通（HTTP ステータス）: 外部サイトの一時的な 503・レート制限・
 *     UA ブロックでサイト全体のデプロイが止まるため、CI の hard gate にはしない。
 *     代わりに scripts/check-case-sources.mjs を任意実行のスクリプトとして用意した。
 *   - 本文字数（1,200〜2,400字）: 業種により妥当な幅が異なり、hard gate だと
 *     正当な記事を落とす。CLAUDE.md の人間向けチェックリストに残す。
 *   - DAB の 40〜60字: 実測で 70 件中 2 件しか収まっておらず（中央値 105字）、
 *     hard gate にすると全滅する。ルール側の見直しが先。
 *   - 提案調かどうか / 禁止フレーズ: 文体判定は機械では誤検知が多い。
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

const violations = []; // { file, kind, message } — exit 1
const warnings = []; // { file, kind, message } — 表示のみ、exit 0
const seenSlugs = new Map(); // slug -> file

/** 必須の文字列フィールド */
const REQUIRED_STRINGS = ["title", "industry", "use_case", "future_outlook"];

/** ちょうど N 項目でなければならない配列フィールド */
const EXACT_LENGTH_ARRAYS = [
	["objectives", 3],
	["measures", 3],
	["effects", 3],
	["metrics", 3],
	["company_profile", 4],
];

/**
 * sources 行から URL を検出する正規表現。
 * src/lib/case.ts の SOURCE_URL と同じ意図（行のどこにあっても拾う）。
 * validator は .mjs で src/ の TS を import できないため、ここは意図的な複製。
 * 片方を変えたら他方も合わせること。
 */
const SOURCE_URL = /https?:\/\/[^\s"'<>）)」』】]+/;

/** 本文中の H2 を数える（コードフェンス内は除外） */
function countH2(content) {
	let inFence = false;
	let n = 0;
	for (const line of content.split(/\r?\n/)) {
		if (line.trim().startsWith("```")) {
			inFence = !inFence;
			continue;
		}
		if (!inFence && /^##\s+\S/.test(line)) n++;
	}
	return n;
}

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

	// (5) 必須の文字列フィールド（industry / use_case は src/lib/case.ts が参照し、
	//     Article JSON-LD の about / audience と業種アーカイブの振り分けに使われる）
	for (const key of REQUIRED_STRINGS) {
		if (typeof data[key] !== "string" || data[key].trim() === "") {
			violations.push({
				file,
				kind: "field_missing",
				message: `frontmatter の ${key} が無い／空。`,
			});
		}
	}

	// (6) 個数が決まっている配列フィールド
	for (const [key, expected] of EXACT_LENGTH_ARRAYS) {
		const v = data[key];
		if (!Array.isArray(v)) {
			violations.push({
				file,
				kind: "field_missing",
				message: `frontmatter の ${key} が配列ではない。`,
			});
		} else if (v.length !== expected) {
			violations.push({
				file,
				kind: "field_count",
				message: `${key} が ${expected} 項目ではない（現在: ${v.length}項目）。`,
			});
		}
	}

	// (7) sources は 2件以上（リサーチプロトコル準拠。詳細ページで出典として描画され、
	//     URL のものは Article JSON-LD の citation になる）
	if (!Array.isArray(data.sources) || data.sources.length < 2) {
		violations.push({
			file,
			kind: "sources_insufficient",
			message: `sources が 2件未満（現在: ${
				Array.isArray(data.sources) ? data.sources.length : "配列ではない"
			}）。リサーチプロトコルで確認した出典を記載してください。`,
		});
	}

	// (hard) sources の各行に URL が含まれること。
	// 詳細ページは URL を持つ sources だけを citation JSON-LD と外部リンクに変換する
	// （src/lib/case.ts の parseSource / sourceUrls）。URL の無い行は
	// 「〜に関する一般的な業界傾向（公開情報）」のような検証不能な記述になり、
	// 引用の裏付けが機械可読にならない。CLAUDE.md も「URL を貼る。曖昧記述で
	// 済ませない」と定めている。2026-08 に全 70 件 210 行を URL 付きに揃えたため
	// hard gate に昇格した（それ以前は 14 行が該当し warning 止まりだった）。
	//
	// 判定は URL の位置を問わない。「タイトル + URL」形式も可
	// （先頭一致で見ると 61 行を取りこぼす）。
	if (Array.isArray(data.sources)) {
		const noUrl = data.sources.filter(
			(s) => typeof s !== "string" || !SOURCE_URL.test(s),
		);
		if (noUrl.length > 0) {
			violations.push({
				file,
				kind: "sources_no_url",
				message: `sources に URL を含まない行が ${noUrl.length} 件（例: ${String(
					noUrl[0],
				).slice(
					0,
					40,
				)}…）。citation JSON-LD と出典リンクが生成されないため、一次情報の URL を記載してください。`,
			});
		}
	}

	// (8) models_used は1件以上
	if (!Array.isArray(data.models_used) || data.models_used.length === 0) {
		violations.push({
			file,
			kind: "models_used_missing",
			message: `models_used が無い／空。`,
		});
	}

	// (9) persona_voice は quote 必須
	const pv = data.persona_voice ?? data.personaVoice;
	if (typeof pv !== "object" || pv === null || typeof pv.quote !== "string") {
		violations.push({
			file,
			kind: "persona_voice_missing",
			message: `persona_voice.quote が無い。`,
		});
	}

	// (10) 本文 H2 が 4個以上
	const h2 = countH2(content ?? "");
	if (h2 < 4) {
		violations.push({
			file,
			kind: "h2_too_few",
			message: `本文の H2 が 4個未満（現在: ${h2}個）。`,
		});
	}

	// (11) slug 重複（.mdx と .md が同名で並ぶと src/lib/case.ts が .mdx を優先し、
	//      もう一方が黙って無視される）
	const slug = file.replace(/\.(mdx|md)$/, "");
	if (seenSlugs.has(slug)) {
		violations.push({
			file,
			kind: "slug_duplicate",
			message: `slug "${slug}" が ${seenSlugs.get(slug)} と重複。`,
		});
	} else {
		seenSlugs.set(slug, file);
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

for (const w of warnings) {
	console.warn(`  ! ${w.file} [${w.kind}] ${w.message}`);
}

console.log(
	`[validate-case] PASS: ${files.length} 件の case を検査（deny-list ${denyTerms.length} terms、warning ${warnings.length} 件）`,
);
process.exit(0);
