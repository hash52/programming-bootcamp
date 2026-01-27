---
applyTo: "docs/docs/java/**"
---
# Java教材編集ガイド

Java教材を作成・編集する前に、以下のドキュメントを参照すること:

## 必須ドキュメント

1. **概要把握**
   - `knowledge/syllabi/java-design-summary.md` - 全16章の一覧・依存関係

2. **詳細設計**（必要時のみ）
   - `knowledge/syllabi/java-design.md` の **該当章のみ**

⚠️ `java-design.md` は2,200行以上あるため、**全文を読み込まず、該当章のセクションのみを参照** すること。

---

## Java教材の構成

| カテゴリ | 章 | 内容 |
|----------|-----|------|
| java/basics | 第1-9章 | 基礎文法、例外処理 |
| java/oop | 第10-14章 | オブジェクト指向 |
| java/stdlib | 第15-16章 | 標準ライブラリ |

---

## 教材作成の共通ルール

- `knowledge/guides/chapter-structure.md` - 章構成テンプレート
- `knowledge/guides/writing-style.md` - 文体ルール
- `knowledge/guides/mdx-syntax.md` - MDX構文ルール

---

## 該当章の参照方法

`java-design.md` で特定の章を検索:

```
## 第N章:
```

例: 第4章の詳細を見たい場合 → `## 第4章:` を検索
