# description: Java教材の章を作成する

以下の手順でJava教材の指定された章を作成してください。

## 前提条件

- Java設計書（`.claude/curriculum/01_java-design.md`）が存在すること
- CLAUDE.mdのルールに従うこと
- Serenaメモリを活用すること

## 作成手順

### 1. 設計書とルールの確認

1. `.claude/curriculum/01_java-design.md`を読み込み、対象章の詳細設計を確認する
2. `.claude/CLAUDE.md`を確認し、教材作成ルールを把握する
3. 既存のSerenaメモリ（特に`java_*`関連）があれば参照し、一貫性を保つ

### 2. 教材ファイルの作成

対象章のMDXファイルを以下の構成で作成する：

```markdown
# 章タイトル

## この章で学ぶこと
- 学習目標を箇条書き

## なぜこの技術が必要か
- 技術の必要性・背景を説明
- 「ないと何が困るか」→「だから必要」の流れで説明

## 基本概念
- 技術の基本的な説明
- 初学者向けに丁寧に解説

## 実例
- OneCompilerCodeBlockを活用した実行可能なサンプルコード
- コードには適切なコメントを付ける
- 「やってみよう」などの促しを適切に配置

## まとめ
- 章の要点を振り返り

## 演習（リンク）
- 演習問題へのリンク（Phase 6で作成予定）
```

#### 注意事項

- **文体**: である調で統一
- **専門用語**: 必ず注釈を入れる
- **MDXルール**:
  - import文はファイルの先頭に配置
  - 改行は半角スペース2つ + 改行
  - 強調記号`**`の前後に半角スペース
  - 表内の特殊文字はバッククォートで囲む
- **admonitions**:
  - `:::info 【言語による違い】`は言語によって異なる場合のみ使用
  - `:::tip`、`:::caution`、`:::warning`、`:::note`を適度に活用
- **図解**: 必要に応じてMermaid図を活用

#### ファイル配置

章のカテゴリに応じて適切なディレクトリに配置：

- java/basics（第1-8章）: `docs/docs/java/basics/XX_章名.mdx`
- java/oop（第9-14章）: `docs/docs/java/oop/XX_章名.mdx`
- java/stdlib（第15-16章）: `docs/docs/java/stdlib/XX_章名.mdx`

### 3. structure.tsへのTopic追加

`docs/src/structure.ts`に、作成した章に対応するTopicとQuestionsを追加する。

#### 追加例

```typescript
withAutoIds({
  id: "chapter_id",           // ファイル名に対応
  label: "章タイトル",        // ダッシュボードに表示されるラベル
  category: "java/basics",    // または java/oop, java/stdlib
  questions: [
    {
      title: "達成目標1",
      type: "KNOW",           // KNOW / READ / WRITE
      difficulty: Difficulty.Easy,  // Easy / Medium / Hard
    },
    // ... 他の達成目標
  ],
})
```

#### 注意事項

- Questionのタイプは設計書の内容に基づいて適切に設定
- 難易度も設計書に従う
- idはファイル名と一致させる

### 4. Serenaメモリへの保存

作成した章の構成や特徴をSerenaメモリに保存する。

#### メモリ名

`java_XX_chapter_name_content`（例：`java_01_java_basics_content`）

#### 保存内容

- 章の構成
- 使用したadmonitionsのパターン
- OneCompilerCodeBlockの活用方法
- 初学者への配慮ポイント
- 次章以降で参考にすべき点

### 5. 確認

作成後、以下を確認する：

- [ ] MDXファイルが正しい場所に配置されているか
- [ ] import文がファイルの先頭にあるか
- [ ] 文体がである調で統一されているか
- [ ] 専門用語に注釈が付いているか
- [ ] structure.tsにTopicとQuestionsが追加されているか
- [ ] Serenaメモリに保存されているか

---

## 使用例

```
/create-java-chapter

ユーザー: 第2章「変数と型」を作成してください
```

このコマンドを実行すると、上記の手順に従って第2章の教材が自動的に作成されます。

---

## 補足

- このコマンドは**教材本文の作成**に特化しています
- **演習問題の作成**は別途Phase 6で行います
- 複数の章を一度に作成する場合は、このコマンドを複数回実行してください
- 作成した教材は必ずブラウザでプレビューして、表示を確認してください
