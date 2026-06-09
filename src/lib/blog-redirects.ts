// 近接重複により別記事へ統合した旧 blog slug のリダイレクトマップ。
// GitHub Pages は server 3xx を持たないため、旧 URL はクライアント側リダイレクトの
// スタブとして残し、被リンクと検索評価を移動先（canonical）へ引き継ぐ
// （/case-studies/・/authors/fujihira-kento/ と同方式）。
// key: 削除した旧 slug / value: 統合先（canonical）の slug。
export const BLOG_REDIRECTS: Record<string, string> = {
	"ax-dx-difference-guide": "ax-vs-dx-comprehensive",
	"iso-42001-ai-management-sme": "iso-42001-certification-roadmap",
	"shadow-ai-detection-governance": "shadow-ai-countermeasures-enterprise",
	"agent-observability-evaluation-log":
		"agent-observability-tracing-instrumentation",
	"ai-agent-prompt-injection-defense":
		"prompt-injection-layered-defense-architecture",
	"managed-agents-cost-benefit": "ai-investment-cost-guide",
	"ai-chatbot-customer-support-cost": "ai-investment-cost-guide",
	"ai-agent-cost-optimization-sme": "ai-investment-cost-guide",
	// 本番オンライン評価の自動生成重複（新しく本数の多い方を canonical に）。
	"agent-online-evaluation-production-sampling":
		"online-evaluation-production-traffic-sampling",
};
