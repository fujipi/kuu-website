import { describe, expect, it } from "vitest";
import { BASE_ORG, BASE_URL, buildBreadcrumb, resolveOgImage } from "@/lib/seo";

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
		expect(resolveOgImage("/news/fde-service-launch/")).toBe(
			"/og/news/fde-service-launch.png",
		);
	});

	it("maps top-level pages to /og/{name}.png", () => {
		expect(resolveOgImage("/ai-governance/")).toBe("/og/ai-governance.png");
		expect(resolveOgImage("/blog/")).toBe("/og/blog.png");
		expect(resolveOgImage("/news/")).toBe("/og/news.png");
	});

	it("falls back archive pages to their section image", () => {
		expect(resolveOgImage("/blog/track/security/")).toBe("/og/blog.png");
		expect(resolveOgImage("/case/industry/healthcare/")).toBe("/og/case.png");
	});

	it("falls back to default for unknown paths", () => {
		expect(resolveOgImage("/")).toBe("/og/default.png");
		expect(resolveOgImage("/privacy-policy/")).toBe("/og/default.png");
	});
});

describe("BASE_ORG", () => {
	it("is a self-contained canonical Organization node", () => {
		expect(BASE_ORG["@context"]).toBe("https://schema.org");
		expect(BASE_ORG["@type"]).toBe("Organization");
		expect(BASE_ORG["@id"]).toBe(`${BASE_URL}/#organization`);
		expect(BASE_ORG.address["@type"]).toBe("PostalAddress");
		expect(BASE_ORG.address.postalCode).toBe("101-0031");
		expect(BASE_ORG.numberOfEmployees["@type"]).toBe("QuantitativeValue");
	});

	it("links only external identity profiles in sameAs", () => {
		expect(BASE_ORG.sameAs).toContain("https://github.com/fujipi");
		expect(BASE_ORG.sameAs).not.toContain(`${BASE_URL}/about/`);
	});

	it("does not fabricate unpublished contact facts", () => {
		// 電話番号・営業時間・座標は非公開のため、構造化データに存在してはならない
		const json = JSON.stringify(BASE_ORG);
		expect(json).not.toContain("telephone");
		expect(json).not.toContain("TollFree");
		expect(json).not.toContain("openingHours");
		expect(json).not.toContain('"geo"');
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
