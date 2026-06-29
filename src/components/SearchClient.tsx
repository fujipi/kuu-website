"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface PagefindResultData {
	url: string;
	meta: { title?: string };
	excerpt: string;
}

interface PagefindResult {
	id: string;
	data: () => Promise<PagefindResultData>;
}

interface PagefindApi {
	search: (query: string) => Promise<{ results: PagefindResult[] }>;
	options?: (opts: Record<string, unknown>) => Promise<void>;
}

type LoadState = "loading" | "ready" | "unavailable";

/**
 * Pagefind ベースの全文検索クライアント。
 * インデックス（/pagefind/）は postbuild の `pagefind --site out` が生成する
 * 静的アセットのため、`next dev` では存在しない（unavailable 表示にフォールバック）。
 */
export default function SearchClient() {
	const pagefindRef = useRef<PagefindApi | null>(null);
	const [loadState, setLoadState] = useState<LoadState>("loading");
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<PagefindResultData[]>([]);
	const [searching, setSearching] = useState(false);

	// /blog/?q=... ・ /case/?q=... での直接アクセス（SearchAction 経由など）に対応
	useEffect(() => {
		const q = new URLSearchParams(window.location.search).get("q");
		if (q) setQuery(q);
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				// バンドラに解決させず、デプロイ済みの静的アセットを実行時に読む
				const pagefind = (await import(
					/* webpackIgnore: true */ "/pagefind/pagefind.js" as string
				)) as PagefindApi;
				if (cancelled) return;
				pagefindRef.current = pagefind;
				setLoadState("ready");
			} catch {
				if (!cancelled) setLoadState("unavailable");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const runSearch = useCallback(async (q: string) => {
		const pagefind = pagefindRef.current;
		if (!pagefind || !q.trim()) {
			setResults([]);
			return;
		}
		setSearching(true);
		try {
			const res = await pagefind.search(q);
			const data = await Promise.all(
				res.results.slice(0, 20).map((r) => r.data()),
			);
			setResults(data);
		} finally {
			setSearching(false);
		}
	}, []);

	useEffect(() => {
		const t = setTimeout(() => {
			void runSearch(query);
		}, 250);
		return () => clearTimeout(t);
	}, [query, runSearch]);

	// Pagefind の URL は /pagefind/ からの絶対 URL（…/index.html 付き）で返る
	const toPath = (url: string) =>
		url.replace(/\/index\.html$/, "/").replace(/^https?:\/\/[^/]+/, "");

	return (
		<div className="fade-in" style={{ maxWidth: "720px" }}>
			<input
				type="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="キーワードを入力（例: MCP, エージェントガバナンス, 監査ログ）"
				aria-label="サイト内検索"
				style={{
					width: "100%",
					background: "rgba(255,255,255,0.03)",
					border: "1px solid var(--gray-dark)",
					borderRadius: "4px",
					padding: "0.85rem 1rem",
					color: "var(--white)",
					fontSize: "0.9rem",
					fontFamily: "var(--font-body)",
					outline: "none",
					marginBottom: "2rem",
				}}
			/>

			{loadState === "unavailable" ? (
				<p style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}>
					検索インデックスが見つかりません。本番ビルド（`pnpm
					build`）後に有効になります。
				</p>
			) : null}

			{loadState === "ready" && query.trim() && !searching ? (
				<p
					style={{
						fontSize: "0.7rem",
						color: "var(--gray-dim)",
						fontFamily: "var(--font-heading)",
						letterSpacing: "0.05em",
						marginBottom: "1rem",
					}}
				>
					{results.length > 0
						? `${results.length} 件ヒット`
						: "該当する記事が見つかりませんでした"}
				</p>
			) : null}

			<div style={{ display: "flex", flexDirection: "column" }}>
				{results.map((r) => (
					<Link
						key={r.url}
						href={toPath(r.url)}
						style={{
							display: "block",
							padding: "1rem 0",
							borderTop: "1px solid var(--gray-dark)",
						}}
					>
						<span
							style={{
								display: "block",
								fontSize: "0.9rem",
								color: "var(--white)",
								marginBottom: "0.4rem",
								lineHeight: "1.6",
							}}
						>
							{r.meta.title ?? toPath(r.url)}
						</span>
						<span
							style={{
								display: "block",
								fontSize: "0.75rem",
								color: "var(--gray-medium)",
								lineHeight: "1.7",
							}}
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind excerpt is generated at build time from our own static content
							dangerouslySetInnerHTML={{ __html: r.excerpt }}
						/>
					</Link>
				))}
				{results.length > 0 ? (
					<div style={{ borderBottom: "1px solid var(--gray-dark)" }} />
				) : null}
			</div>
		</div>
	);
}
