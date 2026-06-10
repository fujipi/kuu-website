import { defineConfig, devices } from "@playwright/test";

/**
 * ビルド成果物（out/）に対する E2E スモークテスト。
 * 事前に `pnpm build` が必要（webServer は out/ をそのまま配信する）。
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: "http://127.0.0.1:4321",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "pnpm exec http-server out -p 4321 -s --no-dotfiles",
		url: "http://127.0.0.1:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
