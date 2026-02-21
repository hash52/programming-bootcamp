# DB教材と問題システムの調査結果（2026-02-20）

## 1. DB教材ファイル構成

### 教材ファイル（docs/docs/db/）
- **db/basics/**: 基礎章（4章）
  - 00_ai_and_database.mdx（序章）
  - 01_why_database.mdx（第1章）
  - 02_table_design.mdx（第2章）
  - 03_crud_operations.mdx（第3章）
- **db/select/**: SELECT章（3章）
  - 04_select_basics.mdx（第4章）
  - 05_where_and_order.mdx（第5章）
  - 06_aggregation.mdx（第6章）
- **db/design/**: 設計章（3章）
  - 07_normalization.mdx（第7章）
  - 08_join.mdx（第8章）
  - 09_er_diagram.mdx（第9章）

### 問題ファイル（docs/src/questions/db/）
- **db/basics/** 配下に問題MDXファイルが存在
- 例：`insert_data.mdx`, `foreign_key_role.mdx` 等
- 現在は基礎章のごく一部のみ問題ファイルが実装されている

## 2. structure.tsのDB関連Topic定義

### DB/basics の例（2005-2147行目）
- Topic ID: `01_why_database`, `02_table_design`, `03_crud_operations`
- **すべてのQuestionに `questionId` フィールドが設定されている**（新形式）
- 例：
  ```typescript
  questionId: "insert_data",
  title: "データを追加できる",
  type: "WRITE",
  difficulty: Difficulty.Easy,
  ```

### DB/select の例（2153-2203行目）
- Topic ID: `04_select_basics`, `05_where_and_order`, `06_aggregation`
- **すべてのQuestionに `questionId` が設定されている**

### DB/design の例（2319-2490行目）
- Topic ID: `07_normalization`, `08_join`, `09_er_diagram`
- **すべてのQuestionに `questionId` が設定されている**

## 3. 問題タイプと採点機能

### 問題形式（QuestionFormat）
- **"multipleChoice"**: 選択肢から選ぶ（自動採点あり）
- **"fillInBlank"**: 穴埋め（自動採点あり）
- **"freeText"**: 自由記述（自動採点なし）

### 採点ロジック（lib/grading.ts）
```typescript
// 選択式問題
gradeMultipleChoice(userAnswer, correctAnswer): QuestionResult

// 穴埋め問題
gradeFillInBlank(userBlanks, correctAnswers): QuestionResult
  - 各空欄を個別に採点
  - 大文字小文字を区別しない（toLowerCase()）
  - 複数の正解パターンに対応（配列or単一値）
  - 各空欄の正誤情報（blankResults）を返す
```

### 自動採点に対応した問題形式
- **KNOW問題**: multipleChoice形式（複数選択可）
- **WRITE問題**: fillInBlank形式（SQL穴埋め）
- **READ問題**: multipleChoice形式（理解度確認）

## 4. INSERT/UPDATE/DELETE対応の現状

### 既存のDB問題例
- **insert_data.mdx**: fillInBlank形式
  - 空欄1: ["INSERT INTO", "insert into", "INSERT  INTO", "insert  into"]
  - 空欄2: ["VALUES", "values"]
  - 自動採点対応、大文字小文字不問

### WRITE系SQL対応について
- ✅ INSERT: fillInBlankで対応可能（穴埋め形式）
- ✅ UPDATE: fillInBlankで対応可能（条件付き更新）
- ✅ DELETE: fillInBlankで対応可能（条件付き削除）
- **現在、完全な結果検証（結果セット比較）の採点機能はない**
- 穴埋め形式で「正しいSQLの記述」を検証する方式

## 5. OneCompilerCodeBlock

### 実装状況
- src/components/OneCompilerCodeBlock.tsx
- OneCompiler iframeの埋め込み
- codeId="TODO" となっているファイルが多い（実際のコードIDを設定していない）
- オフラインモード対応（codeId="TODO"の場合、Prism.js でローカル表示）

### サポート言語
- "java" | "mysql" | "postgresql" | "html"

### 機能
- code prop でコード内容を指定
- hideRun, hideResult, hideStdin などで UI 制御可能
- オフラインモードで自動的にシンタックスハイライトに切り替わる

## 6. コンポーネント構造

### QuestionRenderer.tsx
- MDXの frontmatter からメタデータ取得
- 問題形式に応じた入力UI を表示
  - multipleChoice → MultipleChoiceInput
  - fillInBlank → BlankInput
  - freeText → テキスト入力なし
- handleGrade() で採点実行
- 正解なら自動的に達成済みにマーク

### DojoQuestionView.tsx
- 複数問題の出題・進捗管理
- プログレスバー表示
- WRITE系の自動採点対応（fillInBlank形式）
- 未達成問題のみ再出題機能

### BlankInput コンポーネント
- 穴埋め問題の入力欄
- BlankInputContext で状態管理

## 7. 既知の制限事項

### SQL自動採点の制限
- **結果検証型採点がない**
  - 例：「このSELECT文を実行した結果を比較」
  - 理由：ブラウザではSQLをサーバなしで実行できない
- **穴埋め型のみ対応**
  - 決まった形式（「INSERT INTO」など）の記述を検証
  - 同等の異なる記述は判定できない可能性がある

### codeIdについて
- 現在、多くの OneCompilerCodeBlock に "TODO" が設定されている
- 後で実際のコードIDに置き換える必要がある（OneCompiler登録後）

## 8. Java教材の問題形式との比較

### Java問題（既存）
- format: "freeText"（自由記述）、"multipleChoice"、"fillInBlank"
- WRITE型も "freeText" を使用（自動採点なし）
- 解答例と解説のみ提供

### DB問題（新実装）
- format: "fillInBlank"（穴埋め）、"multipleChoice"
- WRITE型は "fillInBlank" で自動採点対応を目指す
- INSERT/UPDATE/DELETE は穴埋め形式で実装可能

## 重要な設計上の決定

1. **questionIdの統一**: DB全章で新形式（questionId指定）を採用済み ✅
2. **SQL記述の自動採点**: 穴埋め形式での部分的検証（完全な結果検証ではない）
3. **WRITE系SQL**: INSERT/UPDATE/DELETE も fillInBlank で対応可能
4. **学習目標の構造**: structure.ts の Topic・Question は完全に定義されている

