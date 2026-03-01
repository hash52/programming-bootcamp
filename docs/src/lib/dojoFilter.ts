import {
  ALL_TOPIC_STRUCTURE,
  Question,
  QuestionType,
  Difficulty,
  type TrophyQuestion,
  type Topic,
} from "@site/src/structure";
import {
  ALL_ADDITIONAL_EXERCISES,
  type AdditionalExercise,
} from "@site/src/additionalExercises";
import { ProgressRecord } from "@site/src/hooks/useStoredProgress";
import {
  type AdditionalExerciseProgressRecord,
  type TrophyProgressRecord,
} from "@site/src/hooks/useAdditionalExerciseProgress";
import { calcTopicProgressRate } from "@site/src/components/lib/calcProgressRate";
import { daysAgo } from "@site/src/components/lib/date";

export type AchievementFilter = "all" | "achieved" | "unachieved";
export type DaysAgoFilter = "all" | "3" | "7" | "14" | "30";
export type OrderMode = "sequential" | "random";

/**
 * 道場で扱うアイテムの判別共用体型。
 * - kind: "question"    … 通常の演習設問
 * - kind: "additional"  … 追加演習（達成率に影響しない）
 * - kind: "trophy"      … 激ムズ問題（トロフィー）
 */
export type DojoItem =
  | { kind: "question"; data: Question }
  | { kind: "additional"; data: AdditionalExercise }
  | {
      kind: "trophy";
      data: TrophyQuestion & {
        topicId: string;
        category: string;
        isUnlocked: boolean;
      };
    };

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
  // ── 追加演習フィルター ───────────────────────────────────────
  /** 選択された追加演習IDのセット（空セット or undefined = 追加演習なし） */
  selectedAdditionalIds?: Set<string>;
  /** 激ムズ問題（トロフィー）を含める */
  includeTrophy?: boolean;
  /** 追加演習の進捗データ */
  additionalProgress?: AdditionalExerciseProgressRecord;
  /** トロフィー問題の進捗データ */
  trophyProgress?: TrophyProgressRecord;
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
 * トロフィー問題の解放条件を判定する。
 * 同カテゴリ内で当該トピック以前の全トピックが達成率 100% のとき解放済みとなる。
 */
export function isTrophyUnlocked(
  topic: Topic,
  progress: ProgressRecord
): boolean {
  const categoryTopics = ALL_TOPIC_STRUCTURE.filter(
    (t) => t.category === topic.category
  );
  const topicIndex = categoryTopics.findIndex((t) => t.id === topic.id);
  // 当該トピック自身を含む全トピックが100%必要
  const topicsUpToAndIncluding = categoryTopics.slice(0, topicIndex + 1);
  return topicsUpToAndIncluding.every(
    (t) => calcTopicProgressRate(t.id, progress) === 1
  );
}

/**
 * 通常設問のフィルタリングパイプライン。
 * ツリーで選択された問題ID群 → タイプ → 難易度 → 達成状態 → 最終チェック日
 */
function filterRegularQuestions(
  options: Pick<
    DojoFilterOptions,
    | "selectedQuestionIds"
    | "selectedTypes"
    | "selectedDifficulties"
    | "achievementFilter"
    | "daysAgoFilter"
    | "progress"
  >
): Question[] {
  const {
    selectedQuestionIds,
    selectedTypes,
    selectedDifficulties,
    achievementFilter,
    daysAgoFilter,
    progress,
  } = options;

  let questions = ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions).filter((q) =>
    selectedQuestionIds.has(q.id)
  );

  if (selectedTypes.size > 0) {
    questions = questions.filter((q) => selectedTypes.has(q.type));
  }
  if (selectedDifficulties.size > 0) {
    questions = questions.filter((q) =>
      selectedDifficulties.has(q.difficulty)
    );
  }
  if (achievementFilter === "achieved") {
    questions = questions.filter((q) => !!progress[q.id]);
  } else if (achievementFilter === "unachieved") {
    questions = questions.filter((q) => !progress[q.id]);
  }
  if (achievementFilter !== "unachieved" && daysAgoFilter !== "all") {
    const threshold = parseInt(daysAgoFilter, 10);
    const now = new Date();
    questions = questions.filter((q) => {
      const prog = progress[q.id];
      if (!prog) return true;
      const lastChecked = new Date(prog.lastCheckedAt);
      return daysAgo(now, lastChecked) >= threshold;
    });
  }

  return questions;
}

/**
 * 全フィルター適用後の DojoItem[] を返す。
 * 通常設問・追加演習・トロフィー問題をまとめて返す。
 */
export function resolveDojoItems(options: DojoFilterOptions): DojoItem[] {
  const {
    orderMode,
    questionLimit,
    selectedAdditionalIds,
    includeTrophy = false,
    progress,
    achievementFilter,
    additionalProgress = {},
  } = options;

  // ── 通常設問 ──────────────────────────────────────────────
  const regularQuestions: DojoItem[] = filterRegularQuestions(options).map(
    (q) => ({ kind: "question" as const, data: q })
  );

  // ── 追加演習 ──────────────────────────────────────────────
  const additionalItems: DojoItem[] = [];
  if (selectedAdditionalIds && selectedAdditionalIds.size > 0) {
    let filtered = ALL_ADDITIONAL_EXERCISES.filter((ex) =>
      selectedAdditionalIds.has(ex.id)
    );
    // achievementFilter を additionalProgress に適用
    if (achievementFilter === "achieved") {
      filtered = filtered.filter((ex) => !!additionalProgress[ex.id]?.lastSolvedAt);
    } else if (achievementFilter === "unachieved") {
      filtered = filtered.filter((ex) => !additionalProgress[ex.id]?.lastSolvedAt);
    }
    additionalItems.push(
      ...filtered.map((ex) => ({ kind: "additional" as const, data: ex }))
    );
  }

  // ── トロフィー問題 ─────────────────────────────────────────
  const trophyItems: DojoItem[] = includeTrophy
    ? ALL_TOPIC_STRUCTURE.filter((t) => t.trophyQuestion).map((t) => ({
        kind: "trophy" as const,
        data: {
          ...t.trophyQuestion!,
          topicId: t.id,
          category: t.category,
          isUnlocked: isTrophyUnlocked(t, progress),
        },
      }))
    : [];

  let allItems: DojoItem[] = [
    ...regularQuestions,
    ...additionalItems,
    ...trophyItems,
  ];

  // 出題順
  if (orderMode === "random") {
    allItems = shuffle(allItems);
  }

  // 出題数制限（通常設問のみカウントして制限する場合もあるが、ここでは全体に適用）
  if (questionLimit !== null && questionLimit > 0) {
    allItems = allItems.slice(0, questionLimit);
  }

  return allItems;
}

/**
 * 後方互換用: 通常設問のみを返す（既存コードからの呼び出し向け）
 */
export function resolveDojoQuestions(
  options: DojoFilterOptions
): Question[] {
  return filterRegularQuestions(options);
}

/**
 * フィルタ適用後の通常設問数を計算（出題順・出題数制限を適用しない）
 */
export function countFilteredQuestions(
  options: Omit<DojoFilterOptions, "orderMode" | "questionLimit">
): number {
  return filterRegularQuestions({
    ...options,
  }).length;
}
