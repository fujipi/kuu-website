#!/usr/bin/env node
/**
 * Blog 自動生成コンテンツの安全ゲート（content/blog/*.mdx）
 *
 * Blog は 1 日 2 本を人間レビューなしで main 直 push する自動生成パイプラインだが
 * これまで機械バリデーションが無く、deploy.yml の hard gate は validate:case しか
 * 持っていなかった。そこで Case 側と同じ二段防御を Blog にも入れる:
 *
 *   - pre-commit（主防御）: `pnpm validate:blog` を Blog 生成 routine の commit 前に実行
 *   - CI ゲート（バックストップ）: .github/workflows/deploy.yml の build 前ステップで実行
 *
 * 採用方針:
 *
 *   既存記事（main の content/blog/*.mdx 全件）を必ず PASS させる項目だけを hard
 *   gate に置く。validator が厳しすぎて既存記事が落ちると deploy.yml ゲートでサイト
 *   全体のデプロイが止まり、被害が大きいため。判定根拠は本ファイル末尾「採用/不採用
 *   一覧」を参照。
 *
 * 検出する違反（hard / exit 1）:
 *   1. frontmatter 必須欠落（title / description / date / tags）
 *   2. description が 120字超過
 *   3. tags が 1〜4個の範囲外
 *   4. 本文 H2 が 3 個未満
 *   5. 禁止フレーズ混入（CLAUDE.md「禁止事項」より、Case と同じ 5 語）
 *   6. content/blog 内での slug 重複
 *   7. frontmatter の audience が `enterprise` なのに本文に /services/rde/ への
 *      言及が無い（audience 設定時のみ発火。新規生成での事故防止）
 *
 * 警告（warning、exit 0 のまま report のみ）:
 *   - 本文中の /services/ リンク欠落（既存に 2 件存在するため hard にしない）
 *   - 近接重複（near_duplicate）: title 文字 bigram 類似・共有タグ・target_query 一致で
 *     既存記事とテーマ重複する新規記事を警告。NEAR_DUP_ALLOWLIST で併存ペアを除外。
 *
 * 不採用（CLAUDE.md「バリデーション基準」には残るが機械 gate にしない）:
 *   - 本文 1,600〜2,400字（既存 50 件が範囲外。深い技術記事は超過する）
 *   - `## 参考` H2 + sources ≥ 2（既存 93 件は本文に参考セクション未設置）
 *   - frontmatter audience / track / tech_depth / sources 必須化（移行前の旧 93 記
 *     事は未設定で blog-coverage-report.mjs もヒューリスティック分類している）
 *   - Direct-Answer Block 40-60字（既存に逸脱多数。誤検知リスク高）
 *   - 本文レベルの意味的重複検出（誤検知リスク高、AI 判定が必要）。ただし
 *     title/タグ/target_query ベースの近接重複は warning として採用（上記「警告」）。
 *
 * fictional チェック・実在企業 deny-list は Blog では入れない（Blog は実在企業を正当
 * に論評するメディアで、Case とはスコープが逆。詳細は本ファイル末尾 NOTE 参照）。
 *
 * 違反は「ファイル名 + 違反内容」で列挙し、exit 1 で fail。全件 OK なら exit 0。
 * I/O 規約は scripts/validate-case.mjs と揃える。
 *
 * 依存: gray-matter（package.json に既存）
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");

if (!fs.existsSync(BLOG_DIR)) {
	console.error(`[validate-blog] FATAL: ${BLOG_DIR} が存在しません`);
	process.exit(2);
}

/**
 * 禁止フレーズ。CLAUDE.md「ブログ記事自動生成ガイドライン」>「禁止事項」より。
 * Case 側と内容が完全一致するため、運用上は scripts/case-deny-list.json と統合する
 * 余地もあるが、現状は意味が異なる（Case = 実在企業 deny / Blog = 文体禁止フレーズ）
 * ためファイル分離は維持し、ここで定数として持つ。
 */
const BANNED_PHRASES = [
	"以上のことから",
	"このように",
	"昨今",
	"今後も",
	"いかがでしたでしょうか",
];

/**
 * 意図的に併存させる近接記事ペア（読者層・切り口が明確に異なるもの）。
 * near_duplicate 警告から除外する。順序非依存。
 */
const NEAR_DUP_ALLOWLIST = new Set(
	[
		["agent-governance-framework", "agent-governance-checklist"],
		["ai-risk-management-sme", "ai-risk-assessment-template"],
		["ai-agent-roi-measurement", "ai-agent-evaluation-kpi"],
		// enterprise(deep)版とsmb(intermediate)版: 9軸フレームワーク焦点・audience・tech_depthが異なる正当な併存
		[
			"llm-as-a-judge-agent-evaluation-enterprise",
			"nine-axis-evaluation-llm-judge-smb",
		],
		// モデル選択（Haiku/Sonnet/Opus性能比較）とRAG vs ツール使用（アーキテクチャパターン選択）: 主題が異なる正当な併存
		[
			"claude-model-tool-use-performance-comparison",
			"rag-vs-tool-use-agent-design",
		],
		// Function calling実装詳細（JSON Schema/strict mode/tool response）と使い分け設計判断（MCP vs Function calling選択基準）: 焦点が異なる正当な併存
		[
			"function-calling-structured-output-tool-design",
			"mcp-vs-function-calling-design-decision",
		],
		// コンテキストエンジニアリング（トークン予算・設計原則）とコンテキスト圧縮（Compaction API・長期セッション実行時管理）: 設計フェーズ vs 実行時管理で正当な併存
		[
			"context-engineering-token-budget-design",
			"agent-context-compression-session-management",
		],
		// Claude Fable 5（1Mコンテキスト・長時間自律実行・モデルルーティング）と Claude Opus 4.8（Adaptive Thinking移行・effortパラメータ・ミッドターン指示更新）: 別モデルの設計指針で正当な併存
		[
			"claude-fable-5-enterprise-agent-design",
			"claude-opus48-enterprise-agentic-design",
		],
		// オンライン評価（本番トラフィックサンプリング設計方法論・both/deep）vs eval コスト管理（judge選択・予算制御・smb/intermediate）: 設計方法論 vs 予算管理で正当な併存
		[
			"online-evaluation-production-traffic-sampling",
			"agent-eval-cost-management-smb",
		],
	].map((pair) => pair.slice().sort().join("|")),
);
const files = fs
	.readdirSync(BLOG_DIR)
	.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

const violations = []; // { file, kind, message }
const warnings = []; // 同じ shape

const seenSlugs = new Map(); // slug -> first file
const metas = []; // { slug, title, tags, targetQuery } — near_duplicate 検出用

for (const file of files) {
	const slug = file.replace(/\.(mdx|md)$/, "");
	if (seenSlugs.has(slug)) {
		violations.push({
			file,
			kind: "slug_duplicate",
			message: `slug 重複: ${seenSlugs.get(slug)} と同じ slug を持つ`,
		});
	} else {
		seenSlugs.set(slug, file);
	}

	const fullPath = path.join(BLOG_DIR, file);
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

	const { data, content } = parsed;

	metas.push({
		slug,
		title: typeof data.title === "string" ? data.title : "",
		tags: Array.isArray(data.tags) ? data.tags : [],
		targetQuery: typeof data.target_query === "string" ? data.target_query : "",
	});

	// (1) 必須 frontmatter
	if (typeof data.title !== "string" || data.title.length === 0) {
		violations.push({
			file,
			kind: "title_missing",
			message: `frontmatter の title が無い／空。`,
		});
	}
	if (typeof data.description !== "string" || data.description.length === 0) {
		violations.push({
			file,
			kind: "description_missing",
			message: `frontmatter の description が無い／空。`,
		});
	} else if (data.description.length > 120) {
		// (2) description 120字以内
		violations.push({
			file,
			kind: "description_too_long",
			message: `description が 120字超過（${data.description.length}字）。`,
		});
	}
	if (!data.date) {
		violations.push({
			file,
			kind: "date_missing",
			message: `frontmatter の date が無い。`,
		});
	}

	// (3) tags が配列で 1〜4 個
	if (!Array.isArray(data.tags)) {
		violations.push({
			file,
			kind: "tags_missing",
			message: `frontmatter の tags が配列ではない。`,
		});
	} else if (data.tags.length < 1 || data.tags.length > 4) {
		violations.push({
			file,
			kind: "tags_count",
			message: `tags の数が 1〜4 個の範囲外（現在: ${data.tags.length}個）。`,
		});
	}

	// (4) H2 が 3 個以上
	const h2Matches = (content || "").match(/^## /gm) || [];
	if (h2Matches.length < 3) {
		violations.push({
			file,
			kind: "h2_too_few",
			message: `本文の H2 が 3 個未満（${h2Matches.length}個）。`,
		});
	}

	// (5) 禁止フレーズ。frontmatter title/description と本文を対象にする。
	const haystack = [
		typeof data.title === "string" ? data.title : "",
		typeof data.description === "string" ? data.description : "",
		content || "",
	].join("\n");
	const hits = BANNED_PHRASES.filter((p) => haystack.includes(p));
	if (hits.length > 0) {
		violations.push({
			file,
			kind: "banned_phrase",
			message: `禁止フレーズ検出: ${hits.join(
				", ",
			)}（CLAUDE.md「ブログ記事自動生成ガイドライン」>「禁止事項」参照）`,
		});
	}

	// (7) audience が enterprise なら /services/rde/ への言及があること
	if (data.audience === "enterprise") {
		if (!/\/services\/rde\//.test(content || "")) {
			violations.push({
				file,
				kind: "service_link_audience_mismatch",
				message: `audience: "enterprise" だが本文に /services/rde/ への言及が無い（CLAUDE.md service_link マッピング参照）。`,
			});
		}
	}

	// (warning) サービスページリンク 1 個以上
	// 既存 main の 2 件（what-is-ai-agent.mdx / why-agent-governance.mdx）が
	// 該当しないため hard gate にはせず警告で出す。
	if (!/\/services\//.test(content || "")) {
		warnings.push({
			file,
			kind: "no_service_link",
			message: `本文に /services/ への内部リンクが無い（新規生成では 1 個以上推奨）。`,
		});
	}

	// (warning) SERP コピー品質。CLAUDE.md の「SERP（検索結果）コピーの最適化」
	// 基準（title 全角32字以内 / description 70〜120字）の下限側を警告で出す。
	// 既存記事に該当があり得るため hard gate にはしない（デプロイは止めない）。
	if (typeof data.title === "string" && data.title.length > 32) {
		warnings.push({
			file,
			kind: "title_serp_length",
			message: `title が ${data.title.length} 字（推奨 32 字以内）。Google SERP では約 30〜35 字で切られる。`,
		});
	}
	if (typeof data.description === "string" && data.description.length < 70) {
		warnings.push({
			file,
			kind: "description_serp_short",
			message: `description が ${data.description.length} 字（推奨 70〜120 字）。短すぎると SERP の説明文を Google が独自生成しやすくなる。`,
		});
	}
}

// 近接重複検出（warning のみ・exit 1 にしない）。新規生成が既存記事とテーマ重複して
// いないかを機械的に警告する。誤検知リスクと正当な併存ペアがあるため hard gate には
// せず、除外は NEAR_DUP_ALLOWLIST で行う。タイトルは日本語なので文字 bigram で比較する。
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
for (let i = 0; i < metas.length; i++) {
	for (let j = i + 1; j < metas.length; j++) {
		const a = metas[i];
		const b = metas[j];
		if (NEAR_DUP_ALLOWLIST.has([a.slug, b.slug].sort().join("|"))) continue;
		const titleSim = jaccard(titleBigrams(a.title), titleBigrams(b.title));
		const sharedTags = a.tags.filter((t) => b.tags.includes(t)).length;
		const sameQuery = Boolean(a.targetQuery) && a.targetQuery === b.targetQuery;
		// 日本語タイトルの文字 bigram Jaccard は同一テーマでも 0.3 前後で頭打ちのため、
		// 実コーパスで較正した 0.27 を閾値にする（無関係ペアは 0.26 以下に収まる）。
		if (titleSim >= 0.27 || sameQuery) {
			warnings.push({
				file: `${a.slug}.mdx`,
				kind: "near_duplicate",
				message: `「${b.slug}」とテーマ高類似（title類似=${titleSim.toFixed(
					2,
				)}, 共有タグ=${sharedTags}${
					sameQuery ? ", target_query一致" : ""
				}）。新規なら既存記事の更新に切替、正当な併存なら NEAR_DUP_ALLOWLIST に追加。`,
			});
		}
	}
}

if (warnings.length > 0) {
	console.warn(
		`[validate-blog] WARN: ${warnings.length} 件の警告（hard fail にはしない）`,
	);
	for (const w of warnings) {
		console.warn(`  - ${w.file} [${w.kind}] ${w.message}`);
	}
}

if (violations.length > 0) {
	console.error(
		`[validate-blog] FAIL: ${violations.length} 件の違反を ${files.length} ファイル中で検出`,
	);
	for (const v of violations) {
		console.error(`  - ${v.file} [${v.kind}] ${v.message}`);
	}
	console.error(
		`[validate-blog] 対応: 該当ファイルを修正してから再 commit してください。`,
	);
	process.exit(1);
}

console.log(
	`[validate-blog] PASS: ${files.length} 件の blog を検査（warning ${warnings.length} 件）`,
);
process.exit(0);

/*
 * NOTE: なぜ fictional / 実在企業 deny-list を入れないか
 * ====================================================
 * Case（content/case/）は「こういう使い方もできる」という架空ユースケース提案コンテン
 * ツで、実在企業名を出すと「導入実績」と誤認させるリスクがあるため `fictional: true`
 * と deny-list で防御する。
 *
 * 一方 Blog（content/blog/）は技術解説メディアで、Anthropic の Claude、OpenAI の
 * ChatGPT、Google の Vertex AI、Microsoft の Bedrock 等は **正当に論評する対象** で
 * あり、これを deny にすると技術記事が書けなくなる。よって Blog 側では fictional 検
 * 査と deny-list は採用しない。
 *
 * 採用 / 不採用一覧
 * =================
 * | 項目                                          | 採否    | 既存全件 PASS 件数（94中） |
 * | --------------------------------------------- | ------- | -------------------------- |
 * | frontmatter title / description / date / tags | hard    | 94                         |
 * | description ≤ 120 字                          | hard    | 94                         |
 * | tags 1〜4 個                                  | hard    | 94                         |
 * | 本文 H2 ≥ 3                                   | hard    | 94                         |
 * | 禁止フレーズ未使用                            | hard    | 94                         |
 * | slug 重複なし                                 | hard    | 94                         |
 * | audience=enterprise → /services/rde/ 言及     | hard    | 94（既存に enterprise が 0 件のため発火せず） |
 * | /services/ 内部リンク ≥ 1                     | warning | 92（what-is-ai-agent と why-agent-governance が欠落） |
 * | 本文 1,600〜2,400 字                          | 不採用  | 44（50 件が超過。深い技術記事は到達できない） |
 * | `## 参考` H2 + sources ≥ 2                    | 不採用  | 1（既存 93 件には未設置）  |
 * | DAB 40〜60 字                                 | 不採用  | 96.2%（誤検知リスク高）    |
 * | frontmatter audience/track/tech_depth/sources | 不採用  | 1（移行前 93 記事が未設定）|
 *
 * 「不採用」項目は CLAUDE.md の人間向け執筆チェックリストには残るが、ここで機械 gate
 * にすると既存記事が落ちて deploy が止まるため対象外とした。新規生成側で守るべき項目
 * として CLAUDE.md / Blog routine プロンプトでカバーする。
 */
