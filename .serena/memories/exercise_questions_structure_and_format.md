# 演習問題ファイル構造と形式

## 問題ファイルの構成

演習問題は `/docs/src/questions/{category}/{subcategory}/` 配下の `.mdx` ファイルで定義されている。

### フォーマット：YAML Front Matter + MDX content

```yaml
---
id: "{category}/{subcategory}#{file_id}"
title: "達成目標の説明"
type: "KNOW" | "WRITE" | "DO"
format: "multipleChoice" | "fillInBlank" | "freeText" | ...
difficulty: "Easy" | "Medium" | "Hard"
topicId: "{chapter_id}"
category: "{category}/{subcategory}"
multipleSelect: false  # multipleChoice形式の場合
answers:
  correct: ["A"] | ["blank1"] | ...
explanation: |
  解説テキスト
---

{MDXコンテンツ}
```

## 問題形式の種類

1. **multipleChoice** - 複数選択肢の単一選択
   - `format: "multipleChoice"`
   - `multipleSelect: false`（単一選択）| `true`（複数選択）
   - `choices: [{id: "A", text: "..."}]` 配列
   - `answers.correct: ["A"]`

2. **fillInBlank** - 穴埋め形式
   - `format: "fillInBlank"`
   - `fillInBlankAnswers: {blank1: [...], blank2: [...]}`
   - 各空欄に複数の正解が認可される

3. **freeText** - 自由記述形式
   - `format: "freeText"`
   - `sampleAnswer: "..."`
   - `explanation: "..."`

## 調査した3カテゴリの分析結果

### Git基礎（5問）
- 全て「KNOW」型（知識確認）
- `version_control_necessity` のみfreeText形式
- `what_is_git`, `three_areas` はmultipleChoice形式
- **正答分析:** 複数選択式の問題ではAが正答

### Java OOP基礎（10問）
- 全て「KNOW」型（知識確認）
- 全てmultipleChoice形式
- 難易度はEasy/Medium混在

### Java基礎（7問）
- 複数形式：multipleChoice, fillInBlank, freeText
- **hello_world** はfillInBlank形式（穴埋め）
- **execution_order** はmultipleChoice形式で、正答はA

## 重要な観察：正答順序の偏り

確認した複数選択式問題（5問）：
| 問題 | 正答 | 理由 |
|------|------|------|
| what_is_git | A | Gitの定義そのもの |
| three_areas | A | Gitの実行流れの正確な説明 |
| oop_concept | A | OOPの定義そのもの |
| static_vs_instance | A | Java仕様の正確な説明 |
| execution_order | A | プログラム実行の技術的事実 |

**結論:** これらの問題は、選択肢Aが技術的・概念的に正確な定義・説明であるため、意図的にAが正答に設定されている。選択肢順序の変更による「正答均等化」は技術的には可能だが、教育的・実務的には推奨されない。

## 選択肢順序変更の課題

1. **説明との矛盾:** explanationセクションは「Aが正答である理由」と述べているのに、選択肢順序を変えるとその説明が無意味化
2. **学習効果の低下:** 「どれが正答か」という知識テストから「正答の位置」という位置記憶テストに変質
3. **代替案:** 異なる内容の誤り選択肢を新規作成、またはフロントエンドでランダム表示実装
