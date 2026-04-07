import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import { QuestionRenderer } from "../QuestionRenderer";
import { QuestionErrorBoundary } from "../question/QuestionErrorBoundary";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import {
  Difficulty,
  type Question,
  type QuestionType,
} from "@site/src/structure";
import type {
  AchievementFilter,
  DaysAgoFilter,
  OrderMode,
} from "@site/src/lib/dojoFilter";
import { DojoExportDialog } from "./DojoExportDialog";
import { DojoQuestionViewPresetDialog } from "./DojoQuestionViewPresetDialog";
import {
  buildPresetFromState,
  savePreset,
  type CurrentConditions,
} from "@site/src/lib/dojoPreset";

interface DojoQuestionViewProps {
  /** 出題する問題リスト */
  questions: Question[];
  /** 条件変更画面に戻る */
  onBack: () => void;
  /** インポートモード（共有された問題セット） */
  isImported?: boolean;
  /** 未達成の問題だけ再出題 */
  onRetryWrong?: (wrongIds: string[]) => void;
  /** 入力リセット用キー（変更されると全問題コンポーネントが再マウントされる） */
  resetKey?: number;
  /** Reactツリーのマウント完了時に呼ばれるコールバック */
  onReady?: () => void;
  /** プリセット保存用: ツリーで選択された問題ID */
  checkedQuestionIds?: Set<string>;
  /** プリセット保存用: 問題タイプ */
  selectedTypes?: Set<QuestionType>;
  /** プリセット保存用: 難易度 */
  selectedDifficulties?: Set<Difficulty>;
  /** プリセット保存用: 達成状態フィルタ */
  achievementFilter?: AchievementFilter;
  /** プリセット保存用: 最終チェック日フィルタ */
  daysAgoFilter?: DaysAgoFilter;
  /** プリセット保存用: 出題順 */
  orderMode?: OrderMode;
  /** プリセット保存用: 出題数制限 */
  questionLimit?: number | null;
  /** プリセット保存用: 全問出題フラグ */
  allQuestions?: boolean;
}

const TYPE_COLORS: Record<QuestionType, "info" | "warning" | "success"> = {
  KNOW: "info",
  READ: "warning",
  WRITE: "success",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
};

const DIFFICULTY_COLORS: Record<Difficulty, "success" | "warning" | "error"> = {
  [Difficulty.Easy]: "success",
  [Difficulty.Medium]: "warning",
  [Difficulty.Hard]: "error",
};

export const DojoQuestionView: React.FC<DojoQuestionViewProps> = ({
  questions,
  onBack,
  isImported = false,
  onRetryWrong,
  resetKey = 0,
  onReady,
  checkedQuestionIds = new Set(),
  selectedTypes = new Set(),
  selectedDifficulties = new Set(),
  achievementFilter = "all",
  daysAgoFilter = "all",
  orderMode = "sequential",
  questionLimit = null,
  allQuestions = true,
}) => {
  const { progress } = useStoredProgress();

  // Reactツリーのマウント完了を通知（MDX非同期ロードは別途並行進行）
  useEffect(() => {
    onReady?.();
  }, []);
  const [exportOpen, setExportOpen] = useState(false);
  const [backConfirmOpen, setBackConfirmOpen] = useState(false);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /** 達成済み問題数 */
  const achievedCount = useMemo(
    () => questions.filter((q) => !!progress[q.id]).length,
    [questions, progress],
  );

  const totalCount = questions.length;
  const progressPercent =
    totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;
  const allDone = achievedCount === totalCount && totalCount > 0;

  /** タイプ別の達成数 */
  const typeStats = useMemo(() => {
    const stats: Record<QuestionType, { total: number; done: number }> = {
      KNOW: { total: 0, done: 0 },
      READ: { total: 0, done: 0 },
      WRITE: { total: 0, done: 0 },
    };
    questions.forEach((q) => {
      stats[q.type].total++;
      if (progress[q.id]) stats[q.type].done++;
    });
    return stats;
  }, [questions, progress]);

  /** 未達成の問題ID */
  const unachievedIds = useMemo(
    () => questions.filter((q) => !progress[q.id]).map((q) => q.id),
    [questions, progress],
  );

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  /** 条件変更へ戻る（確認後） */
  const handleBackConfirmed = () => {
    setBackConfirmOpen(false);
    onBack();
  };

  /** プリセット保存ハンドラー */
  const handlePresetSave = (name: string, excludeAchieved: boolean) => {
    const conditions: CurrentConditions = {
      checkedQuestionIds,
      selectedTypes,
      selectedDifficulties,
      achievementFilter,
      daysAgoFilter,
      orderMode,
      questionLimit,
      allQuestions,
    };

    const preset = buildPresetFromState(name, conditions, {
      excludeAchieved,
      progress: excludeAchieved ? progress : undefined,
    });

    savePreset(preset);
    setPresetDialogOpen(false);
    setSnackbarMessage("プリセットを保存しました");
    setSnackbarOpen(true);
  };

  return (
    <Box>
      {/* ヘッダー */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setBackConfirmOpen(true)}
          variant="text"
        >
          条件を変更する
        </Button>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<SaveIcon />}
            onClick={() => setPresetDialogOpen(true)}
            variant="outlined"
            size="small"
          >
            プリセットとして保存
          </Button>
          <Button
            startIcon={<ShareIcon />}
            onClick={() => setExportOpen(true)}
            variant="outlined"
            size="small"
          >
            この問題セットを共有
          </Button>
        </Box>
      </Box>

      {/* 戻る確認ダイアログ */}
      <Dialog open={backConfirmOpen} onClose={() => setBackConfirmOpen(false)}>
        <DialogTitle>条件設定に戻りますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            現在の問題セットは破棄されます。ランダム出題の場合、同じ並び順を再現することはできません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackConfirmOpen(false)}>キャンセル</Button>
          <Button
            onClick={handleBackConfirmed}
            color="primary"
            variant="contained"
          >
            戻る
          </Button>
        </DialogActions>
      </Dialog>

      {/* インポート通知 */}
      {isImported && (
        <Alert severity="info" sx={{ mb: 2 }}>
          共有された問題セットです（{totalCount}問）
        </Alert>
      )}

      {/* プログレスバー */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            達成状況
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {achievedCount}/{totalCount}問 達成
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" mt={0.5}>
          自動採点のない問題は、解答確認後にチェックボックスで達成を記録してください
        </Typography>
      </Box>

      {/* 問題一覧 */}
      {questions.map((q, index) => {
        const isAchieved = !!progress[q.id];

        return (
          <QuestionAccordion key={`${q.id}-${resetKey}`} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                  問題{index + 1}.
                </Typography>
                <Typography sx={{ mr: 1 }}>{q.title}</Typography>
                <Chip
                  label={q.type}
                  size="small"
                  color={TYPE_COLORS[q.type]}
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
                <Chip
                  label={DIFFICULTY_LABELS[q.difficulty]}
                  size="small"
                  color={DIFFICULTY_COLORS[q.difficulty]}
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
                {isAchieved && (
                  <CheckCircleIcon color="success" fontSize="small" />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <QuestionErrorBoundary questionId={q.id}>
                <QuestionRenderer id={q.id} mode="dojo" showTitle={false} />
              </QuestionErrorBoundary>
            </AccordionDetails>
          </QuestionAccordion>
        );
      })}

      {/* 結果サマリー（全問達成時） */}
      {allDone && (
        <ResultCard>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              全 {totalCount}問 達成！（達成率 {Math.round(progressPercent)}%）
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              {(["KNOW", "READ", "WRITE"] as QuestionType[]).map((type) => {
                const stat = typeStats[type];
                if (stat.total === 0) return null;
                return (
                  <Typography key={type} variant="body2">
                    {type}: {stat.done}/{stat.total}
                  </Typography>
                );
              })}
            </Box>
          </CardContent>
        </ResultCard>
      )}

      {/* 未達成の問題だけ再出題 */}
      {unachievedIds.length > 0 &&
        unachievedIds.length < totalCount &&
        onRetryWrong && (
          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={() => onRetryWrong(unachievedIds)}
            >
              未達成の問題だけ再出題（{unachievedIds.length}問）
            </Button>
          </Box>
        )}

      {/* フッター: プリセット保存・共有ボタン */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={1}
        mt={4}
        pt={2}
        borderTop="1px solid"
        borderColor="divider"
      >
        <Button
          startIcon={<SaveIcon />}
          onClick={() => setPresetDialogOpen(true)}
          variant="outlined"
          size="small"
        >
          プリセットとして保存
        </Button>
        <Button
          startIcon={<ShareIcon />}
          onClick={() => setExportOpen(true)}
          variant="outlined"
          size="small"
        >
          この問題セットを共有
        </Button>
      </Box>

      {/* エクスポートダイアログ */}
      <DojoExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        questionIds={questionIds}
      />

      {/* プリセット保存ダイアログ */}
      <DojoQuestionViewPresetDialog
        open={presetDialogOpen}
        onClose={() => setPresetDialogOpen(false)}
        onSave={handlePresetSave}
      />

      {/* 保存完了通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

const QuestionAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  "&:before": { display: "none" },
  boxShadow: theme.shadows[1],
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(76, 175, 80, 0.08)"
      : "rgba(76, 175, 80, 0.05)",
  border: `1px solid ${theme.palette.success.main}`,
}));
