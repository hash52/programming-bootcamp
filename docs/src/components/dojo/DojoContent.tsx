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
import {
  type AchievementFilter,
  type DaysAgoFilter,
  type OrderMode,
  resolveDojoQuestions,
} from "@site/src/lib/dojoFilter";
import { DojoTopicSelector } from "./DojoTopicSelector";
import { DojoFilterPanel } from "./DojoFilterPanel";
import { DojoImportPanel } from "./DojoImportPanel";
import { DojoPresetPanel } from "./DojoPresetPanel";
import { DojoQuestionView } from "./DojoQuestionView";
import type { DojoPreset } from "@site/src/lib/dojoPreset";

type Screen = "settings" | "questions";

export const DojoContent: React.FC = () => {
  const { progress } = useStoredProgress();

  // 画面遷移
  const [screen, setScreen] = useState<Screen>("settings");

  // ツリー選択ダイアログ
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [checkedQuestionIds, setCheckedQuestionIds] = useState<Set<string>>(
    new Set()
  );

  // フィルター状態
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

  // 出題された問題リスト
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  // インポートモードフラグ
  const [isImported, setIsImported] = useState(false);
  // 入力リセット用カウンター（再出題時にインクリメントしてコンポーネントを再マウント）
  const [resetKey, setResetKey] = useState(0);
  // ブラウザバック確認ダイアログ
  const [browserBackConfirmOpen, setBrowserBackConfirmOpen] = useState(false);
  // 再出題履歴スタック（popstateハンドラ内でstale closureを避けるためref）
  const questionHistoryRef = useRef<Question[][]>([]);
  const retryCountRef = useRef(0);

  /** 演習開始 */
  const handleStart = useCallback(() => {
    const questions = resolveDojoQuestions({
      selectedQuestionIds: checkedQuestionIds,
      selectedTypes,
      selectedDifficulties,
      achievementFilter,
      daysAgoFilter,
      orderMode,
      questionLimit: allQuestions ? null : questionLimit,
      progress,
    });
    setActiveQuestions(questions);
    setIsImported(false);
    history.pushState(null, "", location.pathname + location.search + "#questions");
    setScreen("questions");
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
  ]);

  /** インポートから直接問題表示 */
  const handleImport = useCallback(
    (questionIds: string[]) => {
      // インポートされた問題IDで問題を取得（structure.ts定義順を保持）
      const idSet = new Set(questionIds);
      const questions = ALL_TOPIC_STRUCTURE.flatMap((t) =>
        t.questions
      ).filter((q) => idSet.has(q.id));
      setActiveQuestions(questions);
      setIsImported(true);
      history.pushState(null, "", location.pathname + location.search + "#questions");
      setScreen("questions");
    },
    []
  );

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

  /** 未達成の問題だけ再出題 */
  const handleRetryWrong = useCallback(
    (wrongIds: string[]) => {
      // 現在の問題セットをスタックに保存
      questionHistoryRef.current.push([...activeQuestions]);

      const idSet = new Set(wrongIds);
      const questions = ALL_TOPIC_STRUCTURE.flatMap((t) =>
        t.questions
      ).filter((q) => idSet.has(q.id));

      // ランダムモードだった場合はシャッフル
      if (orderMode === "random") {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
      }

      retryCountRef.current += 1;
      history.pushState(
        null,
        "",
        location.pathname + location.search + `#retry-${retryCountRef.current}`
      );

      setActiveQuestions(questions);
      setResetKey((prev) => prev + 1);
      setScreen("questions");

      // ページ最上部にスクロール
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [orderMode, activeQuestions]
  );

  // ブラウザバック確認ダイアログのハンドラー
  const handleBrowserBackConfirmed = useCallback(() => {
    setBrowserBackConfirmOpen(false);
    handleBack();
  }, [handleBack]);

  const handleBrowserBackCancelled = useCallback(() => {
    setBrowserBackConfirmOpen(false);
  }, []);

  // questions画面でのpopstateリスナー
  useEffect(() => {
    if (screen !== "questions") return;

    const handlePopState = () => {
      const stack = questionHistoryRef.current;
      if (stack.length > 0) {
        // 前の問題セットに戻る
        const prevQuestions = stack.pop()!;
        retryCountRef.current = Math.max(0, retryCountRef.current - 1);
        const hash =
          retryCountRef.current > 0
            ? `#retry-${retryCountRef.current}`
            : "#questions";
        history.replaceState(null, "", location.pathname + location.search + hash);
        setActiveQuestions(prevQuestions);
        setResetKey((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // スタックが空 → settings に戻る確認ダイアログ
        history.pushState(null, "", location.pathname + location.search + "#questions");
        setBrowserBackConfirmOpen(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [screen]);

  // #questions/#retry-*付きURLに直接アクセスした場合のハッシュ除去
  useEffect(() => {
    if (
      (location.hash === "#questions" || location.hash.startsWith("#retry-")) &&
      screen === "settings"
    ) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, []);

  return (
    <Box maxWidth="1200px" mx="auto">
      {screen === "settings" && (
        <>
          <Typography variant="body1" color="text.secondary" mb={3}>
            出題範囲やフィルターを設定して、演習問題に取り組みましょう。
          </Typography>

          {/* インポートパネル */}
          <DojoImportPanel onImport={handleImport} />

          {/* プリセットパネル */}
          <DojoPresetPanel onSelect={handleSelectPreset} />

          {/* フィルターパネル */}
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
          />

          {/* ツリー選択ダイアログ */}
          <DojoTopicSelector
            open={selectorOpen}
            onClose={() => setSelectorOpen(false)}
            checkedQuestionIds={checkedQuestionIds}
            onConfirm={setCheckedQuestionIds}
          />
        </>
      )}

      {screen === "questions" && (
        <DojoQuestionView
          questions={activeQuestions}
          onBack={handleBack}
          isImported={isImported}
          onRetryWrong={handleRetryWrong}
          resetKey={resetKey}
        />
      )}
      <Dialog open={browserBackConfirmOpen} onClose={handleBrowserBackCancelled}>
        <DialogTitle>条件設定に戻りますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            現在の問題セットは破棄されます。ランダム出題の場合、同じ並び順を再現することはできません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBrowserBackCancelled}>キャンセル</Button>
          <Button onClick={handleBrowserBackConfirmed} color="primary" variant="contained">
            戻る
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
