import type { TocItem } from "@/lib/toc";

interface Props {
	items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
	if (items.length < 3) return null;

	return (
		<nav
			aria-label="目次"
			className="fade-in"
			style={{
				maxWidth: "720px",
				border: "1px solid var(--gray-dark)",
				borderRadius: "4px",
				padding: "1.25rem 1.5rem",
				marginBottom: "2.5rem",
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
				TABLE OF CONTENTS
			</div>
			<ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
				{items.map((item) => (
					<li
						key={item.id}
						style={{
							paddingLeft: item.level === 3 ? "1rem" : 0,
							marginBottom: "0.4rem",
							fontSize: "0.8rem",
							lineHeight: "1.5",
						}}
					>
						<a
							href={`#${item.id}`}
							style={{
								color:
									item.level === 2 ? "var(--gray-light)" : "var(--gray-medium)",
							}}
						>
							{item.text}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
