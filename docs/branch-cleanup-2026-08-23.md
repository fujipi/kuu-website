# ブランチ整理記録（2026-08-23）

リモートの作業ブランチ **116 本を全削除**した際の復元用記録。削除時点の `main` は `283ac3d89ad8e318282ab3baf92bc27a0f636c6f`。

## 経緯

リポジトリに 116 本の作業ブランチが残留していた。整理にあたり、全ブランチについて以下を機械的に確認した。

- **オープン PR はゼロ**（PR #1〜#125 はすべて closed）。レビュー中の作業を巻き込む恐れがないことを確認した。
- 各ブランチが `main` に取り込み済みかを `git merge-base --is-ancestor` と `git cherry` で判定した。
- 未マージ扱いのブランチについては、`main` に存在しないファイルを列挙し、さらにそのパスが **`main` の履歴に一度でも存在したか**を `git rev-list -1 main -- <path>` で確認した。履歴にあれば「意図的に削除・改名された旧パス」であり、失われるものではない。

その結果、削除対象は次の3群に分かれた。

| 群 | 本数 | 判定 |
|---|---|---|
| A | 66 | `main` に完全内包（ancestor）。削除による損失なし |
| B | 35 | squash マージ等。固有ファイルはすべて `main` の履歴に存在 |
| C | 15 | `main` に一度も入っていない記事を1本ずつ保持 |

C 群 15 本は PR #97〜#121 の滞留事故（CLAUDE.md 記載）で生成され、**PR #122 がテーマ重複と判定して破棄した記事**にあたる。15 本すべてについて `main` 側に同テーマの記事が存在することを確認したうえで削除した（例: `computer-use-*` 系は `main` に3本、`shuro-keizoku-shien-b-agent` は `disability-work-support-record-agent` が対応）。

## 復元方法

削除したブランチは SHA が分かれば復元できる。

```
git push origin <SHA>:refs/heads/<ブランチ名>
```

記事ファイル1本だけを取り出したい場合は次のようにする。

```
git fetch origin <SHA>
git show <SHA>:content/blog/<slug>.mdx > content/blog/<slug>.mdx
```

> GitHub 側で到達不能オブジェクトが GC された後は復元できない。C 群の記事が必要になった場合は早めに取り出すこと。

## C群: `main` 未収録の記事を持つブランチ（15本）

| ブランチ | SHA | 未収録ファイル | PR |
|---|---|---|---|
| `blog/ai-management-meeting-report-automation` | `4805a090226df98cacf214d8a631bfdba38df0b6` | `content/blog/ai-management-meeting-report-automation.mdx` | #42(未マージclose) |
| `claude/eloquent-cerf-3ny5k8` | `ac1ac140a99ca4c079dc9e041bffce3fb68158a0` | `content/blog/computer-use-agent-smb-screen-automation.mdx` | #100(未マージclose) |
| `claude/eloquent-cerf-4gx0z3` | `44ec2a93d3db4f18372c989ad5867af5dcc7bdde` | `content/blog/computer-use-smb-automation-patterns.mdx` | #112(未マージclose) |
| `claude/eloquent-cerf-dt8wuy` | `657e052b771b54d804ec84e65a33f0d18393da75` | `content/blog/claude-vision-document-processing-design-smb.mdx` | #109(未マージclose) |
| `claude/eloquent-cerf-eyyh23` | `3583cc087ec8ddc0b848311ab32a9e0b529cbc07` | `content/blog/agent-skills-progressive-disclosure-design-smb.mdx` | #106(未マージclose) |
| `claude/eloquent-cerf-gc9851` | `eec96e32e1e2d18cb4473cc6b50f8f7a04cb9987` | `content/blog/claude-sonnet5-smb-business-guide.mdx` | #118(未マージclose) |
| `claude/eloquent-cerf-jb4yt0` | `6542fc0eabd36be2b6e33fe617d3161fb3893715` | `content/blog/claude-vision-pdf-processing-smb.mdx` | #116(未マージclose) |
| `claude/eloquent-cerf-m7jq5o` | `dcf1e3361b9e26a2fd7af4b494d9f8f3b3877e66` | `content/blog/claude-5-family-model-selection-smb.mdx` | #114(未マージclose) |
| `claude/kind-darwin-9r8mi5` | `59fe344fb9cb67567a67bcc7859b6c98232ea28b` | `content/blog/claude-sonnet5-business-guide-sme.mdx` | #108(未マージclose) |
| `claude/kind-darwin-mok76z` | `1db3afeb47e217b11935e7dd1e846486c975dc2e` | `content/blog/computer-use-tool-smb-adoption-guide.mdx` | #111(未マージclose) |
| `claude/kind-darwin-o9ac7k` | `a3187f7abd5e04af8577e6a4d90f5be27386eaf9` | `content/blog/claude-sonnet5-smb-agent-guide.mdx` | #105(未マージclose) |
| `claude/kind-darwin-pma1i9` | `acc151c172c506ab01ba3bc6de87d1320847f818` | `content/blog/computer-use-multimodal-agent-smb-guide.mdx` | #99(未マージclose) |
| `claude/kind-darwin-x85viz` | `71442c0bf9f0fd0e5cce135bcc8389d681cf264a` | `content/blog/claude-native-pdf-processing-smb.mdx` | #115(未マージclose) |
| `claude/nifty-knuth-63g8x8` | `7ec652069d7a8028ad5c0162a813b38f3925f4bb` | `content/case/shuro-keizoku-shien-b-agent.mdx` | #101(未マージclose) |
| `claude/nifty-knuth-kgtxji` | `04fc4eedf47570fdc220cea5de20e7c061dffc36` | `content/case/recycle-shop-purchase-agent.mdx` | #113(未マージclose) |

## A群・B群: main に取り込み済みのブランチ（101本）

| ブランチ | SHA | 判定 | 最終コミット | PR |
|---|---|---|---|---|
| `auto/case-shihoshoshi-registration-agent` | `10ea5620b4390ccde035bc0c4300bc33f37520a4` | B: 内容は main 履歴にあり | 2026-07-05 | #87 |
| `blog/function-calling-tool-design` | `92d8f013543ffca4aa461906063a0efcc3f98942` | B: 内容は main 履歴にあり | 2026-06-09 | #77 |
| `claude/about-align-with-top` | `3addf069fdf3863b8540b892a2b8ae1770075893` | A: main に内包 | 2026-05-29 | #64 |
| `claude/add-security-policy` | `da538df25031ee7961e951357ed3a78a720448d4` | A: main に内包 | 2026-05-20 | #50 |
| `claude/amazing-ramanujan-OafSL` | `f1552161033ad52cc67046efe5de536ff731830c` | B: 内容は main 履歴にあり | 2026-06-03 | #75 |
| `claude/blog-case-seo-aeo-linking-6h9z8t` | `6a933a9b691e810fa2976b308151dd99cc864643` | B: 内容は main 履歴にあり | 2026-08-06 | #96 |
| `claude/blog-cta-service-link-sme-getting-started` | `4e41d1488a52f59d1680edd2aaed8e5d295d313c` | A: main に内包 | 2026-04-27 | #41 |
| `claude/blog-pagination` | `43a4b39bfad79d1dc80525d6dcc89e809478f4b6` | A: main に内包 | 2026-05-19 | #49 |
| `claude/blur-accenture-mention` | `ade1a1b6a91bcc5a3696dcd3a50d9f3e4ab6b804` | A: main に内包 | 2026-05-29 | #60 |
| `claude/case-rich-template` | `c8185fadb3aa94ffaab4b8280152bda21e30d36b` | A: main に内包 | 2026-05-29 | #66 |
| `claude/case-routine-and-merge` | `7dd1ad2e0c38d8d3398c51beb35326c97fa5c976` | A: main に内包 | 2026-05-29 | #69 |
| `claude/case-tone-proposal` | `af1b15f6cccf5c2cfd1b8469c80c0519be60ea8c` | A: main に内包 | 2026-05-29 | #67 |
| `claude/claudemd-case-studies-cleanup` | `dd361883a02ced6a98051910d0faa07678f755e9` | A: main に内包 | 2026-05-29 | #70 |
| `claude/dazzling-albattani-IAbmm` | `cf3d94db04f319dd775ad37f5759e390f4bc360b` | B: 内容は main 履歴にあり | 2026-06-02 | #68,#72,#74 |
| `claude/eloquent-cerf-03stbj` | `0757ad1b4bbef39298fdbb6a9cef64395cdbd3e2` | B: 内容は main 履歴にあり | 2026-08-07 | #94 |
| `claude/eloquent-cerf-0f5q4i` | `efde11559b3cc9e5910f2915372fe1ede0338105` | B: 内容は main 履歴にあり | 2026-08-07 | #92 |
| `claude/eloquent-cerf-39v9hi` | `3864fc97a885e4e9c5b467ea3e0b4ce0737b6907` | A: main に内包 | 2026-08-16 | —（main 直 push ルーティンの outcome branch） |
| `claude/eloquent-cerf-dpe9t9` | `283cecd18c5fe557a638513ff1e73facb12c21e8` | B: 内容は main 履歴にあり | 2026-08-09 | #103(未マージclose) |
| `claude/eloquent-cerf-o9ciq9` | `a080aa598a9512305de8ed59aa21110225f9a434` | B: 内容は main 履歴にあり | 2026-08-07 | #97(未マージclose) |
| `claude/eloquent-cerf-rclhrx` | `885fe190783610885fab05079f5a9fd5ab9a04a8` | A: main に内包 | 2026-08-06 | —（main 直 push ルーティンの outcome branch） |
| `claude/eloquent-cerf-tlxg52` | `d53ee6f03ea013a3c9599e54dfe27cd9c8dee24e` | B: 内容は main 履歴にあり | 2026-08-06 | #91 |
| `claude/enhance-kuu-seo-content-Yf7EX` | `754da31d45ac197e4f3d0cb97e6faad466e6b45a` | A: main に内包 | 2026-04-17 | #30,#32,#33 |
| `claude/enhance-seo-optimization-hbN1U` | `4da979f275d1674dfb00069d05ab5136920ef38c` | A: main に内包 | 2026-04-16 | #28 |
| `claude/epic-mccarthy-AF0kJ` | `00c67dd11c841b5ab4a18fe4071a837eb21f3713` | A: main に内包 | 2026-05-28 | #56,#57,#58 |
| `claude/exciting-pasteur-1lf4x3` | `adaf5acbe029c5b36c57e51ceec965a19f853a46` | A: main に内包 | 2026-08-20 | —（main 直 push ルーティンの outcome branch） |
| `claude/exciting-pasteur-9gl784` | `283ac3d89ad8e318282ab3baf92bc27a0f636c6f` | A: main に内包 | 2026-08-23 | —（main 直 push ルーティンの outcome branch） |
| `claude/exciting-pasteur-kbd9jy` | `ebcd15364644c917e3a6f6b2dc1f2a1d163b101b` | A: main に内包 | 2026-08-21 | —（main 直 push ルーティンの outcome branch） |
| `claude/exciting-pasteur-r939c6` | `64781dae440eda641ad2b73f1056cca74bfd61df` | A: main に内包 | 2026-08-22 | —（main 直 push ルーティンの outcome branch） |
| `claude/exciting-pasteur-uoq0ch` | `6d2007bb02a74b6a4a856607215c25f6cd59241b` | A: main に内包 | 2026-08-18 | —（main 直 push ルーティンの outcome branch） |
| `claude/exciting-pasteur-zvlk8b` | `9dc88abee1ef49e7395b56051bc04bdf1946ee29` | A: main に内包 | 2026-08-19 | —（main 直 push ルーティンの outcome branch） |
| `claude/fix-blog-fade-observer` | `99f5ba888679148a9bf3ce7b0fd50ddb9b0e735d` | A: main に内包 | 2026-05-19 | #48 |
| `claude/fix-blog-tag-filtering-dyd4P` | `85cd55db04203c41c6db928072531c39797f20e3` | A: main に内包 | 2026-04-24 | #34 |
| `claude/fix-ci-lint` | `5912f8aa94adc95305ba1d886a63509f08e7d78e` | A: main に内包 | 2026-05-29 | #62 |
| `claude/fix-ci-node-version` | `dc025df0a0b9fc5c7cf249ba6e659747aa5affb6` | A: main に内包 | 2026-05-14 | #44 |
| `claude/fix-mobile-blog-layout-McJxS` | `a3eff8a6c18644d777b9dac377dc0f49a5944415` | A: main に内包 | 2026-04-17 | #29 |
| `claude/fix-pnpm-lockfile` | `6741917215c6578a39552dba327ac8c1de7d375b` | A: main に内包 | 2026-04-27 | #39 |
| `claude/fix-postbuild-output-target` | `311ab779ff8e5895535d04f64d3e8a39dd84b0d0` | A: main に内包 | 2026-04-27 | #38 |
| `claude/fix-security-action-image` | `e4d163e78cd12c9e9d721f63f5afa99ca1e5956a` | A: main に内包 | 2026-05-24 | #54 |
| `claude/footer-security-action` | `f15f9080f134edc97a3ba5dd61ee05b4d1a0c846` | A: main に内包 | 2026-05-24 | #53 |
| `claude/gifted-meitner-srtmqp` | `c6a17b3e69053f14790fd277c0172ab7efb73d58` | B: 内容は main 履歴にあり | 2026-06-25 | #83 |
| `claude/great-brahmagupta-nxj2bj` | `1153e64c7638e512f0da777fdd429d0ec243e981` | B: 内容は main 履歴にあり | 2026-06-25 | #82,#84 |
| `claude/hero-perf-refactor` | `ae4336321f952046bb0923e5ee50926474e9160e` | A: main に内包 | 2026-05-28 | #59 |
| `claude/improve-search-620efe` | `a46b97f43cba85dc49d8fdac740e30a953b32687` | B: 内容は main 履歴にあり | 2026-07-24 | #88 |
| `claude/keen-brahmagupta-a18ng1` | `3a47f9dd1dd3485bcce441c21c9258bab5156e86` | B: 内容は main 履歴にあり | 2026-06-10 | #79,#80 |
| `claude/kind-darwin-52g48s` | `83b7e829975e51a82c2b1a03d7de5f63f1bce1a8` | A: main に内包 | 2026-08-04 | —（main 直 push ルーティンの outcome branch） |
| `claude/kind-darwin-9oq6x7` | `7a9f03cbbfd2d56e3bb8036dea5240be95f44e4d` | B: 内容は main 履歴にあり | 2026-08-09 | #102(未マージclose) |
| `claude/kind-darwin-b0fz8x` | `ba23f83596f8c0501554a6aff4289734532036d2` | B: 内容は main 履歴にあり | 2026-08-07 | #93 |
| `claude/kind-darwin-f7vzwk` | `f24b08c6ad5722b953c60a721e83277365e3fc47` | B: 内容は main 履歴にあり | 2026-08-15 | #117(未マージclose) |
| `claude/kind-darwin-j81je5` | `0ad3e1ed40410c39dcff10214803319c36c13328` | B: 内容は main 履歴にあり | 2026-08-16 | #119(未マージclose) |
| `claude/kind-darwin-orkblc` | `9b347ee7e7a95a5b5c000dd90182364ae39d2ea1` | A: main に内包 | 2026-08-07 | —（main 直 push ルーティンの outcome branch） |
| `claude/kind-darwin-qs3ju2` | `f13c10c8a3cf6e19ecc76357ec0e00967b457821` | B: 内容は main 履歴にあり | 2026-08-17 | #121(未マージclose) |
| `claude/kind-darwin-tnnkrh` | `647d24298d3413217c05a7a62214131e80b44548` | A: main に内包 | 2026-08-06 | —（main 直 push ルーティンの outcome branch） |
| `claude/kind-darwin-xu7z8t` | `791ccf285ebb47bf094a41d7feb1e8722576ad47` | B: 内容は main 履歴にあり | 2026-08-06 | #90 |
| `claude/kuu-seo-p1-og-managed-agents` | `5f992d321bc6c31abeba1824fe419bc4a9acae7a` | B: 内容は main 履歴にあり | 2026-04-17 | #31 |
| `claude/lockfile-guideline` | `65fbad0e9400a7a8fef8e02c12d3387cee96fc74` | A: main に内包 | 2026-04-27 | #40 |
| `claude/logo-always-back-to-hero` | `236c9a09bcf31c33208d2f2924e13602ad469746` | A: main に内包 | 2026-05-29 | #65 |
| `claude/magical-brown-dz708f` | `2ab1c4e53d947e6a2776eba3547ef9e6db5c1c57` | B: 内容は main 履歴にあり | 2026-06-17 | #81 |
| `claude/magical-gates-excjw` | `412c51cf676fa57b7e0c9bc261c66e3a6c9f1b16` | A: main に内包 | 2026-05-22 | #52 |
| `claude/nav-refactor-case-news` | `510b1884ee3d0371711b6b46e4c72eb86dd5e111` | A: main に内包 | 2026-05-29 | #61 |
| `claude/nifty-knuth-0cx8vc` | `1b9378b1499fd3d45748bb04c2f84e821b800f17` | B: 内容は main 履歴にあり | 2026-08-09 | #104(未マージclose) |
| `claude/nifty-knuth-28496j` | `86cc449d4c03fba0d271d2d05ef6562ce5c9e2de` | B: 内容は main 履歴にあり | 2026-08-06 | #95(未マージclose) |
| `claude/nifty-knuth-2mmvts` | `28e817e328092b284f2ed9624dbe6a9481acf859` | A: main に内包 | 2026-08-13 | —（main 直 push ルーティンの outcome branch） |
| `claude/nifty-knuth-49nh8h` | `8d8b9c25a9c000c829e83dc2b17aac2ea96c52ff` | B: 内容は main 履歴にあり | 2026-08-10 | #107(未マージclose) |
| `claude/nifty-knuth-8l7uwy` | `a6870193c099091720efca6b1176130019bb43f9` | A: main に内包 | 2026-08-15 | —（main 直 push ルーティンの outcome branch） |
| `claude/nifty-knuth-d70i81` | `01d8fded55b29d178d178ebb7440adbd1fdff854` | B: 内容は main 履歴にあり | 2026-08-16 | #120(未マージclose) |
| `claude/nifty-knuth-dllj8d` | `8534f025be5576a3881af48bc186d5db6e919d86` | B: 内容は main 履歴にあり | 2026-08-11 | #110(未マージclose) |
| `claude/nifty-knuth-gps5ky` | `3879225fe0e716158b8969c212e8f08cd588162c` | A: main に内包 | 2026-08-06 | —（main 直 push ルーティンの outcome branch） |
| `claude/nifty-knuth-hqcjxx` | `1b977ffa8377ad16a075f476ca6bb03ab2d765b3` | A: main に内包 | 2026-08-03 | —（main 直 push ルーティンの outcome branch） |
| `claude/nifty-knuth-jal5d7` | `903104bdb969499acd336289bc45244262452ecb` | B: 内容は main 履歴にあり | 2026-08-06 | #89 |
| `claude/nifty-knuth-mh6d6r` | `b5a86b562b4a911f68d8063aad15a50e01824eb1` | B: 内容は main 履歴にあり | 2026-08-07 | #98(未マージclose) |
| `claude/nifty-knuth-pet1fd` | `6f60cd4e21c42ca1a682c7197a5ca769fcea1418` | A: main に内包 | 2026-08-04 | —（main 直 push ルーティンの outcome branch） |
| `claude/nifty-knuth-rbt95p` | `943428940e20e8ca673094859569d56e5df7781e` | A: main に内包 | 2026-08-14 | —（main 直 push ルーティンの outcome branch） |
| `claude/openai-select-partner-badge-ck2xqf` | `7e4f00c4bc8f707e5762c0456c861598cd217c4e` | B: 内容は main 履歴にあり | 2026-08-22 | #125 |
| `claude/pensive-hawking-ab56cj` | `4411a97cc345142884625622b5bed7113869d309` | A: main に内包 | 2026-08-22 | —（main 直 push ルーティンの outcome branch） |
| `claude/pensive-hawking-dxhbrl` | `42d774bf5bf4dbddb1daf30b2998d07a7f0b3463` | A: main に内包 | 2026-08-19 | —（main 直 push ルーティンの outcome branch） |
| `claude/pensive-hawking-kzd8wf` | `b13544f6c3189ac075b6b128b24f388f684642a4` | A: main に内包 | 2026-08-23 | —（main 直 push ルーティンの outcome branch） |
| `claude/pensive-hawking-n9nish` | `0cf74f39b03991cf826ef3df3338f8f59463ba48` | A: main に内包 | 2026-08-17 | —（main 直 push ルーティンの outcome branch） |
| `claude/pensive-hawking-sp9iuj` | `8c0d6c0ceb911a6efa53330c2c7e540898c8cc85` | A: main に内包 | 2026-08-18 | —（main 直 push ルーティンの outcome branch） |
| `claude/pensive-hawking-wphx6x` | `4d5e5771b7de088befd504626c06cb5f26502a40` | A: main に内包 | 2026-08-21 | —（main 直 push ルーティンの outcome branch） |
| `claude/pin-pnpm-version` | `16d0d5a9c3b30d1bd65e3ab8241c092a39954e4b` | A: main に内包 | 2026-05-14 | #45 |
| `claude/pr-review-conflict-resolution-t4mcf8` | `2096cfc8270d8252795ebf86ad040ddd10bc1363` | B: 内容は main 履歴にあり | 2026-08-17 | #122,#123,#124 |
| `claude/refine-agent-positioning-iaNHs` | `ed17872998f31e3bff05ec5cf023410f4c2d3147` | A: main に内包 | 2026-05-14 | #43 |
| `claude/remove-pricing` | `b0909d9bf1279af041841b64aed289673897a46e` | A: main に内包 | 2026-05-20 | #51 |
| `claude/representative-title-display` | `91fcb12c0e7e50afd70c816f1032bd0bb9a152d7` | A: main に内包 | 2026-05-29 | #63 |
| `claude/search-window-placement-2dp84g` | `aebed87624a7c1acc3a1e7b9f90694a44821af64` | B: 内容は main 履歴にあり | 2026-06-29 | #85 |
| `claude/security-action-invert` | `e9832247807283ac1a12b2cb78eb5636b453df9d` | A: main に内包 | 2026-05-24 | #55 |
| `claude/seo-blog-og-images` | `d92516cefa8a31cc8b6701f862fcb006abcd26d1` | A: main に内包 | 2026-04-26 | #35 |
| `claude/seo-fde-ax-pillars` | `a71393ed36193f29dce69f2635f639431da913ab` | A: main に内包 | 2026-05-15 | #47 |
| `claude/seo-meo-enhancement-6tzrgl` | `e0939877da63046fb26c63f2d41b6b804cfcc9a0` | B: 内容は main 履歴にあり | 2026-07-02 | #86 |
| `claude/seo-related-posts` | `d33911775f617cdd05a92fab2398424ef8fcb352` | A: main に内包 | 2026-04-26 | #36 |
| `claude/seo-structured-data` | `14592ea4b3eae7755ea2b1524c6900931e0cfc35` | A: main に内包 | 2026-04-26 | #37 |
| `claude/services-index-and-constellation` | `8b9f7dcef55f18f2d8d97b8681c9c32f38c50342` | A: main に内包 | 2026-05-14 | #46 |
| `claude/stoic-edison-7HfcW` | `7048901c792e45fd06f22fff47c8afed32cfa763` | B: 内容は main 履歴にあり | 2026-06-02 | #73 |
| `claude/trusting-brahmagupta-1tm59y` | `3408eaf8ad6229271741585257b9253989e955a4` | A: main に内包 | 2026-08-22 | —（main 直 push ルーティンの outcome branch） |
| `claude/trusting-brahmagupta-gnjyga` | `163b0f13d51eac11f624b9e10439afe372a12fa6` | A: main に内包 | 2026-08-17 | —（main 直 push ルーティンの outcome branch） |
| `claude/trusting-brahmagupta-k7zjxm` | `c0e0de146edbbc8e98ed8724f84be021b89b795d` | A: main に内包 | 2026-08-21 | —（main 直 push ルーティンの outcome branch） |
| `claude/trusting-brahmagupta-nzbppv` | `408801666e65debfdf208fdcfabd832c2bbd8e77` | A: main に内包 | 2026-08-18 | —（main 直 push ルーティンの outcome branch） |
| `claude/trusting-brahmagupta-q05hgw` | `bfcf3cb3c4c165301ed16ca5c11192a6dc3bcaf3` | A: main に内包 | 2026-08-19 | —（main 直 push ルーティンの outcome branch） |
| `claude/trusting-brahmagupta-qc177i` | `dd841c00451deddade4da248cb7349ab5a94e59e` | A: main に内包 | 2026-08-20 | —（main 直 push ルーティンの outcome branch） |
| `claude/update-representative-text-UO7j1` | `4e57776a63bc4c7cd43f3415a5e96001ea400e7f` | A: main に内包 | 2026-04-14 | #27 |
| `claude/zen-maxwell-0yMrJ` | `8703c2fe2a2c636f477c8b2e8effd07ccf4e2bc5` | B: 内容は main 履歴にあり | 2026-06-09 | #76,#78 |

## 補足

PR 欄が「—」のものは、CLAUDE.md の Blog / Case 自動生成ルーティンが `main` へ直 push した際に実行環境側が作成した outcome branch（`claude/kind-darwin-*` / `claude/eloquent-cerf-*` / `claude/nifty-knuth-*` ほか）で、PR は存在しない。成果物は `main` に入っているため、ブランチ自体は役目を終えている。
