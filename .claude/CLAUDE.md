# プログラミングブートキャンプ教材 - Claude Code指示

このファイルは、Claude Code が本プロジェクトで教材を作成・編集する際に参照すべき指示をまとめたものである。

---

## 共通ナレッジベース

教材作成のルールは `knowledge/` に集約されている。
**作業開始前に `knowledge/README.md` を参照し、作業内容に応じた適切なドキュメントを読むこと。**

### 主要ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `knowledge/guides/project-overview.md` | プロジェクト概要・対象者特性 |
| `knowledge/guides/writing-style.md` | 文体・表記ルール |
| `knowledge/guides/chapter-structure.md` | 章構成テンプレート |
| `knowledge/guides/structure-ts-rules.md` | structure.ts・質問タイトルルール |
| `knowledge/guides/mdx-syntax.md` | MDX構文ルール |
| `knowledge/guides/admonitions-guide.md` | Admonitions活用ガイド |
| `knowledge/guides/exercise-rules.md` | 演習問題作成ルール |

### シラバス参照ルール

⚠️ `syllabi/` 内のファイルは分量が大きいため、**必要時のみ参照** すること。

- `java-design-summary.md` で概要を把握
- 詳細が必要な場合のみ `java-design.md` の **該当章のみ** を参照
- **全文を読み込まないこと**（java-design.md は 2,200行以上）

---

## Claude Code 固有設定

### Serenaメモリの活用

Serenaは、プロジェクトに関する重要な情報をメモリファイルとして保存・参照できるシステムである。
教材作成の一貫性を保つため、積極的に活用すること。

#### メモリに保存すべき情報
- **完成した章の構成や特徴**（例：Java第1章の教材構成、MDXルール適用状態）
- **設計上の重要な決定事項**（例：なぜこの順序で説明するか、なぜこの例を使うか）
- **頻繁に参照する教材テンプレート**（例：標準的な章構成パターン）
- **プロジェクト固有の用語や表記ルール**

#### メモリの活用方法
1. **新しい章を作成する前に**、関連する既存のメモリを参照する
   - 例：Java第2章を作成する際は、`java_01_java_basics_content`メモリを参照して文体や構成を揃える
2. **重要な章を完成させた後**、その構成や特徴をメモリに保存する
   - `mcp__serena__write_memory`ツールを使用
3. **一貫性が求められる作業**では、必ず過去のメモリを確認する

#### メモリの命名規則
- **章別メモリ**：`java_XX_chapter_name_content`（例：`java_01_java_basics_content`）
- **設計判断メモリ**：`design_decisions_YYYYMMDD`
- **テンプレートメモリ**：`template_chapter_structure`

---

## 実装ロードマップ

教材作成は、各技術分野について「**設計 → 教材作成 → structure.ts追加**」のサイクルを繰り返す。
全ての設計を終えてから教材作成に移るのではなく、1つの分野ごとに完結させていく。

### Phase 1: 全体設計
- [x] 全体設計書の作成

### Phase 2: Java教材の作成
- [x] Java設計書の作成
- [ ] Java教材の作成（16章）
- [ ] structure.tsへのJava関連Topic追加

### Phase 3: HTML/CSS教材の作成
- [ ] HTML/CSS設計書の作成
- [ ] HTML/CSS教材の作成
- [ ] structure.tsへのHTML/CSS関連Topic追加

### Phase 4: SQL教材の作成
- [ ] SQL設計書の作成
- [ ] SQL教材の作成
- [ ] structure.tsへのSQL関連Topic追加

### Phase 5: Git教材の作成
- [ ] Git設計書の作成
- [ ] Git教材の作成
- [ ] structure.tsへのGit関連Topic追加

### Phase 6: 演習問題作成フェーズ
- [ ] 各達成目標に対応する演習問題の作成

### Phase 7: レビュー・改善フェーズ
- [ ] 教材の相互レビュー
- [ ] サンプルコードの動作確認
- [ ] 誤字脱字のチェック

### Phase 8: 各章のブラッシュアップフェーズ
- [ ] 各章の内容を見直し、改善点を洗い出す
- [ ] 説明の分かりやすさを向上させる
- [ ] サンプルコードの充実度を確認
- [ ] 演習問題の適切性を検証
- [ ] 受講生からのフィードバックを反映

---

## 各技術分野の詳細設計

各技術分野ごとの詳細なカリキュラム設計は、以下のファイルを参照すること：

| 設計書 | 対応するカリキュラム | カテゴリ |
|--------|---------------------|----------|
| `knowledge/syllabi/java-design.md` | Day 1-3, 6-15 | java/basics, java/oop, java/stdlib |
| `knowledge/syllabi/html-css-design.md` | Day 4, 9, 14 | frontend |
| `knowledge/syllabi/sql-design.md` | Day 5, 10, 15 | db |
| `knowledge/syllabi/git-design.md` | Day 7, 20 | git |
| `knowledge/syllabi/spring-design.md` | Day 16-19 | spring（既存教材を活用） |

**注意:** 教材作成時は、必ず該当する詳細設計ファイルを参照すること。

---

## 補足

### 既存教材について
- **Spring教材**（`docs/docs/spring/`）とダッシュボード機能は完成度が高いため、**そのまま保持**する
- **Java基礎教材**の一部（`if.mdx`, `loops.mdx`）は仮実装であるので、削除しても構わない

### 教材の改善
既存の教材を参考にしつつ、`knowledge/guides/` のルールに従って新しい教材を作成する。
文体や構成に一貫性を持たせることを重視する。

---

以上
