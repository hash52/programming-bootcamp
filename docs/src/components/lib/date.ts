/**
 * 2つの日付の差（日数）を返す
 * （時刻は無視して年月日のみで比較）
 *
 * @param from - 基準日（例: 現在日時）
 * @param target - 比較対象日
 * @returns 日数差（0: 同日, 正の数: fromが後の日, 負の数: targetが後の日）
 */
export function daysAgo(from: Date, target: Date): number {
  // 年月日だけを残したDateを作成（時刻は0:00にリセット）
  const normalize = (d: Date): Date =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const fromDate = normalize(from);
  const targetDate = normalize(target);

  const diffMs = fromDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}
