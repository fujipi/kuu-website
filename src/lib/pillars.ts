import type { BlogPostMeta } from "./mdx";
import { BASE_URL } from "./seo";
import { resolveTrack, type TrackSlug } from "./taxonomy";

/**
 * ピラー（トピッククラスターのハブページ）の定義と、記事⇄ピラーの双方向マッピング。
 *
 * ピラー⇄クラスターの双方向内部リンクは2026年のSEO/AEOで最高ROIの施策（トピカル
 * オーソリティ＝ナレッジグラフ整合）。本ファイルを単一情報源として、
 *  - ピラーページ → 配下記事（ItemList 構造化データ）
 *  - 記事 → 所属ピラー（本文上部リンク ＋ Article の isPartOf）
 * の両方向を構成する。
 *
 * 記事の所属判定は frontmatter `pillar` を最優先し、未設定の記事は track / tag で
 * 保守的にフォールバック判定する（resolveTrack は blog-coverage と同一ロジック）。
 * 判定は PILLARS の配列順（＝優先順位）で評価し、より固有なピラーを先に置く。
 */
export interface Pillar {
	slug: string;
	/** 記事側の「テーマ全体像」リンク等で使う表示名 */
	label: string;
	/** サイト内パス（先頭・末尾スラッシュ込み） */
	url: string;
	/** このピラーに紐づく技術タクソノミ track */
	tracks: TrackSlug[];
	/** このピラーに紐づく高シグナルな tag（完全一致） */
	tags: string[];
}

/** 優先順位の高い（より固有な）ピラーを先頭に置く。 */
export const PILLARS: Pillar[] = [
	{
		slug: "eu-ai-act-jp",
		label: "EU AI Act 日本企業対応ガイド",
		url: "/eu-ai-act-jp/",
		tracks: [],
		tags: ["EU AI Act", "AI規制", "ISO 42001", "ISO/IEC 42001", "AI法"],
	},
	{
		slug: "ai-governance",
		label: "エージェントガバナンス完全ガイド",
		url: "/ai-governance/",
		tracks: ["governance-tech", "security", "evaluation"],
		tags: [
			"エージェントガバナンス",
			"AIガバナンス",
			"ガバナンス",
			"9軸評価",
			"監査ログ",
			"権限設計",
			"可観測性",
		],
	},
	{
		slug: "managed-agents",
		label: "Managed Agents 実装ガイド",
		url: "/managed-agents/",
		tracks: ["architecture", "protocols", "platform-infra", "model-capability"],
		tags: [
			"Managed Agents",
			"MCP",
			"エージェントハーネス",
			"マルチエージェント",
			"LLMゲートウェイ",
			"オーケストレーション",
		],
	},
	{
		slug: "ax",
		label: "AX（エージェントトランスフォーメーション）",
		url: "/ax/",
		tracks: [],
		tags: ["AX", "エージェントトランスフォーメーション"],
	},
	{
		slug: "fde",
		label: "FDE（Forward Deployed Engineer）",
		url: "/fde/",
		tracks: [],
		tags: ["FDE", "Forward Deployed Engineer", "RDE"],
	},
];

const PILLAR_BY_SLUG = new Map(PILLARS.map((p) => [p.slug, p]));

export function getPillarBySlug(slug: string | undefined): Pillar | null {
	if (!slug) return null;
	return PILLAR_BY_SLUG.get(slug) ?? null;
}

/**
 * 記事が属するピラーを判定する。
 * 1. frontmatter `pillar` が既知のピラーslugなら最優先
 * 2. resolveTrack(track) が pillar.tracks に含まれる、または tag が pillar.tags と一致
 *    （PILLARS の優先順位で最初に一致したものを採用）
 * 3. いずれも無ければ null
 */
export function getPillarForPost(post: BlogPostMeta): Pillar | null {
	const explicit = getPillarBySlug(post.pillar);
	if (explicit) return explicit;

	const track = resolveTrack(post.slug, post.track);
	for (const pillar of PILLARS) {
		const trackHit =
			track !== null && track !== "business" && pillar.tracks.includes(track);
		const tagHit = post.tags.some((t) => pillar.tags.includes(t));
		if (trackHit || tagHit) return pillar;
	}
	return null;
}

/** ピラーに属する記事を日付降順で返す（明示 pillar ＋ track/tag フォールバック）。 */
export function getPostsForPillar(
	slug: string,
	allPosts: BlogPostMeta[],
	limit = 12,
): BlogPostMeta[] {
	return allPosts
		.filter((p) => getPillarForPost(p)?.slug === slug)
		.slice(0, limit);
}

/**
 * ピラーページの「関連記事」を表す ItemList JSON-LD。
 * ページ本体（TechArticle）とは別ノードとして @id を分け、型の衝突を避ける。
 * 構造化データは可視リンクと一致させる必要があるため、ページが表示する記事配列を渡す。
 */
export function buildPillarItemListJsonLd(
	pillar: Pillar,
	posts: { slug: string; title: string }[],
) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		"@id": `${BASE_URL}${pillar.url}#related-articles`,
		name: `${pillar.label}｜関連記事`,
		numberOfItems: posts.length,
		itemListElement: posts.map((p, i) => ({
			"@type": "ListItem",
			position: i + 1,
			url: `${BASE_URL}/blog/${p.slug}/`,
			name: p.title,
		})),
	};
}
