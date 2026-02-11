import {
  calcOverallProgressRate,
  calcCategoryProgressRate,
  calcTopicProgressRate,
  calcMajorChapterProgressRate,
} from "./calcProgressRate";
import { ProgressRecord } from "@site/src/hooks/useStoredProgress";

/**
 * 構成:
 * - javaカテゴリ
 *   - topic1: 3問
 *   - topic2: 2問
 * - springカテゴリ
 *   - topic3: 4問
 */
//HACK: 相対パスでimportしないとテストでエラーになる
jest.mock("../../structure", () => ({
  ALL_TOPIC_STRUCTURE: [
    {
      id: "topic1",
      category: "java",
      label: "Java入門",
      questions: [{ id: "q1" }, { id: "q2" }, { id: "q3" }],
    },
    {
      id: "topic2",
      category: "java",
      label: "Java応用",
      questions: [{ id: "q4" }, { id: "q5" }],
    },
    {
      id: "topic3",
      category: "spring",
      label: "Spring基礎",
      questions: [{ id: "q6" }, { id: "q7" }, { id: "q8" }, { id: "q9" }],
    },
  ],
}));

describe("calcProgressRate系ユーティリティ", () => {
  /**
   * 進捗構成:
   * - java/topic1: q1, q3 完了 → 2/3
   * - java/topic2: q5 完了 → 1/2
   * - spring/topic3: q7, q8, q9 完了 → 3/4
   * ------------------------------------------------
   * 全体: 6問完了 / 9問合計 → 0.6666...
   * javaカテゴリ: (2 + 1) / (3 + 2) = 3/5 = 0.6
   * springカテゴリ: 3 / 4 = 0.75
   */
  const mockProgress: ProgressRecord = {
    q1: { lastCheckedAt: "2025-10-01T00:00:00Z" },
    q3: { lastCheckedAt: "2025-10-02T00:00:00Z" },
    q5: { lastCheckedAt: "2025-10-03T00:00:00Z" },
    q7: { lastCheckedAt: "2025-10-04T00:00:00Z" },
    q8: { lastCheckedAt: "2025-10-05T00:00:00Z" },
    q9: { lastCheckedAt: "2025-10-06T00:00:00Z" },
  };

  test("全体進捗率を正しく計算する（9問中6問完了 → 0.666...）", () => {
    const rate = calcOverallProgressRate(mockProgress);
    expect(rate).toBeCloseTo(2 / 3, 3);
  });

  test("カテゴリ単位の進捗率を正しく計算する（java→0.6, spring→0.75）", () => {
    const javaRate = calcCategoryProgressRate("java", mockProgress);
    const springRate = calcCategoryProgressRate("spring", mockProgress);
    expect(javaRate).toBeCloseTo(0.6, 3);
    expect(springRate).toBeCloseTo(0.75, 3);
  });

  test("トピック単位の進捗率を正しく計算する", () => {
    const t1 = calcTopicProgressRate("topic1", mockProgress); // 2/3
    const t2 = calcTopicProgressRate("topic2", mockProgress); // 1/2
    const t3 = calcTopicProgressRate("topic3", mockProgress); // 3/4

    expect(t1).toBeCloseTo(2 / 3, 3);
    expect(t2).toBeCloseTo(0.5, 3);
    expect(t3).toBeCloseTo(0.75, 3);
  });

  test("存在しないトピック・カテゴリの場合は0を返す", () => {
    const noTopic = calcTopicProgressRate("unknown", mockProgress);
    const noCategory = calcCategoryProgressRate("other", mockProgress);
    expect(noTopic).toBe(0);
    expect(noCategory).toBe(0);
  });

  test("進捗が空の場合は全て0を返す", () => {
    const empty: ProgressRecord = {};
    expect(calcOverallProgressRate(empty)).toBe(0);
    expect(calcCategoryProgressRate("java", empty)).toBe(0);
    expect(calcTopicProgressRate("topic1", empty)).toBe(0);
    expect(calcMajorChapterProgressRate("java", empty)).toBe(0);
  });

  test("大章単位の進捗率を正しく計算する（java→0.6, spring→0.75）", () => {
    const javaRate = calcMajorChapterProgressRate("java", mockProgress);
    const springRate = calcMajorChapterProgressRate("spring", mockProgress);
    // java: topic1(q1,q3完了=2/3) + topic2(q5完了=1/2) → 3/5 = 0.6
    expect(javaRate).toBeCloseTo(0.6, 3);
    // spring: topic3(q7,q8,q9完了=3/4) → 0.75
    expect(springRate).toBeCloseTo(0.75, 3);
  });

  test("存在しない大章の場合は0を返す", () => {
    const rate = calcMajorChapterProgressRate("unknown", mockProgress);
    expect(rate).toBe(0);
  });
});
