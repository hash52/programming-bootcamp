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
  "db",
  "frontend",
  "git",
] as const;
type Category = (typeof ALL_CATEGORIES)[number];

/** ダッシュボードで表示するカテゴリの日本語ラベル */
export const CATEGORIES_LABELS: Record<Category, string> = {
  "java/basics": "Java - 基本文法",
  "java/oop": "Java - オブジェクト指向",
  "java/stdlib": "Java - 標準ライブラリ",
  spring: "Spring",
  db: "データベース",
  frontend: "フロントエンド",
  git: "Git",
};

/** 難易度(数値が大きいほど難しい) */
export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

/** 設問タイプ */
type QuestionType = "KNOW" | "READ" | "WRITE";

/** 各設問の基本構造（ID生成前） */
// IDは自動付与だが、ID付与前はタイトルなどの情報だけを持つ
interface QuestionBase {
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
 * category と topic.id と question.type から question.id を `{category}/{topicId}#q{番号}` 形式で生成する
 *
 * 例:
 * - category: `spring`
 * - topic.id: `02_mvc_intro`
 * - question.type: `KNOW`
 * - question index: 0 (1問目)
 *
 *  => `spring/02_mvc_intro#k1`
 */
function withAutoIds(
  topic: Omit<Topic, "questions"> & { questions: QuestionBase[] }
): Topic {
  return {
    ...topic,
    questions: topic.questions.map((q, index) => {
      const qPrefix = (() => {
        if (q.type == "KNOW") return "k";
        if (q.type == "READ") return "r";
        if (q.type == "WRITE") return "w";
      })();
      const qNum = index + 1;
      return {
        ...q,
        id: `${topic.category}/${topic.id}#${qPrefix}${qNum}`,
      };
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
        title: "プログラムの実行順序を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "読みやすいコードの書き方がわかる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "波括弧の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Javaの活用場面を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "「Hello World」と画面に表示できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "EclipseでJavaプログラムを実行できる",
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
        title: "変数とは何かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "変数に値を代入できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "int型で整数を扱える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "double型で小数を扱える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "boolean型でtrue/falseを扱える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "String型で文字列を扱える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "わかりやすい変数名を付けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "変数のスコープを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "finalで変更できない定数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
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
        title: "+、-、*、/で計算ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "%演算子を使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "整数同士の割り算の結果を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "+=や-=で値を増減できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "==、!=、<、>で値を比較できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "&&と||の演算子を使える",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "!で条件を反転できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "++や--で1増やす・減らすことができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
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
        title: "キーボードから文字を入力できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Scannerを使う準備ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "nextLine()で1行読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "nextInt()で整数を読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "nextDouble()で小数を読み取れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "nextInt()の後にnextLine()を使う注意点がわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
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
        title: "ランダムな数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "Randomクラスを使う準備ができる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "0〜9のランダムな整数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "1〜100のランダムな整数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "0.0〜1.0のランダムな小数を作れる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "乱数の再現性を制御する方法がわかる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
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
        title: "if文で条件によって処理を分けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "if-else文で2つの処理を切り替えられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "if-else if-elseで3つ以上の処理を分けられる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "&&や||を使った複雑な条件を書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "switch文で複数の選択肢から選べる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "switchのbreakの役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "条件分岐のコードを読んで結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
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
];
