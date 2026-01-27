# プログラミングブートキャンプ教材 - Copilot Agent指示

## 言語設定

常に日本語で回答すること。

---

## プロジェクト概要

プログラミング未経験者向けのブートキャンプ教材。Docusaurus形式のWebサイトで、Java、SQL、HTML/CSS、Git、Spring Frameworkを学習する。

---

## 重要: 作業開始前に必ず読むこと

作業を始める前に `knowledge/README.md` を読み、作業内容に応じた適切なドキュメントを参照すること。

### 主要ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| `knowledge/README.md` | ドキュメント一覧・参照ガイド |
| `knowledge/guides/project-overview.md` | プロジェクト概要・対象者特性 |
| `knowledge/guides/writing-style.md` | 文体・表記ルール |
| `knowledge/guides/chapter-structure.md` | 章構成テンプレート |
| `knowledge/guides/structure-ts-rules.md` | structure.ts・質問タイトルルール |
| `knowledge/guides/mdx-syntax.md` | MDX構文ルール |

### シラバス参照のルール

⚠️ シラバス（syllabi/）は分量が大きいため、**全文を読み込まず、必要な章のみを参照** すること。

- `java-design-summary.md` で概要を把握
- 詳細が必要な場合のみ `java-design.md` の該当章を参照

---

## 共通ルール

### 文体
- **「である調」で統一**
- 簡潔でわかりやすい文章
- 冗長な表現を避け、本質を端的に伝える

### 対象者への配慮
- **大前提から説明する**（プログラムは上から下に実行される、など）
- **技術の必要性から理解させる**（「ないと何が困るか」を先に説明）
- **専門用語には必ず注釈を入れる**

---

## プロジェクト構成

```
programming-bootcamp/
├── .claude/           # Claude Code設定
├── .github/           # GitHub設定（Copilot含む）
├── .handoff/          # エージェント間引き継ぎ
├── knowledge/         # 共通ナレッジベース（※最初に参照）
│   ├── syllabi/       # シラバス・設計書
│   └── guides/        # ガイドライン・仕様
└── docs/              # Docusaurusサイト（教材）
```

---

## 引き継ぎ機能

Claude Codeから作業を引き継ぐ場合、`.handoff/` ディレクトリ内の最新の引き継ぎファイルを確認すること。
