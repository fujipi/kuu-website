import Image from "next/image";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Locale } from "@/lib/i18n";

type FooterColumns = {
	heading: string;
	links: { href: string; label: string }[];
}[];

const columnsJa: FooterColumns = [
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
			{ href: "/case/", label: "Case" },
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

const columnsEn: FooterColumns = [
	{
		heading: "Service",
		links: [
			{ href: "/en/services/", label: "Services" },
			{ href: "/en/services/ax-dx/", label: "AX/DX Strategy & Discovery" },
			{
				href: "/en/services/ai-ops/",
				label: "Agent Implementation & Governance",
			},
			{ href: "/en/services/rde/", label: "RDE (Enterprise)" },
		],
	},
	{
		heading: "Resources",
		links: [
			{ href: "/en/ai-governance/", label: "Agent Governance Guide" },
			{ href: "/blog/", label: "Blog (Japanese)" },
			{ href: "/case/", label: "Use Cases (Japanese)" },
			{ href: "/glossary/", label: "Glossary (Japanese)" },
		],
	},
	{
		heading: "Company",
		links: [
			{ href: "/en/about/", label: "About" },
			{ href: "/en/contact/", label: "Contact" },
			{ href: "/privacy-policy/", label: "Privacy (Japanese)" },
			{ href: "/security/", label: "Security (Japanese)" },
		],
	},
];

export default function Footer({ locale = "ja" }: { locale?: Locale }) {
	const columns = locale === "en" ? columnsEn : columnsJa;
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
						{col.heading === "Company" ? (
							<div className="footer-security-action">
								<Image
									src="/images/security_action_futatsuboshi-large_bw.png"
									alt="SECURITY ACTION 二つ星（セキュリティ対策自己宣言）"
									width={60}
									height={60}
									loading="lazy"
								/>
							</div>
						) : null}
					</div>
				))}
			</div>
			<div className="footer-newsletter">
				<div className="footer-col-heading">Newsletter</div>
				<p
					style={{
						fontSize: "0.75rem",
						color: "var(--gray-medium)",
						lineHeight: "1.8",
						marginBottom: "0.75rem",
					}}
				>
					{locale === "en"
						? "Get new articles on AI agent governance by email (Japanese)."
						: "AIエージェントの技術記事・ユースケースの新着をメールでお届けします。"}
				</p>
				<NewsletterSignup locale={locale} />
			</div>
			<div className="footer-bottom">
				<div className="footer-copy">&copy; 2026 Kuu Inc.</div>
			</div>
		</footer>
	);
}
