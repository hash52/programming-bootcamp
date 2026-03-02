# 追加演習機能 仕様書（AIコンテキスト）

このドキュメントは、道場システムに追加した「追加演習（コーディング問題）」機能の設計・実装をまとめたものである。
AI（Claude Code 等）が次回以降の作業で迷わないよう、重要な決定事項・制約・ファイル構成を記録する。

---

## 目的と設計方針

Paizaスキルチェック形式のコーディング問題（自力実装して OneCompiler で動作確認）を追加演習として提供する。

- **既存のダッシュボード達成率には影響しない**独立した問題セット
- フィルタ・共有・プリセット等の既存機能は透過的に再利用
- 採点は自動判定せず、受講生が自分でチェックボックスをつける

---

## ファイル構成

### マスタデータ

```
docs/src/extraExercises.ts
```

追加演習の全テーマ・グループ・問題を定義する唯一のマスタファイル。
`ExtraTheme` → `ExtraGroup` → `ExtraExercise` の3階層構造。

```typescript
export const ALL_EXTRA_THEMES: readonly ExtraTheme[] = [
  {
    id: "java",
    label: "Java",
    groups: [
      { id: "java_if",  label: "if文",          theme: "java", exercises: [...] },
      { id: "java_for", label: "for文・while文", theme: "java", exercises: [...] },
    ],
  },
  {
    id: "comprehensive",
    label: "総合演習",
    groups: [{ id: "general", label: "総合", theme: "comprehensive", exercises: [] }],
  },
];
```

### 問題MDXファイル

```
docs/src/questions/extra/{theme}/{groupId}/{questionId}.mdx
```

例：
- `docs/src/questions/extra/java/java_if/pass_fail.mdx`
- `docs/src/questions/extra/java/java_for/fizzbuzz.mdx`
- `docs/src/questions/extra/comprehensive/general/bmi_calc.mdx`（将来）

---

## 問題IDの形式

```
extra/{theme}/{groupId}#{questionId}
```

例：
- `extra/java/java_if#pass_fail`
- `extra/java/java_for#fizzbuzz`
- `extra/comprehensive/general#bmi_calc`

**`extra/` プレフィックス**により既存の問題IDと確実に区別できる。

---

## MDXフォーマット（`codingProblem`）

追加演習専用のフォーマット。フロントマターに `format: "codingProblem"` を指定する。

```yaml
---
id: "extra/java/java_if#pass_fail"
title: "合否判定を実装する"
type: "WRITE"
difficulty: "Easy"          # "Easy" | "Medium" | "Hard"
format: "codingProblem"
topicId: "java_if"
category: "extra/java"
language: "java"            # "java" | "mysql" | "postgresql" | "html"
hint: |
  ヒントのテキスト
sampleAnswer: |
  public class Main { ... }   # コードのみ（マークダウンのコードフェンス不要）
explanation: |
  解説のテキスト
---
```

### 重要なルール

- `sampleAnswer` には生のコードを書く（` ```java ``` ` などのMarkdownフェンスは不要）
- 問題本文は `## 問題` セクションから始める
- MDX本文末尾に `<OneCompilerCodeBlock>` を配置してスターターコードを提供する
- 「達成済みにチェックを入れよう」などの文言は一切書かない（QuestionRenderer側で自動表示）

### MDXの末尾テンプレート

```mdx
import { OneCompilerCodeBlock } from '@site/src/components/OneCompilerCodeBlock';

## 問題

（問題文）

<OneCompilerCodeBlock
  language="java"
  codeId="TODO"
  code={`public class Main {
    public static void main(String[] args) {
        // スターターコード
    }
}`}
/>
```

> `codeId="TODO"` は仮置き。OneCompilerに実際のIDを後で手動設定する（後方互換あり）。

---

## 章別グループの制約（最重要ルール）

**章別グループの問題は、そのグループが対応する章とそれ以前の章で登場した概念のみで解けるものとする。**

### Java基礎の実際の教授順序

structure.ts の Topic ID は必ずしも学習順と一致しない。**実際の教授順序**は以下：

```
01_java_basics
  → 02_variables_and_types
    → 03_operators
      → 04_if_statement
        → 03a_scanner      ← if文より後！
          → 03b_random     ← if文より後！
            → 05_loops
              → 06_arrays
                → 07_methods
                  → 08_multiple_classes
                    → 09_exception_handling
```

> ⚠️ `03a_scanner` はIDが小さいが**if文より後で教える**。同様に `03b_random` も後。

### グループごとの利用可能概念

| グループID | 対応章 | 利用可能な概念 | 利用不可 |
|-----------|--------|--------------|---------|
| `java_if` | 04_if_statement | 基本構文・変数・型・演算子（`%`・`&&`・`||`）・if/else/switch | Scanner・Random・ループ・配列・メソッド |
| `java_for` | 05_loops | 上記 + Scanner + Random + for/while | 配列・メソッド |

### 検証方法

新しい問題を追加する前に、structure.ts で該当Topicの前後関係を確認し、問題のサンプル解答が制約に違反していないかチェックする。

---

## 難易度基準（Java追加演習）

| 難易度 | 基準 |
|--------|------|
| EASY | 条件分岐1〜2個、ハードコードされた変数のみ、全くの初学者でも解ける |
| NORMAL | 複数の条件分岐 or switch文、境界値の考慮が必要 |
| HARD | ループ + 条件分岐の組み合わせ、アルゴリズム的な思考が必要 |

### 現在の問題一覧

**java_if グループ（04_if_statement まで）**

| questionId | 難易度 | 概要 |
|-----------|--------|------|
| `pass_fail` | EASY | 点数（ハードコード）が60以上なら合格、未満なら不合格 |
| `season_judgment` | NORMAL | 月（ハードコード）から季節を switch で判定 |

**java_for グループ（05_loops まで）**

| questionId | 難易度 | 概要 |
|-----------|--------|------|
| `sum_calculation` | EASY | 1〜100の合計をforループで計算 |
| `fizzbuzz` | NORMAL | 1〜100のFizzBuzz（for + if/else if） |

---

## 実装済みコンポーネントの変更点

### `docs/src/types/question.ts`

- `QuestionFormat` に `"codingProblem"` を追加
- `QuestionMetadata` に `language?: "java" | "mysql" | "postgresql" | "html"` を追加

### `docs/src/components/lib/calcProgressRate.ts`

- `calcOverallProgressRate` で `extra/` プレフィックスのIDをダッシュボード達成率から除外

```typescript
const done = Object.keys(progress).filter(
  (id) => !id.startsWith("extra/")
).length;
```

### `docs/src/lib/dojoFilter.ts`

- `resolveDojoQuestions` の問題プールに `getAllExtraQuestionsAsQuestion()` を追加

### `docs/src/lib/dojoShare.ts`

- `DojoShareData` に `extraIds?: string[]` を追加（v1維持、後方互換）
- encode: `extra/` IDを `extraIds` に分離
- decode: `extraIds` があれば追加演習IDとして復元

### `docs/src/components/QuestionRenderer.tsx`

- `codingProblem` フォーマット用の「解答例を見る」ボタンを追加
- 解答アコーディオンに `OneCompilerCodeBlock offline={true}` で `sampleAnswer` を表示

### `docs/src/components/dojo/DojoTopicSelector.tsx`

- 「追加演習」セクションをトピックツリー下部に追加（Theme → Group → Exercise の3階層）
- 選択IDは既存の `localChecked: Set<string>` に混在（型変更なし）

### `docs/src/components/dojo/DojoFilterPanel.tsx`

- 追加演習の選択数を示す「追加演習(N問)」チップを追加
- WRITE タイプチップの下に `※ WRITE にはコーディング問題（追加演習）も含まれます` の注記を追加

### `docs/src/components/dojo/DojoContent.tsx`

- `handleImport`・`handleRetryWrong` の問題プールを拡張し追加演習を含めた

---

## 新しい問題を追加する手順

1. **MDXファイルを作成**
   - パス: `docs/src/questions/extra/{theme}/{groupId}/{questionId}.mdx`
   - フォーマット: 上記MDXフォーマット参照
   - 章制約: 利用可能な概念のみ使用

2. **`extraExercises.ts` にエントリを追加**
   - 対応するグループの `exercises` 配列に追加

3. **動作確認**
   - 道場で追加演習グループにチェックを入れて問題が表示されることを確認
   - ダッシュボードの達成率が変化しないことを確認

---

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `docs/src/extraExercises.ts` | マスタデータ・ユーティリティ |
| `docs/src/questions/extra/**/*.mdx` | 問題MDXファイル群 |
| `docs/src/types/question.ts` | QuestionFormat 型定義 |
| `docs/src/lib/dojoFilter.ts` | フィルタリングパイプライン |
| `docs/src/lib/dojoShare.ts` | 問題セット共有 |
| `docs/src/components/QuestionRenderer.tsx` | 問題レンダリング |
| `docs/src/components/dojo/DojoTopicSelector.tsx` | ツリー選択UI |
| `docs/src/components/dojo/DojoFilterPanel.tsx` | フィルターUI |
| `docs/src/components/dojo/DojoContent.tsx` | 道場セッション管理 |
| `docs/src/components/lib/calcProgressRate.ts` | ダッシュボード達成率計算 |
