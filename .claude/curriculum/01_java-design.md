# Java教材 - 詳細設計書

**作成日:** 2025年1月
**対象:** プログラミング未経験者（特に文系出身者）
**カリキュラム対応:** Day 1-3, 6-15

---

## 1. Java教材の全体構成

### 1.1 章立て一覧

| 章番号 | 章タイトル | カリキュラム対応 | カテゴリ | 推定学習時間 |
|--------|-----------|-----------------|----------|-------------|
| 第1章 | Javaとプログラミングの基礎 | Day 1前半 | java/basics | 0.5日 |
| 第2章 | 変数と型 | Day 1前半 | java/basics | 0.5日 |
| 第3章 | 演算子 | Day 1後半 | java/basics | 0.5日 |
| 第4章 | 条件分岐 | Day 2 | java/basics | 1日 |
| 第5章 | 繰り返し | Day 3前半 | java/basics | 0.5日 |
| 第6章 | 配列 | Day 3後半 | java/basics | 0.5日 |
| 第7章 | メソッド | Day 6 | java/basics | 1日 |
| 第8章 | 複数クラスの連携 | Day 7 | java/basics | 1日 |
| 第9章 | 例外処理 | Day 13 | java/basics | 1日 |
| 第10章 | オブジェクト指向の基礎 | Day 8 | java/oop | 1日 |
| 第11章 | コンストラクタ | Day 9 | java/oop | 1日 |
| 第12章 | 継承 | Day 11前半 | java/oop | 0.5日 |
| 第13章 | インターフェース | Day 11後半 | java/oop | 0.5日 |
| 第14章 | カプセル化 | Day 12 | java/oop | 1日 |
| 第15章 | コレクション | Day 14 | java/stdlib | 1日 |
| 第16章 | 日時操作 | Day 15 | java/stdlib | 0.5日 |

**合計:** 16章、約11.5日分

**改訂履歴:**
- 2025年11月4日: 第9章「例外処理」をjava/oopからjava/basicsに移動（OOPの前に基礎として学習）
- 2025年11月4日: 全章に実行可能コード（OneCompilerCodeBlock）と初学者向け警告（:::warning）を追加
- 2025年11月4日: 第10章にMermaid図解と用語表を追加

### 1.2 カテゴリ分類
- **java/basics**（第1-9章）: Java基礎文法（例外処理を含む）
- **java/oop**（第10-14章）: オブジェクト指向
- **java/stdlib**（第15-16章）: Java標準ライブラリ

---

## 2. 各章の詳細設計

---

## 第1章: Javaとプログラミングの基礎

### この章で得られるスキル
- プログラミング言語とは何かを説明できる
- Javaを学ぶメリットを理解している
- プログラムが「上から下に実行される」ことを理解している
- インデント（字下げ）の意味と重要性を理解している
- ブロック（`{}`）の役割を理解している
- Hello WorldプログラムをEclipseで書いて実行できる

### なぜこの技術が必要か
**なぜプログラミングを学ぶのか？**

コンピュータは人間の言葉を理解できない。そのため、コンピュータが理解できる「プログラミング言語」を使って指示を出す必要がある。

**例:**
```
人間の言葉: 「画面に『こんにちは』と表示して」
↓ コンピュータは理解できない
↓ プログラミング言語で書く必要がある
Java: System.out.println("こんにちは");
```

Javaは世界中で使われている、信頼性の高い言語である。Webアプリケーション、Androidアプリ、業務システムなど、幅広い場面で活用されている。

### 章構成
1. **プログラミング言語とは**
   - プログラミング言語の役割
   - プログラミング言語にはバージョンがある
     - **例:** Java 8, Java 11, Java 17, Java 21など
     - **例:** Python 2 と Python 3、JavaScript ES5 と ES6
     - バージョンによって書き方や機能が変わることがある
   - 本教材ではJava 17以降を前提とする

2. **Javaとは**
   - Javaの特徴（どこでも動く、安全、高速）
   - Javaを学ぶメリット
     - 求人が多い（企業の業務システムで広く使われている）
     - Androidアプリ開発ができる
     - 大規模な開発に向いている
   - Javaが使われている場面（Webアプリ、Androidアプリ、業務システム）

3. **Eclipseとは**
   - Eclipse（エクリプス）はJavaプログラムを書くための統合開発環境（IDE）
   - コードの補完、エラーチェック、実行などができる
   - 本教材ではEclipseがインストール済みであることを前提とする

4. **最初のJavaプログラム：Hello World**
   - まずは動かしてみることが大切
   - Hello Worldプログラムの提示（OneCompilerCodeBlockで実行可能）
   - Eclipseでの実行手順（4ステップ）
   - **補足:** Java 21以降では、より簡潔な書き方も可能
     ```java
     // Java 21以降の簡潔な書き方（参考）
      void main() {
        System.out.println("Hello Java!");
      }
     ```
     ただし、本教材では従来の書き方を使用する（理由: 旧来の書き方は広く使われており、最新の書き方はまだ普及していないため。また、最新バージョンはネット上に情報が少ないため）

5. **プログラムの大原則**
   - Hello Worldプログラムを例に、以下の大原則を説明
   - **原則1: Javaではmainメソッドを起点に実行が始まる**（Java特有）
   - **原則2: プログラムは上から下に実行される**（ほとんどの言語に共通）
   - **原則3: `{}`でブロックを作り、処理をまとめる**（ほとんどの言語に共通）
     - Hello Worldには2つのブロックがある（クラスのブロックとmainメソッドのブロック）
     - ブロックは入れ子構造（ネスト）になることがある
     - 今は2つのブロックがあることが分かれば十分
   - **原則4: セミコロン`;`で命令の終わりを示す**（Java特有）
     - セミコロンがあれば改行しなくても良い
     - 1行で書くこともできるが、非常に読みにくい
   - **原則5: インデント（字下げ）で構造を見やすくする**（ほとんどの言語に共通）
     - 3つのパターンで比較（改行なし、改行ありインデントなし、改行ありインデントあり）
     - 改行とインデントがあると最も読みやすい
   - **補足: どこで改行できるか？**
     - 細かいルールは今は覚えなくて良い
     - 読みやすい箇所で改行してみて、エラーが出たら戻す
     - 「とりあえずやってみて、体験して学ぶ」ことがプログラミング上達の近道
   - **コードの説明（振り返り）**
     - `public class`、`public static void main`、`System.out.println()`の簡単な説明

6. **Java 21以降の簡潔な書き方（参考）**
   - 従来の書き方を使用する理由

7. **コメント**
   - 1行コメント`//`（Java特有）
   - 複数行コメント`/* */`（Java特有）
   - なぜコメントが必要か（ほとんどの言語に共通）
   - OneCompilerCodeBlockで税率計算の例を示し、コード編集を促す

### 全体の方針
- **Java特有の内容**と**ほとんどの言語に共通する内容**を明確に区別する
- 各セクションの冒頭に「（Java特有）」または「（ほとんどの言語に共通）」と明記
- Hello Worldを先に体験させてから、大原則を説明する構成
- ブロック → セミコロン → インデントの順で説明
- 「とりあえずやってみて、体験して学ぶ」という姿勢を強調

### structure.tsへの定義
```typescript
withAutoIds({
  id: "java_basics",
  label: "Javaとプログラミングの基礎",
  category: "java/basics",
  questions: [
    {
      title: "プログラミング言語とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "Javaを学ぶメリットを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "プログラムは上から下に実行されることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "インデントの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "`{}`（波括弧）でブロックを作り、処理をまとめることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "EclipseでHello Worldプログラムを書いて実行できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
  ],
})
```

### 演習問題との対応
| Question ID | 演習ファイル | 内容 |
|-------------|-------------|------|
| `java/basics/java_basics#k1` | `k1.mdx` | プログラミング言語の役割を説明する問題 |
| `java/basics/java_basics#k2` | `k2.mdx` | Javaを学ぶメリットを選択する問題 |
| `java/basics/java_basics#k3` | `k3.mdx` | プログラムの実行順序を答える問題 |
| `java/basics/java_basics#k4` | `k4.mdx` | インデントの正しい使い方を選ぶ問題 |
| `java/basics/java_basics#k5` | `k5.mdx` | ブロックの範囲を答える問題 |
| `java/basics/java_basics#w1` | `w1.mdx` | EclipseでHello Worldを実装する問題 |

---

## 第2章: 変数と型

### この章で得られるスキル
- 変数とは何か、なぜ必要かを説明できる
- 基本データ型（int, double, boolean, String）を理解している
- 変数の宣言と初期化を正しく実装できる
- 型変換（キャスト）の基礎を理解している
- 変数のスコープを理解している

### なぜこの技術が必要か
**変数がないとどうなるか？**

変数がないと、計算結果を保存できず、同じ値を何度も書く必要がある。プログラムが非常に非効率になる。

**例:**
```java
// 変数がない場合（実際にはできないが、イメージとして）
System.out.println(100 + 200);
System.out.println(100 + 200); // 同じ計算を繰り返す
System.out.println(100 + 200);

// 変数がある場合
int sum = 100 + 200;
System.out.println(sum);
System.out.println(sum); // 簡単に再利用できる
System.out.println(sum);
```

変数を使うことで、値を保存し、何度でも使い回すことができる。

### 章構成
1. **変数とは**
   - 変数はデータを一時保存する「箱」
   - 変数には「名前」と「型」がある
   - OneCompilerCodeBlockで「変数がない場合」と「変数を使った場合」を比較

2. **変数の代入**
   - 代入とは、変数に値を入れること
   - **右辺の値が左辺の変数に代入される**
   - イコール記号`=`は「等しい」という意味ではない
   - `x = x + 5;`のような式の意味（数学とプログラミングの違い）
   - OneCompilerCodeBlockで代入の動作を確認

3. **基本データ型**
   - **初学者がよく使う型**を表にまとめる：
     - `int`（プリミティブ型：整数）
     - `double`（プリミティブ型：小数）
     - `boolean`（プリミティブ型：真偽値）
     - `String`（参照型：文字列）
   - **その他のプリミティブ型**（参考）：byte, short, long, float, char
   - **型名の大文字・小文字**に意味がある：
     - 小文字で始まる型：プリミティブ型
     - 大文字で始まる型：参照型（クラス）
     - この違いは後の章（オブジェクト指向）で詳しく学ぶ

4. **変数の宣言と初期化**
   - 宣言: `int age;`
   - 初期化: `age = 20;`
   - 宣言と初期化を同時に: `int age = 20;`
   - OneCompilerCodeBlockで複数の型の変数を宣言・初期化

5. **変数の命名規則**
   - 基本ルール（英字・数字・アンダースコア、数字から始められない、予約語は使えない）
   - **命名規則の用語**を表にまとめる：
     - キャメルケース（camelCase）
     - パスカルケース（PascalCase）
     - スネークケース（snake_case）
     - アッパースネークケース（UPPER_SNAKE_CASE）
   - Javaの推奨される命名規則：
     - 変数名：キャメルケース
     - クラス名：パスカルケース（後の章で学ぶ）
     - 定数：アッパースネークケース（後の章で学ぶ）

6. **適切な変数名をつける重要性**
   - なぜ適切な変数名が重要か（可読性、保守性）
   - 悪い例と良い例の比較
   - **Javadoc**で変数を説明する方法
   - Eclipse上でJavadocをホバー表示する機能

7. **Eclipseでの実行手順（おさらい）**
   - 第1章でHello Worldを実行したが、ここで改めて手順を確認
   - ステップ1: 新規Javaプロジェクトを作成（初回のみ）
   - ステップ2: 新規クラスを作成
   - ステップ3: コードを書く
   - ステップ4: 実行する
   - ステップ5: Javadocを試す

8. **型変換**
   - 暗黙の型変換（int → double）
   - 明示的な型変換（キャスト：double → int）
   - OneCompilerCodeBlockで型変換の動作を確認

9. **変数のスコープ**
   - スコープとは、変数が有効な範囲のこと
   - ブロック（`{}`）の中で宣言した変数は、そのブロック内でのみ使える
   - 第1章で学んだ「ブロック」のおさらい
   - 次章以降で、if文やfor文など複数のブロックが登場する
   - それぞれのブロックに独自のスコープがあることを理解しておく

### structure.tsへの定義
```typescript
withAutoIds({
  id: "variables_and_types",
  label: "変数と型",
  category: "java/basics",
  questions: [
    {
      title: "変数とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "基本データ型（int, double, boolean, String）を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "変数の宣言と初期化の違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "変数の命名規則を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "型変換（キャスト）の基礎を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "変数のスコープを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "変数を使ったプログラムのコードを読み取れる",
      type: "READ",
      difficulty: Difficulty.Easy,
    },
    {
      title: "変数を宣言・初期化するプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "型変換を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
9つのQuestionに対応する9つの演習問題を作成（k1-k6, r1, w1-w2）

---

## 第3章: 演算子

### この章で得られるスキル
- 算術演算子（+, -, *, /, %）を使いこなせる
- 括弧`()`で演算の優先順位を制御できる
- 比較演算子（==, !=, <, >, <=, >=）を理解している
- 論理演算子（&&, ||, !）を理解している
- インクリメント・デクリメント（++, --）を使える

### なぜこの技術が必要か
**演算子がないとどうなるか？**

演算子がないと、計算や条件判定ができず、プログラムで複雑な処理ができない。

**例:**
```java
// 演算子がないと...
// 「合計金額が1000円以上なら送料無料」という処理ができない

// 演算子があると...
int total = 1200;
if (total >= 1000) {
    System.out.println("送料無料");
}
```

### 章構成
1. **算術演算子**
   - 四則演算（+, -, *, /）
   - 剰余（%）の使い方
   - **括弧`()`で優先順位を制御**
     ```java
     int result1 = 2 + 3 * 4;    // 14 (掛け算が先)
     int result2 = (2 + 3) * 4;  // 20 (括弧が先)
     ```
     括弧を使うことで、計算の順番を明示的に指定できる

2. **比較演算子**
   - 等しい（==）、異なる（!=）
   - 大小比較（<, >, <=, >=）

3. **論理演算子**
   - AND（&&）
   - OR（||）
   - NOT（!）

4. **インクリメント・デクリメント**
   - `++`, `--`の使い方
   - 前置と後置の違い

5. **演算子の優先順位**
   - 括弧を使った優先順位の制御

### structure.tsへの定義
```typescript
withAutoIds({
  id: "operators",
  label: "演算子",
  category: "java/basics",
  questions: [
    {
      title: "算術演算子を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "括弧で演算の優先順位を制御できることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "剰余演算子（%）の使い方を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "比較演算子を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "論理演算子（&&, ||, !）を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "インクリメント・デクリメントの動作を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "演算子を使った式の結果を予測できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "演算子を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第4章: 条件分岐

### この章で得られるスキル
- if文の基本的な書き方を理解している
- if-else文を使いこなせる
- if-else if-elseの構造を理解している
- 条件式にboolean型の変数を使えることを理解している
- switch文の使い方を理解している
- 条件分岐を使ったプログラムを実装できる

### なぜこの技術が必要か
**条件分岐がないとどうなるか？**

条件分岐がないと、状況に応じた処理ができず、全てのパターンを別々に書く必要がある。プログラムが柔軟でなくなる。

**例:**
```java
// 条件分岐がないと...
// 年齢が18歳以上の人も、18歳未満の人も、同じメッセージしか表示できない
System.out.println("ようこそ");

// 条件分岐があると...
int age = 20;
if (age >= 18) {
    System.out.println("成人です");
} else {
    System.out.println("未成年です");
}
```

### 章構成
1. **if文の基礎**
   - if文の書き方
   - 条件式の書き方
   - ブロック内の処理
   - **図解:** if文の流れ（フローチャート）
     ```
     [条件式] → Yes → [処理]
         ↓
        No
         ↓
       [次の処理]
     ```

2. **if-else文**
   - 「もし〜でなければ」の処理
   - 二択の分岐
   - **図解:** if-elseの流れ
     ```
     [条件式] → Yes → [処理A]
         ↓            ↓
        No            ↓
         ↓            ↓
     [処理B] ← ← ← ←
     ```

3. **if-else if-else**
   - 複数の条件分岐
   - 順番に条件をチェックする

4. **条件式にboolean型の変数を使う**
   ```java
   boolean isAdult = age >= 18;
   if (isAdult) {  // boolean変数をそのまま条件式に使える
       System.out.println("成人です");
   }
   ```

5. **switch文**
   - 値による分岐
   - break文の重要性
   - default節

6. **ネストした条件分岐**
   - if文の中にif文を入れる
   - インデントの重要性

### structure.tsへの定義
```typescript
withAutoIds({
  id: "if_statement",
  label: "条件分岐",
  category: "java/basics",
  questions: [
    {
      title: "if文の基本的な書き方を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "if-else文の書き方を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "if-else if-elseの構造を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "条件式にboolean型の変数を使えることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "switch文の使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "break文の役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "条件分岐のコードの実行結果を予測できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "if-else文を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "switch文を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
9つのQuestionに対応する9つの演習問題

---

## 第5章: 繰り返し

### この章で得られるスキル
- for文の基本的な書き方を理解している
- while文の使い方を理解している
- do-while文の使い方を理解している
- break文とcontinue文の違いを説明できる
- ネストしたループを理解している

### なぜこの技術が必要か
**ループがないとどうなるか？**

ループがないと、同じ処理を100回書く必要がある。コードが長く、読みにくくなり、繰り返し回数が変わると全て書き直しが必要になる。

**例:**
```java
// ループがないと...
System.out.println("1回目");
System.out.println("2回目");
System.out.println("3回目");
// ... 100回書く必要がある

// ループがあると...
for (int i = 1; i <= 100; i++) {
    System.out.println(i + "回目");
}
```

### 章構成
1. **for文の基礎**
   - for文の構造（初期化、条件、更新）
   - カウンタ変数
   - 繰り返しの範囲
   - **図解:** for文の動き
     ```
     [初期化] → [条件式] → Yes → [処理] → [更新] ┐
                   ↓                           │
                  No  ← ← ← ← ← ← ← ← ← ← ← ┘
                   ↓
               [次の処理]
     ```

2. **while文**
   - 条件が成立する間繰り返す
   - 無限ループの注意

3. **do-while文**
   - 最低1回は実行される
   - whileとの違い

4. **break文とcontinue文**
   - break: ループを抜ける
   - continue: 次の繰り返しへ

5. **ネストしたループ**
   - ループの中にループを入れる
   - 二重ループの応用

### structure.tsへの定義
```typescript
withAutoIds({
  id: "loops",
  label: "繰り返し",
  category: "java/basics",
  questions: [
    {
      title: "for文の基本的な書き方を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "while文の使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "do-while文とwhile文の違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "break文とcontinue文の違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "ネストしたループの動作を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "ループのコードの実行結果を予測できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "for文を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "while文を使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "ネストしたループを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
9つのQuestionに対応する9つの演習問題

---

## 第6章: 配列

### この章で得られるスキル
- 配列とは何か、なぜ必要かを説明できる
- 配列の宣言と初期化を理解している
- 配列の要素にアクセスできる
- 配列とループを組み合わせて使える
- 多次元配列の基礎を理解している

### 前提知識
- 配列はループと密接に関係している（第5章の内容を理解していること）

### なぜこの技術が必要か
**配列がないとどうなるか？**

配列がないと、同じ種類のデータを100個保存するために100個の変数が必要になる。データの管理が煩雑になり、ループで処理できない。

**例:**
```java
// 配列がないと...
int score1 = 80;
int score2 = 90;
int score3 = 75;
// ... 100個の変数が必要
// 平均を計算するのも大変

// 配列があると...
int[] scores = {80, 90, 75};
// ループで簡単に処理できる
int sum = 0;
for (int score : scores) {
    sum += score;
}
int average = sum / scores.length;
```

### 章構成
1. **配列とは**
   - 配列は同じ型のデータをまとめて管理する仕組み
   - インデックス（添字）の概念
   - **図解:** 配列のイメージ
     ```
     scores[0]  scores[1]  scores[2]
       80         90         75
       ↑          ↑          ↑
     インデックス0  インデックス1  インデックス2
     ```

2. **配列の宣言と初期化**
   - 宣言: `int[] scores;`
   - 初期化: `scores = new int[5];`
   - 値を指定した初期化: `int[] scores = {80, 90, 75};`

3. **配列の要素へのアクセス**
   - インデックスは0から始まる
   - 要素の読み書き

4. **配列とループ**
   - for文で配列を処理
   - 拡張for文（for-each）

5. **多次元配列**
   - 2次元配列の基礎
   - 表形式のデータ

### structure.tsへの定義
```typescript
withAutoIds({
  id: "arrays",
  label: "配列",
  category: "java/basics",
  questions: [
    {
      title: "配列とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "配列のインデックスは0から始まることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "配列の宣言と初期化の方法を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "拡張for文（for-each）の使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "2次元配列の基礎を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "配列を使ったコードの実行結果を予測できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "配列を宣言・初期化するプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "配列とループを組み合わせたプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第7章: メソッド

### この章で得られるスキル
- メソッドとは何か、なぜ必要かを説明できる
- メソッドの定義と呼び出しができる
- 引数と戻り値の役割を理解している
- 戻り値と変数のスコープの関係を理解している
- メソッドのオーバーロードを理解している
- メソッドを使ったプログラムを実装できる

### なぜこの技術が必要か
**メソッドがないとどうなるか？**

メソッドがないと、同じコードを何度もコピペする必要がある。コードの変更が大変で、プログラムが長く読みにくくなる。

**例:**
```java
// メソッドがないと...
System.out.println("こんにちは、太郎さん");
System.out.println("こんにちは、花子さん");
System.out.println("こんにちは、次郎さん");
// 同じパターンを繰り返す

// メソッドがあると...
greet("太郎");
greet("花子");
greet("次郎");

public static void greet(String name) {
    System.out.println("こんにちは、" + name + "さん");
}
```

### 章構成
1. **メソッドとは**
   - メソッドは処理をまとめたもの
   - 再利用可能にする

2. **メソッドの定義**
   - メソッド名、引数、戻り値
   - `public static void`の意味（詳細は後の章で）

3. **メソッドの呼び出し**
   - メソッド名と引数を指定
   - 戻り値の受け取り

4. **引数と戻り値**
   - 引数: メソッドに渡す値
   - 戻り値: メソッドから返す値
   - `void`（戻り値なし）

5. **戻り値と変数のスコープ**
   - メソッド内の変数は、メソッドの外からアクセスできない
   - 戻り値を使うことで、メソッド内の計算結果を外に渡せる
   ```java
   public static int add(int a, int b) {
       int result = a + b; // メソッド内の変数
       return result; // 戻り値として外に渡す
   }

   public static void main(String[] args) {
       int sum = add(10, 20);
       // resultにはアクセスできない（スコープ外）
       // だから戻り値で受け取る必要がある
   }
   ```

6. **メソッドのオーバーロード**
   - 同じ名前で異なる引数のメソッド
   - シグネチャの違い

### structure.tsへの定義
```typescript
withAutoIds({
  id: "methods",
  label: "メソッド",
  category: "java/basics",
  questions: [
    {
      title: "メソッドとは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "引数と戻り値の役割を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "voidの意味を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "戻り値と変数のスコープの関係を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドのオーバーロードを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドを使ったコードの実行結果を予測できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドを定義して呼び出すプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "引数と戻り値を持つメソッドを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドのオーバーロードを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
9つのQuestionに対応する9つの演習問題

---

## 第8章: 複数クラスの連携

### この章で得られるスキル
- パッケージの役割を理解している
- import文の使い方を理解している
- Eclipseの補完機能を活用できる
- 複数のクラスを組み合わせてプログラムを作成できる
- クラスの分割の意義を説明できる

### なぜこの技術が必要か
**クラスを分割しないとどうなるか？**

クラスを分割しないと、1つのファイルが長くなりすぎ、コードの見通しが悪くなる。チームで開発しにくくなる。

**例:**
```java
// 1つのクラスに全て書くと...
public class Main {
    public static void main(String[] args) {
        // 処理1
        // 処理2
        // 処理3
        // ... 1000行以上
    }
}

// クラスを分割すると...
public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        int result = calc.add(10, 20);
    }
}

// 別ファイル: Calculator.java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

### 章構成
1. **パッケージとは**
   - パッケージはクラスを整理する仕組み
   - パッケージ名の命名規則

2. **import文**
   - 他のパッケージのクラスを使う
   - `import java.util.*;`
   - **Eclipseの補完機能**
     - Eclipseでは、`Ctrl + Shift + O`（Macは`Cmd + Shift + O`）で自動的にimport文を追加できる
     - クラス名を書いた後、`Ctrl + Space`で補完候補が表示される

3. **Eclipseの補完機能**
   - importだけでなく、あらゆるコードで補完が効く
   - 条件分岐: `if`と入力して`Ctrl + Space`
   - ループ: `for`と入力して`Ctrl + Space`
   - メソッド名、変数名なども補完できる
   - 補完機能を活用することで、タイプミスを減らし、効率的にコードを書ける

4. **複数クラスの連携**
   - Mainクラスと処理クラス
   - クラス間のメソッド呼び出し

5. **クラスの分割の設計**
   - 役割ごとにクラスを分ける
   - 見通しの良いコード

### structure.tsへの定義
```typescript
withAutoIds({
  id: "multiple_classes",
  label: "複数クラスの連携",
  category: "java/basics",
  questions: [
    {
      title: "パッケージの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "import文の使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "Eclipseの補完機能を活用できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "クラスを分割する意義を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "複数クラスを使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "複数のクラスを組み合わせたプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
6つのQuestionに対応する6つの演習問題

---

## 第9章: オブジェクト指向の基礎

### 冒頭: 初学者への励まし
この章は、**初学者にとって最初の鬼門**である。オブジェクト指向は、プログラミングを学ぶ上で避けて通れない重要な概念だが、最初は難しく感じるのが普通である。

**オブジェクト指向が難しい理由:**
1. **用語が聞き慣れない**: クラス、インスタンス、フィールド、メソッド、カプセル化、継承...など、初めて聞く言葉ばかり
2. **概念的で抽象的**: 目に見えないものをイメージする必要がある
3. **今まで学んだこととの違い**: 変数や条件分岐は「手順」だったが、オブジェクト指向は「設計」の話

**学習のコツ:**
1. **まずは用語に慣れる**: 完璧に理解しようとせず、何度も読んで用語に慣れることから始める
2. **具体例で考える**: 「車」「犬」など、身近なものに置き換えて考える
3. **コードを書いて試す**: 理屈よりも、実際に動かしてみることが理解の近道
4. **焦らない**: 一度で理解できなくても大丈夫。何度も繰り返し学ぶことで、徐々に理解が深まる

それでは、一緒に学んでいこう。

### この章で得られるスキル
- オブジェクト指向とは何かを説明できる
- クラスとオブジェクト（インスタンス）の関係を理解している
- フィールドとメソッドの役割を理解している
- インスタンスの生成と使用ができる
- オブジェクト指向の利点を説明できる

### なぜこの技術が必要か
**オブジェクト指向がないとどうなるか？**

オブジェクト指向がないと、データと処理がバラバラで管理が大変になる。似たようなコードが散在し、大規模なプログラムが書きにくくなる。

**例:**
```java
// データと処理がバラバラ
String name = "太郎";
int age = 20;
void printInfo() {
    System.out.println(name + "さん、" + age + "歳");
}

// オブジェクト指向（データと処理をまとめる）
class Person {
    String name;
    int age;

    void printInfo() {
        System.out.println(this.name + "さん、" + this.age + "歳");
    }
}

Person p = new Person();
p.name = "太郎";
p.age = 20;
p.printInfo(); // データと処理が一体化している
```

### 章構成
1. **オブジェクト指向とは**
   - 現実世界のモノをプログラムで表現する
   - データと処理をまとめる

2. **クラスとオブジェクト**
   - クラスは設計図
   - オブジェクト（インスタンス）は設計図から作られた実体

3. **フィールド**
   - クラスが持つデータ
   - インスタンス変数

4. **メソッド**
   - クラスが持つ処理
   - インスタンスメソッド

5. **インスタンスの生成**
   - `new`キーワード
   - インスタンスの使用

### structure.tsへの定義
```typescript
withAutoIds({
  id: "oop_basics",
  label: "オブジェクト指向の基礎",
  category: "java/oop",
  questions: [
    {
      title: "オブジェクト指向とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "クラスとオブジェクト（インスタンス）の関係を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "フィールドの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "インスタンスメソッドとstaticメソッドの違いを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "newキーワードの役割を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "クラスを使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "クラスを定義してインスタンスを生成するプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "フィールドとメソッドを持つクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第10章: コンストラクタ

### この章で得られるスキル
- コンストラクタとは何か、なぜ必要かを説明できる
- コンストラクタの定義と使用ができる
- コンストラクタのオーバーロードを理解している
- thisキーワードの役割を理解している

### なぜこの技術が必要か
**コンストラクタがないとどうなるか？**

コンストラクタがないと、インスタンス生成時に初期化を忘れる可能性がある。初期化のコードが散在し、必須の値を設定し忘れる。

**例:**
```java
// コンストラクタがないと...
Person p = new Person();
p.name = "太郎"; // 設定し忘れる可能性
p.age = 20;

// コンストラクタがあると...
Person p = new Person("太郎", 20); // 必ず設定される
```

### 章構成
1. **コンストラクタとは**
   - インスタンス生成時に呼ばれる特別なメソッド
   - 初期化を行う

2. **コンストラクタの定義**
   - クラス名と同じ名前
   - 戻り値なし

3. **デフォルトコンストラクタ**
   - 引数なしのコンストラクタ
   - 自動で用意される場合

4. **コンストラクタのオーバーロード**
   - 複数のコンストラクタを定義
   - 初期化方法を選択できる

5. **thisキーワード**
   - 自分自身のフィールドを指す
   - コンストラクタから別のコンストラクタを呼ぶ

### structure.tsへの定義
```typescript
withAutoIds({
  id: "constructors",
  label: "コンストラクタ",
  category: "java/oop",
  questions: [
    {
      title: "コンストラクタとは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "コンストラクタの定義方法を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "デフォルトコンストラクタを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "コンストラクタのオーバーロードを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "thisキーワードの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "コンストラクタを使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "コンストラクタを定義したクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "コンストラクタのオーバーロードを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第11章: 継承

### この章で得られるスキル
- 継承とは何か、なぜ必要かを説明できる
- 継承は複数のクラスを上手く扱うための仕組みであることを理解している
- 継承の実装方法（extendsキーワード）を理解している
- superキーワードの役割を理解している
- メソッドのオーバーライドを理解している
- 継承を使ったプログラムを実装できる

### なぜこの技術が必要か
**継承がないとどうなるか？**

継承がないと、似たようなクラスを何度も書く必要がある。共通部分を変更するときに全てのクラスを修正する必要があり、コードの重複が増える。

**継承は「複数のクラスをどう上手く扱っていくか」という話である。**

プログラムが大きくなると、多くのクラスが必要になる。それらのクラスに共通する部分があれば、継承を使ってまとめることで、効率的に管理できる。

**例:**
```java
// 継承がないと...
class Dog {
    String name;
    void eat() { System.out.println("食べる"); }
    void sleep() { System.out.println("寝る"); }
    void bark() { System.out.println("ワン"); }
}
class Cat {
    String name;
    void eat() { System.out.println("食べる"); } // Dogと同じ
    void sleep() { System.out.println("寝る"); } // Dogと同じ
    void meow() { System.out.println("ニャー"); }
}

// 継承があると...
class Animal {
    String name;
    void eat() { System.out.println("食べる"); }
    void sleep() { System.out.println("寝る"); }
}
class Dog extends Animal {
    void bark() { System.out.println("ワン"); } // 固有のメソッドだけ追加
}
class Cat extends Animal {
    void meow() { System.out.println("ニャー"); }
}
// 共通部分はAnimalにまとめられている
```

### 章構成
1. **継承とは**
   - 既存のクラスを拡張する仕組み
   - 複数のクラスを効率的に管理する
   - 親クラス（スーパークラス）と子クラス（サブクラス）

2. **継承の実装**
   - `extends`キーワード
   - 親クラスのフィールドとメソッドを引き継ぐ

3. **superキーワード**
   - 親クラスのメソッドを呼ぶ
   - 親クラスのコンストラクタを呼ぶ

4. **メソッドのオーバーライド**
   - 親クラスのメソッドを上書き
   - `@Override`アノテーション

5. **継承の設計**
   - is-a関係
   - 適切な継承の使い方

### structure.tsへの定義
```typescript
withAutoIds({
  id: "inheritance",
  label: "継承",
  category: "java/oop",
  questions: [
    {
      title: "継承とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "継承は複数のクラスを上手く扱うための仕組みであることを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "extendsキーワードの使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "superキーワードの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドのオーバーライドを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "is-a関係を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "継承を使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "継承を使ったクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "メソッドのオーバーライドを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
9つのQuestionに対応する9つの演習問題

---

## 第12章: インターフェース

### この章で得られるスキル
- インターフェースとは何か、なぜ必要かを説明できる
- インターフェースの定義と実装ができる
- 抽象メソッドの概念を理解している
- インターフェースと継承の違いを説明できる
- 多態性（ポリモーフィズム）の基礎を理解している

### なぜこの技術が必要か
**インターフェースがないとどうなるか？**

インターフェースがないと、異なるクラスに共通の振る舞いを強制できない。クラスの入れ替えが困難で、柔軟なプログラムが書きにくくなる。

**例:**
```java
// インターフェースがあると...
interface Drawable {
    void draw();
}

class Circle implements Drawable {
    public void draw() { System.out.println("円を描く"); }
}

class Square implements Drawable {
    public void draw() { System.out.println("四角を描く"); }
}

// どちらも同じように扱える
Drawable d = new Circle();
d.draw(); // 円が描かれる
d = new Square();
d.draw(); // 四角が描かれる
```

### 章構成
1. **インターフェースとは**
   - インターフェースは「契約」
   - メソッドのシグネチャだけを定義

2. **インターフェースの定義**
   - `interface`キーワード
   - 抽象メソッド

3. **インターフェースの実装**
   - `implements`キーワード
   - 全てのメソッドを実装する義務

4. **複数のインターフェースを実装**
   - Javaは多重継承できないが、複数のインターフェースは実装できる

5. **多態性（ポリモーフィズム）**
   - インターフェース型の変数
   - 実装クラスの入れ替え

### structure.tsへの定義
```typescript
withAutoIds({
  id: "interfaces",
  label: "インターフェース",
  category: "java/oop",
  questions: [
    {
      title: "インターフェースとは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "抽象メソッドの概念を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "implementsキーワードの使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "インターフェースと継承の違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "多態性（ポリモーフィズム）の基礎を理解している",
      type: "KNOW",
      difficulty: Difficulty.Hard,
    },
    {
      title: "インターフェースを使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "インターフェースを定義して実装するプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "複数のインターフェースを実装するクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Hard,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第13章: カプセル化

### この章で得られるスキル
- カプセル化とは何か、なぜ必要かを説明できる
- アクセス修飾子（public, private, protected）を理解している
- getter/setterの役割と実装方法を理解している
- カプセル化の利点を説明できる

### なぜこの技術が必要か
**カプセル化がないとどうなるか？**

カプセル化がないと、フィールドが外から自由に変更されてしまい、不正な値が設定される可能性がある。クラスの内部実装を変更しにくくなる。

**例:**
```java
// カプセル化がないと...
class Person {
    public int age; // 外から自由に変更できる
}

Person p = new Person();
p.age = -10; // 不正な値が設定できてしまう

// カプセル化があると...
class Person {
    private int age; // 外から直接変更できない

    public void setAge(int age) {
        if (age >= 0) {
            this.age = age; // 正しい値のみ設定
        }
    }

    public int getAge() {
        return this.age;
    }
}

Person p = new Person();
p.setAge(-10); // 設定されない（0未満は拒否される）
p.setAge(20);  // 正常に設定される
```

### 章構成
1. **カプセル化とは**
   - データを隠蔽し、外部から保護する
   - アクセスを制御する

2. **アクセス修飾子**
   - `public`: どこからでもアクセス可能
   - `private`: 同じクラス内のみアクセス可能
   - `protected`: 同じパッケージと子クラスからアクセス可能
   - （何もなし）: 同じパッケージ内のみアクセス可能

3. **getter/setter**
   - getter: フィールドの値を取得
   - setter: フィールドの値を設定
   - バリデーション（検証）

4. **カプセル化の設計**
   - フィールドはprivate
   - 必要に応じてgetter/setterを提供

### structure.tsへの定義
```typescript
withAutoIds({
  id: "encapsulation",
  label: "カプセル化",
  category: "java/oop",
  questions: [
    {
      title: "カプセル化とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "アクセス修飾子（public, private, protected）の違いを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "getterとsetterの役割を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "カプセル化の利点を説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "カプセル化されたクラスのコードを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "privateフィールドとgetter/setterを持つクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "setterでバリデーションを行うクラスを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
7つのQuestionに対応する7つの演習問題

---

## 第14章: 例外処理

### この章で得られるスキル
- 例外とは何か、なぜ必要かを説明できる
- try-catch-finallyの使い方を理解している
- 検査例外と非検査例外の違いを理解している
- 例外をスローする方法を理解している
- 例外処理を使ったプログラムを実装できる

### なぜこの技術が必要か
**例外処理がないとどうなるか？**

例外処理がないと、エラーが起きたときにプログラムが停止してしまう。エラーに対処できず、ユーザーに親切なメッセージを表示できない。

**例:**
```java
// 例外処理がないと...
int result = 10 / 0; // エラーが起きてプログラムが停止

// 例外処理があると...
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("0で割ることはできません");
}
// プログラムは続行される
```

### 章構成
1. **例外とは**
   - プログラム実行中のエラー
   - 例外が発生する場面

2. **try-catch-finally**
   - try: 例外が発生する可能性のある処理
   - catch: 例外を捕捉して処理
   - finally: 必ず実行される処理

3. **例外の種類**
   - 検査例外（Checked Exception）
   - 非検査例外（Unchecked Exception）

4. **例外のスロー**
   - `throw`キーワード
   - `throws`キーワード

5. **カスタム例外**
   - 独自の例外クラスを作成

### structure.tsへの定義
```typescript
withAutoIds({
  id: "exception_handling",
  label: "例外処理",
  category: "java/oop",
  questions: [
    {
      title: "例外とは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "try-catch-finallyの役割を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "検査例外と非検査例外の違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "throwとthrowsの違いを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "例外処理のコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "try-catchを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "finallyブロックを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "例外をスローするメソッドを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 第15章: コレクション

### この章で得られるスキル
- コレクションとは何か、配列との違いを説明できる
- List（ArrayList）の使い方を理解している
- Set（HashSet）の使い方を理解している
- Map（HashMap）の使い方を理解している
- ジェネリクスの基礎を理解している
- Java公式ドキュメントを使って標準ライブラリの使い方を調べられる

### なぜこの技術が必要か
**コレクションがないとどうなるか？**

コレクションがないと、配列は要素数を後から変更できない。重複チェックや検索が煩雑で、キーと値の組み合わせを扱いにくくなる。

**例:**
```java
// 配列は要素数固定
int[] scores = new int[5]; // 5個しか入らない

// ArrayListは可変
List<Integer> scores = new ArrayList<>();
scores.add(80);
scores.add(90); // いくつでも追加できる
```

### 章構成
1. **コレクションとは**
   - データをまとめて扱う仕組み
   - 配列との違い

2. **Java公式ドキュメント**
   - Javaには公式ドキュメントがある
   - JavaDoc（ジャバドック）と呼ばれる
   - 標準ライブラリのクラスやメソッドの使い方が詳しく書かれている
   - **URL:** https://docs.oracle.com/javase/jp/
   - ドキュメントを読むことで、知らないライブラリの使い方を自分で調べられる
   - 例: `ArrayList`のドキュメントを見ると、`add()`, `get()`, `size()`などのメソッドが説明されている

3. **List（ArrayList）**
   - 要素を順番に格納
   - 重複を許可
   - インデックスでアクセス

4. **Set（HashSet）**
   - 重複を許可しない
   - 順序なし

5. **Map（HashMap）**
   - キーと値の組み合わせ
   - キーで値を検索

6. **ジェネリクス**
   - `<>`で型を指定
   - 型安全なコレクション

### structure.tsへの定義
```typescript
withAutoIds({
  id: "collections",
  label: "コレクション",
  category: "java/stdlib",
  questions: [
    {
      title: "コレクションとは何かを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "配列とListの違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "ListとSetの違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "Mapの仕組みを理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "ジェネリクスの基礎を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "Java公式ドキュメントを使って標準ライブラリの使い方を調べられる",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "コレクションを使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "ArrayListを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "HashSetを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "HashMapを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
10つのQuestionに対応する10つの演習問題

---

## 第16章: 日時操作

### この章で得られるスキル
- Java 8以降の日時APIを理解している
- LocalDate、LocalTime、LocalDateTimeの使い分けができる
- 日時の計算（加算・減算）ができる
- 日時のフォーマット（書式設定）ができる

### なぜこの技術が必要か
**日時操作が必要な場面**

日時操作は、実際の業務システムで頻繁に使われる。

**例:**
```java
// 予約システム
LocalDate today = LocalDate.now();
LocalDate reservationDate = today.plusDays(7); // 7日後を予約

// 勤怠管理
LocalTime startTime = LocalTime.of(9, 0);  // 9:00
LocalTime endTime = LocalTime.of(18, 0);   // 18:00

// スケジュール管理
LocalDate deadline = LocalDate.of(2025, 3, 31);
LocalDate now = LocalDate.now();
long daysLeft = ChronoUnit.DAYS.between(now, deadline); // 残り日数
```

### 章構成
1. **Java 8の日時API**
   - 旧APIの問題点
   - java.timeパッケージ

2. **LocalDate（日付）**
   - 年月日の表現
   - 日付の生成と取得

3. **LocalTime（時刻）**
   - 時分秒の表現
   - 時刻の生成と取得

4. **LocalDateTime（日時）**
   - 日付と時刻の両方
   - 日時の生成と取得

5. **日時の計算**
   - plusDays, minusDays（日の加算・減算）
   - plusHours, minusHours（時間の加算・減算）

6. **日時のフォーマット**
   - DateTimeFormatter
   - 文字列への変換と解析

### structure.tsへの定義
```typescript
withAutoIds({
  id: "datetime",
  label: "日時操作",
  category: "java/stdlib",
  questions: [
    {
      title: "LocalDate, LocalTime, LocalDateTimeの違いを説明できる",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "日時の生成方法を理解している",
      type: "KNOW",
      difficulty: Difficulty.Easy,
    },
    {
      title: "日時の計算（加算・減算）の方法を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "DateTimeFormatterの使い方を理解している",
      type: "KNOW",
      difficulty: Difficulty.Medium,
    },
    {
      title: "日時を使ったコードの動きを理解できる",
      type: "READ",
      difficulty: Difficulty.Medium,
    },
    {
      title: "LocalDateを使ったプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Easy,
    },
    {
      title: "日時の計算を行うプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
    {
      title: "日時をフォーマットして表示するプログラムを実装できる",
      type: "WRITE",
      difficulty: Difficulty.Medium,
    },
  ],
})
```

### 演習問題との対応
8つのQuestionに対応する8つの演習問題

---

## 3. OneCompilerCodeBlockの活用方針

### 3.1 OneCompilerCodeBlockとは
OneCompilerCodeBlockは、**ブラウザ上でJavaコードを実行できるコンポーネント**である。
学習者は以下のことができる：

- **コードをその場で実行**: ページ内のサンプルコードをクリック一つで実行できる
- **コードを自由に編集**: サンプルコードを書き換えて、動作を試すことができる
- **入力値の変更**: mainメソッドに任意の入力を与えられる
- **リロードで元に戻る**: ブラウザをリロードすると編集前のコードに戻る

### 3.2 活用の基本方針

#### 3.2.1 実行を促すべき箇所
**全てのサンプルコードで実行を促す必要はない。**
以下のような、**学習に効果的な箇所**で実行を促す：

1. **新しい概念の導入時**
   - 例: 初めて変数を学ぶときの代入と出力
   - 例: 初めてif文を学ぶときの条件分岐の動作
   - 例: 初めてループを学ぶときの繰り返しの動作

2. **動作の違いを比較するとき**
   - 例: `++i` と `i++` の違い
   - 例: `==` と `equals()` の違い
   - 例: intとdoubleの計算結果の違い

3. **学習者が「意外」と感じる可能性がある動作**
   - 例: 整数同士の割り算で小数が切り捨てられる
   - 例: 参照型と基本型の違い
   - 例: NullPointerExceptionが発生する状況

4. **複雑な処理の理解を深めるとき**
   - 例: ネストしたループの動作
   - 例: 再帰処理
   - 例: オブジェクトの参照関係

#### 3.2.2 コード編集を促すべき箇所
**単に実行するだけでなく、コードを編集させることで理解が深まる箇所**では、
明示的に編集を促す：

1. **値を変えて動作を確認させる**
   ```markdown
   **やってみよう:**
   - 変数`age`の値を`18`から別の値に変えて実行してみよう
   - どのような結果になるか予測してから実行しよう
   ```

2. **条件を変えて動作を確認させる**
   ```markdown
   **やってみよう:**
   - `if (score >= 80)`の条件を`score >= 60`に変えてみよう
   - 出力がどう変わるか確認しよう
   ```

3. **ループ回数を変えさせる**
   ```markdown
   **やってみよう:**
   - `for (int i = 0; i < 5; i++)`の`5`を`10`に変えてみよう
   - 何回繰り返されるか確認しよう
   ```

4. **エラーを体験させる**
   ```markdown
   **やってみよう:**
   - わざと`int[] numbers = new int[3];`の配列に`numbers[3]`でアクセスしてみよう
   - どんなエラーが出るか確認しよう
   ```

5. **自分で機能を追加させる**
   ```markdown
   **やってみよう:**
   - このコードに、もう一つ変数を追加して、合計を計算してみよう
   ```

### 3.3 各章での具体的な活用例

#### 第2章「変数と型」
- **実行を促す**: 初めての変数宣言と代入のコード
- **編集を促す**: 変数の値を変えて出力結果を確認させる

#### 第3章「演算子」
- **実行を促す**: `++i`と`i++`の違いを示すコード
- **編集を促す**: 整数同士の割り算を小数の割り算に変えさせる

#### 第4章「条件分岐」
- **実行を促す**: if文の基本動作
- **編集を促す**: 条件を変えて、どの分岐に入るか確認させる

#### 第5章「繰り返し」
- **実行を促す**: for文の基本動作
- **編集を促す**: ループ回数を変えさせる、ネストしたループで変数を変えさせる

#### 第6章「配列」
- **実行を促す**: 配列の初期化とアクセス
- **編集を促す**: 配列のサイズを変えさせる、範囲外アクセスでエラーを体験させる

#### 第7章「メソッド」
- **実行を促す**: メソッドの呼び出しと戻り値
- **編集を促す**: 引数の値を変えて、戻り値がどう変わるか確認させる

#### 第9章「オブジェクト指向の基礎」
- **実行を促す**: オブジェクトの生成とメソッド呼び出し
- **編集を促す**: フィールドの値を変えて動作を確認させる

#### 第11章「継承」
- **実行を促す**: 親クラスと子クラスの関係
- **編集を促す**: 子クラスのメソッドをオーバーライドさせる

#### 第14章「例外処理」
- **実行を促す**: try-catchの基本動作
- **編集を促す**: わざとエラーを起こさせて、catchブロックの動作を確認させる

### 3.4 記述の工夫

#### 3.4.1 実行を促す表現
```markdown
**実行してみよう:**
このコードを実行して、結果を確認しよう。

**動かしてみよう:**
実際にコードを実行して、動作を確かめよう。
```

#### 3.4.2 編集を促す表現
```markdown
**やってみよう:**
- `age`の値を`20`に変えて実行してみよう
- 結果がどう変わるか確認しよう

**実験してみよう:**
- 条件式を`score > 80`から`score >= 80`に変えてみよう
- 違いを確認しよう

**挑戦してみよう:**
- このコードに、もう一つ変数を追加してみよう
```

#### 3.4.3 予測を促す表現
```markdown
**予測してから実行しよう:**
1. このコードの実行結果を予測してみよう
2. 予測を紙に書いてみよう
3. 実際に実行して、予測と比較しよう
```

### 3.5 注意事項

1. **実行を促しすぎない**
   - 全てのサンプルコードで「実行してみよう」と書くと、かえって効果が薄れる
   - 本当に実行することで理解が深まる箇所に絞る

2. **編集の難易度を適切に**
   - 初学者が簡単に編集できる箇所を選ぶ
   - 「どこを変えればいいか」を明確に指示する

3. **エラー体験は意図的に**
   - エラーを体験させる場合は、必ず「なぜエラーが起きるか」を説明する
   - エラーメッセージの読み方も教える

4. **ブラウザリロードで元に戻ることを伝える**
   - 学習者が「コードを壊してしまった」と不安にならないよう、
     「ブラウザをリロードすると元に戻る」ことを最初に伝える

---

## 4. 補足事項

### 3.1 既存教材について
既存のJava教材（`docs/docs/java/basics/if.mdx` と `docs/docs/java/basics/loops.mdx`）は仮の内容であるため、削除して新しい教材に置き換える。

### 3.2 structure.tsへの一括追加
全16章分のTopicとQuestionsを、`docs/src/structure.ts`に追加する。

### 3.3 ファイル配置
教材ファイルは以下のディレクトリに配置：
```
docs/docs/java/
├── basics/
│   ├── 01_java_basics.mdx
│   ├── 02_variables_and_types.mdx
│   ├── 03_operators.mdx
│   ├── 04_if_statement.mdx
│   ├── 05_loops.mdx
│   ├── 06_arrays.mdx
│   ├── 07_methods.mdx
│   └── 08_multiple_classes.mdx
├── oop/
│   ├── 09_oop_basics.mdx
│   ├── 10_constructors.mdx
│   ├── 11_inheritance.mdx
│   ├── 12_interfaces.mdx
│   ├── 13_encapsulation.mdx
│   └── 14_exception_handling.mdx
└── stdlib/
    ├── 15_collections.mdx
    └── 16_datetime.mdx
```

---

以上
