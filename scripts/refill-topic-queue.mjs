#!/usr/bin/env node
/**
 * Blog トピックキューの補充支援（content/blog/topic-queue.json）
 *
 * ## なぜ必要か
 *
 * Blog 生成ルーティンは `status: "queued"` の先頭トピックを取って記事を書くが、
 * 2026-08 時点でキューは空（全 109 トピックが published / consolidated /
 * case-candidate）であり、keyword_bank も 34 語しか残っていない。補充が無いと
 * ルーティンは毎回その場でテーマを考えることになり、これが滞留事故で 25 本中
 * 15 本がテーマ重複になった一因でもある。
 *
 * ## 役割分担
 *
 * 一次情報の収集には WebSearch / WebFetch が要るが、それはエージェント側の道具で
 * あってスクリプトからは呼べない。そこで責務を分ける:
 *
 *   エージェント側（WebSearch を持つセッション）
 *     `--report` で「何を調べるべきか」を受け取り、一次情報を調べて候補 JSON を書く
 *
 *   スクリプト側（このファイル）
 *     候補 JSON を機械検証してキューに merge する。裏取り・重複・スキーマの
 *     すべてをここで止めるので、エージェントが手を滑らせてもキューは汚れない
 *
 * この分担により「調べるのは人／エージェント、通すか決めるのは機械」になり、
 * キューは常に裏取り済みの状態を保てる。
 *
 * ## 使い方
 *
 *   node scripts/refill-topic-queue.mjs                  # 補充ブリーフを出力
 *   node scripts/refill-topic-queue.mjs --report         # 同上
 *   node scripts/refill-topic-queue.mjs --check          # 既存キューの健全性検査のみ
 *   node scripts/refill-topic-queue.mjs --add cand.json  # 候補を検証して追加
 *   node scripts/refill-topic-queue.mjs --add cand.json --dry-run  # 検証だけ
 *
 * 候補 JSON は「トピックオブジェクトの配列」または `{ "topics": [...] }`。
 * 検証に 1 件でも落ちたら**何も書き込まない**（全件成功か、全件不採用か）。
 *
 * 依存: gray-matter（package.json に既存）
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");
const QUEUE_PATH = path.join(ROOT, "content/blog/topic-queue.json");

/** CLAUDE.md「技術タクソノミ」より */
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
const TECH_DEPTHS = ["intro", "intermediate", "deep"];

/** CLAUDE.md「service_link マッピング（audience 連動）」より */
const SERVICE_LINK_BY_AUDIENCE = {
	enterprise: ["/services/rde/"],
	smb: ["/services/ai-ops/", "/services/ax-dx/"],
	both: ["/services/ai-ops/", "/services/ax-dx/"],
};

/**
 * 一次情報源として認めるホスト。CLAUDE.md リサーチプロトコル 2 の
 * 「Anthropic / OpenAI / Google などの公式ドキュメント、MCP・A2A 等のプロトコル
 * 仕様、ISO/IEC 42001・EU AI Act の原文」に対応する。
 *
 * ブログ・まとめサイトは裏取り用途のみで本文の根拠にしない、というルールを
 * 機械側で担保するのがこの一覧の目的。足りないものは足してよいが、
 * 「個人ブログ・ベンダーのマーケ記事」を入れないこと。
 */
const PRIMARY_SOURCE_HOSTS = [
	// モデルプロバイダの公式ドキュメント
	/(^|\.)anthropic\.com$/,
	/(^|\.)claude\.com$/,
	/(^|\.)openai\.com$/,
	/(^|\.)ai\.google\.dev$/,
	/(^|\.)cloud\.google\.com$/,
	/(^|\.)deepmind\.google$/,
	// プロトコル・仕様
	/(^|\.)modelcontextprotocol\.io$/,
	/(^|\.)a2aproject\.github\.io$/,
	/(^|\.)w3\.org$/,
	/(^|\.)ietf\.org$/,
	/(^|\.)rfc-editor\.org$/,
	// 規格・規制
	/(^|\.)iso\.org$/,
	/(^|\.)nist\.gov$/,
	/(^|\.)europa\.eu$/,
	/(^|\.)go\.jp$/,
	// 主要クラウド／基盤の公式ドキュメント
	/(^|\.)docs\.aws\.amazon\.com$/,
	/(^|\.)learn\.microsoft\.com$/,
	// 査読前プレプリント（一次資料として扱う）
	/(^|\.)arxiv\.org$/,
];

// ---------------------------------------------------------------------------
// 読み込み
// ---------------------------------------------------------------------------

function fail(msg) {
	console.error(`[refill-topic-queue] FATAL: ${msg}`);
	process.exit(2);
}

if (!fs.existsSync(BLOG_DIR)) fail(`${BLOG_DIR} が存在しません`);
if (!fs.existsSync(QUEUE_PATH)) fail(`${QUEUE_PATH} が存在しません`);

const queueRaw = fs.readFileSync(QUEUE_PATH, "utf-8");
let queue;
try {
	queue = JSON.parse(queueRaw);
} catch (e) {
	fail(`topic-queue.json のパースに失敗: ${e.message}`);
}

/** 既存記事のメタ（重複判定に使う） */
const articles = fs
	.readdirSync(BLOG_DIR)
	.filter((f) => /\.mdx?$/.test(f))
	.map((f) => {
		const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
		return {
			slug: f.replace(/\.mdx?$/, ""),
			title: typeof data.title === "string" ? data.title : "",
			track: typeof data.track === "string" ? data.track : "",
			audience: typeof data.audience === "string" ? data.audience : "",
			targetQuery:
				typeof data.target_query === "string" ? data.target_query : "",
		};
	});

/** キュー内の全トピック（どの配列にあっても slug 衝突は避ける） */
const queueArrays = ["topics", "topics_from_keyword_bank"].filter((k) =>
	Array.isArray(queue[k]),
);
const allQueueTopics = queueArrays.flatMap((k) => queue[k]);

// ---------------------------------------------------------------------------
// 近接重複判定（validate-blog.mjs と同じ手法・同じ閾値）
// ---------------------------------------------------------------------------

function titleBigrams(s) {
	const chars = (s || "")
		.toLowerCase()
		.replace(/[\s「」『』（）()、。・:：,.\-—_　/]/g, "");
	const grams = [];
	for (let i = 0; i < chars.length - 1; i++) grams.push(chars.slice(i, i + 2));
	return grams;
}
function jaccard(a, b) {
	const A = new Set(a);
	const B = new Set(b);
	if (A.size === 0 || B.size === 0) return 0;
	let inter = 0;
	for (const x of A) if (B.has(x)) inter++;
	return inter / (A.size + B.size - inter);
}
/** validate-blog.mjs の near_duplicate と同じ 0.27 */
const NEAR_DUP_THRESHOLD = 0.27;

function findNearDuplicate(titleHint, targetQuery) {
	const grams = titleBigrams(titleHint);
	let worst = null;
	for (const a of articles) {
		const sim = jaccard(grams, titleBigrams(a.title));
		const sameQuery = Boolean(targetQuery) && targetQuery === a.targetQuery;
		if (sim >= NEAR_DUP_THRESHOLD || sameQuery) {
			if (!worst || sim > worst.sim) worst = { slug: a.slug, sim, sameQuery };
		}
	}
	return worst;
}

// ---------------------------------------------------------------------------
// report: 何を調べるべきか
// ---------------------------------------------------------------------------

function pad(s, n) {
	const str = String(s);
	let w = 0;
	for (const ch of str) w += /[^\x00-\xff]/.test(ch) ? 2 : 1;
	return str + " ".repeat(Math.max(0, n - w));
}

function report() {
	const queued = (queue.topics || []).filter((t) => t.status === "queued");

	console.log("\n=== トピックキュー補充ブリーフ ===\n");
	console.log(`既存記事: ${articles.length} 件 / queued: ${queued.length} 件`);

	if (queued.length > 0) {
		console.log("\n--- 現在の queued ---");
		for (const t of queued) {
			console.log(
				`  ${pad(t.track || "?", 18)} ${pad(t.audience || "?", 12)} ${t.slug}`,
			);
		}
	}

	// track × audience の被覆（frontmatter があるものだけを数える）
	const counts = new Map();
	for (const t of TRACKS) for (const a of AUDIENCES) counts.set(`${t}|${a}`, 0);
	let unclassified = 0;
	for (const a of articles) {
		const key = `${a.track}|${a.audience}`;
		if (counts.has(key)) counts.set(key, counts.get(key) + 1);
		else unclassified++;
	}

	console.log("\n--- track × audience（frontmatter 設定済みのみ）---");
	console.log(
		`${pad("track", 18)}${pad("smb", 8)}${pad("enterprise", 12)}${pad("both", 8)}${pad("計", 6)}`,
	);
	const slots = [];
	for (const t of TRACKS) {
		const row = AUDIENCES.map((a) => counts.get(`${t}|${a}`));
		const total = row.reduce((x, y) => x + y, 0);
		console.log(
			`${pad(t, 18)}${pad(row[0], 8)}${pad(row[1], 12)}${pad(row[2], 8)}${pad(total, 6)}`,
		);
		AUDIENCES.forEach((a, i) => slots.push({ track: t, audience: a, n: row[i] }));
	}
	if (unclassified > 0) {
		console.log(
			`\n  ※ frontmatter 未設定のレガシー記事 ${unclassified} 件は上表に含まれない`,
		);
	}

	slots.sort((x, y) => x.n - y.n);
	console.log("\n--- 手薄なスロット（優先して埋める）---");
	for (const s of slots.slice(0, 6)) {
		console.log(`  ${pad(s.track, 18)} ${pad(s.audience, 12)} 既存 ${s.n} 件`);
	}

	// keyword_bank の未消化推定
	//
	// キューの keyword 列と突き合わせるだけでは当たらない。keyword_bank 経由で
	// 生成された記事はキューに記録が残らないことがあり（例:
	// nine-axis-evaluation-llm-judge-smb はキューに存在しないが記事はある）、
	// その分がすべて「未消化」に化けてしまう。実際に書かれたかどうかは記事側に
	// しか無いので、既存記事の title + slug を突き合わせ先にする。
	const bank = queue.keyword_bank || {};
	if (!Array.isArray(bank) && typeof bank === "object") {
		// 突き合わせ対象: 各記事の「title + slug」と、キューの keyword
		const haystacks = [
			...articles.map((a) => ({
				label: a.slug,
				text: `${a.title} ${a.slug.replace(/-/g, " ")}`,
			})),
			...allQueueTopics
				.filter((t) => t.keyword)
				.map((t) => ({ label: String(t.slug), text: String(t.keyword) })),
		];
		// 消化済み判定は 2 つの信号の OR で行う。
		//
		//   (1) トークン一致率: 空白区切りの語が記事側にそのまま現れる割合
		//   (2) 文字 bigram の重なり係数: |A∩B| / min(|A|,|B|)
		//
		// (1) だけだと言い回しの違いで落ちる。実例:
		//   「エージェント評価 KPI メトリクス 設計」は ai-agent-evaluation-kpi
		//   （"AIエージェントのKPI設計と評価方法…"）が該当するが、"エージェント評価"
		//   も "メトリクス" も title に literal では現れず 0.50 に留まる。
		// bigram 側は語順・助詞の違いを吸収するので、こちらで拾う。Jaccard ではなく
		// 重なり係数を使うのは、短いキーワードを長いタイトルと比べるため
		// （Jaccard だとタイトル長で希釈されて当たらない）。
		//
		// 閾値は main 上の keyword_bank 34 語で較正した（2026-08-17 実測）。34 語
		// すべてに対応する記事が既に存在しており、正解の対応付けのスコアは
		// ratio 0.50〜1.00 / overlap 0.47〜1.00 に分布した。両者 0.5 で全 34 語が
		// 正しく「消化済み」と判定される。
		//
		// 較正の限界: この 34 語には「真に未消化」の例が 1 件も無いため、
		// 誤って消化済みと判定する側の精度は測定できていない。したがってこの判定は
		// ハードゲートではなく、調査の当たりを付けるためのヒントに留める。
		// 取りこぼした（未消化なのに消化済みと言われた）キーワードがあっても、
		// エージェントは track × audience の手薄なスロットから新規テーマを考案でき、
		// 重複は --add の near_duplicate 検査で確実に止まる。
		const CONSUMED_TOKEN_RATIO = 0.5;
		const CONSUMED_BIGRAM_OVERLAP = 0.5;
		function overlapCoefficient(a, b) {
			const A = new Set(a);
			const B = new Set(b);
			if (A.size === 0 || B.size === 0) return 0;
			let inter = 0;
			for (const x of A) if (B.has(x)) inter++;
			return inter / Math.min(A.size, B.size);
		}
		function findConsumer(word) {
			const tokens = String(word).split(/\s+/).filter(Boolean);
			if (tokens.length === 0) return null;
			const wordGrams = titleBigrams(String(word));
			let best = null;
			for (const h of haystacks) {
				const ratio =
					tokens.filter((tk) => h.text.includes(tk)).length / tokens.length;
				const overlap = overlapCoefficient(wordGrams, titleBigrams(h.text));
				const score = Math.max(ratio, overlap);
				if (
					(ratio >= CONSUMED_TOKEN_RATIO ||
						overlap >= CONSUMED_BIGRAM_OVERLAP) &&
					(!best || score > best.score)
				) {
					best = { label: h.label, score };
				}
			}
			return best;
		}

		console.log("\n--- keyword_bank の未消化候補（推定）---");
		let anyUnused = false;
		const consumed = [];
		for (const [track, words] of Object.entries(bank)) {
			if (track.startsWith("_") || !Array.isArray(words)) continue;
			const unused = [];
			for (const w of words) {
				const hit = findConsumer(w);
				if (hit) consumed.push({ track, word: w, hit });
				else unused.push(w);
			}
			if (unused.length > 0) {
				anyUnused = true;
				console.log(`  [${track}]`);
				for (const w of unused) console.log(`    - ${w}`);
			}
		}
		if (!anyUnused) {
			console.log(
				"  （すべて消化済みと推定。新規テーマを Web 調査で考案すること）",
			);
		}
		if (process.argv.includes("--verbose")) {
			console.log("\n--- 消化済みと判定した対応（--verbose）---");
			for (const c of consumed) {
				console.log(
					`  ${pad(c.word, 44)} → ${c.hit.label} (${c.hit.score.toFixed(2)})`,
				);
			}
		} else {
			console.log(
				`\n  （消化済みと判定: ${consumed.length} 語。対応関係は --verbose で確認できる）`,
			);
		}
	}

	console.log(`
--- 次にやること ---

1. 上の「手薄なスロット」から track / audience を選ぶ
2. WebSearch / WebFetch で一次情報を調べ、そのトラックで未執筆のテーマを特定する
   （既存 ${articles.length} 件の title と重複しないこと。判定は本スクリプトが行う）
3. 候補を JSON で書き、次のコマンドで検証・追加する

   node scripts/refill-topic-queue.mjs --add candidates.json

候補 JSON の形式（配列、または { "topics": [...] }）:

[
  {
    "slug": "kebab-case-slug",
    "keyword": "検索キーワード",
    "title_hint": "記事タイトル案（全角32字以内が目安）",
    "persona": "想定読者",
    "service_link": "/services/rde/",
    "audience": "enterprise",
    "track": "security",
    "tech_depth": "deep",
    "target_query": "この記事が答える検索質問",
    "sources": [
      "https://modelcontextprotocol.io/specification",
      "https://www.anthropic.com/engineering/building-effective-agents"
    ]
  }
]

検証内容: 必須フィールド / enum / service_link と audience の整合 /
sources 2件以上かつ全行URL / 一次情報源を1件以上 / slug 衝突 /
既存記事とのテーマ重複（title 類似 >= ${NEAR_DUP_THRESHOLD}）

1件でも落ちたら何も書き込まない。
`);
}

// ---------------------------------------------------------------------------
// check: 既存キューの健全性
// ---------------------------------------------------------------------------

function checkQueue() {
	const problems = [];
	const seen = new Map();
	for (const key of queueArrays) {
		for (const t of queue[key]) {
			const slug = String(t.slug || "");
			if (!slug) {
				problems.push(`${key}: slug の無いトピックがある`);
				continue;
			}
			if (seen.has(slug)) {
				problems.push(`slug 重複: ${slug}（${seen.get(slug)} と ${key}）`);
			} else {
				seen.set(slug, key);
			}
		}
	}
	// queued なのに記事が既にある = status 更新漏れ
	const articleSlugs = new Set(articles.map((a) => a.slug));
	for (const t of allQueueTopics) {
		if (t.status === "queued" && articleSlugs.has(String(t.slug))) {
			problems.push(
				`${t.slug}: status が queued のままだが content/blog に記事が存在する（status 更新漏れ）`,
			);
		}
	}
	return problems;
}

// ---------------------------------------------------------------------------
// add: 候補の検証と追加
// ---------------------------------------------------------------------------

function isUrl(s) {
	return /^https?:\/\/\S+$/.test(String(s).trim());
}
function hostOf(u) {
	try {
		return new URL(String(u).trim()).hostname;
	} catch {
		return "";
	}
}
function isPrimarySource(u) {
	const h = hostOf(u);
	return h !== "" && PRIMARY_SOURCE_HOSTS.some((re) => re.test(h));
}

function validateCandidate(c, i, pendingSlugs) {
	const errs = [];
	const at = `候補[${i}]${c && c.slug ? ` (${c.slug})` : ""}`;

	if (!c || typeof c !== "object") return [`${at}: オブジェクトではない`];

	// 必須の文字列フィールド
	for (const f of [
		"slug",
		"keyword",
		"title_hint",
		"persona",
		"service_link",
		"audience",
		"track",
		"tech_depth",
		"target_query",
	]) {
		if (typeof c[f] !== "string" || c[f].trim() === "") {
			errs.push(`${at}: ${f} が無い／空`);
		}
	}
	if (errs.length > 0) return errs;

	// slug 形式
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)) {
		errs.push(`${at}: slug が kebab-case ではない`);
	}
	// enum
	if (!TRACKS.includes(c.track)) {
		errs.push(`${at}: track が不正（${c.track}）。許容: ${TRACKS.join(" / ")}`);
	}
	if (!AUDIENCES.includes(c.audience)) {
		errs.push(`${at}: audience が不正（${c.audience}）`);
	}
	if (!TECH_DEPTHS.includes(c.tech_depth)) {
		errs.push(`${at}: tech_depth が不正（${c.tech_depth}）`);
	}
	// service_link と audience の整合（CLAUDE.md のマッピング）
	const allowed = SERVICE_LINK_BY_AUDIENCE[c.audience];
	if (allowed && !allowed.includes(c.service_link)) {
		errs.push(
			`${at}: audience "${c.audience}" の service_link は ${allowed.join(
				" または ",
			)} であるべき（現在: ${c.service_link}）`,
		);
	}
	// sources
	const srcs = Array.isArray(c.sources) ? c.sources : [];
	if (srcs.length < 2) {
		errs.push(`${at}: sources が 2 件未満（${srcs.length} 件）`);
	}
	const nonUrl = srcs.filter((s) => !isUrl(s));
	if (nonUrl.length > 0) {
		errs.push(`${at}: sources に URL でない行がある（${nonUrl[0]}）`);
	}
	if (srcs.length > 0 && !srcs.some(isPrimarySource)) {
		errs.push(
			`${at}: sources に一次情報源が 1 件も無い。公式ドキュメント・仕様・規制原文を含めること（現在: ${srcs
				.map(hostOf)
				.filter(Boolean)
				.join(", ")}）`,
		);
	}
	// slug 衝突
	if (articles.some((a) => a.slug === c.slug)) {
		errs.push(`${at}: content/blog に同名の記事が既にある`);
	}
	if (allQueueTopics.some((t) => String(t.slug) === c.slug)) {
		errs.push(`${at}: キューに同じ slug が既にある`);
	}
	if (pendingSlugs.has(c.slug)) {
		errs.push(`${at}: 同じ候補ファイル内で slug が重複している`);
	}
	// テーマ重複
	const dup = findNearDuplicate(c.title_hint, c.target_query);
	if (dup) {
		errs.push(
			`${at}: 既存記事「${dup.slug}」とテーマ重複（title類似=${dup.sim.toFixed(
				2,
			)}${dup.sameQuery ? ", target_query一致" : ""}）。切り口を変えるか既存記事の更新に切り替えること`,
		);
	}
	return errs;
}

/**
 * topics 配列の末尾に、既存の整形を壊さずテキストとして追記する。
 * JSON.parse/stringify の往復は 1 行配列を展開してしまい差分が汚れるため使わない。
 */
function appendToTopicsArray(rawText, entries) {
	const key = '"topics": [';
	const ks = rawText.indexOf(key);
	if (ks < 0) throw new Error('"topics" 配列が見つからない');
	let depth = 0;
	let close = -1;
	for (let j = ks + key.length - 1; j < rawText.length; j++) {
		const ch = rawText[j];
		if (ch === "[") depth++;
		else if (ch === "]") {
			depth--;
			if (depth === 0) {
				close = j;
				break;
			}
		}
	}
	if (close < 0) throw new Error('"topics" 配列の終端が見つからない');
	const lastBrace = rawText.lastIndexOf("}", close);
	if (lastBrace < 0 || lastBrace < ks) throw new Error("既存要素が見つからない");

	const block = entries
		.map(
			(e) => ",\n    " + JSON.stringify(e, null, 2).replace(/\n/g, "\n    "),
		)
		.join("");
	return rawText.slice(0, lastBrace + 1) + block + rawText.slice(lastBrace + 1);
}

function add(filePath, dryRun) {
	if (!fs.existsSync(filePath)) fail(`候補ファイルが無い: ${filePath}`);
	let input;
	try {
		input = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch (e) {
		fail(`候補ファイルのパースに失敗: ${e.message}`);
	}
	const cands = Array.isArray(input) ? input : input.topics;
	if (!Array.isArray(cands) || cands.length === 0) {
		fail("候補が配列で 1 件以上入っていない");
	}

	const allErrs = [];
	const pendingSlugs = new Set();
	for (let i = 0; i < cands.length; i++) {
		const errs = validateCandidate(cands[i], i, pendingSlugs);
		if (errs.length === 0) pendingSlugs.add(cands[i].slug);
		allErrs.push(...errs);
	}

	if (allErrs.length > 0) {
		console.error(
			`[refill-topic-queue] FAIL: ${allErrs.length} 件の問題（${cands.length} 候補中）。何も書き込んでいません。`,
		);
		for (const e of allErrs) console.error(`  - ${e}`);
		process.exit(1);
	}

	// status を queued に固定して整形（キー順も揃える）
	const entries = cands.map((c) => ({
		slug: c.slug,
		keyword: c.keyword,
		title_hint: c.title_hint,
		persona: c.persona,
		service_link: c.service_link,
		audience: c.audience,
		track: c.track,
		tech_depth: c.tech_depth,
		target_query: c.target_query,
		sources: c.sources,
		status: "queued",
		...(typeof c.note === "string" && c.note ? { note: c.note } : {}),
	}));

	if (dryRun) {
		console.log(
			`[refill-topic-queue] DRY-RUN: ${entries.length} 件すべて検証を通過（書き込みなし）`,
		);
		for (const e of entries) {
			console.log(`  + ${pad(e.track, 18)} ${pad(e.audience, 12)} ${e.slug}`);
		}
		return;
	}

	const next = appendToTopicsArray(queueRaw, entries);
	JSON.parse(next); // 構文検証（壊れていたら書かない）
	fs.writeFileSync(QUEUE_PATH, next, "utf-8");

	console.log(
		`[refill-topic-queue] OK: ${entries.length} 件を topics に追加（status: queued）`,
	);
	for (const e of entries) {
		console.log(`  + ${pad(e.track, 18)} ${pad(e.audience, 12)} ${e.slug}`);
	}
}

// ---------------------------------------------------------------------------
// エントリポイント
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const addIdx = argv.indexOf("--add");

const problems = checkQueue();
if (problems.length > 0) {
	console.error("[refill-topic-queue] キューに問題があります:");
	for (const p of problems) console.error(`  - ${p}`);
	if (argv.includes("--check")) process.exit(1);
	console.error("  ※ 続行しますが、先に解消することを推奨します\n");
} else if (argv.includes("--check")) {
	console.log(
		`[refill-topic-queue] OK: キューは健全（${allQueueTopics.length} トピック）`,
	);
	process.exit(0);
}

if (addIdx >= 0) {
	const f = argv[addIdx + 1];
	if (!f || f.startsWith("--")) fail("--add にはファイルパスが必要です");
	add(path.resolve(f), dryRun);
} else {
	report();
}
