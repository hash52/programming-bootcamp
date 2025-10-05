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
 * category と topic.id から question.id を `{category}/{topicId}#q{番号}` 形式で生成する
 */
function withAutoIds(
  topic: Omit<Topic, "questions"> & { questions: QuestionBase[] }
): Topic {
  return {
    ...topic,
    questions: topic.questions.map((q, index) => ({
      ...q,
      id: `${topic.category}/${topic.id}#q${index + 1}`,
    })),
  };
}

/**
 * 全トピック一覧
 * ダッシュボードに表示されるデータのマスター
 */
export const ALL_TOPIC_STRUCTURE: readonly Topic[] = [
  // Java
  withAutoIds({
    id: "if",
    label: "if文",
    category: "java/basics",
    questions: [
      {
        title: "if文の基本的な書き方を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
      {
        title: "if-else文の基本的な書き方を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  // Spring
  withAutoIds({
    id: "mvc_intro",
    label: "MVCモデルの基本",
    category: "spring",
    questions: [
      {
        title: "MVCモデルの3つの役割（Model / View / Controller）を説明できる",
        type: "KNOW",
        difficulty: Difficulty.Easy,
      },
    ],
  }),
  withAutoIds({
    id: "request_to_controller",
    label:
      "リクエストからコントローラへの値の受け渡し（リンク・パラメータ・フォーム）",
    category: "spring",
    questions: [
      {
        title:
          "リンク・パラメータ・フォームからの値の受け渡しのコードリーディングができる",
        type: "READ",
        difficulty: Difficulty.Medium,
      },
      {
        title: "リンク・パラメータ・フォームからの値の受け渡しのコードを書ける",
        type: "WRITE",
        difficulty: Difficulty.Hard,
      },
    ],
  }),
];
