# 演習問題作成ルール

本ドキュメントは、演習問題の作成ルールと達成目標との対応関係を定義する。

---

## 基本原則

**1つの達成目標（Question）に対して、1つの演習問題を作成する。**

---

## 対応関係

### structure.ts の定義

```typescript
{
  title: "変数とは何かを説明できる",
  type: "KNOW",
  difficulty: Difficulty.Easy,
}
// このQuestionのIDは自動生成される：
// "java/basics/variables_and_types#k1"
```

### 対応する演習問題ファイル

```
docs/src/questions/java/basics/variables_and_types/k1.mdx
```

---

## 演習問題のファイル名規則

| タイプ | ファイル名パターン |
|--------|-------------------|
| **KNOW** | `k1.mdx`, `k2.mdx`, `k3.mdx`, ... |
| **READ** | `r1.mdx`, `r2.mdx`, `r3.mdx`, ... |
| **WRITE** | `w1.mdx`, `w2.mdx`, `w3.mdx`, ... |

---

## 演習問題の作成タイミング

教材本文の作成が完了した後に、演習問題を作成する。
現在の Phase では、**演習問題の作成は行わない**（Phase 6 で実施予定）。

---

## 質問タイトルと演習問題の関係

- 質問タイトルは「自己チェックリスト」として機能する
- 受講生は質問タイトルを見て「これができるようになったか」を振り返る
- 演習問題は、その質問に対する具体的な確認課題となる
- **重要**: 質問タイトルから答えが見えてしまうと、演習問題の意味がなくなる

---

## ディレクトリ構造

```
docs/src/questions/
├── java/
│   ├── basics/
│   │   ├── variables_and_types/
│   │   │   ├── k1.mdx
│   │   │   ├── k2.mdx
│   │   │   ├── w1.mdx
│   │   │   └── ...
│   │   └── ...
│   ├── oop/
│   │   └── ...
│   └── stdlib/
│       └── ...
├── db/
│   └── ...
├── git/
│   └── ...
├── frontend/
│   └── ...
└── spring/
    └── ...
```

---

## 関連ドキュメント

- [structure.ts・質問タイトルルール](./structure-ts-rules.md)
- [ダッシュボード仕様](./dashboard-spec.md)
