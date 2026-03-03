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
          { questionId: "four_operations",     title: "四則演算と余りを表示する",     difficulty: "EASY"   },
          { questionId: "comparison_results",  title: "比較演算子の結果を表示する",   difficulty: "EASY"   },
          { questionId: "circle_area",         title: "円の面積と円周を求める",       difficulty: "EASY"   },
          { questionId: "quotient_remainder",  title: "商と余りで個数を表現する",     difficulty: "EASY"   },
          { questionId: "logical_display",     title: "論理演算子の結果を表示する",   difficulty: "EASY"   },
          { questionId: "tax_calculation",     title: "税込み価格を計算する",         difficulty: "NORMAL" },
          { questionId: "discount_calculation",title: "割引後の支払い金額を計算する", difficulty: "NORMAL" },
          { questionId: "speed_distance",      title: "速さと時間から距離を求める",   difficulty: "NORMAL" },
          { questionId: "calorie_calculator",  title: "三大栄養素のカロリーを計算する",difficulty: "NORMAL" },
          { questionId: "compound_interest",   title: "複利計算で3年後の元利合計を求める", difficulty: "HARD" },
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
          { questionId: "pass_fail",              title: "合否判定を実装する",           difficulty: "EASY"   },
          { questionId: "positive_negative_zero", title: "正・負・ゼロを判定する",       difficulty: "EASY"   },
          { questionId: "even_odd",               title: "偶数・奇数を判定する",         difficulty: "EASY"   },
          { questionId: "max_of_two",             title: "2つの数の大きい方を表示する",  difficulty: "EASY"   },
          { questionId: "age_category",           title: "年齢から区分を判定する",       difficulty: "EASY"   },
          { questionId: "season_judgment",        title: "季節判定プログラムを実装する", difficulty: "NORMAL" },
          { questionId: "bmi_category",           title: "BMIから体重区分を判定する",    difficulty: "NORMAL" },
          { questionId: "triangle_type",          title: "三角形の種類を判定する",       difficulty: "NORMAL" },
          { questionId: "score_grade",            title: "点数から成績と評価を出力する", difficulty: "NORMAL" },
          { questionId: "leap_year",              title: "うるう年を判定する",           difficulty: "HARD"   },
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
          { questionId: "sum_calculation",    title: "合計計算プログラムを実装する",    difficulty: "EASY"   },
          { questionId: "countdown",          title: "カウントダウンを表示する",        difficulty: "EASY"   },
          { questionId: "even_numbers",       title: "1〜30の偶数をすべて表示する",     difficulty: "EASY"   },
          { questionId: "multiplication_row", title: "指定した段の九九を表示する",      difficulty: "EASY"   },
          { questionId: "sum_input",          title: "入力した数まで合計を求める",      difficulty: "EASY"   },
          { questionId: "fizzbuzz",           title: "FizzBuzzを実装する",             difficulty: "NORMAL" },
          { questionId: "prime_check",        title: "素数かどうかを判定する",          difficulty: "NORMAL" },
          { questionId: "multiplication_table",title: "九九全体を表示する",            difficulty: "NORMAL" },
          { questionId: "digit_sum",          title: "整数の各桁の和を求める",          difficulty: "NORMAL" },
          { questionId: "collatz_sequence",   title: "コラッツ数列を表示する",          difficulty: "HARD"   },
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
