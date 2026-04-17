@AGENTS.md

# ブログ記事自動生成ガイドライン

## 概要

`content/blog/topic-queue.json` のトピックキューからブログ記事を自動生成し、mainブランチにpushする。
pushすると GitHub Actions (deploy.yml) が自動でビルド・デプロイする。

## 生成フロー

1. `content/blog/topic-queue.json` を読む
2. `status: "queued"` の先頭トピックを取得
3. 既存の `content/blog/*.mdx` ファイル名を確認し、slugが重複しないことを検証
4. トピック情報（keyword, title_hint, persona, service_link）に基づきMDX記事を生成
5. バリデーション（下記基準をすべて満たすこと）
6. MDXファイルを `content/blog/{slug}.mdx` に保存
7. topic-queue.json の該当トピックの status を `"published"` に更新
8. `git add content/blog/ && git commit && git push origin main`

キューが空（全トピックが published）の場合は `keyword_bank` から自動選定してslugを生成する。

## 記事の文体・構成ルール

### ブランドボイス
- Kuu株式会社はAIエージェントガバナンスサービスを提供するエージェントガバナンス専門会社
- ターゲット読者: 日本の中小企業の経営者・管理職・IT担当者
- トーン: 断定的・実務的。「〜でしょう」より「〜です」
- 日本語で書く。英語の専門用語は初出時のみ括弧で説明

### MDXフォーマット

```mdx
---
title: "記事タイトル（SEOキーワードを含む）"
description: "120字以内の要約（検索結果に表示される）"
date: "YYYY-MM-DD"
lastModified: "YYYY-MM-DD"
tags: ["タグ1", "タグ2", "タグ3"]
author: "kuu-editorial"             # or "fujihira-kento"（content/authors/*.json と対応、未指定時はkuu-editorial）
pillar: "ai-governance"              # 任意。関連ピラーページのslug
series: "agent-governance-basics"    # 任意。シリーズ名
series_order: 3                       # 任意。シリーズ内順序
---

[本文]
```

### 構成ルール
- 見出しはH2（##）とH3（###）のみ使う
- 冒頭3行で読者の具体的な課題を示す（フック）
- **各H2の直下に40〜60字のDirect-Answer Block (DAB) を置く**（LLMO/GEO/AEO施策）。`> ` で始まるblockquote 1段落で書く。CSS側で `ANSWER` ラベルが自動付与 + JSON-LD `Speakable` で AI Overviews / 音声応答の引用最適化
- DAB例:
  ```mdx
  ## AIエージェントとは何か

  > AIエージェントは、目標を与えれば自律的に計画・ツール使用・実行まで完結するAIシステムです。2025年以降、中小企業でも Managed Agents モデルの普及で本格導入が始まっています。

  [本文...]
  ```
- DABのルール: 40-60字 / 句点込み / 数値または固有名詞を1つ以上 / 「まとめ」H2 には入れない
- 具体的な数値・事例・ステップを含める
- リスト（-）と番号付きリスト（1.）を適切に使う
- 最後のH2は「まとめ」にし、Kuuへの問い合わせCTAで締める
- 記事中に https://kuucorp.com{service_link} へのリンクを1回以上含める
- 用語の初出では /glossary/ 配下の該当用語ページへの内部リンクを検討する（例: [エージェントガバナンス](/glossary/agent-governance/)）
- 関連する既存記事があれば内部リンクを追加する
- ピラーページ (/ai-governance/ 等) と関連する場合は、frontmatter の `pillar` を設定し本文冒頭でピラーへのリンクを含める

### 禁止事項
- 以下のフレーズは使わない: 「以上のことから」「このように」「昨今」「今後も」「いかがでしたでしょうか」
- 冒頭で「今回は〜について解説します」のような導入は使わない
- 英語が本文の15%を超えない
- 根拠のない数値の捏造はしない（「事例では〜という報告がある」等、出典を曖昧にしない表現にする）

## バリデーション基準

生成した記事は以下をすべて満たすこと。満たさない場合はコミットしない。

- [ ] frontmatter 必須4フィールド完備（title, description, date, tags）
- [ ] description が120字以内
- [ ] tags が1〜4個
- [ ] 本文が1,600〜2,400字
- [ ] H2が3個以上
- [ ] 各H2直下にDirect-Answer Block（40〜60字）を配置
- [ ] サービスページへのリンクが1箇所以上
- [ ] 禁止フレーズが含まれていない
- [ ] 既存slugと重複していない
- [ ] 任意: author 指定、pillar / series / series_order は該当する場合のみ設定

## 品質リファレンス

既存の3記事を品質の基準として参照すること:
- `content/blog/what-is-ai-agent.mdx` — 入門系の構成例
- `content/blog/why-agent-governance.mdx` — 課題提起→解決策の構成例
- `content/blog/sme-ai-getting-started.mdx` — ステップ解説の構成例

## Gitコミット

```
git add content/blog/
git commit -m "blog: {slug} を自動生成"
git push origin main
```
