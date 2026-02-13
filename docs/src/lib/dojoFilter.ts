import {
  ALL_TOPIC_STRUCTURE,
  Question,
  QuestionType,
  Difficulty,
} from "@site/src/structure";
import { ProgressRecord } from "@site/src/hooks/useStoredProgress";
import { daysAgo } from "@site/src/components/lib/date";

export type AchievementFilter = "all" | "achieved" | "unachieved";
export type DaysAgoFilter = "all" | "3" | "7" | "14" | "30";
export type OrderMode = "sequential" | "random";

export interface DojoFilterOptions {
  /** 選択された問題IDのセット */
  selectedQuestionIds: Set<string>;
  /** 選択された問題タイプ */
  selectedTypes: Set<QuestionType>;
  /** 選択された難易度 */
  selectedDifficulties: Set<Difficulty>;
  /** 達成状態フィルタ */
  achievementFilter: AchievementFilter;
  /** 最終チェック日フィルタ（日数） */
  daysAgoFilter: DaysAgoFilter;
  /** 出題順 */
  orderMode: OrderMode;
  /** 出題数（nullなら全問） */
  questionLimit: number | null;
  /** 進捗データ */
  progress: ProgressRecord;
}

/** Fisher-Yates シャッフル */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * フィルタリングパイプライン
 * ツリーで選択された問題ID群 → タイプ → 難易度 → 達成状態 → 最終チェック日 → 出題順 → 出題数制限
 */
export function resolveDojoQuestions(options: DojoFilterOptions): Question[] {
  const {
    selectedQuestionIds,
    selectedTypes,
    selectedDifficulties,
    achievementFilter,
    daysAgoFilter,
    orderMode,
    questionLimit,
    progress,
  } = options;

  // ツリーで選択された問題を取得（structure.ts の定義順を保持）
  let questions = ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions).filter((q) =>
    selectedQuestionIds.has(q.id)
  );

  // タイプフィルタ
  if (selectedTypes.size > 0) {
    questions = questions.filter((q) => selectedTypes.has(q.type));
  }

  // 難易度フィルタ
  if (selectedDifficulties.size > 0) {
    questions = questions.filter((q) =>
      selectedDifficulties.has(q.difficulty)
    );
  }

  // 達成状態フィルタ
  if (achievementFilter === "achieved") {
    questions = questions.filter((q) => !!progress[q.id]);
  } else if (achievementFilter === "unachieved") {
    questions = questions.filter((q) => !progress[q.id]);
  }

  // 最終チェック日フィルタ（達成状態が「未達成のみ」の場合はスキップ）
  if (achievementFilter !== "unachieved" && daysAgoFilter !== "all") {
    const threshold = parseInt(daysAgoFilter, 10);
    const now = new Date();
    questions = questions.filter((q) => {
      const prog = progress[q.id];
      if (!prog) return true; // 未達成の問題は残す
      const lastChecked = new Date(prog.lastCheckedAt);
      return daysAgo(now, lastChecked) >= threshold;
    });
  }

  // 出題順
  if (orderMode === "random") {
    questions = shuffle(questions);
  }

  // 出題数制限
  if (questionLimit !== null && questionLimit > 0) {
    questions = questions.slice(0, questionLimit);
  }

  return questions;
}

/**
 * フィルタ適用後の問題数を計算（出題順・出題数制限を適用しない）
 */
export function countFilteredQuestions(
  options: Omit<DojoFilterOptions, "orderMode" | "questionLimit">
): number {
  return resolveDojoQuestions({
    ...options,
    orderMode: "sequential",
    questionLimit: null,
  }).length;
}
