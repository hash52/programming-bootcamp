import { ALL_TOPIC_STRUCTURE, Question } from "@site/src/structure";

/** 共有データ構造 */
export interface DojoShareData {
  v: 1;
  ids: number[];
  aids?: string[];
}

/** 全問題のフラットな配列（インデックス順） */
function getAllQuestions(): Question[] {
  return ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions);
}

/** 問題IDからインデックスへのマップを構築 */
export function buildQuestionIndex(): Map<string, number> {
  const map = new Map<string, number>();
  getAllQuestions().forEach((q, i) => {
    map.set(q.id, i);
  });
  return map;
}

/** 問題ID配列をインデックス配列に変換 */
export function questionIdsToIndices(questionIds: string[]): number[] {
  const indexMap = buildQuestionIndex();
  return questionIds
    .map((id) => indexMap.get(id))
    .filter((idx): idx is number => idx !== undefined);
}

/** インデックス配列を問題ID配列に変換 */
export function indicesToQuestionIds(indices: number[]): string[] {
  const allQuestions = getAllQuestions();
  return indices
    .filter((idx) => idx >= 0 && idx < allQuestions.length)
    .map((idx) => allQuestions[idx].id);
}

/** DojoShareData を JSON 文字列にエンコード */
export function encodeShareData(
  questionIds: string[],
  additionalIds?: string[]
): string {
  const data: DojoShareData = {
    v: 1,
    ids: questionIdsToIndices(questionIds),
    ...(additionalIds && additionalIds.length > 0 ? { aids: additionalIds } : {}),
  };
  return JSON.stringify(data);
}

/** JSON 文字列を DojoShareData としてデコード・バリデーション */
export function decodeShareData(
  json: string
): { ok: true; questionIds: string[]; additionalIds: string[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json);

    if (typeof parsed !== "object" || parsed === null) {
      return { ok: false, error: "形式が正しくありません" };
    }

    if (parsed.v !== 1) {
      return { ok: false, error: "サポートされていないバージョンです" };
    }

    if (!Array.isArray(parsed.ids)) {
      return { ok: false, error: "問題IDの配列が見つかりません" };
    }

    if (!parsed.ids.every((id: unknown) => typeof id === "number")) {
      return { ok: false, error: "問題IDの形式が正しくありません" };
    }

    const questionIds = indicesToQuestionIds(parsed.ids);

    // aids の検証（省略可）
    let additionalIds: string[] = [];
    if (parsed.aids !== undefined) {
      if (!Array.isArray(parsed.aids)) {
        return { ok: false, error: "追加演習IDの形式が正しくありません" };
      }
      if (!parsed.aids.every((id: unknown) => typeof id === "string")) {
        return { ok: false, error: "追加演習IDの形式が正しくありません" };
      }
      additionalIds = parsed.aids;
    }

    if (questionIds.length === 0 && additionalIds.length === 0) {
      return { ok: false, error: "有効な問題が見つかりません" };
    }

    return { ok: true, questionIds, additionalIds };
  } catch {
    return { ok: false, error: "JSONの形式が正しくありません" };
  }
}
