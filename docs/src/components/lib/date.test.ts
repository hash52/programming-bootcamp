import { daysAgo } from "./date";

describe("daysAgo", () => {
  test("2025/10/01 23:59 → 現在: 2025/10/02 00:00 → 1日前と判定", () => {
    const result = daysAgo(
      new Date("2025-10-02T00:00:00"),
      new Date("2025-10-01T23:59:00")
    );
    expect(result).toBe(1);
  });

  test("2025/10/01 00:00 → 現在: 2025/10/01 23:59 → 同日(0日前)", () => {
    const result = daysAgo(
      new Date("2025-10-01T23:59:00"),
      new Date("2025-10-01T00:00:00")
    );
    expect(result).toBe(0);
  });

  test("2025/09/30 23:59 → 現在: 2025/10/01 00:00 → 1日前と判定", () => {
    const result = daysAgo(
      new Date("2025-10-01T00:00:00"),
      new Date("2025-09-30T23:59:00")
    );
    expect(result).toBe(1);
  });

  test("同日内なら0日前", () => {
    expect(
      daysAgo(new Date("2025-10-05T12:00:00"), new Date("2025-10-05T00:00:00"))
    ).toBe(0);
    expect(
      daysAgo(new Date("2025-10-05T23:59:59"), new Date("2025-10-05T12:00:00"))
    ).toBe(0);
  });

  test("2日前なら2を返す", () => {
    const result = daysAgo(
      new Date("2025-10-03T00:00:00"),
      new Date("2025-10-01T23:59:00")
    );
    expect(result).toBe(2);
  });
});
