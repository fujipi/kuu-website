"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { localeFromPath, switchLocalePath } from "@/lib/i18n";
import { isDropdown, type NavItem } from "@/lib/navigation";

interface HeaderProps {
	navLinks: NavItem[];
}

export default function Header({ navLinks }: HeaderProps) {
	const pathname = usePathname();
	const locale = localeFromPath(pathname ?? "/");
	const homeHref = locale === "en" ? "/en/" : "/";
	const switchHref = switchLocalePath(pathname ?? "/");
	const [menuOpen, setMenuOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const toggleMenu = useCallback(() => {
		setMenuOpen((prev) => !prev);
		setOpenDropdown(null);
	}, []);

	const closeAll = useCallback(() => {
		setMenuOpen(false);
		setOpenDropdown(null);
	}, []);

	const onLogoClick = useCallback(
		(e: MouseEvent<HTMLAnchorElement>) => {
			closeAll();
			// On the home page, scroll back to the hero (top) instead of a no-op nav.
			if (pathname === homeHref || (locale === "ja" && pathname === "/")) {
				e.preventDefault();
				const reduce = window.matchMedia(
					"(prefers-reduced-motion: reduce)",
				).matches;
				window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
				if (window.location.hash) {
					history.replaceState(null, "", "/");
				}
			}
		},
		[closeAll, pathname, homeHref, locale],
	);

	const toggleDropdown = useCallback((label: string) => {
		setOpenDropdown((prev) => (prev === label ? null : label));
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpenDropdown(null);
				setMenuOpen(false);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<header>
			<Link href={homeHref} className="logo" onClick={onLogoClick}>
				<Image
					src="/images/logo.png"
					alt="Kuu"
					width={120}
					height={12}
					className="logo-img"
					priority
				/>
			</Link>
			<button
				className="menu-toggle"
				onClick={toggleMenu}
				aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
				aria-expanded={menuOpen}
				type="button"
			>
				<span />
				<span />
				<span />
			</button>
			<nav id="nav" className={menuOpen ? "active" : ""}>
				<ul>
					{navLinks.map((item) =>
						isDropdown(item) ? (
							<li
								key={item.label}
								className={`has-dropdown${openDropdown === item.label ? " open" : ""}`}
							>
								<button
									type="button"
									className="dropdown-trigger"
									aria-haspopup="true"
									aria-expanded={openDropdown === item.label}
									onClick={() => toggleDropdown(item.label)}
								>
									{item.label}
									<span className="dropdown-caret" aria-hidden="true">
										▾
									</span>
								</button>
								<ul className="dropdown-menu">
									{item.children.map((child) => (
										<li key={child.href}>
											<Link href={child.href} onClick={closeAll}>
												{child.label}
											</Link>
										</li>
									))}
								</ul>
							</li>
						) : (
							<li key={item.href}>
								<Link href={item.href} onClick={closeAll}>
									{item.label}
								</Link>
							</li>
						),
					)}
					<li>
						<Link
							href={switchHref}
							onClick={closeAll}
							aria-label={
								locale === "en" ? "日本語ページへ切り替え" : "Switch to English"
							}
							style={{
								fontSize: "0.7rem",
								letterSpacing: "0.08em",
							}}
						>
							{locale === "en" ? "日本語" : "EN"}
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
