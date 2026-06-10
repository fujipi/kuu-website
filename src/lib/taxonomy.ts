import trackData from "./track-heuristics.json";

/**
 * 技術タクソノミ（track）。CLAUDE.md のブログ技術タクソノミと一致させる。
 * 分類の単一情報源は track-heuristics.json（blog-coverage-report.mjs と共有）。
 */
export type TrackSlug =
	| "architecture"
	| "protocols"
	| "security"
	| "evaluation"
	| "platform-infra"
	| "governance-tech"
	| "model-capability";

export const TRACK_SLUGS = trackData.tracks as TrackSlug[];

export const TRACK_INFO: Record<
	TrackSlug,
	{ label: string; description: string }
> = {
	architecture: {
		label: "アーキテクチャ",
		description:
			"エージェントハーネス・マルチエージェント・メモリ・コンテキスト設計など、AIエージェントの構造と設計判断を扱う技術記事の一覧です。",
	},
	protocols: {
		label: "プロトコル",
		description:
			"MCP（Model Context Protocol）・A2A・Function Calling など、エージェント間連携とツール接続のプロトコル仕様を扱う技術記事の一覧です。",
	},
	security: {
		label: "セキュリティ",
		description:
			"権限設計・監査ログ・プロンプトインジェクション対策・サンドボックスなど、AIエージェントのセキュリティ内部実装を扱う技術記事の一覧です。",
	},
	evaluation: {
		label: "評価・可観測性",
		description:
			"LLM-as-a-Judge・9軸評価・回帰テスト・オブザーバビリティなど、AIエージェントの評価手法と監視設計を扱う技術記事の一覧です。",
	},
	"platform-infra": {
		label: "プラットフォーム・基盤",
		description:
			"LLMゲートウェイ・VPC・SSO/SCIM・AI FinOps・Bedrock/Vertex など、エージェント運用基盤とインフラ構成を扱う技術記事の一覧です。",
	},
	"governance-tech": {
		label: "ガバナンス機構",
		description:
			"ポリシーエンジン・ガードレール・ISO/IEC 42001・EU AI Act 対応など、技術レベルのガバナンス機構を扱う技術記事の一覧です。",
	},
	"model-capability": {
		label: "モデル能力",
		description:
			"Claude・GPT・Gemini 等のモデル能力比較・API活用・コスト特性など、基盤モデルの能力と使い分けを扱う技術記事の一覧です。",
	},
};

const HEURISTICS: [string, RegExp][] = (
	trackData.heuristics as [string, string][]
).map(([track, pattern]) => [track, new RegExp(pattern)]);

const BUSINESS_RE = new RegExp(trackData.business);

export function isTrackSlug(value: string): value is TrackSlug {
	return (TRACK_SLUGS as string[]).includes(value);
}

/**
 * 記事の track を解決する。frontmatter の track を最優先し、
 * 未設定の旧記事は slug ヒューリスティックで暫定分類する
 * （blog-coverage-report.mjs と同一ロジック）。
 *
 * @returns TrackSlug / "business"（Case領域・track ページに収載しない）/ null（未分類）
 */
export function resolveTrack(
	slug: string,
	fmTrack?: string,
): TrackSlug | "business" | null {
	if (fmTrack && isTrackSlug(fmTrack)) return fmTrack;
	if (BUSINESS_RE.test(slug)) return "business";
	for (const [track, re] of HEURISTICS) {
		if (re.test(slug)) return track as TrackSlug;
	}
	return null;
}
