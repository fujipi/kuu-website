# Kuu株式会社 コーポレートサイト

Kuu株式会社（AI業務活用コンサルティング事業）の公式Webサイトです。

## 主要ページ
- `/` トップページ（サービス訴求・導入プロセス・FAQ）
- `/about/` 会社情報
- `/news/` ニュース
- `/privacy_policy/` プライバシーポリシー
- `/404.html` カスタム404

## SEO実装
- 各ページに `title` / `description` / canonical / OGP / Twitter Card を設定
- `robots.txt` と `sitemap.xml` を更新
- 構造化データ（Organization / WebSite / Service / FAQPage など）を設定
- `hreflang`、`max-image-preview` などクローラー向けメタを設定

## セキュリティ実装（静的サイトで可能な範囲）
- `Content-Security-Policy`（meta）
- `Referrer-Policy`、`X-Frame-Options`、`X-Content-Type-Options`、`Permissions-Policy`（meta）
- `.well-known/security.txt` を追加

> 注: 本来はHTTPレスポンスヘッダーでの設定が推奨です。GitHub Pages以外のCDN/ホスティングでヘッダーを強制する構成が理想です。

## ローカル確認
```bash
python3 -m http.server 4173
```
`http://127.0.0.1:4173/` を開いて確認します。
