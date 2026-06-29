export interface NavLink {
	href: string;
	label: string;
}

export interface NavDropdown {
	label: string;
	children: NavLink[];
}

export type NavItem = NavLink | NavDropdown;

export function isDropdown(item: NavItem): item is NavDropdown {
	return "children" in item;
}

interface MainNavOptions {
	isHome?: boolean;
}

/** 英語ページ用ナビ（対訳が存在するページのみで構成） */
export function getEnNav(): NavItem[] {
	return [
		{ href: "/en/about/", label: "About" },
		{ href: "/en/services/", label: "Services" },
		{ href: "/en/ai-governance/", label: "Agent Governance" },
		{ href: "/en/contact/", label: "Contact" },
	];
}

export function getMainNav(opts: MainNavOptions = {}): NavItem[] {
	return [
		{ href: opts.isHome ? "/#about" : "/about/", label: "About" },
		{ href: "/services/", label: "Service" },
		{
			label: "Technology",
			children: [
				{ href: "/case/", label: "Case" },
				{ href: "/blog/", label: "Blog" },
			],
		},
		{ href: "/news/", label: "News" },
		{ href: "/contact/", label: "Contact" },
	];
}
