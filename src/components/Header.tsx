"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

interface HeaderProps {
	navLinks: { href: string; label: string }[];
}

export default function Header({ navLinks }: HeaderProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = useCallback(() => {
		setMenuOpen((prev) => !prev);
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
					{navLinks.map((link) => (
						<li key={link.href}>
							<Link href={link.href} onClick={() => setMenuOpen(false)}>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
