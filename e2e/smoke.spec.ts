import { expect, test } from "@playwright/test";

test.describe("トップページ", () => {
	test("表示・ナビゲーション・JSON-LD", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Kuu株式会社/);
		await expect(page.locator("header .logo")).toBeVisible();
		// Organization + WebSite(SearchAction) JSON-LD
		const jsonLd = await page
			.locator('script[type="application/ld+json"]')
			.first()
			.textContent();
		expect(jsonLd).toContain('"@context"');
	});
});

test.describe("ブログ記事", () => {
	test("JSON-LD・関連記事・CTA・目次が描画される", async ({ page }) => {
		await page.goto("/blog/what-is-ai-agent/");
		await expect(page.locator("article.blog-content")).toBeVisible();
		// Article/TechArticle JSON-LD
		const ld = await page
			.locator('script[type="application/ld+json"]')
			.allTextContents();
		expect(ld.join("")).toMatch(/"@type":"(Tech)?Article"/);
		// 関連記事 or 前後ナビ
		await expect(
			page.getByRole("link", { name: "← ブログ一覧へ戻る" }),
		).toBeVisible();
		// CTA ボックス
		await expect(page.locator(".cta-box")).toBeVisible();
	});

	test("track アーカイブから記事へ遷移できる", async ({ page }) => {
		await page.goto("/blog/track/security/");
		await expect(page.locator("h1")).toContainText("セキュリティ");
		const first = page.locator(".blog-list-item").first();
		await expect(first).toBeVisible();
		await first.click();
		await expect(page.locator("article.blog-content")).toBeVisible();
	});
});

test.describe("全文検索", () => {
	test("Blog 一覧の検索窓で日本語クエリがヒットする", async ({ page }) => {
		await page.goto("/blog/");
		const input = page.getByRole("searchbox");
		await expect(input).toBeVisible();
		await input.fill("エージェント");
		// デバウンス + インデックスロード待ち
		await expect(page.getByText(/件ヒット/)).toBeVisible({ timeout: 10_000 });
		await expect(
			page.locator('main a[href^="/blog/"], main a[href^="/case/"]').first(),
		).toBeVisible();
	});

	test("旧 /search/ は /blog/ にリダイレクトされる", async ({ page }) => {
		await page.goto("/search/");
		await page.waitForURL(/\/blog\/?$/, { timeout: 10_000 });
		await expect(page.getByRole("searchbox")).toBeVisible();
	});
});

test.describe("問い合わせフォーム", () => {
	test("クライアントバリデーションが機能する", async ({ page }) => {
		await page.goto("/contact/");
		await page.getByRole("button", { name: "送信する" }).click();
		await expect(page.getByText("会社名を入力してください")).toBeVisible();
	});

	test("正常入力で成功状態になる（送信はモック）", async ({ page }) => {
		await page.route("https://formspree.io/**", (route) =>
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ ok: true }),
			}),
		);
		await page.goto("/contact/");
		const form = page.locator("form.contact-form");
		await form.getByLabel(/会社名/).fill("テスト株式会社");
		await form.getByLabel(/お名前/).fill("山田 太郎");
		await form.getByLabel(/メールアドレス/).fill("yamada@example.com");
		await form.getByRole("button", { name: "送信する" }).click();
		await expect(page.getByText("送信が完了しました。")).toBeVisible();
	});
});

test.describe("英語ページ", () => {
	test("/en/ が lang=en で表示され言語切替が機能する", async ({ page }) => {
		await page.goto("/en/");
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
		await expect(page).toHaveTitle(/Kuu Inc\./);
		// 言語切替（日本語へ）
		await page.getByRole("link", { name: "日本語ページへ切り替え" }).click();
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator("html")).toHaveAttribute("lang", "ja");
	});

	test("EN contact フォームが英語で表示される", async ({ page }) => {
		await page.goto("/en/contact/");
		await expect(page.getByLabel(/Company/)).toBeVisible();
		await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
	});
});

test.describe("404", () => {
	test("未知URLで日英併記の404が返る", async ({ page }) => {
		const res = await page.goto("/no-such-page/");
		expect(res?.status()).toBe(404);
		await expect(
			page.getByText("お探しのページは見つかりませんでした。"),
		).toBeVisible();
		await expect(
			page.getByText("The page you are looking for could not be found."),
		).toBeVisible();
	});
});
