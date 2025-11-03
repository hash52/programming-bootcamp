# description: Java教材の章を作成する際に自動的に呼び出される

ユーザーがJava教材の章作成を依頼した場合、以下の手順で作成してください。

---

## 判定条件

以下のいずれかに該当する場合、このSKILLを実行する：

- 「Java第X章を作成」
- 「変数と型の教材を作成」
- 「Javaの〇〇の章を作成」
- その他、Java教材の章作成を明示的に依頼された場合

---

## 実行手順

### 1. 設計書とルールの確認

まず、以下のファイルを読み込んで確認する：

1. **Java設計書**: `.claude/curriculum/01_java-design.md`
   - 対象章の詳細設計を確認
   - 学習目標、章構成、structure.tsへの定義を把握

2. **CLAUDE.md**: `.claude/CLAUDE.md`
   - 教材作成ルール（文体、MDXルール、admonitionsの使い方など）を確認

3. **既存のSerenaメモリ**:
   - `java_*`関連のメモリがあれば参照し、一貫性を保つ
   - 特に最新の章のメモリを参考にする

### 2. 教材ファイルの作成

以下の構成でMDXファイルを作成する：

```markdown
import { OneCompilerCodeBlock } from "@site/src/components/OneCompilerCodeBlock";

# 章タイトル

この章では、〇〇について学ぶ。
（改行する場合は半角スペース2つ + 改行を使用）

## この章で学ぶこと

- 学習目標1
- 学習目標2
- 学習目標3

## なぜこの技術が必要か

**〇〇がないとどうなるか？**

〇〇がないと、△△という問題が発生する。

**例：**
```java
// 悪い例（技術がない場合）
コード例
```

```java
// 良い例（技術がある場合）
コード例
```

## 基本概念

### サブセクション1

説明文...

### サブセクション2

説明文...

:::info 【言語による違い】
言語によって異なる場合のみ、この注釈を入れる。
例：「Javaではセミコロン`;`が必須だが、Pythonでは不要」
:::

:::tip ポイント
学習のコツや重要なポイントを強調
:::

:::caution 重要
特に注意すべき仕様や、間違えやすいポイント
:::

:::warning 注意
よくあるエラーや間違い
:::

## 実例

以下のコードを実行してみよう。

<OneCompilerCodeBlock
  language="java"
  code={`
public class Main {
    public static void main(String[] args) {
        // サンプルコード
        System.out.println("Hello");
    }
}
`}
/>

**やってみよう：**
- 変数の値を変えて実行してみよう
- 結果がどう変わるか確認しよう

## まとめ

この章では、以下のことを学んだ：

- ポイント1
- ポイント2
- ポイント3

次の章では、〇〇について学ぶ。

## 演習

この章の演習問題は、Phase 6で作成予定である。
```

#### 重要な記述ルール

**文体**:
- である調で統一
- 簡潔でわかりやすい文章

**専門用語**:
- 必ず注釈を入れる
- 例：「コンパイル（人間が書いたコードを機械語に変換すること）」

**MDXルール**:
- import文はファイルの先頭に配置
- 改行は半角スペース2つ + 改行（`  \n`）
- 強調記号`**`の前後に半角スペース
- 表内の演算子や特殊文字はバッククォートで囲む
  ```markdown
  | 演算子 | 意味 |
  |--------|------|
  | `+` | 加算 |
  | `<` | 小なり |
  ```

**admonitionsの使い方**:
- `:::info 【言語による違い】`: 言語によって異なる場合のみ使用
- `:::tip ポイント`: 学習のコツ
- `:::caution 重要`: 注意すべき仕様
- `:::warning 注意`: よくあるエラー
- `:::note 補足`: 技術的な背景
- 1つの章に3〜5個程度を目安

**OneCompilerCodeBlockの活用**:
- 可能な限り実行可能なコードを提示
- 「やってみよう」「実験してみよう」などの促しを適切に配置
- 全てのコードで実行を促す必要はない（学習に効果的な箇所のみ）

#### ファイル配置

章のカテゴリに応じて適切なディレクトリに配置：

- **java/basics（第1-8章）**: `docs/docs/java/basics/XX_章名.mdx`
- **java/oop（第9-14章）**: `docs/docs/java/oop/XX_章名.mdx`
- **java/stdlib（第15-16章）**: `docs/docs/java/stdlib/XX_章名.mdx`

ファイル名の例：
- `01_java_basics.mdx`
- `02_variables_and_types.mdx`
- `03_operators.mdx`

### 3. structure.tsへのTopic追加

`docs/src/structure.ts`に、作成した章に対応するTopicとQuestionsを追加する。

設計書に記載されている定義をそのまま追加する：

```typescript
withAutoIds({
  id: "chapter_id",
  label: "章タイトル",
  category: "java/basics",  // または java/oop, java/stdlib
  questions: [
    {
      title: "達成目標1",
      type: "KNOW",  // KNOW / READ / WRITE
      difficulty: Difficulty.Easy,  // Easy / Medium / Hard
    },
    // ... 他の達成目標
  ],
})
```

**重要**: 設計書に記載されているQuestionの定義をそのまま使用すること。

### 4. Serenaメモリへの保存

作成した章の構成や特徴をSerenaメモリに保存する。

#### メモリ名

`java_XX_chapter_name_content`（例：`java_02_variables_and_types_content`）

#### 保存内容

以下の情報を含める：

- 章の構成（どのセクションを含めたか）
- 使用したadmonitionsのパターンと配置理由
- OneCompilerCodeBlockの活用方法（どこで実行を促したか）
- 初学者への配慮ポイント（どのように説明を工夫したか）
- 次章以降で参考にすべき点
- 設計書との差異（もしあれば）

### 5. 作成後の確認

以下のチェックリストを確認する：

- [ ] MDXファイルが正しい場所に配置されている
- [ ] import文がファイルの先頭にある
- [ ] 文体がである調で統一されている
- [ ] 専門用語に注釈が付いている
- [ ] MDXルール（改行、強調記号、特殊文字）が守られている
- [ ] admonitionsが適度に使用されている（3〜5個程度）
- [ ] OneCompilerCodeBlockが適切に配置されている
- [ ] structure.tsにTopicとQuestionsが追加されている
- [ ] Serenaメモリに保存されている

### 6. ユーザーへの報告

作成完了後、以下の情報をユーザーに報告する：

```
Java第X章「章タイトル」の作成が完了しました。

【作成ファイル】
- docs/docs/java/カテゴリ/XX_章名.mdx

【structure.ts】
- Topic ID: chapter_id
- Questions: X個追加

【Serenaメモリ】
- java_XX_chapter_name_content に保存

【次のステップ】
- ブラウザでプレビューして表示を確認してください
- 次の章を作成する場合は、同様に依頼してください
```

---

## 補足

- このSKILLは**教材本文の作成**に特化しています
- **演習問題の作成**は別途Phase 6で行います
- 複数の章を一度に作成する場合は、1章ずつ順番に作成してください
- 設計書に記載されていない内容を追加する場合は、ユーザーに確認してください

---

## エラーハンドリング

以下の場合はユーザーに確認する：

- 指定された章が設計書に存在しない場合
- ファイルが既に存在する場合（上書きするか確認）
- structure.tsに既に同じIDのTopicが存在する場合
