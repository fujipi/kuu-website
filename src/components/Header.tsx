"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { isDropdown, type NavItem } from "@/lib/navigation";

interface HeaderProps {
	navLinks: NavItem[];
}

export default function Header({ navLinks }: HeaderProps) {
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
			<Link href="/" className="logo">
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
				</ul>
			</nav>
		</header>
	);
}
