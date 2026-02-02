# 問題ファイル作成: 開発者向けドキュメント

本教材では、各章末の「練習問題」を **独立した `.mdx` ファイル** として管理している。  
これにより、問題の **ランダム出題** や **ダッシュボード上での動的表示** に対応できるようにしている。  
そのため、通常の Markdown 記述よりも少し手間はかかるが、構造化された設計になっている。

---

## ディレクトリ構成のルール

- `src/questions` と `docs/` のディレクトリ構造は **完全に一致** させること。  
  例：

```
docs/
├── java/
│   └── basics/
│       └── 02_variables_and_types.mdx
src/
└── questions/
    ├── java/
    │   └── basics/
    │       └── 02_variables_and_types/
    │           ├── variables_concept.mdx
    │           └── type_basics.mdx
```

- `docs/java/basics/02_variables_and_types.mdx` に対応する問題は  
  `src/questions/java/basics/02_variables_and_types/` ディレクトリに配置する。

---

## 問題ファイルの命名規則

### 新形式（推奨）

- 問題は **1 問につき 1 ファイル** とする。
- ファイル名は **問題の内容を表すスネークケース** で命名する。
- **短く、意味が伝わる英語** を使用する。
- 拡張子は必ず `.mdx` とする。

例：

```
src/questions/java/basics/02_variables_and_types/variables_concept.mdx
src/questions/java/basics/02_variables_and_types/type_basics.mdx
src/questions/java/basics/02_variables_and_types/declare_variable.mdx
```

**命名のガイドライン：**

- ✅ `variables_concept` (変数の概念)
- ✅ `type_casting` (型変換)
- ✅ `declare_variable` (変数宣言)
- ❌ `var_concept` (略語は避ける)
- ❌ `variablesConcept` (キャメルケースではなくスネークケース)
- ❌ `question1` (内容が分からない)

### 旧形式（後方互換性のため残存）

一部のトピックでは、以下の旧形式のファイルが残っている：

```
k1.mdx, k2.mdx, ...  (KNOW問題)
w1.mdx, w2.mdx, ...  (WRITE問題)
r1.mdx, r2.mdx, ...  (READ問題)
```

**新しい問題を追加する場合は、必ず新形式を使用すること。**

---

## structure.tsでの問題定義

問題を作成する際は、`src/structure.ts` でも問題を定義する必要がある。

### 新形式（questionId指定）

```typescript
withAutoIds({
  id: "02_variables_and_types",
  label: "変数と型",
  category: "java/basics",
  questions: [
    {
      questionId: "variables_concept", // ファイル名と一致させる
      title: "変数とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      questionId: "type_basics",
      title: "型とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      questionId: "declare_variable",
      title: "変数に値を代入できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
  ],
});
```

**重要：** `questionId` とファイル名（`.mdx`を除く）は **完全に一致** させること。

生成されるID：

- `java/basics/02_variables_and_types#variables_concept`
- `java/basics/02_variables_and_types#type_basics`
- `java/basics/02_variables_and_types#declare_variable`

### 旧形式（後方互換性のため）

`questionId` を指定しない場合、旧形式のID（`k1`, `w1`など）が生成される：

```typescript
{
  title: "整数型が扱えるデータを説明できる",
  type: "KNOW",
  difficulty: Difficulty.Easy,
  // questionIdなし → 自動的に k3 として生成される
}
```

---

## 問題の呼び出し方法

作成した問題は、本文内から次のように呼び出す：

```tsx
<QuestionList topicId="02_variables_and_types" category="java/basics" />
```

章末に上記のタグを記述すると、structure.tsで定義された全ての問題が自動的に表示される。

個別に問題を呼び出す場合：

```tsx
<QuestionRenderer id="java/basics/02_variables_and_types#variables_concept" />
```

> **ポイント**
>
> - `QuestionList` を使うと、structure.tsの定義に基づいて問題が自動表示される。
> - 問題の追加・削除は structure.ts のみで管理できる。
> - ID形式は `{category}/{topicId}#{questionId}` となる。

---

## このような構造を採用している理由

通常の教材であれば、問題文を教材本文 (`.mdx`) に直接埋め込んでも問題ない。  
しかし、本教材では以下の目的のため、あえて **問題ファイルを分離** している：

1. **ダッシュボード機能との連携**
   - 学習者が各問題を「理解済み」「未理解」としてチェックできる。
   - 達成率や経過日数を localStorage に記録して、ダッシュボードで集計できる。

2. **ランダム出題機能の実現**
   - 同一トピック内から未達成問題のみをランダムに出題する。
   - 問題を増減しても ID 体系が変わらず、既存データを壊さない。

3. **再利用性・保守性の向上**
   - 同じ問題を複数教材で再利用できる。
   - 問題をファイル単位でレビュー・修正しやすい。

---

## 開発者への補足メモ

| 項目                   | 内容                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| **ファイル配置**       | `src/questions/{category}/{topicId}/{questionId}.mdx`                     |
| **ファイル命名**       | 短く意味が伝わるスネークケース（`variables_concept`, `type_casting`など） |
| **structure.ts定義**   | `questionId` フィールドでファイル名を指定                                 |
| **ID生成ルール**       | `{category}/{topicId}#{questionId}` 形式                                  |
| **旧形式との互換性**   | `questionId` 未指定時は旧形式（`k1`, `w1`など）で生成                     |
| **呼び出しタグ**       | `<QuestionList topicId="..." category="..." />` で一括表示                |
| **内部処理**           | `QuestionRenderer` が `require.context` により対象 MDX を自動読み込み     |
| **URL からの直リンク** | `#questionId` でアンカーリンク可能                                        |

---

## 問題追加の手順

1. **structure.tsに問題を定義**

   ```typescript
   {
     questionId: "new_question",  // ファイル名と同じ
     title: "問題のタイトル",
     type: "KNOW",  // または "READ", "WRITE"
     difficulty: Difficulty.Easy,
   }
   ```

2. **問題ファイルを作成**
   - ファイルパス: `src/questions/{category}/{topicId}/new_question.mdx`
   - frontmatterに適切なメタデータを記述

3. **動作確認**
   - 開発サーバーで該当ページを開く
   - 問題が正しく表示されるか確認
   - ダッシュボードで進捗管理が動作するか確認

---

## 実装例（教材側）

教材ページ `docs/java/basics/02_variables_and_types.mdx` の章末：

```mdx
## 練習問題

この章の内容を理解したか確認してみましょう。

<QuestionList topicId="02_variables_and_types" category="java/basics" />
```

これだけで、structure.tsで定義された全ての問題が表示される。

教材ページ `docs/java/basics/if.mdx` の一部：

```mdx
## 練習問題

この章の内容を理解したか確認してみましょう。

`\`\`tsx
\<QuestionRenderer id="java/basics/if#q1" />
\<QuestionRenderer id="java/basics/if#q2" />
`\`\`
```

---

## 将来的な拡張を見据えた設計

- 今後、`QuestionRenderer` は問題の正答率・最終確認日などのメタデータを
  localStorage から取得し、進捗と連動して表示できるようにする。
- 問題データを JSON や YAML ではなく `.mdx` で管理しているのは、
  **文章構造（説明・コード例・ヒントなど）をそのままマークアップできるため**。

---

## まとめ

| 要点                 | 内容                                             |
| -------------------- | ------------------------------------------------ |
| 🔹 1 問 1 ファイル制 | `q1.mdx`, `q2.mdx`, ...                          |
| 🔹 ディレクトリ構造  | `src/questions` と `docs` は同一構造             |
| 🔹 呼び出し方法      | `<QuestionRenderer id="java/basics/if#q1" />`    |
| 🔹 理由              | ダッシュボード集計・ランダム出題・再利用性のため |
| 🔹 効果              | 問題追加・修正時も壊れない安定した教材管理       |

---

このルールに従えば、教材と問題が自動的にリンクされ、
新しい問題を追加しても **全ページ・ダッシュボード・出題機能が同期して動作**する。

```

```
