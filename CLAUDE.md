@AGENTS.md

# コンテンツの振り分け（Blog と Case）

新規コンテンツは内容によって Blog と Case に振り分ける。

- **Blog（`/blog/`）**: 技術トレンド・知識・概念解説・ガバナンス論・規制（EU AI Act 等）など、**知識的な示唆**を与える記事。
- **Case（`/case/`）**: 製造・小売・不動産・医療・飲食・物流・人事・建設・士業・コスト/ROI など、**業務/業種別の具体的なユースケース**。「こういう使い方もできる」という提案として、事業への実装イメージを示す。

→ **業務/業種別ユースケースは今後すべて Case で作成する**（Blog では作らない）。Blog 既存の業種記事は据え置き。Case の作り方は本ファイル後半「Case ユースケース自動生成ガイドライン」を参照。

# ブログ記事自動生成ガイドライン

## 概要

`content/blog/topic-queue.json` のトピックキューからブログ記事を自動生成し、mainブランチにpushする。
pushすると GitHub Actions (deploy.yml) が自動でビルド・デプロイする。

## 生成フロー

1. `content/blog/topic-queue.json` を読む
2. `status: "queued"` の先頭トピックを取得
3. 既存の `content/blog/*.mdx` ファイル名を確認し、slugが重複しないことを検証
4. **技術関連性チェック**: トピックの `track`（後述の技術タクソノミ）が設定され、いずれかに明確に該当することを確認する。業務・業種・ROI・コスト主題なら生成を中止し、Case 側の領域とする（「ブログのスコープと棲み分け」を参照）
5. **リサーチプロトコル**（後述「リサーチプロトコル」）を実行し、一次情報源を確認して topic と frontmatter の `sources` に記録する
6. トピック情報（keyword, title_hint, persona, service_link, audience, track, tech_depth, target_query, sources）に基づきMDX記事を生成
7. バリデーション（下記基準をすべて満たすこと）
8. MDXファイルを `content/blog/{slug}.mdx` に保存
9. topic-queue.json の該当トピックの status を `"published"` に更新
10. `git add content/blog/ && git commit && git push origin main`

キューが空（全トピックが published）の場合は `keyword_bank`（track別オブジェクト）から自動選定する。その際は `node scripts/blog-coverage-report.mjs` を実行し、track×audience マトリクスで**本数の少ない（空きの大きい）トラック・読者層を優先**して keyword を選び、slugを生成する。

## ブログのスコープと棲み分け

> ブログは**技術コンテンツ専用**メディアです。エージェントアーキテクチャ、MCP/A2A 等のプロトコル、コンテキストエンジニアリング、評価・可観測性、セキュリティの内部実装、モデル能力、プラットフォーム/基盤、技術レベルのガバナンス機構を扱います。業務・業種・ROI・コスト・補助金・導入事例は Case / Case Studies が担当します。

- **Blog（このルーティン）= 技術**: 仕組み・設計・実装・プロトコル・評価手法など「どう動くか／どう作るか」。
- **`/case/`（ユースケース集）= 業務**: 外部トレンドや業種別の活用パターンの編集的アグリゲーション。
- **`/case-studies/`（導入事例）= 業務＋実績**: クライアント実装の定量ROI（工数削減%・品質向上 等）。

### 行き先の決定ルール

| この記事の主題は？ | 行き先 |
|---|---|
| 仕組み・設計・実装・プロトコル・評価手法 | **Blog** |
| 特定業種での活用・ROI・コスト・体制論・人材/採用 | Case / Case Studies |
| クライアント実装の定量結果 | Case Studies |

判定基準: その記事に技術タクソノミ（`track`）を1つ明確に割り当てられるか。割り当てられなければブログ対象外（Case へ）。

### 技術タクソノミ（`track`）

`architecture`（アーキテクチャ）/ `protocols`（MCP・A2A等）/ `security`（セキュリティ内部実装）/ `evaluation`（評価・可観測性）/ `platform-infra`（プラットフォーム・基盤）/ `governance-tech`（技術的ガバナンス機構）/ `model-capability`（モデル能力）

> 業務・業種・ROI寄りの既存記事（製造/小売/不動産/医療/飲食/物流/人事 ほか）は**移行せず据え置く**（URL・被リンク維持）。本ルーティンは「今後の新規生成」を技術特化に転換する forward-only 方針。

## 記事の文体・構成ルール

### ブランドボイス
- Kuu株式会社はAIエージェントガバナンスサービスを提供するエージェントガバナンス専門会社
- トーン: 断定的・実務的。「〜でしょう」より「〜です」。技術メディアとして、原理・設計判断・トレードオフを明示する
- 日本語で書く。英語の専門用語は初出時のみ括弧で説明

#### 読者層（`audience` で出し分け）

ターゲットは **SMB と エンタープライズの2層**。トピックの `audience` フィールドで文体・前提知識・CTAを分岐する。

- **`audience: "smb"`** — 中小企業のIT担当・DX推進担当。前提知識は中程度。具体的なツール名と着手手順を重視。CTAは `/services/ai-ops/`（運用管理）または `/services/ax-dx/`（変革）。
- **`audience: "enterprise"`** — 大企業のプラットフォームエンジニア／セキュリティアーキテクト／SRE／情報システム部門。スケール・IAM/SSO/SCIM・データレジデンシー・VPC/オンプレ・LLMゲートウェイ・AI FinOps・マルチチーム統制・調達/ベンダーリスク・大規模コンプライアンスを前提に書く。「中小企業」前提のフックは使わない。CTAは `/services/rde/`。
- **`audience: "both"`** — 技術原理は共通で書き、本文末尾（「まとめ」の前）に H3「規模別の留意点（SMB / エンタープライズ）」を置く。CTAは `/services/ai-ops/` を主、本文中で「大規模なら RDE」と `/services/rde/` を副リンク。

#### 著者の割り当て（frontmatter `author`）
- `kuu-engineering` — `tech_depth: "deep"` の深い技術記事（アーキテクチャ・プロトコル・セキュリティ・評価・基盤）
- `fujihira-kento` — 戦略・経営寄りの技術記事（代表の視点）
- `kuu-editorial` — 上記以外（未指定時のデフォルト）

#### service_link マッピング（`audience` 連動）

| audience | service_link |
|---|---|
| `enterprise` | `/services/rde/` |
| `smb` | `/services/ai-ops/` または `/services/ax-dx/` |
| `both` | `/services/ai-ops/` を主＋本文で `/services/rde/` を副リンク |

### MDXフォーマット

```mdx
---
title: "記事タイトル（SEOキーワードを含む）"
description: "120字以内の要約（検索結果に表示される）"
date: "YYYY-MM-DD"
lastModified: "YYYY-MM-DD"
tags: ["タグ1", "タグ2", "タグ3"]
author: "kuu-engineering"           # kuu-engineering / fujihira-kento / kuu-editorial（content/authors/*.json と対応、未指定時はkuu-editorial）
audience: "enterprise"              # smb / enterprise / both（topicと一致させる）
track: "security"                  # 技術タクソノミ（architecture/protocols/security/evaluation/platform-infra/governance-tech/model-capability）
tech_depth: "deep"                 # intro / intermediate / deep
sources:                            # リサーチプロトコルで確認した一次情報源（最低2件）
  - "https://modelcontextprotocol.io/specification"
  - "https://www.anthropic.com/engineering/building-effective-agents"
pillar: "ai-governance"              # 任意。関連ピラーページのslug
series: "agent-governance-basics"    # 任意。シリーズ名
series_order: 3                       # 任意。シリーズ内順序
---

[本文]
```

> `audience` / `track` / `tech_depth` / `sources` は frontmatter にも必ず転記する（カバレッジ計測・検証が frontmatter から行えるようにするため）。これらのフィールドはレンダリング側 (`src/lib/mdx.ts`) では現状読まれないため、追加してもビルドには影響しない。

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
- DABのルール: 40-60字 / 句点込み / 数値または固有名詞を1つ以上 / 「まとめ」「参考」H2 には入れない
- 具体的な数値・事例・ステップ・コードや設定例（該当する場合）を含める。`enterprise` 記事はスケール・統制の観点を、`smb` 記事は着手手順を厚くする
- リスト（-）と番号付きリスト（1.）を適切に使う
- **本文末尾の「まとめ」H2 の直前に `## 参考` H2 を置き、リサーチプロトコルで確認した `sources` をタイトル + リンクの箇条書きで列挙する**（最低2件）
- 最後のH2は「まとめ」にし、Kuuへの問い合わせCTAで締める
- 記事中に https://kuucorp.com{service_link} へのリンクを1回以上含める
- 用語の初出では /glossary/ 配下の該当用語ページへの内部リンクを検討する（例: [エージェントガバナンス](/glossary/agent-governance/)）
- 関連する既存記事があれば内部リンクを追加する
- ピラーページ (/ai-governance/ 等) と関連する場合は、frontmatter の `pillar` を設定し本文冒頭でピラーへのリンクを含める

### 禁止事項
- 以下のフレーズは使わない: 「以上のことから」「このように」「昨今」「今後も」「いかがでしたでしょうか」
- 冒頭で「今回は〜について解説します」のような導入は使わない
- 英語が本文の15%を超えない（コードブロック・プロトコル名・API名・製品固有名詞はこの割合に含めない）
- 根拠のない数値・仕様の捏造はしない。**数値や技術仕様は `sources` で裏付けられるもののみ記載する**（裏付けられない数値は書かない）

## リサーチプロトコル（執筆前に必須）

> 記事を書く前に WebSearch / WebFetch で一次情報を確認し、確認したURLを `sources` に記録します。これにより静的な keyword_bank だけに依存せず、最新の仕様・事実に基づいた技術記事を生成します。

1. 執筆前に **WebSearch / WebFetch を最低3クエリ**実行し、トピックの `target_query` と `keyword` の現状・一次情報・公式ドキュメントを確認する。
2. **一次情報源を優先する**: Anthropic / OpenAI / Google などの公式ドキュメント、MCP・A2A 等のプロトコル仕様、ISO/IEC 42001・EU AI Act の原文。ブログ・まとめサイトは裏取り用途のみで、本文の根拠にはしない。
3. 確認したURLを topic の `sources` と frontmatter の `sources:` の双方に記録する（最低2件）。
4. 本文の数値・仕様は `sources` で裏付けられる範囲に限定する（禁止事項の捏造禁止ルールの強化）。
5. 任意: Google Search Console のエクスポートCSVが `data/` 等にあれば、keyword_bank の優先順位付けの参考に使ってよい（必須ではない）。

## バリデーション基準

生成した記事は以下をすべて満たすこと。満たさない場合はコミットしない。

- [ ] frontmatter 必須フィールド完備（title, description, date, tags, **audience, track, tech_depth**）
- [ ] description が120字以内
- [ ] tags が1〜4個
- [ ] 本文が1,600〜2,400字
- [ ] H2が3個以上
- [ ] 各H2直下にDirect-Answer Block（40〜60字）を配置（「まとめ」「参考」を除く）
- [ ] サービスページへのリンクが1箇所以上
- [ ] 禁止フレーズが含まれていない
- [ ] 既存slugと重複していない
- [ ] **技術関連性**: 記事の主題が `track` enum のいずれかに明確に該当する（業務・業種・ROI主題なら生成中止し Case へ）
- [ ] **重複チェック**: 既存 `content/blog/*.mdx` の slug・title・`target_query` と意味的に重複しない。`node scripts/blog-coverage-report.mjs` で同 `track`×`audience` の既存本数を確認した
- [ ] **audience フレーミング**: `enterprise` 記事に「中小企業」前提のフックや語り口を混ぜていない／`smb` 記事が過度に専門的になっていない
- [ ] **`## 参考` H2 が存在し、`sources` を最低2件掲載**している（リサーチプロトコル準拠）
- [ ] `service_link` が `audience` のマッピングに沿う（`enterprise` → `/services/rde/`）
- [ ] 任意: author 指定、pillar / series / series_order / glossary_refs は該当する場合のみ設定

## 品質リファレンス

技術記事の品質基準として、深い技術記事を参照すること:
- `content/blog/agent-harness-architecture.mdx` — アーキテクチャ解説の構成例（`track: architecture`）
- `content/blog/ai-agent-permission-management-design.mdx` — セキュリティ設計の構成例（`track: security`）
- `content/blog/vertex-ai-agent-builder-vs-bedrock-agentcore.mdx` — 技術比較の構成例（`track: platform-infra`）

文体・DAB・内部リンクの基本形は次の旧記事も参照可（ただし「中小企業」一辺倒の読者設定は新方針に合わせて `audience` で調整する）:
- `content/blog/what-is-ai-agent.mdx` / `content/blog/why-agent-governance.mdx`

## Gitコミット

```
git add content/blog/
git commit -m "blog: {slug} を自動生成"
git push origin main
```

## 依存ファイル変更時の注意

`package.json` を編集して依存を追加・更新・削除した場合は、**必ず同じコミットに `pnpm-lock.yaml` の更新も含める**こと。

```
pnpm install          # lockfile を package.json と同期
git add package.json pnpm-lock.yaml
git commit -m "..."
```

CI (`.github/workflows/deploy.yml`) は `pnpm install --frozen-lockfile` を使うため、両者がズレているとビルドが `ERR_PNPM_OUTDATED_LOCKFILE` で失敗し、サイト全体のデプロイが止まる。ブログ自動生成のフローでは通常 `package.json` を触らないが、テンプレート改善や新スクリプト追加で依存を増やしたときは要注意。

# Case ユースケース自動生成ガイドライン

## 概要

`content/case/case-topic-queue.json` のキューから **業務/業種別の具体ユースケース**を自動生成し、mainブランチにpushする。Blog とは別系統で毎日1本ペースで回す。Case は「実績事例」ではなく「**こういう使い方もできる**」という提案コンテンツ。実在企業・実績を装わない。

## 生成フロー

1. `content/case/case-topic-queue.json` を読む
2. `status: "queued"` の先頭トピックを取得
3. 既存の `content/case/*.mdx` と slug が重複しないことを検証
4. 「**調査 → 需要特定 → 用途考案 → コンテンツ化**」の流れで内容を構成:
   - ① 調査: 対象業務/業種における最新のAI活用トレンド・公開情報を踏まえる
   - ② 需要特定: その業務のボトルネック（工数偏在・属人化等）を特定
   - ③ 用途考案: 最新モデル/機能を活用した実装イメージを考案
   - ④ コンテンツ化: 下記フォーマットの MDX に落とす
5. バリデーション（下記）を満たすこと
6. `content/case/{slug}.mdx` に保存
7. case-topic-queue.json の該当トピックの status を `"published"` に更新
8. `git add content/case/ && git commit -m "case: {slug} を自動生成" && git push origin main`

キューが空（全て published）の場合は `keyword_bank` から未使用テーマを選定して slug を生成する。

## MDX フロントマター（リッチスキーマ）

```mdx
---
title: "（提案調のタイトル。「事例」ではなく「こうできる」）"
description: "120字以内。検索結果に表示される要約"
date: "YYYY-MM-DD"
lastModified: "YYYY-MM-DD"
tags: ["ユースケース", "（業種）", "（業務）"]
industry: "（想定業種）"
use_case: "（想定する業務ユースケース）"
fictional: true
objectives:        # 想定する課題（3項目程度）
  - "..."
measures:          # アプローチ（3項目程度）
  - "..."
effects:           # 期待できること（3項目程度。「目安」と分かる表現に）
  - "..."
metrics:           # KPIカード（2〜3枚。value は "-80%" 等、label は説明）
  - value: "-80%"
    label: "（想定の効果指標）"
company_profile:   # 想定される導入シーン（label/value 4行程度）
  - label: "想定業種"
    value: "..."
persona_voice:     # 現場で想定されるニーズ（実績の声ではなく「〜できたら」）
  quote: "..."
  attribution: "想定ペルソナ：（役職）"
models_used:       # 活用した最新モデル・機能
  - "..."
sources:           # 調査の出典・需要根拠（公開情報ベース、出典を曖昧にしない）
  - "..."
future_outlook: "今後の展望（次の発展段階）"
---

[本文]
```

## 本文の構成・文体ルール

- 見出しは H2（##）／H3（###）のみ。本文冒頭に DAB（`> ` で始まる40〜60字の blockquote）を1つ置く
- H2 は「① 最新情報の調査」「② 需要の特定」「③ 用途の考案（実装イメージ）」「④ 設計・運用のポイント」を基本構成にする
- トーンは**提案調**（「〜できます」「こういう使い方もできる」）。**「何が変わったか」のような実績・事例調にしない**
- 数値は「目安」「想定」と分かる表現にし、特定の実績と誤認させない
- 末尾CTAは本文に書かず、テンプレート側（詳細ページ）の「無料相談」導線に集約する
- 禁止フレーズはブログと同じ（「以上のことから」「このように」「昨今」「今後も」「いかがでしたでしょうか」）

## バリデーション基準

- [ ] frontmatter 必須: title / description（120字以内）/ date / tags（1〜4個）
- [ ] objectives / measures / effects を各2項目以上
- [ ] metrics 2枚以上、company_profile 3行以上、persona_voice あり、sources 1件以上
- [ ] 本文に DAB を1つ配置、H2 が3個以上、本文 1,200〜2,400字
- [ ] 提案調で、実績・実在企業を装っていない
- [ ] 既存 slug と重複していない

## 品質リファレンス

- `content/case/sample-meeting-minutes-agent.mdx`（議事録ユースケースの構成例）
- `content/case/contract-review-agent.mdx` / `manufacturing-quality-report-agent.mdx` / `ec-customer-support-agent.mdx`（業種別の構成例）

## Gitコミット

```
git add content/case/
git commit -m "case: {slug} を自動生成"
git push origin main
```
