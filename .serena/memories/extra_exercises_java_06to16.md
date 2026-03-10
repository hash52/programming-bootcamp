# Java追加演習 グループ06〜16 作成済み情報

## 概要

Java追加演習として06_arrays〜16_datetime の11グループ・計110問のMDXファイルを作成済み。
`extraExercises.ts` にも11グループのエントリを追加済み。

## 作成済みグループ一覧

| groupId | topicId | label | 問題数 |
|---------|---------|-------|--------|
| `java_arrays` | `06_arrays` | 配列 | 10 |
| `java_methods` | `07_methods` | メソッド | 10 |
| `java_multiple_classes` | `08_multiple_classes` | 複数クラスの連携 | 10 |
| `java_exception` | `09_exception_handling` | 例外処理 | 10 |
| `java_oop_basics` | `10_oop_basics` | オブジェクト指向の基礎 | 10 |
| `java_constructors` | `11_constructors` | コンストラクタ | 10 |
| `java_inheritance` | `12_inheritance` | 継承 | 10 |
| `java_interfaces` | `13_interfaces` | インターフェース | 10 |
| `java_encapsulation` | `14_encapsulation` | カプセル化 | 10 |
| `java_collections` | `15_collections` | コレクション | 10 |
| `java_datetime` | `16_datetime` | 日時操作 | 10 |

## MDXファイルのパスパターン

```
docs/src/questions/extra/java/{groupId}/{questionId}.mdx
```

## フロントマター形式

```yaml
---
id: "extra/java/{groupId}#{questionId}"
title: "問題タイトル"
type: "WRITE"
difficulty: "Easy"   # Easy / Normal / Hard（大文字始まり）
format: "codingProblem"
topicId: "{groupId}"
category: "extra/java"
language: "java"
hint: |
  ヒントテキスト
sampleAnswer: |
  実装クラスのコードのみ（Mainクラスなし）
explanation: |
  解説テキスト
---
```

## 重要：OOP章以降のコード形式規約

### Eclipseでの実装（本番）
- 「1 public クラス = 1 ファイル」の標準形式
- `BankAccount.java` と `Main.java` を別ファイルで作成

### OneCompilerスターターコード（ブラウザ確認用）
- 複数クラスを1ファイルにまとめる妥協形式
- 非publicクラス（アクセス修飾子なし）と Main を同一ファイルに記述

```java
// OneCompiler用（非publicクラス + Main を同一ファイル）
class BankAccount {
    private int balance;
    // ...
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        // ...
    }
}
```

### sampleAnswer フィールド
- メインの実装クラスのみ記述（Mainクラス不要）
- Mainクラスでの呼び出し例は問題本文 or OneCompilerCodeBlock で補う

## MDX注意事項

- `codeId="TODO"` は仮置き（後で手動でOneCompilerのIDに差し替え）
- import文は `## 問題` セクションの前、フロントマター直後に記述
- `<OneCompilerCodeBlock>` は本文末尾に配置

## 各グループのquestionId一覧

### java_arrays
array_print_all(EASY), array_sum(EASY), array_max(EASY), array_length(EASY),
array_average(NORMAL), array_reverse_print(NORMAL), array_count_positive(NORMAL), array_linear_search(NORMAL),
two_dim_sum(HARD), bubble_sort(HARD)

### java_methods
greet_method(EASY), add_method(EASY), is_even_method(EASY), max_two_method(EASY),
power_method(NORMAL), factorial_method(NORMAL), array_sum_method(NORMAL), is_prime_method(NORMAL),
overload_area(HARD), celsius_conversion_methods(HARD)

### java_multiple_classes
point_class(EASY), rectangle_class(EASY), person_display(EASY),
counter_class(NORMAL), bank_account_class(NORMAL), calculator_class(NORMAL), two_classes_interaction(NORMAL),
temperature_converter_class(HARD), circle_class(HARD), todo_class(HARD)

### java_exception
basic_try_catch(EASY), array_index_exception(EASY), number_format_exception(EASY),
finally_block(NORMAL), multi_catch(NORMAL), null_pointer_exception(NORMAL), custom_exception(NORMAL),
throws_declaration(HARD), exception_in_method(HARD), validation_with_exception(HARD)

### java_oop_basics
dog_class(EASY), car_class(EASY), book_class(EASY),
counter_object(NORMAL), player_class(NORMAL), circle_object(NORMAL), student_score(NORMAL),
bank_account_object(HARD), dice_class(HARD), shopping_cart(HARD)

### java_constructors
point_constructor(EASY), person_constructor(EASY), default_constructor(EASY),
this_usage(NORMAL), constructor_overload(NORMAL), rectangle_constructor(NORMAL), this_chain(NORMAL),
student_with_constructor(HARD), immutable_point(HARD), bank_account_constructor(HARD)

### java_inheritance
animal_extends(EASY), shape_extends(EASY), super_call(EASY),
override_method(NORMAL), polymorphism(NORMAL), vehicle_hierarchy(NORMAL), super_method_call(NORMAL),
instanceof_check(HARD), abstract_base(HARD), multilevel_inheritance(HARD)

### java_interfaces
simple_interface(EASY), shape_interface(EASY), printable_interface(EASY),
interface_polymorphism(NORMAL), multiple_interfaces(NORMAL), comparable_like(NORMAL), flyable_swimable(NORMAL),
interface_default_method(HARD), strategy_pattern(HARD), interface_vs_class(HARD)

### java_encapsulation
private_fields(EASY), getter_setter(EASY), access_modifiers(EASY),
validation_in_setter(NORMAL), readonly_field(NORMAL), person_encapsulation(NORMAL), bank_account_encapsulation(NORMAL),
temperature_encapsulation(HARD), immutable_class(HARD), encapsulation_refactor(HARD)

### java_collections
arraylist_basic(EASY), arraylist_remove(EASY), hashmap_basic(EASY), hashset_unique(EASY),
arraylist_sum(NORMAL), arraylist_filter(NORMAL), hashmap_count(NORMAL), collections_sort(NORMAL),
nested_collection(HARD), todo_list_collections(HARD)

### java_datetime
local_date_basic(EASY), local_time_basic(EASY), date_of(EASY),
date_format(NORMAL), date_plus_minus(NORMAL), date_compare(NORMAL), days_until_birthday(NORMAL),
period_between(HARD), datetime_combination(HARD), schedule_display(HARD)

## 既存グループ（参考）

| groupId | questionIds |
|---------|-------------|
| `java_if` | pass_fail(EASY), season_judgment(NORMAL) |
| `java_for` | sum_calculation(EASY), fizzbuzz(NORMAL), ... |

詳細は `knowledge/guides/extra-exercises-spec.md` を参照。
