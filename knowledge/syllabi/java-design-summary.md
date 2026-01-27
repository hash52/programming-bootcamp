# Java教材 - 概要サマリー

**⚠️ 注意:** 詳細な設計情報が必要な場合は、`java-design.md` の該当章のみを参照すること。
全文を読み込まないこと（2,200行以上あるため）。

---

## 全16章の構成

| 章番号 | 章タイトル | カテゴリ | 概要 |
|--------|-----------|----------|------|
| 第1章 | Javaとプログラミングの基礎 | java/basics | Hello World、プログラムの大原則、コメント |
| 第2章 | 変数と型 | java/basics | 変数宣言、基本型（int, double, boolean, char, String） |
| 第3章 | 演算子 | java/basics | 算術・比較・論理演算子、優先順位 |
| 第4章 | 条件分岐 | java/basics | if-else、switch文、三項演算子 |
| 第5章 | 繰り返し | java/basics | for、while、do-while、break/continue |
| 第6章 | 配列 | java/basics | 配列の宣言・初期化、要素アクセス、拡張for文 |
| 第7章 | メソッド | java/basics | メソッド定義、引数・戻り値、オーバーロード |
| 第8章 | 複数クラスの連携 | java/basics | クラスの分割、参照渡し |
| 第9章 | 例外処理 | java/basics | try-catch、throws、カスタム例外 |
| 第10章 | オブジェクト指向の基礎 | java/oop | クラスとオブジェクト、フィールドとメソッド |
| 第11章 | コンストラクタ | java/oop | コンストラクタ定義、this、オーバーロード |
| 第12章 | 継承 | java/oop | extends、オーバーライド、super |
| 第13章 | インターフェース | java/oop | interface、implements、多態性 |
| 第14章 | カプセル化 | java/oop | アクセス修飾子、getter/setter |
| 第15章 | コレクション | java/stdlib | List、Map、Set、ジェネリクス |
| 第16章 | 日時操作 | java/stdlib | LocalDate、LocalTime、DateTimeFormatter |

---

## カテゴリ分類

| カテゴリ | 章 | 説明 |
|----------|-----|------|
| **java/basics** | 第1-9章 | Java基礎文法（例外処理を含む） |
| **java/oop** | 第10-14章 | オブジェクト指向 |
| **java/stdlib** | 第15-16章 | Java標準ライブラリ |

---

## 章間の依存関係

```
第1章（基礎）
  ↓
第2章（変数）→ 第3章（演算子）
  ↓
第4章（条件分岐）→ 第5章（繰り返し）→ 第6章（配列）
  ↓
第7章（メソッド）→ 第8章（複数クラス）→ 第9章（例外処理）
  ↓
第10章（OOP基礎）→ 第11章（コンストラクタ）
  ↓
第12章（継承）→ 第13章（インターフェース）→ 第14章（カプセル化）
  ↓
第15章（コレクション）→ 第16章（日時操作）
```

---

## 詳細設計の参照方法

特定の章の詳細（章構成、structure.ts定義、演習問題対応など）が必要な場合:

```
# 第N章のみを参照
java-design.md の「## 第N章:」セクションを検索
```

**例:** 第4章の詳細を見たい場合
→ `java-design.md` で `## 第4章:` を検索

---

## 関連ドキュメント

- [詳細設計: java-design.md](./java-design.md) - 全章の詳細設計（必要時のみ参照）
- [カリキュラムスケジュール: schedule.md](./schedule.md) - Day 1-29 の全体スケジュール
