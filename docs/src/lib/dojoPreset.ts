import type { QuestionType, Difficulty } from "@site/src/structure";
import type {
  AchievementFilter,
  DaysAgoFilter,
  OrderMode,
} from "@site/src/lib/dojoFilter";

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
    p.id === id ? { ...p, name: newName } : p
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
  state: CurrentConditions
): DojoPreset {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    checkedQuestionIds: [...state.checkedQuestionIds],
    selectedTypes: [...state.selectedTypes],
    selectedDifficulties: [...state.selectedDifficulties],
    achievementFilter: state.achievementFilter,
    daysAgoFilter: state.daysAgoFilter,
    orderMode: state.orderMode,
    questionLimit: state.questionLimit,
    allQuestions: state.allQuestions,
  };
}
