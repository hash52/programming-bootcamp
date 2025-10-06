import { useLocalStorage } from "react-use";
import { calcOverallProgressRate } from "../components/lib/calcProgressRate";

const STORAGE_KEY_PROGRESS = "questionProgress";
const STORAGE_KEY_HISTORY = "progressHistory";

/** 設問ごとの進捗状態 */
interface QuestionProgress {
  /** 最後にチェックした日（ISO文字列） */
  lastCheckedAt: string;
}

/**
 * 全設問分の進捗をまとめたレコード（questionId -> 最後にチェックした日）
 * 例: { "question-1": { lastCheckedAt: "2024-01-01T12:00:00Z" }, ... }
 * チェック済み設問のみ登録される
 */
export type ProgressRecord = Record<string, QuestionProgress>;

/**
 * 進捗履歴。日付ごとの進捗率のマッピング
 * 例: { "2025-10-01": 45, ... }
 * 当日の進捗率のみ編集可能
 */
type ProgressHistory = Record<string, number>;

/** 進捗や進捗履歴を管理するオブジェクト */
interface UseStoredProgressReturn {
  /** 全設問分の進捗状態 */
  progress: ProgressRecord;
  /** 進捗履歴（日付ごとの進捗率） */
  history: ProgressHistory;
  /**
   * 指定設問の進捗状態を更新する関数
   * @param id 設問ID
   * @param checked チェック状態（true: チェック済み、false: 未チェック）
   */
  updateProgress: (id: string, checked: boolean) => void;
}

/**
 * localStorage に保存された進捗データを管理するカスタムフック
 * - チェック時：日付を登録
 * - チェック解除時：該当レコードを削除
 */
function useStoredProgress(): UseStoredProgressReturn {
  const [progress, setProgress] = useLocalStorage<ProgressRecord>(
    STORAGE_KEY_PROGRESS,
    {}
  );
  const [history, setHistory] = useLocalStorage<ProgressHistory>(
    STORAGE_KEY_HISTORY,
    {}
  );

  /** 当日の進捗率を履歴に保存する */
  const updateProgressHistory = (ratio: number) => {
    const today = new Date().toISOString().split("T")[0];
    const updated: ProgressHistory = { ...history, [today]: ratio };
    setHistory(updated);
  };

  /** 指定設問の進捗を更新する（チェックON/OFF両対応） */
  const updateProgress = (id: string, checked: boolean) => {
    let updated: ProgressRecord = { ...progress };

    if (checked) {
      // チェックON → 現在日時を登録
      updated[id] = { lastCheckedAt: new Date().toISOString() };
    } else {
      // チェックOFF → 該当レコードを削除
      delete updated[id];
    }

    setProgress(updated);

    // 全体進捗率を再計算して履歴に反映
    const overallRatio = Math.round(calcOverallProgressRate(updated) * 100);
    updateProgressHistory(overallRatio);
  };

  return { progress, history, updateProgress };
}

export { useStoredProgress };
