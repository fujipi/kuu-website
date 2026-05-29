"use client";

import { useEffect } from "react";

interface Props {
	to: string;
}

/**
 * Client-side redirect for statically-exported pages (GitHub Pages has no
 * server-side 3xx). Renders a visible fallback link and a <meta refresh> so
 * the redirect works even without JS, while setting the canonical via the
 * page's metadata (handled by the caller).
 */
export default function Redirect({ to }: Props) {
	useEffect(() => {
		window.location.replace(to);
	}, [to]);

	return (
		<>
			{/* biome-ignore lint/a11y/noRedundantRoles: meta refresh fallback for no-JS */}
			<meta httpEquiv="refresh" content={`0; url=${to}`} />
			<div className="page-content" style={{ minHeight: "40vh" }}>
				<p
					style={{
						fontSize: "0.9rem",
						color: "var(--gray-medium)",
						lineHeight: "2",
					}}
				>
					このページは移動しました。自動で転送されない場合は{" "}
					<a href={to} style={{ color: "var(--white)" }}>
						こちら
					</a>{" "}
					をクリックしてください。
				</p>
			</div>
		</>
	);
}
