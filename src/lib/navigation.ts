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

export function getMainNav(opts: MainNavOptions = {}): NavItem[] {
	return [
		{ href: opts.isHome ? "/#about" : "/about/", label: "About" },
		{ href: "/services/", label: "Service" },
		{
			label: "Technology",
			children: [
				{ href: "/case/", label: "Case" },
				{ href: "/blog/", label: "Blog" },
				{ href: "/search/", label: "Search" },
			],
		},
		{ href: "/news/", label: "News" },
		{ href: "/contact/", label: "Contact" },
	];
}
