/*
  追加演習（Additional Exercises）のデータ定義。
  達成率（questionProgress）には影響しない。
  道場で通常問題と混在出題可能。
*/

import { Difficulty } from "./structure";

/** 追加演習のカテゴリ */
export type AdditionalCategory = "java" | "sql" | "comprehensive";

/** 追加演習の定義 */
export interface AdditionalExercise {
  /**
   * MDXファイルのid。
   * 例: "additional/java/basics#fizzbuzz"
   * → docs/src/questions/additional/java/basics/fizzbuzz.mdx
   */
  id: string;
  /** 道場一覧表示用タイトル */
  title: string;
  /** カテゴリ */
  category: AdditionalCategory;
  /** 難易度 */
  difficulty: Difficulty;
  /**
   * 解放条件となるトピックID。
   * 指定した場合、そのトピック以前の全トピックが100%達成時のみ道場で選択可能。
   * 未指定の場合は制限なし。
   */
  prerequisiteTopicId?: string;
  /** フィルター用タグ（任意） */
  tags?: string[];
}

/**
 * 全追加演習一覧
 */
export const ALL_ADDITIONAL_EXERCISES: readonly AdditionalExercise[] = [
  // ── Java 追加演習 ──────────────────────────────────────────
  {
    id: "additional/java/basics#fizzbuzz",
    title: "FizzBuzz を実装せよ",
    category: "java",
    difficulty: Difficulty.Medium,
    prerequisiteTopicId: "05_loops",
    tags: ["loops", "conditionals"],
  },
  {
    id: "additional/java/basics#factorial",
    title: "階乗を計算するメソッドを実装せよ",
    category: "java",
    difficulty: Difficulty.Medium,
    prerequisiteTopicId: "05_loops",
    tags: ["loops", "methods"],
  },
  {
    id: "additional/java/basics#array_sum",
    title: "配列の合計値を求めるプログラムを実装せよ",
    category: "java",
    difficulty: Difficulty.Easy,
    prerequisiteTopicId: "06_arrays",
    tags: ["arrays", "loops"],
  },

  // ── 総合演習（章に依存しない応用問題） ─────────────────────
  {
    id: "additional/comprehensive#bmi_calculator",
    title: "BMI 計算機を実装せよ",
    category: "comprehensive",
    difficulty: Difficulty.Medium,
    tags: ["practical"],
  },
  {
    id: "additional/comprehensive#temperature_converter",
    title: "温度変換プログラムを実装せよ（摂氏 ↔ 華氏）",
    category: "comprehensive",
    difficulty: Difficulty.Easy,
    tags: ["practical", "math"],
  },
];
