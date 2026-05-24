import Link from "next/link";

const columns: { heading: string; links: { href: string; label: string }[] }[] =
	[
		{
			heading: "Service",
			links: [
				{ href: "/services/", label: "Service" },
				{ href: "/services/ax-dx/", label: "AX/DX戦略・現場ディスカバリ" },
				{
					href: "/services/ai-ops/",
					label: "AIエージェント実装・ガバナンス",
				},
			],
		},
		{
			heading: "Resources",
			links: [
				{ href: "/ai-governance/", label: "Agent Governance" },
				{ href: "/fde/", label: "FDE / Forward Deployed Engineer" },
				{ href: "/ax/", label: "AX / エージェントトランスフォーメーション" },
				{ href: "/managed-agents/", label: "Managed Agents" },
				{ href: "/eu-ai-act-jp/", label: "EU AI Act" },
				{ href: "/glossary/", label: "Glossary" },
				{ href: "/case-studies/", label: "Case Studies" },
				{ href: "/resources/", label: "Resources" },
				{ href: "/blog/", label: "Blog" },
			],
		},
		{
			heading: "Company",
			links: [
				{ href: "/about/", label: "About" },
				{ href: "/contact/", label: "Contact" },
				{ href: "/privacy-policy/", label: "Privacy" },
				{ href: "/security/", label: "Security" },
			],
		},
	];

export default function Footer() {
	return (
		<footer>
			<div className="footer-columns">
				{columns.map((col) => (
					<div key={col.heading} className="footer-col">
						<div className="footer-col-heading">{col.heading}</div>
						<ul className="footer-col-list">
							{col.links.map((l) => (
								<li key={l.href}>
									<Link href={l.href}>{l.label}</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="footer-bottom">
				<div className="footer-copy">&copy; 2026 Kuu Inc.</div>
				<div
					className="footer-security-action"
					aria-label="SECURITY ACTION 二つ星 セキュリティ対策自己宣言"
				>
					<img
						src="/images/security_action_futatsuboshi-large_bw.png"
						alt="SECURITY ACTION 二つ星（セキュリティ対策自己宣言）"
						width={56}
						height={56}
						loading="lazy"
					/>
				</div>
			</div>
		</footer>
	);
}
