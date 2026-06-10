import Link from "next/link";

interface Props {
	/** 記事の audience（smb / enterprise / both）。未指定は both 扱い */
	audience?: string;
	/** GA・文脈用の track（任意） */
	track?: string;
}

/**
 * 記事末尾の問い合わせ導線。audience に応じてサービスリンクを出し分ける
 * （CLAUDE.md の service_link マッピング: enterprise → /services/rde/、
 * smb → /services/ai-ops/ + /services/ax-dx/、both → ai-ops 主 + rde 副）。
 * テンプレート側のビルド時処理なので、既存・新規の全記事に自動適用される。
 */
export default function CtaBox({ audience }: Props) {
	const isEnterprise = audience === "enterprise";
	const isSmb = audience === "smb";

	const primary = isEnterprise
		? {
				href: "/services/rde/",
				label: "RDE（大規模変革支援）を見る",
				copy: "エンタープライズ環境でのエージェント統制・大規模展開は、RDE（Reinvention Deployed Engineering）が設計から伴走します。",
			}
		: {
				href: "/services/ai-ops/",
				label: "AI-Ops（実装・運用管理）を見る",
				copy: "AIエージェントの実装・ガバナンス・運用管理は、Kuu株式会社が伴走支援します。記事の内容を自社でどう実装するかは、無料相談でご提案できます。",
			};

	const secondary = isEnterprise
		? null
		: isSmb
			? { href: "/services/ax-dx/", label: "AX/DX戦略コンサルティング" }
			: { href: "/services/rde/", label: "大規模環境なら RDE" };

	return (
		<aside
			className="fade-in cta-box"
			style={{
				maxWidth: "720px",
				border: "1px solid var(--gray-dark)",
				borderRadius: "4px",
				padding: "1.5rem 1.75rem",
				marginBottom: "3rem",
				background: "rgba(255,255,255,0.02)",
			}}
		>
			<div
				style={{
					fontSize: "0.65rem",
					color: "var(--gray-dim)",
					fontFamily: "var(--font-heading)",
					letterSpacing: "0.1em",
					marginBottom: "0.75rem",
				}}
			>
				KUU AGENT GOVERNANCE
			</div>
			<p
				style={{
					fontSize: "0.85rem",
					color: "var(--gray-medium)",
					lineHeight: "1.9",
					marginBottom: "1.25rem",
				}}
			>
				{primary.copy}
			</p>
			<div
				style={{
					display: "flex",
					gap: "1rem",
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<Link
					href={primary.href}
					style={{
						display: "inline-block",
						fontSize: "0.8rem",
						color: "var(--white)",
						border: "1px solid var(--white)",
						padding: "0.6rem 1.5rem",
						fontFamily: "var(--font-heading)",
						letterSpacing: "0.05em",
					}}
				>
					{primary.label}
				</Link>
				<Link
					href="/contact/"
					style={{
						fontSize: "0.8rem",
						color: "var(--gray-light)",
						borderBottom: "1px solid var(--gray-dark)",
						paddingBottom: "0.15rem",
					}}
				>
					無料相談（15〜30分）
				</Link>
				{secondary ? (
					<Link
						href={secondary.href}
						style={{
							fontSize: "0.8rem",
							color: "var(--gray-light)",
							borderBottom: "1px solid var(--gray-dark)",
							paddingBottom: "0.15rem",
						}}
					>
						{secondary.label}
					</Link>
				) : null}
			</div>
		</aside>
	);
}
