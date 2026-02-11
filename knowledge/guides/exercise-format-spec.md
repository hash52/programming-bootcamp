# 演習問題フォーマット仕様書

本ドキュメントは、演習問題の作成に必要な **すべての情報** を1ファイルにまとめた包括的な仕様書である。
AIエージェントおよび開発者は、演習問題を作成する際にこのドキュメントのみを参照すればよい。

> **廃止ドキュメント**: 本仕様書は `exercise-rules.md` と `question-files.md` の内容を統合・改善したものである。
> これらのファイルは廃止済みであり、参照してはならない。
> `structure-ts-rules.md` は演習以外の内容（ダッシュボード目的、カテゴリ一覧等）も含むため、独立して保持する。

---

## 1. 概要

### 目的と対象読者

- **目的**: 演習問題を正確かつ効率的に作成するためのルールとテンプレートを提供する
- **対象読者**: AIエージェント（Claude Code, GitHub Copilot）および開発者

### 1問1ファイルの設計思想

本教材では、演習問題を **独立した `.mdx` ファイル** として管理している。
これにより以下を実現している：

1. **ダッシュボード連携**: 各問題の達成状況を localStorage で管理し、進捗率を表示する
2. **ランダム出題**: 同一トピック内から未達成問題をランダムに出題できる
3. **再利用性・保守性**: 問題を個別にレビュー・修正・再利用できる

---

## 2. ディレクトリ構成とファイル命名規則

### ディレクトリ構成

```
docs/src/questions/
├── java/
│   ├── basics/
│   │   ├── 01_java_basics/
│   │   │   ├── java_use_cases.mdx
│   │   │   ├── hello_world.mdx
│   │   │   └── ...
│   │   ├── 02_variables_and_types/
│   │   │   ├── variables_concept.mdx
│   │   │   ├── declare_int_variable.mdx
│   │   │   └── ...
│   │   └── ...
│   ├── oop/
│   │   └── ...
│   └── stdlib/
│       └── ...
├── db/
│   ├── basics/
│   │   └── 01_why_database/
│   ├── select/
│   └── design/
├── git/
│   ├── basics/
│   └── teamwork/
├── frontend/
│   └── ...
└── spring/
    └── ...
```

### `docs/docs/` とのパス対応

`docs/docs/` 配下の教材ファイルと `docs/src/questions/` 配下の問題ディレクトリは **構造を一致** させる。

| 教材ファイル | 問題ディレクトリ |
|-------------|----------------|
| `docs/docs/java/basics/02_variables_and_types.mdx` | `docs/src/questions/java/basics/02_variables_and_types/` |
| `docs/docs/db/basics/01_why_database.mdx` | `docs/src/questions/db/basics/01_why_database/` |
| `docs/docs/git/basics/01_version_control.mdx` | `docs/src/questions/git/basics/01_version_control/` |

### ファイル命名規則

- 問題は **1問につき1ファイル** とする
- ファイル名は **問題内容を表すスネークケース** で命名する
- **短く、意味が伝わる英語** を使用する
- 拡張子は `.mdx`

**命名のガイドライン**：

| 例 | 良し悪し | 理由 |
|----|---------|------|
| `variables_concept.mdx` | ✅ | 内容が分かる |
| `type_casting.mdx` | ✅ | 内容が分かる |
| `declare_variable.mdx` | ✅ | 内容が分かる |
| `var_concept.mdx` | ❌ | 略語は避ける |
| `variablesConcept.mdx` | ❌ | キャメルケースではなくスネークケース |
| `question1.mdx` | ❌ | 内容が分からない |
| `k1.mdx` | ❌ | 旧形式（非推奨） |

### 旧形式（非推奨）

一部のトピックでは `k1.mdx`, `r1.mdx`, `w1.mdx` 等の旧形式ファイルが残存している。
**新しい問題を追加する場合は、必ず新形式を使用すること。**

---

## 3. Frontmatter仕様

### 3.1 共通フィールド（全形式必須）

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `id` | `string` | 必須 | `{category}/{topicId}#{questionId}` 形式 |
| `title` | `string` | 必須 | ダッシュボードに表示されるタイトル |
| `type` | `"KNOW" \| "READ" \| "WRITE"` | 必須 | 問題のタイプ |
| `difficulty` | `"Easy" \| "Medium" \| "Hard"` | 必須 | 難易度 |
| `format` | `"multipleChoice" \| "fillInBlank" \| "freeText"` | 必須 | 出題形式 |
| `topicId` | `string` | 必須 | 所属するトピックのID |
| `category` | `string` | 必須 | カテゴリ（例: `java/basics`） |
| `explanation` | `string` | 推奨 | 解説文（Markdown形式、である調で記述） |
| `sampleAnswer` | `string` | 任意 | 解答例テキスト |
| `hint` | `string` | 任意 | ヒント（Markdown形式、difficulty Medium以上推奨） |

> **注意**: `format` フィールドは **全問題で必須** である。省略すると `freeText` として扱われるが、明示的に指定すること。

### 3.2 選択問題固有フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `multipleSelect` | `boolean` | 必須 | `false`: 単一選択、`true`: 複数選択 |
| `choices` | `Choice[]` | 必須 | 選択肢リスト |
| `answers` | `{ correct: string[] }` | 必須 | 正解の選択肢ID |

`Choice` の構造:
```yaml
choices:
  - id: "A"
    text: "選択肢のテキスト"
  - id: "B"
    text: "選択肢のテキスト"
```

### 3.3 穴埋め問題固有フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `fillInBlankAnswers` | `Record<string, string \| string[]>` | **必須** | 各空欄の正解 |
| `sampleAnswer` | `string` | 推奨 | 完成した解答例 |

```yaml
fillInBlankAnswers:
  blank1: "int"                    # 単一正解
  blank2: ["&&", "& &"]           # 複数パターン許容
```

> **重要**: `fillInBlank` 形式では `fillInBlankAnswers` は **必須** である。欠落すると採点が動作しない。

### 3.4 自由記述問題固有フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `sampleAnswer` | `string` | 推奨 | 模範解答テキスト |

自由記述問題は自動採点の対象外である。
ユーザーが「解答を表示する」ボタンで解答例と解説を確認する形式をとる。

### 3.5 hintフィールド

`hint` フィールドは **任意** であり、難しい問題にのみ付ける（difficulty Medium以上推奨、Easyでは基本不要）。

```yaml
hint: |
  **ポイント**: `&&` は「かつ」、`||` は「または」を意味する。

  教材の「論理演算子」セクションを復習しよう。
```

> **注意**: `hint` フィールドのUI表示は未実装である（将来のコード変更で対応予定）。
> 現時点では、MDX本体内に直接ヒントを記述するパターンも許容する。

---

## 4. MDX本体の構造ルール

### 基本構造

```mdx
---
(frontmatter)
---

import文（必要な場合のみ、frontmatter直後）

問題文（1〜3文、簡潔に）

コンポーネント（穴埋めやOneCompiler等）
```

### ルール

1. **import文は frontmatter 直後** に配置する
2. **問題文は簡潔** に記述する（1〜3文が目安）
3. **見出し `## 問題` は任意** である（問題文が短い場合は不要、長い場合は付けてもよい）
4. **文体は「である調」** で統一する（explanation 含む）
5. **MDX本体にヒントや解説をベタ書きする場合**、frontmatter の `explanation` と内容が重複しないよう注意する

### 穴埋め問題の構造

```mdx
import { BlankInput } from '@site/src/components/question/inputs/BlankInput';
import { CodeBlock } from '@site/src/components/question/CodeBlock';

以下のコードの空欄を埋めよ。

<CodeBlock>
  <BlankInput id="blank1" /> age = <BlankInput id="blank2" />;
</CodeBlock>
```

- `<BlankInput id="blankN" />` の `id` は frontmatter の `fillInBlankAnswers` のキーと一致させる

### コーディング問題の構造

```mdx
import { OneCompilerCodeBlock } from '@site/src/components/OneCompilerCodeBlock';

以下のプログラムを完成させよ。

<OneCompilerCodeBlock
  language="java"
  code={`public class Main {
    public static void main(String[] args) {
        // ここにコードを書いてください
    }
}`}
/>
```

- `codeId` が必要な場合は仮値 `"TODO"` で埋め、後で手動差し替えする

---

## 5. テンプレート（コピペ用）

### 5.1 選択問題（単一選択）

```mdx
---
id: "{category}/{topicId}#{questionId}"
title: "質問タイトル"
type: "KNOW"
difficulty: "Easy"
format: "multipleChoice"
topicId: "{topicId}"
category: "{category}"
multipleSelect: false
choices:
  - id: "A"
    text: "正解の選択肢"
  - id: "B"
    text: "紛らわしい誤答"
  - id: "C"
    text: "誤答"
answers:
  correct: ["A"]
explanation: |
  解説文をここに記述する。である調で統一すること。

  **ポイント**：
  - 補足事項1
  - 補足事項2
---

問題文を簡潔に記述する。最も適切なものを選べ。
```

### 5.2 選択問題（複数選択）

```mdx
---
id: "{category}/{topicId}#{questionId}"
title: "質問タイトル"
type: "KNOW"
difficulty: "Easy"
format: "multipleChoice"
topicId: "{topicId}"
category: "{category}"
multipleSelect: true
choices:
  - id: "A"
    text: "正解の選択肢1"
  - id: "B"
    text: "正解の選択肢2"
  - id: "C"
    text: "紛らわしい誤答"
  - id: "D"
    text: "誤答"
answers:
  correct: ["A", "B"]
explanation: |
  解説文をここに記述する。

  AとBが正解である。Cは〜という理由で誤りである。
---

該当するものを **すべて** 選べ。
```

### 5.3 穴埋め問題

```mdx
---
id: "{category}/{topicId}#{questionId}"
title: "質問タイトル"
type: "WRITE"
difficulty: "Easy"
format: "fillInBlank"
topicId: "{topicId}"
category: "{category}"
fillInBlankAnswers:
  blank1: "正解テキスト"
  blank2: ["正解パターン1", "正解パターン2"]
sampleAnswer: "完成したコードの全体像"
explanation: |
  解説文をここに記述する。
---

import { BlankInput } from '@site/src/components/question/inputs/BlankInput';
import { CodeBlock } from '@site/src/components/question/CodeBlock';

以下のコードの空欄を埋めよ。

<CodeBlock>
{`コードの前半部分`}<BlankInput id="blank1" />{`コードの後半部分`}
</CodeBlock>
```

### 5.4 自由記述問題

```mdx
---
id: "{category}/{topicId}#{questionId}"
title: "質問タイトル"
type: "KNOW"
difficulty: "Easy"
format: "freeText"
topicId: "{topicId}"
category: "{category}"
sampleAnswer: "模範解答のテキスト"
explanation: |
  解説文をここに記述する。
---

問題文を記述する。自分の言葉で説明せよ。
```

### 5.5 コーディング問題（OneCompiler使用）

```mdx
---
id: "{category}/{topicId}#{questionId}"
title: "質問タイトル"
type: "WRITE"
difficulty: "Easy"
format: "freeText"
topicId: "{topicId}"
category: "{category}"
explanation: |
  解説文をここに記述する。

  **解答例**：
  ```java
  完成コードをここに記述
  ```
---

import { OneCompilerCodeBlock } from '@site/src/components/OneCompilerCodeBlock';

以下のプログラムを完成させよ。

**要件**：
- 要件1
- 要件2

<OneCompilerCodeBlock
  language="java"
  code={`public class Main {
    public static void main(String[] args) {
        // ここにコードを書いてください
    }
}`}
/>
```

---

## 6. structure.ts との連携

### withAutoIds での定義方法

問題を作成する際は、`docs/src/structure.ts` で対応するTopicにQuestionを定義する必要がある。

```typescript
withAutoIds({
  id: "02_variables_and_types",          // 教材ファイル名に対応
  label: "変数と型",                     // ダッシュボード表示名
  category: "java/basics",               // カテゴリ
  questions: [
    {
      questionId: "variables_concept",    // ファイル名（.mdx除く）と完全一致
      title: "変数とは何かを説明できる",   // 答えが見えないタイトル
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      questionId: "declare_int_variable",
      title: "変数に値を代入できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
  ],
})
```

### questionId とファイル名の対応

- `questionId` = ファイル名（拡張子なし）
- **完全一致** させること

### ID形式

生成されるIDは `{category}/{topicId}#{questionId}` 形式である。

例:
- `java/basics/02_variables_and_types#variables_concept`
- `db/basics/01_why_database#file_management_issues`
- `git/basics/01_version_control#version_control_necessity`

このIDは以下で使用される：
- frontmatter の `id` フィールド
- `<QuestionRenderer id="..." />` の `id` プロパティ
- localStorage のキー（進捗管理）

---

## 7. 教材本文からの呼び出し

### 一括表示（推奨）

章末に以下を記述すると、structure.ts で定義された全問題が自動表示される：

```mdx
## 練習問題

この章の内容を理解できたか確認しよう。

<QuestionList topicId="02_variables_and_types" category="java/basics" />
```

### 個別表示

特定の問題だけ表示する場合：

```mdx
<QuestionRenderer id="java/basics/02_variables_and_types#variables_concept" />
```

---

## 8. 採点・達成フラグの仕組み

### 自動採点

| 形式 | 採点 | 判定ロジック |
|------|------|-------------|
| `multipleChoice` | 自動 | 選択したIDのSet比較（完全一致） |
| `fillInBlank` | 自動 | 各空欄ごとに正解パターンと比較（大文字小文字不問） |
| `freeText` | なし | ユーザーが解答例と自己比較 |

### 達成フラグの動作

| アクション | 達成状態 |
|-----------|---------|
| 選択/穴埋めで正解 | 自動で達成済み |
| 選択/穴埋めで不正解 | 自動で未達成 |
| 「解答を表示する」（freeText） | 変化なし |
| 「諦めて解答を表示する」 | 未達成に戻す |
| ユーザーが手動チェック | 任意に切替可能 |

### 穴埋め問題の部分正解

- 各空欄の正誤が個別に表示される（緑: 正解、赤: 不正解）
- **全空欄が正解の場合のみ** 達成済みとなる

---

## 9. UI動作仕様

### ヒント（hint）

- **表示条件**: frontmatter に `hint` フィールドがある問題のみ表示
- **UIイメージ**: 「ヒントを表示」ボタン → Collapse でトグル表示
- **独立性**: 採点ボタンや解答表示とは独立して動作する
- **実装状況**: 未実装（将来のコード変更で対応予定）

> 現時点では、MDX本体に直接ヒントを記述してもよい。

### 解答 + 解説

- 選択/穴埋め: 「採点する」ボタン押下後に自動表示（Collapse アニメーション）
- freeText: 「解答を表示する」ボタンで表示
- Accordion コンポーネント内に「解答例」と「解説」を表示

### 達成チェックボックス

- 各問題の下部に表示
- 採点結果に連動して自動更新
- ユーザーが手動で切替可能
- localStorage に保存

---

## 10. 品質ガイドライン

### 質問タイトル

**核心原則: 答えを隠す**

質問タイトルに **具体的な答え（型名、キーワード、メタファー）を含めてはならない**。
詳細は `structure-ts-rules.md` を参照すること。

| ❌ 悪い例 | ✅ 良い例 |
|----------|----------|
| 「変数は『データを入れる箱』だとわかる」 | 「変数とは何かを説明できる」 |
| 「int型で整数を扱える」 | 「整数型の変数を宣言できる」 |
| 「`&&`は『かつ』を意味する」 | 「論理演算子を使える」 |

### 選択肢

- **3〜4個** の選択肢を用意する
- **紛らわしい誤答** を含める（学習者が間違えやすいポイントを反映）
- 正解が明らかすぎる選択肢は避ける
- 複数選択問題では、正解数が予測しにくい構成にする

### 穴埋めの正解パターン

- 大文字小文字の違い: 採点ロジックが `.toLowerCase()` で比較するため自動対応
- **セミコロンの有無** や **スペースの有無** など、入力のゆらぎは `string[]` で複数パターンを記載する

例:
```yaml
fillInBlankAnswers:
  blank1: ["&&", "& &"]       # スペース有無
  blank2: ["System.out.println", "system.out.println"]  # 大文字小文字は自動
```

### explanation の品質

- **である調** で統一する（「〜です」「〜ます」は使わない）
- **なぜその答えか** を説明する
- **よくある間違い** に言及する
- **関連知識** やコード例を含める
- Markdown形式で記述する（コードブロック、リスト等使用可）

---

## 11. 拡張ガイド

### 新しい問題形式の追加手順

新しい出題形式（例: ドラッグ&ドロップ、マッチング等）を追加する場合：

1. **型定義**: `docs/src/types/question.ts`
   - `QuestionFormat` に新形式を追加
   - `QuestionMetadata` に必要なフィールドを追加
   - `UserAnswer` に新形式の回答型を追加

2. **採点ロジック**: `docs/src/lib/grading.ts`
   - 新形式用の採点関数を追加

3. **入力コンポーネント**: `docs/src/components/question/inputs/`
   - 新しい入力UIコンポーネントを作成

4. **レンダラー更新**: `docs/src/components/QuestionRenderer.tsx`
   - 新形式の分岐を `handleGrade()` と JSX に追加

### コード変更が必要なファイル一覧

| ファイル | 役割 |
|---------|------|
| `docs/src/types/question.ts` | 型定義 |
| `docs/src/lib/grading.ts` | 採点ロジック |
| `docs/src/components/QuestionRenderer.tsx` | 問題表示・採点実行 |
| `docs/src/components/question/inputs/` | 入力UIコンポーネント群 |
| `docs/src/components/question/GradingFeedback.tsx` | 採点結果表示 |
| `docs/src/components/question/AchievementCheckbox.tsx` | 達成チェックボックス |
| `docs/src/components/question/HintLink.tsx` | ヒントリンク |
| `docs/src/components/question/CodeBlock.tsx` | コードブロック（穴埋め用） |
| `docs/src/components/QuestionList.tsx` | 問題一覧表示 |
| `docs/src/components/QuestionDialog.tsx` | ダイアログモード表示 |
| `docs/src/structure.ts` | トピック・問題のマスタデータ |

---

## 12. チェックリスト

問題作成後、以下を確認すること：

### Frontmatter

- [ ] `id` が `{category}/{topicId}#{questionId}` 形式になっているか
- [ ] `format` フィールドが明示的に指定されているか
- [ ] `type` が `KNOW` / `READ` / `WRITE` のいずれかか
- [ ] `difficulty` が `Easy` / `Medium` / `Hard` のいずれかか
- [ ] `topicId` と `category` が structure.ts の定義と一致しているか
- [ ] `explanation` がである調で書かれているか

### 選択問題

- [ ] `multipleSelect` が正しく設定されているか
- [ ] `choices` が3〜4個あるか
- [ ] `answers.correct` に正解IDが配列で指定されているか
- [ ] 紛らわしい誤答が含まれているか

### 穴埋め問題

- [ ] `fillInBlankAnswers` が設定されているか（必須）
- [ ] 各 `<BlankInput id="..." />` の `id` が `fillInBlankAnswers` のキーと一致しているか
- [ ] 入力のゆらぎ（スペース有無等）を `string[]` で対応しているか
- [ ] `sampleAnswer` に完成した解答例があるか

### コーディング問題

- [ ] `<OneCompilerCodeBlock>` に適切なスケルトンコードが含まれているか
- [ ] 要件が明確に箇条書きされているか

### structure.ts

- [ ] 対応するTopicに `questionId` 付きのQuestionが定義されているか
- [ ] `questionId` がファイル名（.mdx除く）と完全一致しているか
- [ ] `title` に答えが見えていないか

### ファイル配置

- [ ] ファイルパスが `docs/src/questions/{category}/{topicId}/{questionId}.mdx` か
- [ ] ファイル名がスネークケースか

### 動作確認

- [ ] 開発サーバーで問題が正しく表示されるか
- [ ] 選択/穴埋め問題の採点が動作するか
- [ ] ダッシュボードに問題が表示されるか
- [ ] 達成チェックボックスが動作するか
