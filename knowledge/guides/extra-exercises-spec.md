# 追加演習機能 仕様書（AIコンテキスト）

このドキュメントは、道場システムに追加した「追加演習（コーディング問題）」機能の設計・実装をまとめたものである。
AI（Claude Code 等）が次回以降の作業で迷わないよう、重要な決定事項・制約・ファイル構成を記録する。

---

## 目的と設計方針

Paizaスキルチェック形式のコーディング問題（自力実装して OneCompiler で動作確認）を追加演習として提供する。

- **既存のダッシュボード達成率には影響しない**独立した問題セット
- フィルタ・共有・プリセット等の既存機能は透過的に再利用
- 採点は自動判定せず、受講生が自分でチェックボックスをつける

### なぜ追加演習が必要なのか

教材本体の「達成目標」は概念の理解・確認を目的としており、
「自力でゼロからコードを書く」反復練習としては問題数が少ない。

追加演習は以下のニーズに応える：

1. **反復練習の提供** — 受講生が同じ章の概念を何度も書き直し、定着させる場を与える
2. **自己検証の手段** — Paizaスキルチェック形式でコードを実行して自分でOKを判断できる
3. **講師・TAの手離れ** — 自動採点なしでも、サンプル解答と実行結果を自分で比較できる
4. **スキルムラの解消** — 全受講生が同じペースで進まないため、早く終わった受講生が次の演習に進める

受講生は文系出身のプログラミング未経験者が多く、「書いて動かす」経験を多く積むことが最重要課題である。

---

## コーディング環境

受講生が実際にコードを書く環境は **Eclipse（IDE）** である。
OneCompilerCodeBlock はスターターコードを問題ページに表示するための参照用コンポーネントであり、
受講生は表示されたコードを Eclipse にコピーして実装する。

### 重要：クラス設計はEclipseのルールに従う

Eclipse では Java 標準の「1 public クラス = 1 ファイル」が推奨される。
OOP章以降の問題では、受講生は以下のように複数ファイルを作成することを前提とする：

```
BankAccount.java  ← public class BankAccount { ... }
Main.java         ← public class Main { ... }
```

### MDXファイルの sampleAnswer について

`sampleAnswer` フィールドにはメインの実装クラス（例: BankAccount）のみを記述し、
Main クラスでの呼び出し例は本文の問題説明または OneCompilerCodeBlock のスターターコードで補う。

なお、OneCompilerCodeBlock のスターターコードは「ブラウザで動作確認したい受講生向け」として
複数クラスを1ファイルにまとめた形式を記載することがある（表示上の妥協点）。

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
| `java_arrays` | 06_arrays | 上記 + 配列（宣言・初期化・要素アクセス・`.length`・for-each） | ユーザー定義メソッド・クラス |
| `java_methods` | 07_methods | 上記 + static メソッド（引数・戻り値・オーバーロード） | クラス設計 |
| `java_multiple_classes` | 08_multiple_classes | 上記 + 複数クラスの参照・static と非static の混在 | 継承・カプセル化 |
| `java_exception` | 09_exception_handling | 上記 + try-catch-finally・throws・カスタム例外 | 継承・インターフェース |
| `java_oop_basics` | 10_oop_basics | 上記 + クラス・フィールド・インスタンスメソッド・new | 継承・インターフェース・カプセル化 |
| `java_constructors` | 11_constructors | 上記 + コンストラクタ・this・コンストラクタオーバーロード | 継承 |
| `java_inheritance` | 12_inheritance | 上記 + extends・super・@Override・ポリモーフィズム | インターフェース |
| `java_interfaces` | 13_interfaces | 上記 + interface・implements・多態性 | — |
| `java_encapsulation` | 14_encapsulation | 上記 + private・getter/setter・アクセス修飾子 | — |
| `java_collections` | 15_collections | 上記 + ArrayList・HashMap・HashSet・for-each | — |
| `java_datetime` | 16_datetime | 上記 + LocalDate・LocalTime・LocalDateTime・DateTimeFormatter・Period・ChronoUnit | — |

> ⚠️ OOP章（java_oop_basics）以降の問題では、OneCompiler での動作確認のために非public クラスと Main クラスを同一ファイルに記述する形式を使うことがある。Eclipse での実装は複数ファイル構成が前提（上記「コーディング環境」参照）。

### 検証方法

新しい問題を追加する前に、structure.ts で該当Topicの前後関係を確認し、問題のサンプル解答が制約に違反していないかチェックする。

---

## 難易度基準（Java追加演習）

### 各難易度のレベル感（全グループ共通）

| 難易度 | 配分目安 | 受講生の体感 | 具体的な特徴 |
|--------|---------|------------|-------------|
| EASY   | 30〜40% | 「教材を見直せば解ける」 | 穴埋め1〜2箇所・ハードコード値・単一概念の直接適用 |
| NORMAL | 40%     | 「少し考えれば解ける」   | ロジックの実装（バリデーション・計算・条件分岐）・複数ステップ |
| HARD   | 20〜30% | 「30分以上かかることもある」| アルゴリズム・複数クラス連携・設計判断・応用的な組み合わせ |

### グループ別の難易度分布

| グループ | EASY | NORMAL | HARD | 分布の根拠 |
|---------|------|--------|------|-----------|
| java_if         | 多め | 普通 | 少なめ | 最初のグループ、概念が単純 |
| java_for        | 普通 | 普通 | 少なめ | ループ構造は単純、組み合わせで HARD |
| java_arrays     | 4 | 4 | 2 | 配列は基礎的なため EASY 多め |
| java_methods    | 4 | 4 | 2 | メソッド定義自体は単純、HARD はオーバーロード等 |
| java_multiple_classes | 3 | 4 | 3 | 複数クラス連携から HARD 増加 |
| java_exception  | 3 | 4 | 3 | カスタム例外・throws は難しい |
| java_oop_basics | 3 | 4 | 3 | OOP設計全般は応用要素が増える |
| java_constructors | 3 | 4 | 3 | this() チェーン等は難しい |
| java_inheritance | 3 | 4 | 3 | ポリモーフィズム・多段継承は難しい |
| java_interfaces | 3 | 4 | 3 | Strategy パターン等は設計判断が必要 |
| java_encapsulation | 3 | 4 | 3 | 不変クラス・リファクタは難しい |
| java_collections | 4 | 4 | 2 | コレクション操作は API が豊富で EASY が多い |
| java_datetime   | 3 | 4 | 3 | Period・ChronoUnit の組み合わせは難しい |

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

**java_arrays グループ（06_arrays まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `array_print_all` | 配列の全要素を表示する | EASY |
| `array_sum` | 配列の合計を求める | EASY |
| `array_max` | 配列の最大値を求める | EASY |
| `array_length` | 配列の要素数と各要素を番号付きで表示する | EASY |
| `array_average` | 配列の平均値を求める | NORMAL |
| `array_reverse_print` | 配列を逆順に表示する | NORMAL |
| `array_count_positive` | 配列の正の要素の個数を数える | NORMAL |
| `array_linear_search` | 配列から特定の値を線形探索する | NORMAL |
| `two_dim_sum` | 2次元配列の全要素の合計を求める | HARD |
| `bubble_sort` | バブルソートで配列を昇順に並び替える | HARD |

**java_methods グループ（07_methods まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `greet_method` | 名前を受け取り挨拶を返すメソッド | EASY |
| `add_method` | 2つの整数の和を返すメソッド | EASY |
| `is_even_method` | 偶数かどうかを返すbooleanメソッド | EASY |
| `max_two_method` | 2数の大きい方を返すメソッド | EASY |
| `power_method` | n乗を計算するメソッド | NORMAL |
| `factorial_method` | 階乗を返すメソッドを実装する | NORMAL |
| `array_sum_method` | int配列の合計を返すメソッド | NORMAL |
| `is_prime_method` | 素数判定メソッドを使って100以下の素数を表示 | NORMAL |
| `overload_area` | オーバーロードで複数の図形の面積を計算する | HARD |
| `celsius_conversion_methods` | 摂氏⇔華氏変換メソッドを両方向で実装する | HARD |

**java_multiple_classes グループ（08_multiple_classes まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `point_class` | Pointクラスを別クラスから生成・表示する | EASY |
| `rectangle_class` | Rectangleクラスで面積と周囲長を計算する | EASY |
| `person_display` | Personクラスを作り情報を表示するメソッドを定義する | EASY |
| `counter_class` | Counterクラスでカウント・リセットを実装する | NORMAL |
| `bank_account_class` | BankAccountクラスで入金・出金・残高表示 | NORMAL |
| `calculator_class` | Calculatorクラスで四則演算メソッドを実装する | NORMAL |
| `two_classes_interaction` | StudentクラスとTeacherクラスを相互に参照する | NORMAL |
| `temperature_converter_class` | TemperatureConverterクラスで変換処理を分離する | HARD |
| `circle_class` | Circleクラスで面積・周囲・比較メソッドを実装する | HARD |
| `todo_class` | ToDoItemクラスを使ったタスク管理プログラム | HARD |

**java_exception グループ（09_exception_handling まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `basic_try_catch` | 基本的なtry-catchで例外をキャッチする | EASY |
| `array_index_exception` | ArrayIndexOutOfBoundsExceptionをキャッチする | EASY |
| `number_format_exception` | NumberFormatExceptionをキャッチして対処する | EASY |
| `finally_block` | try-catch-finallyで後処理を保証する | NORMAL |
| `multi_catch` | 複数の例外を個別にキャッチする | NORMAL |
| `null_pointer_exception` | NullPointerExceptionをキャッチして安全に処理する | NORMAL |
| `custom_exception` | 独自例外クラスを定義してスローする | NORMAL |
| `throws_declaration` | throwsで例外を呼び出し元に伝搬させる | HARD |
| `exception_in_method` | メソッドから例外をスローして呼び出し元でキャッチ | HARD |
| `validation_with_exception` | 入力値検証に独自例外を使う | HARD |

**java_oop_basics グループ（10_oop_basics まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `dog_class` | Dogクラスでフィールドとインスタンスメソッドを定義する | EASY |
| `car_class` | Carクラスで属性と走行メソッドを実装する | EASY |
| `book_class` | Bookクラスでタイトル・著者・ページ数を管理する | EASY |
| `counter_object` | Counterオブジェクトでカウント・リセット・取得を実装する | NORMAL |
| `player_class` | Playerクラスでゲームプレイヤーの体力と攻撃を管理する | NORMAL |
| `circle_object` | Circleクラスで半径・面積・周囲を計算するメソッドを実装する | NORMAL |
| `student_score` | Studentクラスで複数科目の点数管理と平均計算 | NORMAL |
| `bank_account_object` | BankAccountオブジェクトで残高管理（入金・出金）する | HARD |
| `dice_class` | Diceクラスでサイコロを振るメソッドを実装する（Random使用） | HARD |
| `shopping_cart` | ShoppingCartクラスで商品追加・合計計算を実装する | HARD |

**java_constructors グループ（11_constructors まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `point_constructor` | コンストラクタでPointオブジェクトを初期化する | EASY |
| `person_constructor` | Personクラスにコンストラクタを追加して情報を初期化する | EASY |
| `default_constructor` | デフォルトコンストラクタと引数ありコンストラクタを比べる | EASY |
| `this_usage` | thisキーワードでフィールドとパラメータを区別する | NORMAL |
| `constructor_overload` | コンストラクタをオーバーロードして複数の初期化方法を提供する | NORMAL |
| `rectangle_constructor` | Rectangleクラスのコンストラクタで面積・周囲長を計算 | NORMAL |
| `this_chain` | this()でコンストラクタから別コンストラクタを呼ぶ | NORMAL |
| `student_with_constructor` | Studentクラスでコンストラクタ・フィールド・メソッドを組み合わせる | HARD |
| `immutable_point` | コンストラクタのみで初期化し変更不可なPointクラスを作る | HARD |
| `bank_account_constructor` | BankAccountクラスにコンストラクタで初期残高を設定する | HARD |

**java_inheritance グループ（12_inheritance まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `animal_extends` | Animalクラスを継承してDogクラスを作る | EASY |
| `shape_extends` | Shapeクラスを継承してCircleとRectangleを作る | EASY |
| `super_call` | superでスーパークラスのコンストラクタを呼ぶ | EASY |
| `override_method` | @Overrideでメソッドをオーバーライドする | NORMAL |
| `polymorphism` | 親クラス型の変数でサブクラスのメソッドを呼ぶ | NORMAL |
| `vehicle_hierarchy` | Vehicleクラス→Car/Bike/Truck の継承ツリーを実装する | NORMAL |
| `super_method_call` | super.メソッド() で親クラスの処理を再利用する | NORMAL |
| `instanceof_check` | instanceofでオブジェクトの型を判定する | HARD |
| `abstract_base` | 抽象的な基底クラスを継承して複数のサブクラスを実装する | HARD |
| `multilevel_inheritance` | 3段階の継承チェーンを実装してオーバーライドの動作を確認する | HARD |

**java_interfaces グループ（13_interfaces まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `simple_interface` | Greetableインターフェースを定義して実装する | EASY |
| `shape_interface` | Shapeインターフェースで面積・周囲のメソッドを定義する | EASY |
| `printable_interface` | Printableインターフェースを複数クラスに実装する | EASY |
| `interface_polymorphism` | インターフェース型変数で複数実装クラスを扱う | NORMAL |
| `multiple_interfaces` | 複数のインターフェースを1つのクラスに実装する | NORMAL |
| `comparable_like` | 大小比較メソッドをインターフェースで定義して実装する | NORMAL |
| `flyable_swimable` | FlyableとSwimmableを複数クラスに組み合わせて実装する | NORMAL |
| `interface_default_method` | defaultメソッドをインターフェースに定義して使う | HARD |
| `strategy_pattern` | インターフェースで処理の切り替え（Strategyパターン）を実装する | HARD |
| `interface_vs_class` | インターフェースと継承を組み合わせたクラス設計を実装する | HARD |

**java_encapsulation グループ（14_encapsulation まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `private_fields` | フィールドをprivateにしてクラス外からのアクセスを防ぐ | EASY |
| `getter_setter` | getterとsetterを定義してフィールドにアクセスする | EASY |
| `access_modifiers` | public/private/protectedの違いを確認する | EASY |
| `validation_in_setter` | setterでバリデーションを行う | NORMAL |
| `readonly_field` | getterだけ定義してread-onlyなフィールドを実現する | NORMAL |
| `person_encapsulation` | Personクラスを完全にカプセル化して情報を保護する | NORMAL |
| `bank_account_encapsulation` | BankAccountの残高をprivateで管理して不正操作を防ぐ | NORMAL |
| `temperature_encapsulation` | 温度をカプセル化し、範囲外の値を拒否するクラスを作る | HARD |
| `immutable_class` | すべてのフィールドをfinalにした不変クラスを作る | HARD |
| `encapsulation_refactor` | カプセル化されていないクラスを適切に修正する | HARD |

**java_collections グループ（15_collections まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `arraylist_basic` | ArrayListに要素を追加・取得・表示する | EASY |
| `arraylist_remove` | ArrayListから要素を削除して残りを表示する | EASY |
| `hashmap_basic` | HashMapでキーと値のペアを管理する | EASY |
| `hashset_unique` | HashSetで重複のない要素集合を管理する | EASY |
| `arraylist_sum` | ArrayListの数値要素の合計を求める | NORMAL |
| `arraylist_filter` | ArrayListから条件に合う要素だけを抽出する | NORMAL |
| `hashmap_count` | HashMapで単語の出現回数を数える | NORMAL |
| `collections_sort` | ArrayListをCollections.sort()で並び替える | NORMAL |
| `nested_collection` | HashMapのvalueをArrayListにしてグループ管理する | HARD |
| `todo_list_collections` | ArrayListとHashMapを使ったToDoリストを実装する | HARD |

**java_datetime グループ（16_datetime まで）**

| questionId | title | difficulty |
|-----------|-------|-----------|
| `local_date_basic` | LocalDate.now()で今日の日付を表示する | EASY |
| `local_time_basic` | LocalTime.now()で現在時刻を表示する | EASY |
| `date_of` | LocalDate.of()で特定の日付を作成して表示する | EASY |
| `date_format` | DateTimeFormatterで日付を指定フォーマットで表示する | NORMAL |
| `date_plus_minus` | plusDays/minusMonthsで日付の加減算を行う | NORMAL |
| `date_compare` | 2つの日付を比較してどちらが先かを判定する | NORMAL |
| `days_until_birthday` | 今日から誕生日までの日数を計算する | NORMAL |
| `period_between` | Period.between()で年齢（年数）を計算する | HARD |
| `datetime_combination` | LocalDateTimeで日付と時刻を組み合わせて操作する | HARD |
| `schedule_display` | 複数のLocalDateを使ってスケジュール一覧を表示する | HARD |

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
