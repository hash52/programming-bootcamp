# 共通ナレッジベース

このディレクトリは、Claude Code と GitHub Copilot Agent が共有するナレッジベースである。
**作業開始前に、作業内容に応じた適切なドキュメントを参照すること。**

---

## ⚠️ 重要: シラバス参照のルール

`syllabi/` 内のファイルは分量が大きいため、**必要時のみ参照** すること。

- `java-design-summary.md` で概要を把握
- 詳細が必要な場合のみ `java-design.md` の **該当章のみ** を参照
- **全文を読み込まないこと**（java-design.md は 2,200行以上）

---

## ディレクトリ構成

```
knowledge/
├── README.md                  # このファイル
├── syllabi/                   # シラバス・カリキュラム設計
│   ├── schedule.md            # カリキュラムスケジュール（Day 1-29）
│   ├── java-design.md         # Java教材設計書（詳細版、2,200行以上）
│   └── java-design-summary.md # Java教材設計書（軽量版、概要のみ）
└── guides/                    # ガイドライン・仕様書
    ├── project-overview.md    # プロジェクト概要・対象者特性
    ├── writing-style.md       # 文体・表記ルール
    ├── chapter-structure.md   # 章構成テンプレート
    ├── structure-ts-rules.md  # structure.ts・質問タイトルルール
    ├── mdx-syntax.md          # MDX構文ルール
    ├── admonitions-guide.md   # Admonitions活用ガイド
    ├── exercise-rules.md      # 演習問題作成ルール
    ├── question-files.md      # 問題ファイル作成ガイド
    └── dashboard-spec.md      # ダッシュボード仕様
```

---

## 作業内容別の参照ガイド

### 教材の新規作成・編集

| 参照すべきドキュメント                                | 優先度 |
| ----------------------------------------------------- | ------ |
| [project-overview.md](./guides/project-overview.md)   | 必須   |
| [writing-style.md](./guides/writing-style.md)         | 必須   |
| [chapter-structure.md](./guides/chapter-structure.md) | 必須   |
| [mdx-syntax.md](./guides/mdx-syntax.md)               | 必須   |
| [admonitions-guide.md](./guides/admonitions-guide.md) | 推奨   |

### structure.ts の編集

| 参照すべきドキュメント                                  | 優先度   |
| ------------------------------------------------------- | -------- |
| [structure-ts-rules.md](./guides/structure-ts-rules.md) | **必須** |
| [exercise-rules.md](./guides/exercise-rules.md)         | 推奨     |

### 演習問題の作成

| 参照すべきドキュメント                                  | 優先度 |
| ------------------------------------------------------- | ------ |
| [question-files.md](./guides/question-files.md)         | 必須   |
| [exercise-rules.md](./guides/exercise-rules.md)         | 必須   |
| [structure-ts-rules.md](./guides/structure-ts-rules.md) | 必須   |

### Java教材の作成

| 参照すべきドキュメント                                     | 優先度           |
| ---------------------------------------------------------- | ---------------- |
| [java-design-summary.md](./syllabi/java-design-summary.md) | 必須（概要把握） |
| [java-design.md](./syllabi/java-design.md) の該当章        | 必要時のみ       |

### ダッシュボード機能の開発

| 参照すべきドキュメント                                  | 優先度 |
| ------------------------------------------------------- | ------ |
| [dashboard-spec.md](./guides/dashboard-spec.md)         | 必須   |
| [structure-ts-rules.md](./guides/structure-ts-rules.md) | 推奨   |

---

## ドキュメント一覧

### シラバス（syllabi/）

| ファイル                                                   | 内容                                       |
| ---------------------------------------------------------- | ------------------------------------------ |
| [schedule.md](./syllabi/schedule.md)                       | カリキュラム全体のスケジュール（Day 1-29） |
| [java-design-summary.md](./syllabi/java-design-summary.md) | Java教材の概要（16章一覧、依存関係）       |
| [java-design.md](./syllabi/java-design.md)                 | Java教材の詳細設計（必要時のみ参照）       |

### ガイドライン（guides/）

| ファイル                                                | 内容                                   |
| ------------------------------------------------------- | -------------------------------------- |
| [project-overview.md](./guides/project-overview.md)     | プロジェクト概要、対象者特性、配慮事項 |
| [writing-style.md](./guides/writing-style.md)           | 文体ルール、専門用語の注釈             |
| [chapter-structure.md](./guides/chapter-structure.md)   | 章構成テンプレート、重要原則           |
| [structure-ts-rules.md](./guides/structure-ts-rules.md) | structure.ts管理、質問タイトルルール   |
| [mdx-syntax.md](./guides/mdx-syntax.md)                 | MDX構文、改行、強調記号、特殊文字      |
| [admonitions-guide.md](./guides/admonitions-guide.md)   | Docusaurus admonitions の使い方        |
| [exercise-rules.md](./guides/exercise-rules.md)         | 演習問題のファイル名規則、対応関係     |
| [question-files.md](./guides/question-files.md)         | 問題ファイル作成・配置ガイド           |
| [dashboard-spec.md](./guides/dashboard-spec.md)         | 進捗ダッシュボードの仕様               |

---

## 更新履歴

- 2025-01-28: ドキュメント構成を大幅リファクタリング（CLAUDE.md から分離）
- 2025-01-27: 初版作成、.claude/curriculum/ と .claude/specs/ から移行
