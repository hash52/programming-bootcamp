/*
  すべてのトピックと設問の構造を定義する
  これを元にダッシュボード画面が生成される
*/

/** すべてのカテゴリ一覧。トピックが所属するディレクトリ。 */
const ALL_CATEGORIES = [
  "java/basics",
  "java/oop",
  "java/stdlib",
  "spring",
  "db/basics",
  "db/select",
  "db/design",
  "frontend",
  "git/basics",
  "git/teamwork",
] as const;
type Category = (typeof ALL_CATEGORIES)[number];

/** ダッシュボードで表示するカテゴリの日本語ラベル */
export const CATEGORIES_LABELS: Record<Category, string> = {
  "java/basics": "Java - 基本文法",
  "java/oop": "Java - オブジェクト指向",
  "java/stdlib": "Java - 標準ライブラリ",
  spring: "Spring",
  "db/basics": "データベース - 基礎",
  "db/select": "データベース - SELECT",
  "db/design": "データベース - 設計",
  frontend: "フロントエンド",
  "git/basics": "Git - 入門",
  "git/teamwork": "Git - チーム開発",
};

/** 難易度(数値が大きいほど難しい) */
export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

/** 設問タイプ */
type QuestionType = "KNOW" | "READ" | "WRITE";

/** 各設問の基本構造(ID生成前) */
// IDは自動付与だが、ID付与前はタイトルなどの情報だけを持つ
interface QuestionBase {
  /** 問題の固定識別子（例: "variables_concept", "type_casting"）。
   * 未指定の場合は旧形式（type+index）でIDが生成される */
  questionId?: string;
  /** ダッシュボードで表示するタイトル。必ずしも設問文と一致しない */
  title: string;
  /** 設問の種類 */
  type: QuestionType;
  /** 難易度 */
  difficulty: Difficulty;
}

/** 各設問（ID付与後） */
interface Question extends QuestionBase {
  /** src/questions/{id}.mdxのid部分。ローカルストレージに保存する際のキー */
  id: string;
  /** 最後に達成済みとしてチェックした日 */
  //checkedAt: Date | null; ローカルストレージから引っ張る。マスタデータには持たせない
}

/** 各カテゴリのトピック */
interface Topic {
  /** ファイル名`01_{id}.mdx`のid部分。URLパスになる */
  id: string;
  /** トピックのタイトル */
  label: string;
  /** 所属カテゴリ */
  category: Category; // 階層構造をCategory/Topic/QuestionではなくTopic/Questionの形にするため、カテゴリはTopicのプロパティとして持たせる
  /** このトピックに関連する設問一覧 */
  questions: Question[];
}

/**
 * IDを自動生成するユーティリティ関数
 *
 * questionIdが指定されている場合:
 *   `{category}/{topicId}#{questionId}` 形式でIDを生成（新形式）
 *
 * questionIdが未指定の場合:
 *   `{category}/{topicId}#{type}{index}` 形式でIDを生成（旧形式、後方互換性のため）
 *
 * 例:
 * - questionId指定あり: `java/basics/02_variables_and_types#variables_concept`
 * - questionId指定なし: `java/basics/02_variables_and_types#k1`
 */
function withAutoIds(
  topic: Omit<Topic, "questions"> & { questions: QuestionBase[] },
): Topic {
  // type別のカウンター（旧形式用）
  const typeCounters: Record<string, number> = { k: 0, r: 0, w: 0 };

  return {
    ...topic,
    questions: topic.questions.map((q) => {
      if (q.questionId) {
        // 新形式: questionIdを使用
        return {
          ...q,
          id: `${topic.category}/${topic.id}#${q.questionId}`,
        };
      } else {
        // 旧形式: type + 連番
        const qPrefix = q.type === "KNOW" ? "k" : q.type === "READ" ? "r" : "w";
        typeCounters[qPrefix]++;
        return {
          ...q,
          id: `${topic.category}/${topic.id}#${qPrefix}${typeCounters[qPrefix]}`,
        };
      }
    }),
  };
}

/**
 * 全トピック一覧
 * ダッシュボードに表示されるデータのマスタ
 */
export const ALL_TOPIC_STRUCTURE: readonly Topic[] = [
  // Java - 基本文法
  withAutoIds({
    id: "01_java_basics",
    label: "Javaとプログラミングの基礎",
    category: "java/basics",
    questions: [
      {
        questionId: "execution_order",
        title: "プログラムの実行順序を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "readable_code",
        title: "読みやすいコードの書き方がわかる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "brace_role",
        title: "波括弧の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "java_use_cases",
        title: "Javaの活用場面を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "hello_world",
        title: "「Hello World」と画面に表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "run_in_eclipse",
        title: "EclipseでJavaプログラムを実行できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "print_name_and_age",
        title: "自分の名前と年齢を表示するプログラムを書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "02_variables_and_types",
    label: "変数と型",
    category: "java/basics",
    questions: [
      {
        questionId: "variables_concept",
        title: "変数とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "type_basics",
        title: "型とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "int_type_data",
        title: "整数型が扱えるデータを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "double_type_data",
        title: "小数型が扱えるデータを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "string_type_data",
        title: "文字列型が扱えるデータを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "boolean_type_data",
        title: "真偽値型が扱えるデータを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "assignment_concept",
        title: "代入とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "declare_variable",
        title: "変数に値を代入できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "declare_int_variable",
        title: "整数型の変数を宣言できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "declare_double_variable",
        title: "小数型の変数を宣言できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "declare_boolean_variable",
        title: "真偽値型の変数を宣言できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "declare_string_variable",
        title: "文字列型の変数を宣言できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "variable_naming",
        title: "わかりやすい変数名を付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "type_casting",
        title: "型変換ができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "variable_scope",
        title: "変数のスコープを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "declare_constant",
        title: "定数を宣言できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_type_compatibility",
        title: "型が違う変数に代入できるか判断できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "03_operators",
    label: "演算子",
    category: "java/basics",
    questions: [
      {
        questionId: "arithmetic_operators_concept",
        title: "算術演算子とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "comparison_operators_concept",
        title: "比較演算子とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "logical_operators_concept",
        title: "論理演算子とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "increment_decrement_concept",
        title: "インクリメント・デクリメント演算子とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "basic_arithmetic",
        title: "四則演算ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "modulo_operation",
        title: "剰余演算ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "integer_division_result",
        title: "整数同士の割り算の結果を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "compound_assignment",
        title: "複合代入演算ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "value_comparison",
        title: "値を比較できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "combine_conditions",
        title: "複数の条件を組み合わせられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "invert_condition",
        title: "条件を反転できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "increment_decrement_value",
        title: "値を1増やす・減らすことができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_calculation_result",
        title: "計算式の結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "03a_scanner",
    label: "標準入力（Scanner）",
    category: "java/basics",
    questions: [
      {
        questionId: "stdin_concept",
        title: "標準入力とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "scanner_class_role",
        title: "標準入力用クラスの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "string_vs_int_reading",
        title: "文字列読み取りと整数読み取りの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "input_from_keyboard",
        title: "キーボードから文字を入力できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "prepare_scanner",
        title: "標準入力を使う準備ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_line",
        title: "1行を読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_integer",
        title: "整数を読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_double",
        title: "小数を読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "after_nextint_caution",
        title: "整数読み取り後の注意点がわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "handle_invalid_input",
        title: "数字以外が入力された時の対処ができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "03b_random",
    label: "乱数生成（Random）",
    category: "java/basics",
    questions: [
      {
        questionId: "random_concept",
        title: "乱数とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "random_class_role",
        title: "Randomクラスの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "nextint_argument_meaning",
        title: "nextInt()の引数の意味を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "generate_random_number",
        title: "ランダムな数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "prepare_random_class",
        title: "Randomクラスを使う準備ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "random_0_to_9",
        title: "0〜9のランダムな整数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "random_1_to_100",
        title: "1〜100のランダムな整数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "random_double",
        title: "0.0〜1.0のランダムな小数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "random_seed_concept",
        title: "乱数の再現性を制御する方法がわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "random_from_array",
        title: "配列からランダムに選ぶプログラムを書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "04_if_statement",
    label: "条件分岐",
    category: "java/basics",
    questions: [
      {
        questionId: "conditional_branch_concept",
        title: "条件分岐とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "if_syntax_basics",
        title: "if文の基本的な構文を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "if_else_vs_elseif",
        title: "if-elseとif-else ifの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "switch_vs_if",
        title: "switch文とif文の使い分けを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "simple_if_statement",
        title: "if文で条件によって処理を分けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "if_else_statement",
        title: "if-else文で2つの処理を切り替えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "if_elseif_else_statement",
        title: "if-else if-elseで3つ以上の処理を分けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "complex_conditions",
        title: "&&や||を使った複雑な条件を書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "switch_statement",
        title: "switch文で複数の選択肢から選べる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "switch_break_role",
        title: "switchのbreakの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "read_conditional_code",
        title: "条件分岐のコードを読んで結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "conditional_by_value",
        title: "年齢や点数で処理を変えるプログラムが書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "05_loops",
    label: "繰り返し",
    category: "java/basics",
    questions: [
      {
        title: "ループとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "for文の基本的な構文を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "while文とdo-while文の違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "breakとcontinueの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "無限ループとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "for文で同じ処理を繰り返せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "for文で1〜10まで表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "while文で条件が満たされる間繰り返せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "do-while文で最低1回は実行できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "breakでループを途中で抜けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "continueで次の繰り返しにスキップできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "二重ループが書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ループのコードを読んで何回実行されるかわかる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "06_arrays",
    label: "配列",
    category: "java/basics",
    questions: [
      {
        title: "配列とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列のインデックスの仕組みを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の宣言と初期化の方法を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の長さを取得する方法を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列を作って値を入れられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の値を取り出せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "forループで配列の全要素を表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "拡張for文で配列を簡単に処理できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の合計や平均を計算できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "配列から最大値・最小値を見つけられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "2次元配列を使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "07_methods",
    label: "メソッド",
    category: "java/basics",
    questions: [
      {
        title: "メソッドとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "引数なし・戻り値なしのメソッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "引数でメソッドに値を渡せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "returnで値を返すメソッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "voidの意味を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "メソッドを呼び出して結果を受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "同じ名前で引数が違うメソッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "メソッド内外での変数のスコープを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "重複したコードをメソッドにまとめられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "08_multiple_classes",
    label: "複数クラスの連携",
    category: "java/basics",
    questions: [
      {
        title: "パッケージでクラスを整理できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "import文で他のクラスを使えるようにできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "複数のクラスに処理を分けることのメリットがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "別のクラスのメソッドを呼び出せる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "Eclipseの補完機能を使ってコードを速く書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "複数クラスで連携するプログラムを書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "09_exception_handling",
    label: "例外処理",
    category: "java/basics",
    questions: [
      {
        title: "例外とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "try-catch-finallyの各ブロックの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "throwとthrowsの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "try-catchでエラーを捕まえて処理できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "catchで複数の例外を処理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "finallyで必ず実行される処理を書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "throwsでエラーを呼び出し元に任せられる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "throwで自分でエラーを発生させられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "例外処理のコードを読んで流れを理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ファイル操作やネットワーク処理で例外処理を書ける",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "10_oop_basics",
    label: "オブジェクト指向の基礎",
    category: "java/oop",
    questions: [
      {
        title: "クラスとオブジェクトの関係を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "オブジェクト指向とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フィールドとメソッドの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フィールドでデータを保存できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "newキーワードでオブジェクトを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "インスタンスメソッドを呼び出せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "staticメソッドとインスタンスメソッドの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "同じクラスから複数のオブジェクトを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フィールドとメソッドを持つクラスを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "配列でオブジェクトをまとめて管理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "11_constructors",
    label: "コンストラクタ",
    category: "java/oop",
    questions: [
      {
        title: "コンストラクタとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "コンストラクタとメソッドの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "thisキーワードの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "コンストラクタでフィールドに初期値を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "引数ありのコンストラクタを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "thisキーワードでフィールドを指定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "引数が違う複数のコンストラクタを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "デフォルトコンストラクタの仕組みを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "this()で別のコンストラクタを呼び出せる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "コンストラクタで値をチェックできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "12_inheritance",
    label: "継承",
    category: "java/oop",
    questions: [
      {
        title: "継承とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "extendsで親クラスを指定できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "子クラスで親のメソッドを使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "superで親のメソッドを呼び出せる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "super()で親のコンストラクタを呼び出せる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "メソッドをオーバーライドして動きを変えられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@Overrideアノテーションを付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "オーバーロードとオーバーライドの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "親クラス型で子クラスのオブジェクトを扱える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "継承の適切な使い方を判断できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "13_interfaces",
    label: "インターフェース",
    category: "java/oop",
    questions: [
      {
        title: "インターフェースとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "interfaceでインターフェースを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "implementsでインターフェースを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "インターフェースのメソッド定義の特徴を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "実装クラスで全てのメソッドを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "複数のインターフェースを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェース型で複数のクラスをまとめて扱える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "defaultメソッドの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "継承とインターフェースの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "14_encapsulation",
    label: "カプセル化",
    category: "java/oop",
    questions: [
      {
        title: "カプセル化とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フィールドをprivateにできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "getterで値を取得するメソッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "setterで値を設定するメソッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "publicとprivateの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "protectedとデフォルトアクセスの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "setterで値をチェックして不正な値を防げる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "読み取り専用のフィールドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "適切なアクセス修飾子を選んでクラスを設計できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "15_collections",
    label: "コレクション",
    category: "java/stdlib",
    questions: [
      {
        title: "ArrayListの特徴を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列とArrayListの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ジェネリクスとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ArrayListに要素を追加できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ArrayListから要素を取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ArrayListから要素を削除できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "HashSetで重複しないデータを管理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "HashMapでキーと値のペアを保存できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ジェネリクスで型を指定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "List、Set、Mapの使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "コレクションをループで処理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "16_datetime",
    label: "日時操作",
    category: "java/stdlib",
    questions: [
      {
        title: "LocalDate、LocalTime、LocalDateTimeの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "DateTimeFormatterの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "LocalDateで今日の日付を取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "LocalTimeで現在時刻を取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "LocalDateTimeで日付と時刻を一緒に扱える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "日付に日数を足したり引いたりできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "2つの日付の差を計算できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "DateTimeFormatterで日付を好きな形式で表示できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "PeriodとDurationの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "日時オブジェクトの変更可能性について説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // Spring
  withAutoIds({
    id: "02_mvc_intro",
    label: "MVCモデルの基本",
    category: "spring",
    questions: [
      {
        title: "MVCの各要素を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Modelの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Viewの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Controllerの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "MVCで役割を分けるメリットを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ユーザー操作から画面表示までの流れを説明できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フレームワークのメリットを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "MVCを意識してコードを整理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "04_controller_routing",
    label: "コントローラとルーティング",
    category: "spring",
    questions: [
      {
        title: "ルーティングとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "GETとPOSTの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Controllerアノテーションの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Controllerでコントローラクラスを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@GetMappingでURLと処理を紐付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "メソッドからビュー名を返せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@PostMappingでフォーム送信を受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@GetMappingと@PostMappingの使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "URLからどのメソッドが実行されるか判断できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "コントローラが検出されない原因を推測できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@RequestMappingの使い方がわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "05_request_to_controller",
    label: "リクエストからコントローラへの値の受け渡し",
    category: "spring",
    questions: [
      {
        title: "リクエストパラメータとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@RequestParamの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@PathVariableの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@RequestParamでクエリパラメータを受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@PathVariableでURLの一部を受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "クエリパラメータとパスパラメータの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "フォームオブジェクトで複数の値をまとめて受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "URLから送られた値を読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "必須パラメータとオプションパラメータを使い分けられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "06_controller_to_view_thymeleaf",
    label: "コントローラからビューへの値の受け渡しとThymeleaf",
    category: "spring",
    questions: [
      {
        title: "Thymeleafとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Modelオブジェクトの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "th:textとth:utextの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "Thymeleafの主要な属性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ModelのaddAttributeで値を渡せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "th:textで値を画面に表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "[[...]]で値を埋め込める",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "th:ifで条件によって表示を変えられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "th:eachで繰り返し表示できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "th:objectでオブジェクトを簡潔に参照できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "th:utextの注意点を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "#stringsなどのユーティリティを使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "フラグメントで共通部品を再利用できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "07_validation",
    label: "入力値のバリデーション",
    category: "spring",
    questions: [
      {
        title: "バリデーションとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title:
          "クライアントサイドとサーバーサイドのバリデーションの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "主要なバリデーションアノテーションを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "BindingResultの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@NotNullで必須チェックができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Minや@Maxで数値の範囲をチェックできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Emailでメール形式をチェックできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Validatedでバリデーションを実行できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "BindingResultでエラーを受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "th:errorsでエラーメッセージを表示できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@AssertTrueで相関チェックができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "エラー時に入力値を保持できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "08_spring_di",
    label: "SpringのDI（依存性注入）",
    category: "spring",
    questions: [
      {
        title: "DIとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@Serviceでサービスクラスを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "コンストラクタでサービスを受け取れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@Autowiredの仕組みがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@Component、@Controller、@Service、@Repositoryの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "newを使う場合とDIを使う場合を判断できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@Primaryで優先するBeanを指定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェースを使ったDIの構成を作れる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "09_spring_mybatis",
    label: "MyBatisによるDBアクセス",
    category: "spring",
    questions: [
      {
        title: "O/Rマッパーとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "MyBatisの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "アノテーションマッパーとXMLマッパーの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "resultMapの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@Mapperでデータアクセスクラスを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "@SelectでSELECT文を実行できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "XMLマッパーでSQLを書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "schema.sqlでテーブルを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "data.sqlで初期データを入れられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "resultMapでテーブルとJavaオブジェクトを紐付けられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "1対多のリレーションをresultMapで表現できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
      {
        title: "application.propertiesでDB接続を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "10_spring_session",
    label: "セッションとログインの仕組み",
    category: "spring",
    questions: [
      {
        title: "セッションとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "セッションスコープとリクエストスコープの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "HttpSessionオブジェクトの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "HttpSessionで値を保存できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "HttpSessionで値を取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "セッションとリクエストスコープの違いがわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@SessionAttributesでフォーム情報を保持できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "SessionStatusでセッションを破棄できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "セッションでログイン状態を保持できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "セッションを使ったカート機能を作れる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "11_spring_security_login",
    label: "Spring Securityでのログイン実装",
    category: "spring",
    questions: [
      {
        title: "認証とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "認可とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "パスワードのハッシュ化の必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "UserDetailsServiceでユーザー情報を取得できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "BCryptPasswordEncoderでパスワードを暗号化できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "SecurityFilterChainでログイン画面を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "Spring SecurityとMyBatisを組み合わせて認証できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
      {
        title: "ログイン成功後のセッション情報を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ログアウト処理を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // DB - 基礎
  withAutoIds({
    id: "01_why_database",
    label: "データベースの必要性",
    category: "db/basics",
    questions: [
      {
        questionId: "file_management_issues",
        title: "ファイル管理の課題を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "dbms_functions",
        title: "DBMSの主な機能を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "table_row_column",
        title: "テーブル、行、列の概念を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_sample_db",
        title: "サンプルDBのテーブル構造を理解できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "select_all_from_table",
        title: "OneCompilerでテーブルの内容を表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "02_table_design",
    label: "テーブル設計の基礎",
    category: "db/basics",
    questions: [
      {
        questionId: "create_table_basics",
        title: "テーブルを作成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "data_type_selection",
        title: "適切なデータ型を選択できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "not_null_role",
        title: "NOT NULL制約の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "unique_role",
        title: "UNIQUE制約の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "primary_key_role",
        title: "主キーの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "foreign_key_role",
        title: "外部キーの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "check_constraint",
        title: "CHECK制約でデータの妥当性を保証できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "design_table_from_requirements",
        title: "要件からテーブル定義を作成できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "03_crud_operations",
    label: "データの作成・更新・削除",
    category: "db/basics",
    questions: [
      {
        questionId: "insert_data",
        title: "データを追加できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "insert_with_fk",
        title: "外部キー制約を考慮してデータを追加できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "update_with_where",
        title: "条件を指定してデータを更新できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "delete_with_where",
        title: "条件を指定してデータを削除できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "fk_constraint_on_delete",
        title: "外部キー制約が削除に与える影響を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "transaction_necessity",
        title: "トランザクションの必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "commit_rollback_role",
        title: "COMMITとROLLBACKの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "safe_multi_table_update",
        title: "複数テーブルを安全に更新できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  // DB - SELECT
  withAutoIds({
    id: "04_select_basics",
    label: "データの取得（基礎）",
    category: "db/select",
    questions: [
      {
        questionId: "select_all_data",
        title: "テーブルから全データを取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "select_specific_columns",
        title: "特定の列だけを取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "column_alias",
        title: "列に別名を付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "expression_column",
        title: "計算式を使った列を作成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "distinct_data",
        title: "重複を除去してデータを取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "limit_rows",
        title: "取得件数を制限できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "read_ai_select",
        title: "AIが生成したSELECT文を理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "write_select_requirements",
        title: "要件に応じたSELECT文を書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "05_where_and_order",
    label: "データの絞り込みと並び替え",
    category: "db/select",
    questions: [
      {
        questionId: "where_basic",
        title: "条件を指定してデータを絞り込める",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "where_multiple_conditions",
        title: "複数条件を組み合わせて絞り込める",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "where_between",
        title: "範囲を指定して絞り込める",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "where_in",
        title: "複数の値のいずれかに一致するデータを取得できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "where_like",
        title: "あいまい検索ができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "where_null",
        title: "NULL値を判定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "order_by",
        title: "データを並び替えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "complex_conditions",
        title: "複雑な条件でデータを取得できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "06_aggregation",
    label: "データの集計",
    category: "db/select",
    questions: [
      {
        questionId: "count_rows",
        title: "件数を集計できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "sum_avg_max_min",
        title: "合計、平均、最大、最小を計算できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "null_aggregation_impact",
        title: "NULLが集計に与える影響を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "group_by_basic",
        title: "グループごとに集計できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "group_by_multiple",
        title: "複数列でグループ化できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "having_clause",
        title: "集計結果を絞り込める",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "where_vs_having",
        title: "WHEREとHAVINGの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "aggregate_requirements",
        title: "要件に応じた集計SQLを書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // DB - 設計
  withAutoIds({
    id: "07_normalization",
    label: "テーブルの分割と正規化",
    category: "db/design",
    questions: [
      {
        questionId: "table_split_necessity",
        title: "テーブル分割の必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "update_anomalies",
        title: "更新不整合の種類を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "first_normal_form",
        title: "第1正規形を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "second_normal_form",
        title: "第2正規形を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "third_normal_form",
        title: "第3正規形を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "normalize_table",
        title: "非正規形のテーブルを正規化できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "normalization_pros_cons",
        title: "正規化のメリットとデメリットを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "design_normalized_table",
        title: "要件から正規化されたテーブル設計ができる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "08_join",
    label: "テーブルの結合",
    category: "db/design",
    questions: [
      {
        questionId: "join_necessity",
        title: "JOINの必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "inner_join",
        title: "INNER JOINで2つのテーブルを結合できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "table_alias",
        title: "テーブルに別名を付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "left_outer_join",
        title: "LEFT OUTER JOINで外部結合ができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "inner_vs_left_join",
        title: "INNER JOINとLEFT JOINの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "self_join",
        title: "自己結合ができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "multi_table_join",
        title: "3つ以上のテーブルを結合できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "join_with_where_group",
        title: "JOINとWHERE、GROUP BYを組み合わせられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "complex_join_query",
        title: "複雑な結合を含むSQLを書ける",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "09_er_diagram",
    label: "ER図とデータベース設計",
    category: "db/design",
    questions: [
      {
        questionId: "er_diagram_necessity",
        title: "ER図の必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "identify_entity",
        title: "ER図のエンティティを識別できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "identify_attribute",
        title: "ER図の属性を識別できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "understand_relationship",
        title: "ER図のリレーションシップを理解できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "cardinality",
        title: "カーディナリティ（1対多、多対多）を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "many_to_many_resolution",
        title: "多対多を中間テーブルで解決できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "er_to_sql",
        title: "ER図からCREATE TABLE文を書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "design_er_from_requirements",
        title: "要件からER図を作成できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  // Frontend - HTML/CSS/Bootstrap
  withAutoIds({
    id: "01_html_basics",
    label: "HTMLの基礎",
    category: "frontend",
    questions: [
      {
        title: "HTMLとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "タグとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "開始タグと終了タグの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ブロック要素とインライン要素の違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "h1〜h6タグで見出しを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "pタグで段落を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "aタグでリンクを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "imgタグで画像を表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ulとolでリストを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "tableタグで表を作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "divタグでブロックをまとめられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "spanタグでテキストをまとめられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "02_css_basics",
    label: "CSSの基礎",
    category: "frontend",
    questions: [
      {
        title: "CSSとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "セレクタとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "プロパティと値の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "colorプロパティで文字色を変えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "font-sizeプロパティで文字サイズを変えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "background-colorプロパティで背景色を変えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "marginプロパティで外側の余白を調整できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "paddingプロパティで内側の余白を調整できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "borderプロパティで枠線を付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "CSSの適用方法を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "03_css_layout",
    label: "CSSレイアウトとセレクタ",
    category: "frontend",
    questions: [
      {
        title: "Flexboxとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "floatとFlexboxの違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "display: flexでFlexboxレイアウトを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "justify-contentで横方向の配置を調整できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "align-itemsで縦方向の配置を調整できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "クラスセレクタを使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "IDセレクタを使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "子孫セレクタを使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "複数のセレクタを組み合わせて使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "04_html_forms",
    label: "HTMLフォーム",
    category: "frontend",
    questions: [
      {
        title: "フォームとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "formタグでフォームを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="text"でテキスト入力欄を作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="password"でパスワード入力欄を作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="email"でメール入力欄を作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="number"で数値入力欄を作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="checkbox"でチェックボックスを作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: 'input type="radio"でラジオボタンを作れる',
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "selectタグでドロップダウンを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "textareaタグで複数行テキスト入力欄を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "labelタグで入力欄にラベルを付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "05_form_validation",
    label: "フォームとバリデーション",
    category: "frontend",
    questions: [
      {
        title: "バリデーションとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "required属性で必須入力を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "minlength/maxlength属性で文字数制限を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "min/max属性で数値範囲を制限できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "pattern属性で入力形式を制限できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "placeholder属性でヒントを表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "title属性でエラーメッセージをカスタマイズできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "06_bootstrap_intro",
    label: "Bootstrap入門",
    category: "frontend",
    questions: [
      {
        title: "Bootstrapとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "CDNとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "BootstrapをCDNで導入できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Bootstrapのユーティリティクラスを使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "btn系クラスでボタンをスタイリングできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "card系クラスでカードコンポーネントを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "alert系クラスでアラートを作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "07_bootstrap_grid",
    label: "Bootstrapコンポーネントとグリッド",
    category: "frontend",
    questions: [
      {
        title: "Bootstrapのグリッドシステムとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "containerとrowとcolの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "col-*でカラム幅を指定できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "レスポンシブグリッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "グリッドをネストできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "navbarコンポーネントを使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "Bootstrapでフォームをスタイリングできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "08_responsive_design",
    label: "レスポンシブデザイン総合演習",
    category: "frontend",
    questions: [
      {
        title: "レスポンシブデザインとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "モバイルファーストとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "メディアクエリとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "HTML/CSS/Bootstrapを組み合わせて使える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "レスポンシブなヘッダーを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "レスポンシブなカードグリッドを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "レスポンシブなフォームを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "レスポンシブなフッターを作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "モバイルファーストでCSSを書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "完全なレスポンシブサイトを構築できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  // Git - 入門
  withAutoIds({
    id: "01_version_control",
    label: "バージョン管理とGit",
    category: "git/basics",
    questions: [
      {
        questionId: "version_control_necessity",
        title: "バージョン管理の必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "what_is_git",
        title: "Gitとは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "three_areas",
        title: "3つのエリアの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "basic_terms",
        title: "基本用語を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_config",
        title: "Gitの初期設定ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "02_git_basics",
    label: "Gitの基本操作",
    category: "git/basics",
    questions: [
      {
        questionId: "git_init",
        title: "リポジトリを作成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_status",
        title: "ファイルの状態を確認できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_add",
        title: "ファイルをステージに追加できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_commit",
        title: "変更を記録できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_log",
        title: "履歴を確認できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_diff",
        title: "変更内容を確認できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "gitignore",
        title: "管理対象外のファイルを設定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "practice_commits",
        title: "Javaプロジェクトで複数のコミットを行える",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "03_github_remote",
    label: "GitHubとリモート操作",
    category: "git/basics",
    questions: [
      {
        questionId: "github_role",
        title: "GitHubの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "create_repository",
        title: "GitHubでリポジトリを作成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "https_setup",
        title: "HTTPS接続を設定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "git_push",
        title: "ローカルの変更をリモートに送れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_pull",
        title: "リモートの変更をローカルに取り込める",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_clone",
        title: "既存リポジトリをクローンできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "github_ui",
        title: "GitHubの画面を理解できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "practice_remote",
        title: "push・clone・pullの一連の流れを実践できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // Git - 入門（第4章）
  withAutoIds({
    id: "04_undo_restore",
    label: "変更の取り消しとバージョンの復元",
    category: "git/basics",
    questions: [
      {
        questionId: "undo_overview",
        title: "取り消し操作の全体像を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_restore",
        title: "作業ディレクトリの変更を元に戻せる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_restore_staged",
        title: "ステージの取り消しができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_revert",
        title: "コミットを安全に取り消せる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "git_log_show",
        title: "過去のコミットを確認できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "undo_practice",
        title: "各取り消し操作を状況に応じて使い分けられる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // Git - チーム開発（第5章）
  withAutoIds({
    id: "05_branch_merge",
    label: "ブランチとマージ",
    category: "git/teamwork",
    questions: [
      {
        questionId: "branch_concept",
        title: "ブランチの概念を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "branch_switch",
        title: "ブランチを作成・切り替えできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "branch_commit",
        title: "ブランチ上で作業してコミットできる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "git_merge",
        title: "ブランチをマージできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "conflict_resolve",
        title: "マージコンフリクトを解決できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "branch_strategy",
        title: "ブランチ戦略を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "branch_practice",
        title: "featureブランチで機能追加しmainにマージできる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // Git - チーム開発（第6章）
  withAutoIds({
    id: "06_pull_request",
    label: "プルリクエストとコードレビュー",
    category: "git/teamwork",
    questions: [
      {
        questionId: "pr_purpose",
        title: "プルリクエストの意義を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "pr_create",
        title: "PRを作成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "pr_description",
        title: "PRの説明文を適切に書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "code_review",
        title: "コードレビューができる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "pr_merge_sync",
        title: "PRマージ後にローカルを同期できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "pr_practice",
        title: "ペアでPRベースの開発を実践できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  // Git - チーム開発（第7章）
  withAutoIds({
    id: "07_issue_team_practice",
    label: "Issueとチーム開発実践",
    category: "git/teamwork",
    questions: [
      {
        questionId: "github_issue",
        title: "GitHub Issueを作成・活用できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "issue_driven",
        title: "Issue駆動開発の流れを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "closes_keyword",
        title: "PRとIssueを紐づけられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "github_flow",
        title: "GitHub Flowの全体像を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        questionId: "commit_convention",
        title: "コミットメッセージの規約を守れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        questionId: "team_practice",
        title: "ペアでIssue駆動の開発を実践できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
];
