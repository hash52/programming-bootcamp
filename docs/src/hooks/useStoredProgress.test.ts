import { renderHook, act } from "@testing-library/react";
import { useStoredProgress } from "./useStoredProgress";

describe("useStoredProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("チェックONでprogressに追加され、履歴が更新される", () => {
    const { result } = renderHook(() => useStoredProgress());

    act(() => result.current.updateProgress("q1", true));

    expect(result.current.progress["q1"]).toBeDefined();
    expect(result.current.history).toHaveProperty(
      new Date().toISOString().split("T")[0]
    );
  });

  it("チェックOFFでprogressから削除される", () => {
    const { result } = renderHook(() => useStoredProgress());

    act(() => result.current.updateProgress("q1", true));
    act(() => result.current.updateProgress("q1", false));

    expect(result.current.progress["q1"]).toBeUndefined();
  });

  it("過去の履歴は保持され、今日の履歴のみ更新される", () => {
    const pastDate = "2025-10-01";
    localStorage.setItem("progressHistory", JSON.stringify({ [pastDate]: 50 }));

    const { result } = renderHook(() => useStoredProgress());
    act(() => result.current.updateProgress("q2", true));

    const history = result.current.history;
    expect(history[pastDate]).toBe(50); // 過去データは保持
    expect(Object.keys(history)).toContain(
      new Date().toISOString().split("T")[0]
    ); // 今日の履歴も追加
  });
});
