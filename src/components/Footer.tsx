import Link from "next/link";

export default function Footer() {
	return (
		<footer>
			<div className="footer-links">
				<Link href="/contact/">Contact</Link>
				<Link href="/privacy-policy/">Privacy</Link>
			</div>
			<div className="footer-copy">&copy; 2026 Kuu Inc.</div>
		</footer>
	);
}
