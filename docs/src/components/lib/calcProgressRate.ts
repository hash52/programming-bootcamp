/*
  進捗率計算ユーティリティ
*/

import { ProgressRecord } from "@site/src/hooks/useStoredProgress";
import { ALL_TOPIC_STRUCTURE } from "../../structure"; //HACK: 相対パスでimportしないとテストでエラーになる

/** 全体の進捗率を計算する */
export function calcOverallProgressRate(progress: ProgressRecord) {
  const allQuestions = ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions);
  // 進捗が登録されている設問の数
  const done = Object.keys(progress).length;
  return allQuestions.length > 0 ? done / allQuestions.length : 0;
}

/** カテゴリごとの進捗率を計算する */
export function calcCategoryProgressRate(
  category: string,
  progress: ProgressRecord
) {
  const categoryQuestions = ALL_TOPIC_STRUCTURE.filter(
    (t) => t.category === category
  ).flatMap((t) => t.questions);
  //そのカテゴリで進捗が登録されている設問の数
  const done = categoryQuestions.filter((q) => progress[q.id]).length;
  return categoryQuestions.length > 0 ? done / categoryQuestions.length : 0;
}

/** トピックごとの進捗率を計算する */
export function calcTopicProgressRate(
  topicId: string,
  progress: ProgressRecord
) {
  const topic = ALL_TOPIC_STRUCTURE.find((t) => t.id === topicId);
  if (!topic) return 0;
  //そのトピックで進捗が登録されている設問の数
  const done = topic.questions.filter((q) => progress[q.id]).length;
  return topic.questions.length > 0 ? done / topic.questions.length : 0;
}

/** 大章ごとの進捗率を計算する */
export function calcMajorChapterProgressRate(
  majorChapter: string,
  progress: ProgressRecord
) {
  const majorQuestions = ALL_TOPIC_STRUCTURE
    .filter((t) => t.category.split("/")[0] === majorChapter)
    .flatMap((t) => t.questions);
  const done = majorQuestions.filter((q) => progress[q.id]).length;
  return majorQuestions.length > 0 ? done / majorQuestions.length : 0;
}

/** 達成済み個数と全個数を返す型 */
export type ProgressCount = { done: number; total: number };

/** トピックごとの達成個数を返す */
export function calcTopicProgressCount(
  topicId: string,
  progress: ProgressRecord
): ProgressCount {
  const topic = ALL_TOPIC_STRUCTURE.find((t) => t.id === topicId);
  if (!topic) return { done: 0, total: 0 };
  const done = topic.questions.filter((q) => progress[q.id]).length;
  return { done, total: topic.questions.length };
}

/** カテゴリごとの達成個数を返す */
export function calcCategoryProgressCount(
  category: string,
  progress: ProgressRecord
): ProgressCount {
  const categoryQuestions = ALL_TOPIC_STRUCTURE
    .filter((t) => t.category === category)
    .flatMap((t) => t.questions);
  const done = categoryQuestions.filter((q) => progress[q.id]).length;
  return { done, total: categoryQuestions.length };
}

/** 大章ごとの達成個数を返す */
export function calcMajorChapterProgressCount(
  majorChapter: string,
  progress: ProgressRecord
): ProgressCount {
  const majorQuestions = ALL_TOPIC_STRUCTURE
    .filter((t) => t.category.split("/")[0] === majorChapter)
    .flatMap((t) => t.questions);
  const done = majorQuestions.filter((q) => progress[q.id]).length;
  return { done, total: majorQuestions.length };
}
