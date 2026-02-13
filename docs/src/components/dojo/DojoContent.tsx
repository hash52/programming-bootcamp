import React, { useState, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
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
import { DojoQuestionView } from "./DojoQuestionView";

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
      setScreen("questions");
    },
    []
  );

  /** 条件変更画面に戻る */
  const handleBack = useCallback(() => {
    setScreen("settings");
    setIsImported(false);
  }, []);

  /** 未達成の問題だけ再出題 */
  const handleRetryWrong = useCallback(
    (wrongIds: string[]) => {
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

      setActiveQuestions(questions);
      setResetKey((prev) => prev + 1);
      setScreen("questions");

      // ページ最上部にスクロール
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [orderMode]
  );

  return (
    <Box maxWidth="1200px" mx="auto">
      {screen === "settings" && (
        <>
          <Typography variant="body1" color="text.secondary" mb={3}>
            出題範囲やフィルターを設定して、演習問題に取り組みましょう。
          </Typography>

          {/* インポートパネル */}
          <DojoImportPanel onImport={handleImport} />

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
    </Box>
  );
};
