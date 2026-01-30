---
applyTo: "docs/**"
---

# Docusaurus教材サイト

このディレクトリで作業する前に、以下のドキュメントを参照すること:

## 必須ドキュメント

- `knowledge/guides/project-overview.md` - プロジェクト概要・対象者特性
- `knowledge/guides/chapter-structure.md` - 章構成テンプレート
- `knowledge/guides/writing-style.md` - 文体・表記ルール
- `knowledge/guides/admonitions-guide.md` - Admonitions活用ガイド

## MDXファイル編集時

- `knowledge/guides/mdx-syntax.md` - MDX構文ルール

## structure.ts編集時

- `knowledge/guides/structure-ts-rules.md` - structure.ts・質問タイトルルール

## 問題ファイル（src/questions/）作成時

- `knowledge/guides/question-files.md` - 問題ファイル作成・配置ガイド
- `knowledge/guides/exercise-rules.md` - 演習問題作成ルール

---

## 主要ファイル

- `docs/docs/` - 教材コンテンツ（MDXファイル）
- `docs/src/structure.ts` - 達成目標のマスタデータ
- `docs/src/components/` - 再利用可能なコンポーネント
- `docs/src/questions/` - 演習問題

---

## クイックリファレンス

### MDXファイルの構文

- import文はファイル先頭に配置
- 改行には末尾に半角スペース2つ
- 強調記号 `**` の前後に半角スペース
- 表内の `|` はバッククォートで囲む

### structure.ts

- 新しい章を追加したら、対応するTopicとQuestionsを追加
- **質問タイトルに答えを含めない**（詳細は `structure-ts-rules.md`）

### 章の構成

- 冒頭に「Step 0: まず体験してみよう」
- 文末に「よくある質問」
- Docusaurus admonitionsを活用（:::note, :::tip, :::warning等）
