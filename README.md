# Kuu株式会社 コーポレートサイト

Kuu株式会社の公式Webサイトです。

## GitHub Pagesへのデプロイ手順

### 1. GitHubリポジトリの作成

```bash
# ローカルでGit初期化
cd kuu-website
git init
git add .
git commit -m "Initial commit"

# GitHubでリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/kuu-website.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pagesの有効化

1. GitHubリポジトリの **Settings** タブを開く
2. 左メニューから **Pages** を選択
3. **Source** で `Deploy from a branch` を選択
4. **Branch** で `main` を選択、フォルダは `/ (root)` を選択
5. **Save** をクリック

### 3. カスタムドメインの設定（kuucorp.com）

#### DNSの設定

お使いのドメインレジストラまたはDNSプロバイダで以下を設定：

**Aレコード（apex domain: kuucorp.com）:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAMEレコード（www.kuucorp.com → YOUR_USERNAME.github.io）**

#### GitHubでの設定

1. リポジトリの **Settings** → **Pages**
2. **Custom domain** に `kuucorp.com` を入力
3. **Enforce HTTPS** にチェック

#### CNAMEファイルの追加

このリポジトリのルートに `CNAME` ファイルを作成：
```
kuucorp.com
```

## ディレクトリ構成

```
kuu-website/
├── index.html          # トップページ
├── css/
│   └── style.css       # スタイルシート
├── img/
│   ├── logo.svg        # ロゴ
│   ├── sphere.svg      # 背景装飾
│   └── favicon.svg     # ファビコン
├── about/
│   └── index.html      # 企業情報ページ
├── news/
│   └── index.html      # ニュースページ
├── privacy_policy/
│   └── index.html      # プライバシーポリシー
├── CNAME               # カスタムドメイン設定
└── README.md           # このファイル
```

## ローカルでの確認

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx serve
```

ブラウザで `http://localhost:8000` を開いて確認できます。

## 更新方法

1. ファイルを編集
2. `git add .`
3. `git commit -m "更新内容"`
4. `git push`

GitHub Pagesは自動的に更新されます（通常1〜2分）。

## 技術スタック

- HTML5
- CSS3（CSS Variables使用）
- Vanilla JavaScript（モバイルメニューのみ）
- Google Fonts（Outfit, Noto Sans JP）

## ライセンス

© 2022 Kuu株式会社 All Rights Reserved.
