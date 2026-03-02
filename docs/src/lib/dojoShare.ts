import { ALL_TOPIC_STRUCTURE, Question } from "@site/src/structure";

/** 共有データ構造 */
export interface DojoShareData {
  v: 1;
  ids: number[];
  /** 追加演習の文字列IDリスト（"extra/" プレフィックス） */
  extraIds?: string[];
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
export function encodeShareData(questionIds: string[]): string {
  const regularIds = questionIds.filter((id) => !id.startsWith("extra/"));
  const extraIds = questionIds.filter((id) => id.startsWith("extra/"));
  const data: DojoShareData = {
    v: 1,
    ids: questionIdsToIndices(regularIds),
    ...(extraIds.length > 0 ? { extraIds } : {}),
  };
  return JSON.stringify(data);
}

/** JSON 文字列を DojoShareData としてデコード・バリデーション */
export function decodeShareData(
  json: string
): { ok: true; questionIds: string[] } | { ok: false; error: string } {
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

    // extraIds のバリデーションと復元
    const extraIds: string[] = [];
    if (parsed.extraIds !== undefined) {
      if (!Array.isArray(parsed.extraIds)) {
        return { ok: false, error: "追加演習IDの形式が正しくありません" };
      }
      if (
        !parsed.extraIds.every(
          (id: unknown) =>
            typeof id === "string" && (id as string).startsWith("extra/")
        )
      ) {
        return { ok: false, error: "追加演習IDの形式が正しくありません" };
      }
      extraIds.push(...parsed.extraIds);
    }

    const allIds = [...questionIds, ...extraIds];
    if (allIds.length === 0) {
      return { ok: false, error: "有効な問題が見つかりません" };
    }

    return { ok: true, questionIds: allIds };
  } catch {
    return { ok: false, error: "JSONの形式が正しくありません" };
  }
}
