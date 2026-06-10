# Kuu株式会社 コーポレートサイト

[kuucorp.com](https://kuucorp.com) のソースコード。Next.js（App Router・静的エクスポート）製で、`main` への push をトリガーに GitHub Actions が GitHub Pages へ自動デプロイする。

## 技術スタック

- **Next.js 16**（`output: "export"` による静的サイト生成、`trailingSlash: true`）
- **React 19** / **TypeScript**（strict）
- スタイリング: `src/app/globals.css`（CSS変数ベース）+ インラインstyle
- コンテンツ: `content/` 配下の MDX + frontmatter（gray-matter でパース）
- Lint/Format: **Biome**（`biome.json`）
- テスト: **Vitest**（`src/lib/__tests__/`）

## 開発

```bash
pnpm install        # 依存インストール
pnpm dev            # 開発サーバー (http://localhost:3000)
pnpm build          # 静的ビルド → out/（postbuildでOG画像・sitemap・feed・llms.txt生成）
pnpm lint           # biome check src/
pnpm test           # vitest（lib のユニットテスト）
pnpm check:links    # out/ の内部リンク切れ検証（build 後に実行）
```

E2E スモークテスト（Playwright。ビルド成果物 out/ に対して実行）:

```bash
pnpm build
pnpm exec playwright install chromium   # 初回のみ
pnpm exec playwright test
```

E2E は毎日のコンテンツデプロイを遅らせないよう `deploy.yml` には含めず、`.github/workflows/e2e.yml`（コード変更PR・手動・週次）で実行される。

> **注意**: `package.json` を変更したら必ず `pnpm install` で `pnpm-lock.yaml` を同期し、同じコミットに含めること。CI は `--frozen-lockfile` のためズレるとデプロイ全体が失敗する。

## ディレクトリ構成

```
content/
  blog/        技術ブログ（毎日自動生成。topic-queue.json 駆動）
  case/        業務/業種別ユースケース（自動生成。fictional: true 必須）
  glossary/    用語集
  resources/   テンプレート・チェックリスト
  news/        お知らせ・プレスリリース
  authors/     著者プロファイル（JSON）
src/
  app/         ルーティング（App Router）
  components/  共通コンポーネント
  lib/         コンテンツパーサ・SEO・タクソノミ等のロジック
scripts/       ビルド補助・検証スクリプト（下記）
```

## スクリプト一覧（scripts/）

| スクリプト | 役割 | 実行タイミング |
|---|---|---|
| `validate-blog.mjs` | Blog frontmatter・禁止フレーズ・重複の安全ゲート | commit 前 / CI |
| `validate-case.mjs` | Case の fictional 漏れ・実在企業 deny-list 検出 | commit 前 / CI |
| `check-internal-links.mjs` | `out/` の内部リンク切れ検証 | build 後 / CI |
| `generate-og-images.mjs` | OG画像（1200×630 PNG）生成 | postbuild |
| `generate-feed.mjs` | RSS / Atom / JSON Feed 生成 | postbuild |
| `generate-llms-txt.mjs` | llms.txt / llms-full.txt 生成 | postbuild |
| `blog-coverage-report.mjs` | track×audience カバレッジ診断 | 手動 |

## コンテンツ運用

Blog / Case は `CLAUDE.md` のガイドラインに従って自動生成され、`main` へ直 push される（PR は作らない）。生成フロー・frontmatter スキーマ・バリデーション基準・文体ルールは **`CLAUDE.md` を一次情報源とする**。

- Blog: `content/blog/topic-queue.json` のキューから生成。技術コンテンツ専用
- Case: `content/case/case-topic-queue.json` のキューから生成。業務/業種ユースケース（提案コンテンツ・架空バッジ必須）

## デプロイ

`.github/workflows/deploy.yml` が `main` push 時に lint → test → validate → build → リンク検証 → GitHub Pages デプロイを実行する。カスタムドメインは `public/CNAME`（→ `out/CNAME`）で維持。

環境変数（GitHub Actions の Variables / ローカルは `.env.local`）:

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `NEXT_PUBLIC_GSC_VERIFICATION` — Google Search Console 検証トークン
