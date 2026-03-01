import { useLocalStorage } from "react-use";

const STORAGE_KEY_ADDITIONAL = "additionalExerciseProgress";
const STORAGE_KEY_TROPHY = "trophyProgress";

/** 追加演習の完了状態 */
interface AdditionalExerciseProgressEntry {
  /** 最後に「解いた！」を押した日時（UTC ISO文字列） */
  lastSolvedAt: string;
}

/**
 * 追加演習の進捗レコード（exerciseId → 完了状態）
 * 例: { "additional/java/basics#fizzbuzz": { lastSolvedAt: "..." } }
 */
export type AdditionalExerciseProgressRecord = Record<
  string,
  AdditionalExerciseProgressEntry
>;

/** トロフィー問題の解答状態 */
interface TrophyProgressEntry {
  /** 解いた日時（UTC ISO文字列） */
  solvedAt: string;
}

/**
 * トロフィー問題の進捗レコード（trophyId → 解答状態）
 * 例: { "trophy/java/basics/05_loops#ultra": { solvedAt: "..." } }
 */
export type TrophyProgressRecord = Record<string, TrophyProgressEntry>;

interface UseAdditionalExerciseProgressReturn {
  /** 追加演習の完了状態 */
  additionalProgress: AdditionalExerciseProgressRecord;
  /** トロフィー問題の解答状態 */
  trophyProgress: TrophyProgressRecord;
  /**
   * 追加演習を「解いた！」とマークする
   * @param id AdditionalExercise の id
   */
  markAdditionalSolved: (id: string) => void;
  /**
   * トロフィー問題を解答済みとマークする
   * @param id TrophyQuestion の id
   */
  markTrophySolved: (id: string) => void;
}

/**
 * 追加演習・トロフィー問題の進捗を localStorage で管理するカスタムフック。
 * 既存の questionProgress（通常設問）とは完全に分離されたキーで管理する。
 */
export function useAdditionalExerciseProgress(): UseAdditionalExerciseProgressReturn {
  const [additionalProgress, setAdditionalProgress] =
    useLocalStorage<AdditionalExerciseProgressRecord>(
      STORAGE_KEY_ADDITIONAL,
      {}
    );
  const [trophyProgress, setTrophyProgress] =
    useLocalStorage<TrophyProgressRecord>(STORAGE_KEY_TROPHY, {});

  const markAdditionalSolved = (id: string) => {
    const updated: AdditionalExerciseProgressRecord = {
      ...(additionalProgress ?? {}),
      [id]: { lastSolvedAt: new Date().toISOString() },
    };
    setAdditionalProgress(updated);
  };

  const markTrophySolved = (id: string) => {
    const updated: TrophyProgressRecord = {
      ...(trophyProgress ?? {}),
      [id]: { solvedAt: new Date().toISOString() },
    };
    setTrophyProgress(updated);
  };

  return {
    additionalProgress: additionalProgress ?? {},
    trophyProgress: trophyProgress ?? {},
    markAdditionalSolved,
    markTrophySolved,
  };
}
