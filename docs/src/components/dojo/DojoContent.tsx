import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  ALL_TOPIC_STRUCTURE,
  Difficulty,
  type Question,
  type QuestionType,
} from "@site/src/structure";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import { useAdditionalExerciseProgress } from "@site/src/hooks/useAdditionalExerciseProgress";
import { ALL_ADDITIONAL_EXERCISES } from "@site/src/additionalExercises";
import {
  type AchievementFilter,
  type DaysAgoFilter,
  type OrderMode,
  type DojoItem,
  resolveDojoItems,
  isTrophyUnlocked,
} from "@site/src/lib/dojoFilter";
import { DojoTopicSelector } from "./DojoTopicSelector";
import { DojoAdditionalExerciseSelector } from "./DojoAdditionalExerciseSelector";
import { DojoFilterPanel } from "./DojoFilterPanel";
import { DojoImportPanel } from "./DojoImportPanel";
import { DojoPresetPanel } from "./DojoPresetPanel";
import { DojoQuestionView } from "./DojoQuestionView";
import { DojoLoadingOverlay } from "./DojoLoadingOverlay";
import type { DojoPreset } from "@site/src/lib/dojoPreset";

type Screen = "settings" | "loading" | "questions";

export const DojoContent: React.FC = () => {
  const { progress } = useStoredProgress();
  const { additionalProgress } = useAdditionalExerciseProgress();

  // 画面遷移
  const [screen, setScreen] = useState<Screen>("settings");

  // ツリー選択ダイアログ
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [checkedQuestionIds, setCheckedQuestionIds] = useState<Set<string>>(
    new Set()
  );

  // フィルター状態（通常設問）
  const [selectedTypes, setSelectedTypes] = useState<Set<QuestionType>>(
    new Set(["KNOW", "READ", "WRITE"])
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Set<Difficulty>
  >(new Set([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard]));
  const [achievementFilter, setAchievementFilter] =
    useState<AchievementFilter>("all");
  const [daysAgoFilter, setDaysAgoFilter] = useState<DaysAgoFilter>("all");
  const [orderMode, setOrderMode] = useState<OrderMode>("sequential");
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);
  const [allQuestions, setAllQuestions] = useState(true);

  // ── 追加演習フィルター ─────────────────────────────────────────
  const [selectedAdditionalIds, setSelectedAdditionalIds] = useState<Set<string>>(new Set());
  const [additionalSelectorOpen, setAdditionalSelectorOpen] = useState(false);
  const [includeTrophy, setIncludeTrophy] = useState(false);

  // 出題されたアイテムリスト（通常設問・追加演習・トロフィー問題の混在可）
  const [activeItems, setActiveItems] = useState<DojoItem[]>([]);
  // インポートモードフラグ
  const [isImported, setIsImported] = useState(false);
  // 入力リセット用カウンター
  const [resetKey, setResetKey] = useState(0);
  // バックグラウンドレンダリング有効フラグ
  const [bgRenderEnabled, setBgRenderEnabled] = useState(false);
  // QuestionView のマウント完了フラグ
  const [qvReady, setQvReady] = useState(false);
  // ブラウザバック確認ダイアログ
  const [browserBackConfirmOpen, setBrowserBackConfirmOpen] = useState(false);
  // 再出題履歴スタック
  const questionHistoryRef = useRef<DojoItem[][]>([]);
  const retryCountRef = useRef(0);

  // HACK: パンくずリスト非表示
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.hackId = "dojo-hide-breadcrumbs";
    style.textContent = ".breadcrumbs { display: none !important; }";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /** トロフィー問題の解放済み数・全体数 */
  const { unlockedTrophyCount, totalTrophyCount } = useMemo(() => {
    const trophyTopics = ALL_TOPIC_STRUCTURE.filter((t) => t.trophyQuestion);
    const unlocked = trophyTopics.filter((t) =>
      isTrophyUnlocked(t, progress)
    ).length;
    return { unlockedTrophyCount: unlocked, totalTrophyCount: trophyTopics.length };
  }, [progress]);

  /** 演習開始 */
  const handleStart = useCallback(() => {
    const items = resolveDojoItems({
      selectedQuestionIds: checkedQuestionIds,
      selectedTypes,
      selectedDifficulties,
      achievementFilter,
      daysAgoFilter,
      orderMode,
      questionLimit: allQuestions ? null : questionLimit,
      progress,
      selectedAdditionalIds,
      additionalProgress,
      includeTrophy,
    });
    setActiveItems(items);
    setIsImported(false);
    setSelectorOpen(false);
    history.pushState(
      null,
      "",
      location.pathname + location.search + "#questions"
    );
    setScreen("loading");
  }, [
    checkedQuestionIds,
    selectedTypes,
    selectedDifficulties,
    achievementFilter,
    daysAgoFilter,
    orderMode,
    questionLimit,
    allQuestions,
    progress,
    selectedAdditionalIds,
    additionalProgress,
    includeTrophy,
  ]);

  /** インポートから直接問題表示（通常設問 + 追加演習対応） */
  const handleImport = useCallback((questionIds: string[], additionalIds: string[]) => {
    const idSet = new Set(questionIds);
    const questions = ALL_TOPIC_STRUCTURE.flatMap((t) =>
      t.questions
    ).filter((q) => idSet.has(q.id));
    const questionItems: DojoItem[] = questions.map((q) => ({
      kind: "question" as const,
      data: q,
    }));

    const additionalIdSet = new Set(additionalIds);
    const additionalItems: DojoItem[] = ALL_ADDITIONAL_EXERCISES
      .filter((ex) => additionalIdSet.has(ex.id))
      .map((ex) => ({ kind: "additional" as const, data: ex }));

    setActiveItems([...questionItems, ...additionalItems]);
    setIsImported(true);
    history.pushState(
      null,
      "",
      location.pathname + location.search + "#questions"
    );
    setScreen("loading");
  }, []);

  /** プリセット選択 */
  const handleSelectPreset = useCallback((preset: DojoPreset) => {
    setCheckedQuestionIds(new Set(preset.checkedQuestionIds));
    setSelectedTypes(new Set(preset.selectedTypes));
    setSelectedDifficulties(new Set(preset.selectedDifficulties));
    setAchievementFilter(preset.achievementFilter);
    setDaysAgoFilter(preset.daysAgoFilter);
    setOrderMode(preset.orderMode);
    setQuestionLimit(preset.questionLimit);
    setAllQuestions(preset.allQuestions);
    setSelectedAdditionalIds(new Set(preset.selectedAdditionalIds ?? []));
    setIncludeTrophy(preset.includeTrophy ?? false);
  }, []);

  /** 条件変更画面に戻る */
  const handleBack = useCallback(() => {
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    questionHistoryRef.current = [];
    retryCountRef.current = 0;
    setScreen("settings");
    setIsImported(false);
  }, []);

  /** 未達成の通常設問だけ再出題 */
  const handleRetryWrong = useCallback(
    (wrongIds: string[]) => {
      questionHistoryRef.current.push([...activeItems]);

      const idSet = new Set(wrongIds);
      const questions = ALL_TOPIC_STRUCTURE.flatMap((t) =>
        t.questions
      ).filter((q) => idSet.has(q.id));
      let items: DojoItem[] = questions.map((q) => ({
        kind: "question" as const,
        data: q,
      }));

      if (orderMode === "random") {
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
      }

      retryCountRef.current += 1;
      history.pushState(
        null,
        "",
        location.pathname +
          location.search +
          `#retry-${retryCountRef.current}`
      );

      setActiveItems(items);
      setResetKey((prev) => prev + 1);
      setScreen("questions");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [orderMode, activeItems]
  );

  const handleBrowserBackConfirmed = useCallback(() => {
    setBrowserBackConfirmOpen(false);
    handleBack();
  }, [handleBack]);

  const handleBrowserBackCancelled = useCallback(() => {
    setBrowserBackConfirmOpen(false);
  }, []);

  useEffect(() => {
    if (screen !== "loading") {
      setBgRenderEnabled(false);
      setQvReady(false);
      return;
    }
    const rafId = requestAnimationFrame(() => {
      setBgRenderEnabled(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, [screen]);

  useEffect(() => {
    if (screen !== "questions") return;

    const handlePopState = () => {
      const stack = questionHistoryRef.current;
      if (stack.length > 0) {
        const prevItems = stack.pop()!;
        retryCountRef.current = Math.max(0, retryCountRef.current - 1);
        const hash =
          retryCountRef.current > 0
            ? `#retry-${retryCountRef.current}`
            : "#questions";
        history.replaceState(
          null,
          "",
          location.pathname + location.search + hash
        );
        setActiveItems(prevItems);
        setResetKey((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        history.pushState(
          null,
          "",
          location.pathname + location.search + "#questions"
        );
        setBrowserBackConfirmOpen(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [screen]);

  useEffect(() => {
    if (
      (location.hash === "#questions" ||
        location.hash.startsWith("#retry-")) &&
      screen === "settings"
    ) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, []);

  return (
    <Box maxWidth="1200px" mx="auto">
      {(screen === "settings" || screen === "loading") && (
        <>
          <Typography variant="body1" color="text.secondary" mb={3}>
            出題範囲やフィルターを設定して、演習問題に取り組みましょう。
          </Typography>

          <DojoImportPanel onImport={handleImport} />
          <DojoPresetPanel onSelect={handleSelectPreset} />

          <DojoFilterPanel
            checkedQuestionIds={checkedQuestionIds}
            onOpenSelector={() => setSelectorOpen(true)}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            selectedDifficulties={selectedDifficulties}
            onDifficultiesChange={setSelectedDifficulties}
            achievementFilter={achievementFilter}
            onAchievementFilterChange={setAchievementFilter}
            daysAgoFilter={daysAgoFilter}
            onDaysAgoFilterChange={setDaysAgoFilter}
            orderMode={orderMode}
            onOrderModeChange={setOrderMode}
            questionLimit={questionLimit}
            onQuestionLimitChange={setQuestionLimit}
            allQuestions={allQuestions}
            onAllQuestionsChange={setAllQuestions}
            progress={progress}
            onStart={handleStart}
            selectedAdditionalIds={selectedAdditionalIds}
            onOpenAdditionalSelector={() => setAdditionalSelectorOpen(true)}
            additionalProgress={additionalProgress}
            includeTrophy={includeTrophy}
            onIncludeTrophyChange={setIncludeTrophy}
            unlockedTrophyCount={unlockedTrophyCount}
            totalTrophyCount={totalTrophyCount}
          />

          <DojoTopicSelector
            open={selectorOpen}
            onClose={() => setSelectorOpen(false)}
            checkedQuestionIds={checkedQuestionIds}
            onConfirm={setCheckedQuestionIds}
          />

          <DojoAdditionalExerciseSelector
            open={additionalSelectorOpen}
            onClose={() => setAdditionalSelectorOpen(false)}
            selectedAdditionalIds={selectedAdditionalIds}
            onConfirm={setSelectedAdditionalIds}
            additionalProgress={additionalProgress}
          />
        </>
      )}

      {screen === "loading" && (
        <>
          {bgRenderEnabled && (
            <Box
              sx={{
                position: "fixed",
                visibility: "hidden",
                pointerEvents: "none",
                top: 0,
                left: 0,
                width: "100%",
              }}
            >
              <DojoQuestionView
                items={activeItems}
                onBack={handleBack}
                isImported={isImported}
                onRetryWrong={handleRetryWrong}
                resetKey={resetKey}
                onReady={() => setQvReady(true)}
              />
            </Box>
          )}
          <DojoLoadingOverlay
            questionCount={activeItems.length}
            triggerComplete={qvReady}
            onComplete={() => setScreen("questions")}
          />
        </>
      )}

      {screen === "questions" && (
        <DojoQuestionView
          items={activeItems}
          onBack={handleBack}
          isImported={isImported}
          onRetryWrong={handleRetryWrong}
          resetKey={resetKey}
        />
      )}

      <Dialog
        open={browserBackConfirmOpen}
        onClose={handleBrowserBackCancelled}
      >
        <DialogTitle>条件設定に戻りますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            現在の問題セットは破棄されます。ランダム出題の場合、同じ並び順を再現することはできません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBrowserBackCancelled}>キャンセル</Button>
          <Button
            onClick={handleBrowserBackConfirmed}
            color="primary"
            variant="contained"
          >
            戻る
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
