import type { QuestionType, Difficulty } from "@site/src/structure";
import type {
  AchievementFilter,
  DaysAgoFilter,
  OrderMode,
} from "@site/src/lib/dojoFilter";
import type { ProgressRecord } from "@site/src/hooks/useStoredProgress";

export interface DojoPreset {
  id: string;
  name: string;
  createdAt: string;
  checkedQuestionIds: string[];
  selectedTypes: QuestionType[];
  selectedDifficulties: Difficulty[];
  achievementFilter: AchievementFilter;
  daysAgoFilter: DaysAgoFilter;
  orderMode: OrderMode;
  questionLimit: number | null;
  allQuestions: boolean;
  /** 達成済みの問題を除外した状態でプリセットが作成されたか */
  excludeAchieved?: boolean;
}

const STORAGE_KEY = "dojoPresets";

export function loadPresets(): DojoPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DojoPreset[];
  } catch {
    return [];
  }
}

function saveAll(presets: DojoPreset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function savePreset(preset: DojoPreset): void {
  const presets = loadPresets();
  presets.push(preset);
  saveAll(presets);
}

export function deletePreset(id: string): void {
  const presets = loadPresets().filter((p) => p.id !== id);
  saveAll(presets);
}

export function renamePreset(id: string, newName: string): void {
  const presets = loadPresets().map((p) =>
    p.id === id ? { ...p, name: newName } : p,
  );
  saveAll(presets);
}

export interface CurrentConditions {
  checkedQuestionIds: Set<string>;
  selectedTypes: Set<QuestionType>;
  selectedDifficulties: Set<Difficulty>;
  achievementFilter: AchievementFilter;
  daysAgoFilter: DaysAgoFilter;
  orderMode: OrderMode;
  questionLimit: number | null;
  allQuestions: boolean;
}

export function buildPresetFromState(
  name: string,
  state: CurrentConditions,
  options?: {
    excludeAchieved?: boolean;
    progress?: ProgressRecord;
  },
): DojoPreset {
  let checkedQuestionIds = [...state.checkedQuestionIds];

  // 達成済み除外オプションが有効な場合、達成済みの問題を除外
  if (options?.excludeAchieved && options?.progress) {
    checkedQuestionIds = checkedQuestionIds.filter(
      (id) => !options.progress![id],
    );
  }

  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    checkedQuestionIds,
    selectedTypes: [...state.selectedTypes],
    selectedDifficulties: [...state.selectedDifficulties],
    achievementFilter: state.achievementFilter,
    daysAgoFilter: state.daysAgoFilter,
    orderMode: state.orderMode,
    questionLimit: state.questionLimit,
    allQuestions: state.allQuestions,
    excludeAchieved: options?.excludeAchieved,
  };
}
