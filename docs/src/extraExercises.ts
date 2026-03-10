/**
 * 追加演習（コーディング問題）のマスタデータとユーティリティ
 *
 * 追加演習は既存のダッシュボード達成率に影響しない独立した問題セット。
 * フィルタパイプライン再利用のため Question 型互換に変換して扱う。
 */

import { Difficulty, Question, type QuestionType } from "@site/src/structure";

/** 個別の追加演習問題 */
export interface ExtraExercise {
  /** MDXファイル名 / IDの # 以降の部分（例: "fizzbuzz"） */
  questionId: string;
  /** 問題のタイトル */
  title: string;
  /** 難易度 */
  difficulty: "EASY" | "NORMAL" | "HARD";
}

/** 追加演習のグループ（章単位） */
export interface ExtraGroup {
  /** グループID（例: "java_if"） */
  id: string;
  /** 表示ラベル（例: "if文"） */
  label: string;
  /** 所属テーマID（例: "java"） */
  theme: string;
  /** このグループに属する演習問題 */
  exercises: ExtraExercise[];
}

/** 追加演習のテーマ（技術分野単位） */
export interface ExtraTheme {
  /** テーマID（例: "java"） */
  id: string;
  /** 表示ラベル（例: "Java"） */
  label: string;
  /** このテーマに属するグループ */
  groups: ExtraGroup[];
}

/** 難易度文字列を Difficulty enum に変換 */
function toDifficulty(d: "EASY" | "NORMAL" | "HARD"): Difficulty {
  if (d === "EASY") return Difficulty.Easy;
  if (d === "NORMAL") return Difficulty.Medium;
  return Difficulty.Hard;
}

/**
 * 追加演習の全テーマ定義
 *
 * 章別グループの問題はその章までの内容のみで解けるものとする。
 * 総合演習グループのみ、複数章にまたがる問題を許可する。
 *
 * 章の実際の教授順序（java/basics）:
 *   01_java_basics → 02_variables_and_types → 03_operators → 04_if_statement
 *   → 03a_scanner → 03b_random → 05_loops → 06_arrays → 07_methods → 08_multiple_classes → 09_exception_handling
 * ※ 03a_scanner・03b_random はIDが小さいが 04_if_statement より後で教える
 */
export const ALL_EXTRA_THEMES: readonly ExtraTheme[] = [
  {
    id: "java",
    label: "Java",
    groups: [
      {
        // 02_variables_and_types までの知識で解ける問題
        // 利用可能: 基本構文・変数（int, double, boolean, char, String）・型キャスト・文字列連結（+）
        // 利用不可: 算術計算（+/-/*///%）による計算式・if文・Scanner・Random・ループ・配列・メソッド
        // ※ System.out.println での文字列連結（+）は使用可
        id: "java_variables",
        label: "変数と型",
        theme: "java",
        exercises: [
          { questionId: "self_introduction",      title: "自己紹介を出力する",                          difficulty: "EASY"   },
          { questionId: "char_display",           title: "char型と文字コードを表示する",                difficulty: "EASY"   },
          { questionId: "student_profile",        title: "学生情報を表示する",                         difficulty: "EASY"   },
          { questionId: "boolean_variables",      title: "boolean型の変数を使う",                      difficulty: "EASY"   },
          { questionId: "product_info",           title: "商品情報を表示する",                         difficulty: "EASY"   },
          { questionId: "type_casting_narrowing", title: "(int)キャストで小数点以下の切り捨てを確認する", difficulty: "NORMAL" },
          { questionId: "variable_swap",          title: "2つの変数の値を入れ替える",                  difficulty: "NORMAL" },
          { questionId: "char_code_table",        title: "複数のcharの文字コードを表示する",            difficulty: "NORMAL" },
          { questionId: "type_widening",          title: "widening変換とnarrowing変換を比べる",         difficulty: "NORMAL" },
          { questionId: "type_representation",    title: "同じ値が型によって見え方が変わることを確認する", difficulty: "HARD"   },
        ],
      },
      {
        // 03_operators までの知識で解ける問題
        // 利用可能: 変数・算術演算子（+/-/*///%）・比較演算子・論理演算子・型キャスト
        // 利用不可: if文・Scanner・Random・ループ・配列・メソッド
        id: "java_operators",
        label: "演算子",
        theme: "java",
        exercises: [
          { questionId: "four_operations",      title: "四則演算と余りを表示する",           difficulty: "EASY"   },
          { questionId: "comparison_results",  title: "比較演算子の結果を表示する",         difficulty: "EASY"   },
          { questionId: "circle_area",         title: "円の面積と円周を求める",             difficulty: "EASY"   },
          { questionId: "quotient_remainder",  title: "商と余りで個数を表現する",           difficulty: "EASY"   },
          { questionId: "logical_display",     title: "論理演算子の結果を表示する",         difficulty: "EASY"   },
          { questionId: "tax_calculation",     title: "税込み価格を計算する",               difficulty: "NORMAL" },
          { questionId: "discount_calculation",title: "割引後の支払い金額を計算する",       difficulty: "NORMAL" },
          { questionId: "speed_distance",      title: "速さと時間から距離を求める",         difficulty: "NORMAL" },
          { questionId: "calorie_calculator",  title: "三大栄養素のカロリーを計算する",     difficulty: "NORMAL" },
          { questionId: "compound_interest",   title: "複利計算で3年後の元利合計を求める",  difficulty: "HARD"   },
          { questionId: "increment_decrement", title: "++/--演算子の動作を確認する",        difficulty: "EASY"   },
          { questionId: "compound_assignment", title: "複合代入演算子でスコアを変化させる", difficulty: "EASY"   },
          { questionId: "int_double_division", title: "整数除算とdouble除算の違いを確認する", difficulty: "EASY"  },
          { questionId: "rectangle_area",      title: "長方形の面積と周囲長を計算する",     difficulty: "EASY"   },
          { questionId: "celsius_to_fahrenheit",title: "摂氏を華氏に変換する",             difficulty: "NORMAL" },
          { questionId: "triangle_area",       title: "三角形の面積を計算する",             difficulty: "NORMAL" },
          { questionId: "bmi_calculation",     title: "BMIを計算して表示する",              difficulty: "NORMAL" },
          { questionId: "average_three",       title: "3科目の平均点を計算する",            difficulty: "NORMAL" },
          { questionId: "time_conversion",     title: "秒数を時・分・秒に変換する",         difficulty: "HARD"   },
          { questionId: "exchange_calculation",title: "円をドルとユーロに換算する",         difficulty: "HARD"   },
        ],
      },
      {
        // 04_if_statement までの知識で解ける問題
        // 利用可能: 基本構文・変数・型・演算子（%・&&・||）・if/else/switch
        // 利用不可: Scanner・Random・for/while ループ・配列・メソッド
        // ※ Scanner は 03a_scanner（if文より後）で登場するため使用不可
        id: "java_if",
        label: "if文",
        theme: "java",
        exercises: [
          { questionId: "pass_fail",              title: "合否判定を実装する",                    difficulty: "EASY"   },
          { questionId: "positive_negative_zero", title: "正・負・ゼロを判定する",                difficulty: "EASY"   },
          { questionId: "even_odd",               title: "偶数・奇数を判定する",                  difficulty: "EASY"   },
          { questionId: "max_of_two",             title: "2つの数の大きい方を表示する",           difficulty: "EASY"   },
          { questionId: "age_category",           title: "年齢から区分を判定する",                difficulty: "EASY"   },
          { questionId: "season_judgment",        title: "季節判定プログラムを実装する",          difficulty: "NORMAL" },
          { questionId: "bmi_category",           title: "BMIから体重区分を判定する",             difficulty: "NORMAL" },
          { questionId: "triangle_type",          title: "三角形の種類を判定する",                difficulty: "NORMAL" },
          { questionId: "score_grade",            title: "点数から成績と評価を出力する",          difficulty: "NORMAL" },
          { questionId: "leap_year",              title: "うるう年を判定する",                    difficulty: "HARD"   },
          { questionId: "divisible_by_three",     title: "3の倍数かどうかを判定する",             difficulty: "EASY"   },
          { questionId: "max_of_three",           title: "3つの数の最大値を求める",               difficulty: "EASY"   },
          { questionId: "absolute_value",         title: "絶対値をif文で求める",                  difficulty: "EASY"   },
          { questionId: "letter_grade",           title: "点数からA〜Fの成績を判定する",          difficulty: "EASY"   },
          { questionId: "ticket_price",           title: "年齢区分によってチケット代を表示する",  difficulty: "NORMAL" },
          { questionId: "fizz_single",            title: "1つの数がFizz/Buzz/FizzBuzzか判定する", difficulty: "NORMAL" },
          { questionId: "body_temperature",       title: "体温から状態を判定する",                difficulty: "NORMAL" },
          { questionId: "quadrant",               title: "座標がどの象限にあるかを判定する",      difficulty: "NORMAL" },
          { questionId: "vending_machine",        title: "自動販売機のお釣りを計算する",          difficulty: "HARD"   },
          { questionId: "right_triangle",         title: "直角三角形かどうかを判定する",          difficulty: "HARD"   },
        ],
      },
      {
        // 05_loops までの知識で解ける問題
        // 利用可能: if文 + Scanner + for/while ループ
        // 利用不可: 配列・メソッド
        id: "java_for",
        label: "for文・while文",
        theme: "java",
        exercises: [
          { questionId: "sum_calculation",      title: "合計計算プログラムを実装する",      difficulty: "EASY"   },
          { questionId: "countdown",           title: "カウントダウンを表示する",         difficulty: "EASY"   },
          { questionId: "even_numbers",        title: "1〜30の偶数をすべて表示する",      difficulty: "EASY"   },
          { questionId: "multiplication_row",  title: "指定した段の九九を表示する",       difficulty: "EASY"   },
          { questionId: "sum_input",           title: "入力した数まで合計を求める",       difficulty: "EASY"   },
          { questionId: "fizzbuzz",            title: "FizzBuzzを実装する",              difficulty: "NORMAL" },
          { questionId: "prime_check",         title: "素数かどうかを判定する",           difficulty: "NORMAL" },
          { questionId: "multiplication_table",title: "九九全体を表示する",              difficulty: "NORMAL" },
          { questionId: "digit_sum",           title: "整数の各桁の和を求める",           difficulty: "NORMAL" },
          { questionId: "collatz_sequence",    title: "コラッツ数列を表示する",           difficulty: "HARD"   },
          { questionId: "triangle_stars",      title: "＊で三角形を表示する",             difficulty: "EASY"   },
          { questionId: "sum_of_odd",          title: "1〜Nの奇数の合計を求める",        difficulty: "EASY"   },
          { questionId: "factorial",           title: "N!（階乗）を計算する",            difficulty: "EASY"   },
          { questionId: "multiples_of_n",      title: "100以下のNの倍数をすべて表示する", difficulty: "EASY"   },
          { questionId: "star_square",         title: "＊でN×Nの四角形を表示する",       difficulty: "NORMAL" },
          { questionId: "sum_of_squares",      title: "1²+2²+...+N²の合計を求める",     difficulty: "NORMAL" },
          { questionId: "minimum_from_input",  title: "5個の入力から最小値を求める",      difficulty: "NORMAL" },
          { questionId: "fibonacci",           title: "フィボナッチ数列を表示する",       difficulty: "NORMAL" },
          { questionId: "perfect_numbers",     title: "1〜1000の完全数をすべて表示する",  difficulty: "HARD"   },
          { questionId: "number_pattern",      title: "数字のピラミッドを表示する",       difficulty: "HARD"   },
        ],
      },
      {
        // 06_arrays までの知識で解ける問題
        // 利用可能: ループ・if・Scanner・配列（宣言・アクセス・.length・for-each）
        // 利用不可: ユーザー定義メソッド・クラス
        id: "java_arrays",
        label: "配列",
        theme: "java",
        exercises: [
          { questionId: "array_print_all",      title: "配列の全要素を表示する",               difficulty: "EASY"   },
          { questionId: "array_sum",            title: "配列の合計を求める",                   difficulty: "EASY"   },
          { questionId: "array_max",            title: "配列の最大値を求める",                 difficulty: "EASY"   },
          { questionId: "array_length",         title: "配列の要素数と各要素を番号付きで表示する", difficulty: "EASY"  },
          { questionId: "array_average",        title: "配列の平均値を求める",                 difficulty: "NORMAL" },
          { questionId: "array_reverse_print",  title: "配列を逆順に表示する",                 difficulty: "NORMAL" },
          { questionId: "array_count_positive", title: "配列の正の要素の個数を数える",         difficulty: "NORMAL" },
          { questionId: "array_linear_search",  title: "配列から特定の値を線形探索する",       difficulty: "NORMAL" },
          { questionId: "two_dim_sum",          title: "2次元配列の全要素の合計を求める",      difficulty: "HARD"   },
          { questionId: "bubble_sort",          title: "バブルソートで配列を昇順に並び替える", difficulty: "HARD"   },
        ],
      },
      {
        // 07_methods までの知識で解ける問題
        // 利用可能: static メソッド（引数・戻り値・オーバーロード）・配列
        // 利用不可: クラス設計（非staticメソッド・フィールド）
        id: "java_methods",
        label: "メソッド",
        theme: "java",
        exercises: [
          { questionId: "greet_method",              title: "名前を受け取り挨拶を返すメソッド",                   difficulty: "EASY"   },
          { questionId: "add_method",                title: "2つの整数の和を返すメソッド",                       difficulty: "EASY"   },
          { questionId: "is_even_method",            title: "偶数かどうかを返すbooleanメソッド",                  difficulty: "EASY"   },
          { questionId: "max_two_method",            title: "2数の大きい方を返すメソッド",                       difficulty: "EASY"   },
          { questionId: "power_method",              title: "n乗を計算するメソッド",                            difficulty: "NORMAL" },
          { questionId: "factorial_method",          title: "階乗を返すメソッドを実装する",                      difficulty: "NORMAL" },
          { questionId: "array_sum_method",          title: "int配列の合計を返すメソッド",                      difficulty: "NORMAL" },
          { questionId: "is_prime_method",           title: "素数判定メソッドを使って100以下の素数を表示",       difficulty: "NORMAL" },
          { questionId: "overload_area",             title: "オーバーロードで複数の図形の面積を計算する",        difficulty: "HARD"   },
          { questionId: "celsius_conversion_methods",title: "摂氏⇔華氏変換メソッドを両方向で実装する",         difficulty: "HARD"   },
        ],
      },
      {
        // 08_multiple_classes までの知識で解ける問題
        // 利用可能: 複数クラスの参照・static と非static の混在
        // 利用不可: OOP（カプセル化・継承）
        id: "java_multiple_classes",
        label: "複数クラスの連携",
        theme: "java",
        exercises: [
          { questionId: "point_class",               title: "Pointクラスを別クラスから生成・表示する",           difficulty: "EASY"   },
          { questionId: "rectangle_class",           title: "Rectangleクラスで面積と周囲長を計算する",          difficulty: "EASY"   },
          { questionId: "person_display",            title: "Personクラスを作り情報を表示するメソッドを定義する", difficulty: "EASY"  },
          { questionId: "counter_class",             title: "Counterクラスでカウント・リセットを実装する",       difficulty: "NORMAL" },
          { questionId: "bank_account_class",        title: "BankAccountクラスで入金・出金・残高表示",           difficulty: "NORMAL" },
          { questionId: "calculator_class",          title: "Calculatorクラスで四則演算メソッドを実装する",     difficulty: "NORMAL" },
          { questionId: "two_classes_interaction",   title: "StudentクラスとTeacherクラスを相互に参照する",     difficulty: "NORMAL" },
          { questionId: "temperature_converter_class",title: "TemperatureConverterクラスで変換処理を分離する", difficulty: "HARD"   },
          { questionId: "circle_class",              title: "Circleクラスで面積・周囲・比較メソッドを実装する", difficulty: "HARD"   },
          { questionId: "todo_class",                title: "ToDoItemクラスを使ったタスク管理プログラム",        difficulty: "HARD"   },
        ],
      },
      {
        // 09_exception_handling までの知識で解ける問題
        // 利用可能: try-catch-finally・throws・カスタム例外
        // 利用不可: 継承・インターフェース
        id: "java_exception",
        label: "例外処理",
        theme: "java",
        exercises: [
          { questionId: "basic_try_catch",        title: "基本的なtry-catchで例外をキャッチする",          difficulty: "EASY"   },
          { questionId: "array_index_exception",  title: "ArrayIndexOutOfBoundsExceptionをキャッチする", difficulty: "EASY"   },
          { questionId: "number_format_exception",title: "NumberFormatExceptionをキャッチして対処する",   difficulty: "EASY"   },
          { questionId: "finally_block",          title: "try-catch-finallyで後処理を保証する",           difficulty: "NORMAL" },
          { questionId: "multi_catch",            title: "複数の例外を個別にキャッチする",                difficulty: "NORMAL" },
          { questionId: "null_pointer_exception", title: "NullPointerExceptionをキャッチして安全に処理する", difficulty: "NORMAL" },
          { questionId: "custom_exception",       title: "独自例外クラスを定義してスローする",            difficulty: "NORMAL" },
          { questionId: "throws_declaration",     title: "throwsで例外を呼び出し元に伝搬させる",          difficulty: "HARD"   },
          { questionId: "exception_in_method",    title: "メソッドから例外をスローして呼び出し元でキャッチ", difficulty: "HARD" },
          { questionId: "validation_with_exception",title: "入力値検証に独自例外を使う",                  difficulty: "HARD"   },
        ],
      },
      {
        // 10_oop_basics までの知識で解ける問題
        // 利用可能: クラス・フィールド・インスタンスメソッド・new
        // 利用不可: 継承・インターフェース・カプセル化（private/getter）
        id: "java_oop_basics",
        label: "オブジェクト指向の基礎",
        theme: "java",
        exercises: [
          { questionId: "dog_class",          title: "Dogクラスでフィールドとインスタンスメソッドを定義する",      difficulty: "EASY"   },
          { questionId: "car_class",          title: "Carクラスで属性と走行メソッドを実装する",                  difficulty: "EASY"   },
          { questionId: "book_class",         title: "Bookクラスでタイトル・著者・ページ数を管理する",            difficulty: "EASY"   },
          { questionId: "counter_object",     title: "Counterオブジェクトでカウント・リセット・取得を実装する",   difficulty: "NORMAL" },
          { questionId: "player_class",       title: "Playerクラスでゲームプレイヤーの体力と攻撃を管理する",     difficulty: "NORMAL" },
          { questionId: "circle_object",      title: "Circleクラスで半径・面積・周囲を計算するメソッドを実装する", difficulty: "NORMAL" },
          { questionId: "student_score",      title: "Studentクラスで複数科目の点数管理と平均計算",             difficulty: "NORMAL" },
          { questionId: "bank_account_object",title: "BankAccountオブジェクトで残高管理（入金・出金）する",      difficulty: "HARD"   },
          { questionId: "dice_class",         title: "Diceクラスでサイコロを振るメソッドを実装する（Random使用）", difficulty: "HARD"  },
          { questionId: "shopping_cart",      title: "ShoppingCartクラスで商品追加・合計計算を実装する",        difficulty: "HARD"   },
        ],
      },
      {
        // 11_constructors までの知識で解ける問題
        // 利用可能: コンストラクタ・this・オーバーロードコンストラクタ
        // 利用不可: 継承
        id: "java_constructors",
        label: "コンストラクタ",
        theme: "java",
        exercises: [
          { questionId: "point_constructor",       title: "コンストラクタでPointオブジェクトを初期化する",          difficulty: "EASY"   },
          { questionId: "person_constructor",      title: "Personクラスにコンストラクタを追加して情報を初期化する", difficulty: "EASY"   },
          { questionId: "default_constructor",     title: "デフォルトコンストラクタと引数ありコンストラクタを比べる", difficulty: "EASY"  },
          { questionId: "this_usage",              title: "thisキーワードでフィールドとパラメータを区別する",       difficulty: "NORMAL" },
          { questionId: "constructor_overload",    title: "コンストラクタをオーバーロードして複数の初期化方法を提供する", difficulty: "NORMAL" },
          { questionId: "rectangle_constructor",   title: "Rectangleクラスのコンストラクタで面積・周囲長を計算",   difficulty: "NORMAL" },
          { questionId: "this_chain",              title: "this()でコンストラクタから別コンストラクタを呼ぶ",       difficulty: "NORMAL" },
          { questionId: "student_with_constructor",title: "Studentクラスでコンストラクタ・フィールド・メソッドを組み合わせる", difficulty: "HARD" },
          { questionId: "immutable_point",         title: "コンストラクタのみで初期化し変更不可なPointクラスを作る", difficulty: "HARD"  },
          { questionId: "bank_account_constructor",title: "BankAccountクラスにコンストラクタで初期残高を設定する", difficulty: "HARD"  },
        ],
      },
      {
        // 12_inheritance までの知識で解ける問題
        // 利用可能: extends・super・@Override・ポリモーフィズム
        // 利用不可: インターフェース
        id: "java_inheritance",
        label: "継承",
        theme: "java",
        exercises: [
          { questionId: "animal_extends",        title: "Animalクラスを継承してDogクラスを作る",              difficulty: "EASY"   },
          { questionId: "shape_extends",         title: "Shapeクラスを継承してCircleとRectangleを作る",      difficulty: "EASY"   },
          { questionId: "super_call",            title: "superでスーパークラスのコンストラクタを呼ぶ",        difficulty: "EASY"   },
          { questionId: "override_method",       title: "@Overrideでメソッドをオーバーライドする",           difficulty: "NORMAL" },
          { questionId: "polymorphism",          title: "親クラス型の変数でサブクラスのメソッドを呼ぶ",      difficulty: "NORMAL" },
          { questionId: "vehicle_hierarchy",     title: "Vehicleクラス→Car/Bike/Truckの継承ツリーを実装する", difficulty: "NORMAL" },
          { questionId: "super_method_call",     title: "super.メソッド()で親クラスの処理を再利用する",      difficulty: "NORMAL" },
          { questionId: "instanceof_check",      title: "instanceofでオブジェクトの型を判定する",           difficulty: "HARD"   },
          { questionId: "abstract_base",         title: "抽象的な基底クラスを継承して複数のサブクラスを実装する", difficulty: "HARD" },
          { questionId: "multilevel_inheritance",title: "3段階の継承チェーンを実装してオーバーライドの動作を確認する", difficulty: "HARD" },
        ],
      },
      {
        // 13_interfaces までの知識で解ける問題
        // 利用可能: interface・implements・多態性
        id: "java_interfaces",
        label: "インターフェース",
        theme: "java",
        exercises: [
          { questionId: "simple_interface",        title: "Greetableインターフェースを定義して実装する",            difficulty: "EASY"   },
          { questionId: "shape_interface",         title: "Shapeインターフェースで面積・周囲のメソッドを定義する", difficulty: "EASY"   },
          { questionId: "printable_interface",     title: "Printableインターフェースを複数クラスに実装する",       difficulty: "EASY"   },
          { questionId: "interface_polymorphism",  title: "インターフェース型変数で複数実装クラスを扱う",          difficulty: "NORMAL" },
          { questionId: "multiple_interfaces",     title: "複数のインターフェースを1つのクラスに実装する",         difficulty: "NORMAL" },
          { questionId: "comparable_like",         title: "大小比較メソッドをインターフェースで定義して実装する",  difficulty: "NORMAL" },
          { questionId: "flyable_swimable",        title: "FlyableとSwimmableを複数クラスに組み合わせて実装する", difficulty: "NORMAL" },
          { questionId: "interface_default_method",title: "defaultメソッドをインターフェースに定義して使う",      difficulty: "HARD"   },
          { questionId: "strategy_pattern",        title: "インターフェースで処理の切り替え（Strategyパターン）を実装する", difficulty: "HARD" },
          { questionId: "interface_vs_class",      title: "インターフェースと継承を組み合わせたクラス設計を実装する", difficulty: "HARD" },
        ],
      },
      {
        // 14_encapsulation までの知識で解ける問題
        // 利用可能: private・getter/setter・アクセス修飾子
        id: "java_encapsulation",
        label: "カプセル化",
        theme: "java",
        exercises: [
          { questionId: "private_fields",         title: "フィールドをprivateにしてクラス外からのアクセスを防ぐ", difficulty: "EASY"   },
          { questionId: "getter_setter",          title: "getterとsetterを定義してフィールドにアクセスする",     difficulty: "EASY"   },
          { questionId: "access_modifiers",       title: "public/private/protectedの違いを確認する",            difficulty: "EASY"   },
          { questionId: "validation_in_setter",   title: "setterでバリデーションを行う",                        difficulty: "NORMAL" },
          { questionId: "readonly_field",         title: "getterだけ定義してread-onlyなフィールドを実現する",   difficulty: "NORMAL" },
          { questionId: "person_encapsulation",   title: "Personクラスを完全にカプセル化して情報を保護する",    difficulty: "NORMAL" },
          { questionId: "bank_account_encapsulation",title: "BankAccountの残高をprivateで管理して不正操作を防ぐ", difficulty: "NORMAL" },
          { questionId: "temperature_encapsulation",title: "温度をカプセル化し、範囲外の値を拒否するクラスを作る", difficulty: "HARD"  },
          { questionId: "immutable_class",        title: "すべてのフィールドをfinalにした不変クラスを作る",      difficulty: "HARD"   },
          { questionId: "encapsulation_refactor", title: "カプセル化されていないクラスを適切に修正する",         difficulty: "HARD"   },
        ],
      },
      {
        // 15_collections までの知識で解ける問題
        // 利用可能: ArrayList・HashMap・HashSet・for-each
        id: "java_collections",
        label: "コレクション",
        theme: "java",
        exercises: [
          { questionId: "arraylist_basic",      title: "ArrayListに要素を追加・取得・表示する",         difficulty: "EASY"   },
          { questionId: "arraylist_remove",     title: "ArrayListから要素を削除して残りを表示する",     difficulty: "EASY"   },
          { questionId: "hashmap_basic",        title: "HashMapでキーと値のペアを管理する",             difficulty: "EASY"   },
          { questionId: "hashset_unique",       title: "HashSetで重複のない要素集合を管理する",         difficulty: "EASY"   },
          { questionId: "arraylist_sum",        title: "ArrayListの数値要素の合計を求める",             difficulty: "NORMAL" },
          { questionId: "arraylist_filter",     title: "ArrayListから条件に合う要素だけを抽出する",     difficulty: "NORMAL" },
          { questionId: "hashmap_count",        title: "HashMapで単語の出現回数を数える",               difficulty: "NORMAL" },
          { questionId: "collections_sort",     title: "ArrayListをCollections.sort()で並び替える",    difficulty: "NORMAL" },
          { questionId: "nested_collection",    title: "HashMapのvalueをArrayListにしてグループ管理する", difficulty: "HARD"  },
          { questionId: "todo_list_collections",title: "ArrayListとHashMapを使ったToDoリストを実装する", difficulty: "HARD"  },
        ],
      },
      {
        // 16_datetime までの知識で解ける問題
        // 利用可能: LocalDate・LocalTime・LocalDateTime・DateTimeFormatter・Period・ChronoUnit
        id: "java_datetime",
        label: "日時操作",
        theme: "java",
        exercises: [
          { questionId: "local_date_basic",     title: "LocalDate.now()で今日の日付を表示する",            difficulty: "EASY"   },
          { questionId: "local_time_basic",     title: "LocalTime.now()で現在時刻を表示する",              difficulty: "EASY"   },
          { questionId: "date_of",              title: "LocalDate.of()で特定の日付を作成して表示する",     difficulty: "EASY"   },
          { questionId: "date_format",          title: "DateTimeFormatterで日付を指定フォーマットで表示する", difficulty: "NORMAL" },
          { questionId: "date_plus_minus",      title: "plusDays/minusMonthsで日付の加減算を行う",         difficulty: "NORMAL" },
          { questionId: "date_compare",         title: "2つの日付を比較してどちらが先かを判定する",        difficulty: "NORMAL" },
          { questionId: "days_until_birthday",  title: "今日から誕生日までの日数を計算する",               difficulty: "NORMAL" },
          { questionId: "period_between",       title: "Period.between()で年齢（年数）を計算する",         difficulty: "HARD"   },
          { questionId: "datetime_combination", title: "LocalDateTimeで日付と時刻を組み合わせて操作する",  difficulty: "HARD"   },
          { questionId: "schedule_display",     title: "複数のLocalDateを使ってスケジュール一覧を表示する", difficulty: "HARD"  },
        ],
      },
    ],
  },
  {
    id: "comprehensive",
    label: "総合演習",
    groups: [
      {
        id: "general",
        label: "総合",
        theme: "comprehensive",
        exercises: [],
      },
    ],
  },
];

/**
 * 追加演習のIDを構築する
 * 形式: `extra/{theme}/{groupId}#{questionId}`
 */
export function buildExtraId(
  theme: string,
  groupId: string,
  questionId: string
): string {
  return `extra/${theme}/${groupId}#${questionId}`;
}

/**
 * 全追加演習を Question 型互換オブジェクトとして返す
 * フィルタパイプライン（resolveDojoQuestions）で再利用するため
 */
export function getAllExtraQuestionsAsQuestion(): Question[] {
  const result: Question[] = [];
  for (const theme of ALL_EXTRA_THEMES) {
    for (const group of theme.groups) {
      for (const exercise of group.exercises) {
        result.push({
          id: buildExtraId(theme.id, group.id, exercise.questionId),
          title: exercise.title,
          type: "WRITE" as QuestionType,
          difficulty: toDifficulty(exercise.difficulty),
        });
      }
    }
  }
  return result;
}

/** 全追加演習IDを返す */
export function getAllExtraExerciseIds(): string[] {
  return getAllExtraQuestionsAsQuestion().map((q) => q.id);
}

/** 指定グループの追加演習IDを返す */
export function getExtraQuestionIdsForGroup(groupId: string): string[] {
  for (const theme of ALL_EXTRA_THEMES) {
    const group = theme.groups.find((g) => g.id === groupId);
    if (group) {
      return group.exercises.map((e) =>
        buildExtraId(theme.id, groupId, e.questionId)
      );
    }
  }
  return [];
}

/** 指定テーマの追加演習IDを返す */
export function getExtraQuestionIdsForTheme(themeId: string): string[] {
  const theme = ALL_EXTRA_THEMES.find((t) => t.id === themeId);
  if (!theme) return [];
  return theme.groups.flatMap((g) =>
    g.exercises.map((e) => buildExtraId(themeId, g.id, e.questionId))
  );
}
