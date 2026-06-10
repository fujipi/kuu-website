import { describe, expect, it } from "vitest";
import { BASE_URL, buildBreadcrumb, resolveOgImage } from "@/lib/seo";

describe("resolveOgImage", () => {
	it("maps content detail pages to their generated OG image", () => {
		expect(resolveOgImage("/blog/what-is-ai-agent/")).toBe(
			"/og/blog/what-is-ai-agent.png",
		);
		expect(resolveOgImage("/glossary/agent-governance/")).toBe(
			"/og/glossary/agent-governance.png",
		);
		expect(resolveOgImage("/case/contract-review-agent/")).toBe(
			"/og/case/contract-review-agent.png",
		);
	});

	it("maps top-level pages to /og/{name}.png", () => {
		expect(resolveOgImage("/ai-governance/")).toBe("/og/ai-governance.png");
		expect(resolveOgImage("/blog/")).toBe("/og/blog.png");
	});

	it("falls back to default for unknown paths", () => {
		expect(resolveOgImage("/")).toBe("/og/default.png");
		expect(resolveOgImage("/privacy-policy/")).toBe("/og/default.png");
	});
});

describe("buildBreadcrumb", () => {
	it("builds a BreadcrumbList with absolute URLs and positions", () => {
		const bc = buildBreadcrumb([
			{ name: "ホーム", path: "/" },
			{ name: "ブログ", path: "/blog/" },
		]);
		expect(bc["@type"]).toBe("BreadcrumbList");
		expect(bc.itemListElement).toHaveLength(2);
		expect(bc.itemListElement[0]).toMatchObject({
			position: 1,
			item: BASE_URL,
		});
		expect(bc.itemListElement[1].item).toBe(`${BASE_URL}/blog/`);
	});
});
