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
        title: "代入の仕組みを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "基本データ型（int, double, boolean, String）を使い分けられる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "わかりやすい変数名が付けられる",
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
        title: "定数（final）の使い方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "変数を使ったコードの実行結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "データを保存して再利用するプログラムが書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "03_operators",
    label: "演算子",
    category: "java/basics",
    questions: [
      {
        title: "算術演算子を使いこなせる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "剰余演算子（%）の実用例を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "整数除算の注意点を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "複合代入演算子を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "比較演算子を使いこなせる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "論理演算子（&&, ||, !）を使いこなせる",
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
  }),
  withAutoIds({
    id: "04_if_statement",
    label: "条件分岐",
    category: "java/basics",
    questions: [
      {
        title: "if文の基本的な書き方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "if-else文とif-else if-elseの使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "論理演算子（&&、||、!）を使った複雑な条件式が書ける",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "switch文の基本的な書き方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "switch文でbreakを忘れた場合の動作を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "条件分岐を使ったコードの実行結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "状況に応じて異なる処理を実行するプログラムが書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ユーザー入力に応じた柔軟なプログラムが書ける",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "実務でよく使うif文のパターンを理解している",
        type: "KNOW",
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
        title: "for文の基本的な書き方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "while文とfor文の使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "do-while文の特徴を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "break文とcontinue文の違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ネストしたループ（二重ループ）の動作を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ループのコードの実行結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "同じ処理を効率的に繰り返すプログラムが書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ループの途中で抜ける・スキップする処理が実装できる",
        type: "WRITE",
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
        title: "配列とは何か、なぜ必要かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "インデックスは0から始まることを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の宣言と初期化の方法を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の要素にアクセスして読み書きできる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "通常のfor文と拡張for文の使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "配列の実用例（合計、平均、最大値、最小値、検索）を理解している",
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
        title: "配列とループを組み合わせたプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
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
        title: "引数と戻り値の役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "voidと戻り値ありの使い分けができる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "変数のスコープを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "メソッドのオーバーロードを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "Javadocでメソッドのドキュメントを書ける",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "メソッドを使ったコードの実行結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "処理をまとめて再利用可能なメソッドが書ける",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      {
        title: "コードの重複を減らし、読みやすいプログラムが書ける",
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
  }),
  withAutoIds({
    id: "09_exception_handling",
    label: "例外処理",
    category: "java/basics",
    questions: [
      {
        title: "例外とは何か、なぜ必要かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "try-catch文で例外を捕捉できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "複数の例外を適切な順序で処理できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "finally句の役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "throwsキーワードを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "throwキーワードで例外をスローできる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "検査例外と非検査例外の違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Hard,
      },
      {
        title: "例外処理を含むコードを読んで理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "try-catch-finallyを使った例外処理を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "10_oop_basics",
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
  }),
  withAutoIds({
    id: "12_inheritance",
    label: "継承",
    category: "java/oop",
    questions: [
      {
        title: "継承とは何か、なぜ必要かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "継承は複数のクラスを上手く扱うための仕組みであることを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "継承の実装方法（extendsキーワード）を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "superキーワードの役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "メソッドのオーバーライドを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "継承を使ったコードを読んで理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "継承を使ったプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "is-a関係を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "適切な継承設計ができる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "13_interfaces",
    label: "インターフェース",
    category: "java/oop",
    questions: [
      {
        title: "インターフェースとは何か、なぜ必要かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェースと継承の違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェースの定義方法を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "implementsキーワードを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "複数のインターフェースを実装できることを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "デフォルトメソッドを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェースを使ったコードを読んで理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "インターフェースを定義して実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "複数のインターフェースを実装したクラスを作成できる",
        type: "WRITE",
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
        title: "カプセル化とは何か、なぜ必要かを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "アクセス修飾子（public, private, protected, デフォルト）を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "getter/setterメソッドの役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "フィールドは基本的にprivateにすることを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "setterで値のチェックを行う意義を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "カプセル化されたクラスのコードを読んで理解できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "privateフィールドとgetter/setterを持つクラスを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "値のチェックを含むsetterを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "適切なアクセス制御を持つクラスを設計できる",
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
        title: "コレクションとは何か、配列との違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "ArrayListの基本的な使い方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "HashSetの基本的な使い方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "HashMapの基本的な使い方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ジェネリクスの役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "適切なコレクションを選択できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "ArrayListを使ったプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "HashMapを使ったプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "状況に応じてコレクションを使い分けたプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "16_datetime",
    label: "日時操作",
    category: "java/stdlib",
    questions: [
      {
        title: "日時操作の必要性を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "LocalDateで日付を扱える",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "LocalTimeで時刻を扱える",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "LocalDateTimeで日時を扱える",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "PeriodとDurationの違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "DateTimeFormatterで日時のフォーマットができる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "日時オブジェクトがイミュータブルであることを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "日時の計算（加算・減算）を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "日時を使った実用的なプログラムを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  // Spring
  withAutoIds({
    id: "02_mvc_intro",
    label: "MVCモデルの基本",
    category: "spring",
    questions: [
      // KNOW
      {
        title: "MVCモデルの3つの役割（Model / View / Controller）を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "MVCでModel・View・Controllerを分ける目的を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "MVCモデルを使うメリットを3つ以上挙げられる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "フレームワークが共通処理を肩代わりする意味を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "AOP（アスペクト指向プログラミング）の役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // READ
      {
        title:
          "MVCの流れ図を見てユーザー操作から画面表示までの処理順を説明できる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "悪例のコードからMVCが崩れている点を指摘できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // WRITE
      {
        title:
          "Model・View・Controllerを分けて処理を整理したJavaコードを記述できる",
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
      // k1
      {
        title: "URLパスと処理の対応関係を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k2
      {
        title: "コントローラの配置ルール（パッケージ構成）を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k3
      {
        title: "ビュー（HTML）の検索パスを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k4
      {
        title:
          "@RequestMapping / @GetMapping / @PostMapping の違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title: "URLから実行メソッドと表示HTMLを読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // r2
      {
        title: "コントローラ検出エラーの原因を推定できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r3
      {
        title: "@RequestMapping と @GetMapping の関係を説明できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // w1
      {
        title: "@GetMapping を使った基本的なルーティングを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
      // w2
      {
        title:
          "サブディレクトリ構成のビューを正しく返すコントローラを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w3
      {
        title: "@PostMapping を使ってフォーム送信を処理できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "05_request_to_controller",
    label: "リクエストからコントローラへの値の受け渡し",
    category: "spring",
    questions: [
      // k1
      {
        title: "@RequestParam の仕組みと用途を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k2
      {
        title: "@PathVariable の仕組みと用途を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k3
      {
        title: "クエリパラメータとパスパラメータの使い分けを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title: "クエリパラメータを使ったリクエストをコードから読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // r2
      {
        title: "パスパラメータを使ったリクエストをコードから読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // w1
      {
        title:
          "@RequestParam を使ってクエリパラメータを受け取るコントローラを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w2
      {
        title:
          "@PathVariable を使ってパスパラメータを受け取るコントローラを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w3
      {
        title:
          "フォームオブジェクトを使って複数の入力値をまとめて受け取るコントローラを実装できる",
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
      // k1
      {
        title:
          "ModelとaddAttributeを使って値をビューに渡す仕組みを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k2
      {
        title: "th:textと[[...]]の違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k3
      {
        title: "th:utextによるXSSリスクと安全な表示方法を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title:
          "Modelで渡した値がテンプレートにどのように埋め込まれるかを読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // r2
      {
        title: "th:ifによる条件分岐の表示結果を予測できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r3
      {
        title: "th:switchによる分岐処理の結果を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r4
      {
        title: "th:eachによる繰り返し表示の仕組みを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r5
      {
        title: "ユーティリティオブジェクト #strings の使用例を理解している",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // r6
      {
        title: "ユーティリティオブジェクト #numbers の使用例を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r7
      {
        title: "ユーティリティオブジェクト #dates の使用例を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // w1
      {
        title: "Modelに値を追加しThymeleafで動的に表示するコードを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w2
      {
        title:
          "th:objectを使ってオブジェクトのフィールドを簡潔に参照するテンプレートを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w3
      {
        title:
          "フラグメントを利用して共通ヘッダーとフッターを再利用するビューを実装できる",
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
      // k1
      {
        title: "単項目チェックと相関項目チェックの違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k2
      {
        title:
          "@NotNull, @Min, @Max, @Email などの基本的なバリデーションアノテーションの役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k3
      {
        title: "@AssertTrue を用いた相関項目チェックの仕組みを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title: "@Validated と BindingResult の役割と実行順序を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r2
      {
        title: "th:object と th:field の対応関係を理解している",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      // r3
      {
        title:
          "#fields.hasErrors と th:errors によるエラーメッセージ表示の仕組みを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // w1
      {
        title:
          "フォームオブジェクトにバリデーションアノテーションを付与して入力チェックを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w2
      {
        title:
          "コントローラで @Validated と BindingResult を使ってエラー処理を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w3
      {
        title:
          "th:object と th:field を用いてフォーム入力とエラーメッセージを連携させたHTMLを実装できる",
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
      // k1
      {
        title: "DI（依存性注入）の目的と仕組みを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k2
      {
        title:
          "@Controller / @Service / @Repository / @Component の役割を区別できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k3
      {
        title: "コンストラクタインジェクションの仕組みを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title: "@Autowired の挙動と依存関係解決の流れを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r2
      {
        title: "自分で new するケースとDIに任せるケースを判断できる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r3
      {
        title: "@Primary によるBeanの優先選択を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // w1
      {
        title: "@Service クラスをDIで利用するコントローラを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w2
      {
        title:
          "インターフェースと複数実装を用いてDIで切り替えられる構成を実装できる",
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
      // k1
      {
        title: "O/Rマッパー（Object Relational Mapper）の概念を理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      // k2
      {
        title: "MyBatisがO/Rマッパーであることを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k3
      {
        title: "application.propertiesでのDB接続設定を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // k4
      {
        title: "schema.sqlとdata.sqlの役割を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // r1
      {
        title: "アノテーションMapperの動作を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r2
      {
        title: "XMLマッパーファイルのnamespaceとidの対応関係を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // r3
      {
        title: "1対多リレーションのresultMapを読み取れる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // w1
      {
        title: "MapperインターフェースとXMLを用いた検索処理を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      // w2
      {
        title: "resultMapを用いた1対多リレーションの取得を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
  withAutoIds({
    id: "10_spring_session",
    label: "セッションとログインの仕組み",
    category: "spring",
    questions: [
      // KNOW
      {
        title: "リクエストスコープとセッションスコープの違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "HttpSession の基本的な使い方を理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title: "@SessionAttributes と @SessionAttribute の違いを説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // READ
      {
        title:
          "セッションに保存されたデータがどのようにビューで参照されるかを読み取れる",
        type: "READ",
        difficulty: Difficulty.Easy,
      },
      {
        title: "セッションを利用したログイン保持処理の流れを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "SessionStatus を使ったセッション破棄の仕組みを理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // WRITE
      {
        title:
          "HttpSession を用いてログイン状態を保持するコントローラを実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title:
          "@SessionAttributes を利用してフォーム情報をセッションに保持する処理を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "セッションを使った簡単なカート機能を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
    ],
  }),
  withAutoIds({
    id: "11_spring_security_login",
    label: "Spring Securityでのログイン実装",
    category: "spring",
    questions: [
      // KNOW
      {
        title: "認証(Authentication)と認可(Authorization)の違いを理解している",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "UserDetailsService の役割を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      {
        title:
          "BCryptPasswordEncoder によるパスワードハッシュ化の仕組みを理解している",
        type: "KNOW",
        difficulty: Difficulty.Medium,
      },
      // READ
      {
        title: "SecurityFilterChain の設定内容から認証フローを読み取れる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title:
          "UserDetailsService 実装クラスの loadUserByUsername() の動作を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title:
          "Spring Securityがログイン成功後にセッションへ保存する情報を理解している",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      // WRITE
      {
        title:
          "Spring SecurityとMyBatisを組み合わせてDB認証を行う構成を実装できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title:
          "SecurityConfigを作成してログイン・ログアウト画面のルートを設定できる",
        type: "WRITE",
        difficulty: Difficulty.Medium,
      },
      {
        title: "BCryptPasswordEncoderを使って安全なパスワードを生成できる",
        type: "WRITE",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
];
