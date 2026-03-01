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
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { QuestionRenderer } from "../QuestionRenderer";
import { QuestionErrorBoundary } from "../question/QuestionErrorBoundary";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import { useAdditionalExerciseProgress } from "@site/src/hooks/useAdditionalExerciseProgress";
import { Difficulty, type QuestionType } from "@site/src/structure";
import { type DojoItem } from "@site/src/lib/dojoFilter";
import {
  DojoAdditionalExerciseCard,
  DojoTrophyCard,
} from "./DojoAdditionalExerciseCard";
import { DojoExportDialog } from "./DojoExportDialog";

interface DojoQuestionViewProps {
  /** 出題するアイテムリスト（通常設問・追加演習・トロフィー問題の混在可） */
  items: DojoItem[];
  /** 条件変更画面に戻る */
  onBack: () => void;
  /** インポートモード（共有された問題セット） */
  isImported?: boolean;
  /** 未達成の通常設問だけ再出題（追加演習・トロフィーは除外） */
  onRetryWrong?: (wrongIds: string[]) => void;
  /** 入力リセット用キー（変更されると全問題コンポーネントが再マウントされる） */
  resetKey?: number;
  /** Reactツリーのマウント完了時に呼ばれるコールバック */
  onReady?: () => void;
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

const DIFFICULTY_COLORS: Record<Difficulty, "success" | "warning" | "error"> =
  {
    [Difficulty.Easy]: "success",
    [Difficulty.Medium]: "warning",
    [Difficulty.Hard]: "error",
  };

export const DojoQuestionView: React.FC<DojoQuestionViewProps> = ({
  items,
  onBack,
  isImported = false,
  onRetryWrong,
  resetKey = 0,
  onReady,
}) => {
  const { progress } = useStoredProgress();
  const { additionalProgress, trophyProgress } = useAdditionalExerciseProgress();

  useEffect(() => {
    onReady?.();
  }, []);

  const [exportOpen, setExportOpen] = useState(false);
  const [backConfirmOpen, setBackConfirmOpen] = useState(false);

  /** アイテムごとの「達成済み」判定 */
  const isItemAchieved = (item: DojoItem): boolean => {
    if (item.kind === "question") return !!progress[item.data.id];
    if (item.kind === "additional")
      return !!additionalProgress[item.data.id]?.lastSolvedAt;
    if (item.kind === "trophy")
      return !!trophyProgress[item.data.id]?.solvedAt;
    return false;
  };

  /** 達成済みアイテム数 */
  const achievedCount = useMemo(
    () => items.filter((item) => isItemAchieved(item)).length,
    [items, progress, additionalProgress, trophyProgress]
  );

  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;
  const allDone = achievedCount === totalCount && totalCount > 0;

  /** 通常設問のタイプ別達成数 */
  const typeStats = useMemo(() => {
    const stats: Record<QuestionType, { total: number; done: number }> = {
      KNOW: { total: 0, done: 0 },
      READ: { total: 0, done: 0 },
      WRITE: { total: 0, done: 0 },
    };
    items.forEach((item) => {
      if (item.kind !== "question") return;
      const q = item.data;
      stats[q.type].total++;
      if (progress[q.id]) stats[q.type].done++;
    });
    return stats;
  }, [items, progress]);

  /** 未達成の通常設問ID（再出題ボタン用） */
  const unachievedRegularIds = useMemo(
    () =>
      items
        .filter(
          (item) => item.kind === "question" && !progress[item.data.id]
        )
        .map((item) => (item.kind === "question" ? item.data.id : "")),
    [items, progress]
  );

  /** 共有ダイアログ用：通常設問のIDのみ */
  const regularQuestionIds = useMemo(
    () =>
      items
        .filter((item) => item.kind === "question")
        .map((item) => (item.kind === "question" ? item.data.id : "")),
    [items]
  );

  /** 共有ダイアログ用：追加演習のIDのみ */
  const additionalExerciseIds = useMemo(
    () =>
      items
        .filter((item) => item.kind === "additional")
        .map((item) => (item.kind === "additional" ? item.data.id : "")),
    [items]
  );

  const handleBackConfirmed = () => {
    setBackConfirmOpen(false);
    onBack();
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
        <Button
          startIcon={<ShareIcon />}
          onClick={() => setExportOpen(true)}
          variant="outlined"
          size="small"
          disabled={regularQuestionIds.length === 0 && additionalExerciseIds.length === 0}
        >
          この問題セットを共有
        </Button>
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
          自動採点のない問題は、解答確認後にチェックボックスまたは「解いた！」ボタンで達成を記録してください
        </Typography>
      </Box>

      {/* アイテム一覧 */}
      {items.map((item, index) => {
        const isAchieved = isItemAchieved(item);

        if (item.kind === "additional") {
          return (
            <QuestionAccordion key={`additional-${item.data.id}-${resetKey}`} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                    問題{index + 1}.
                  </Typography>
                  <Typography sx={{ mr: 1 }}>{item.data.title}</Typography>
                  <Chip
                    label="追加演習"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                  {isAchieved && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DojoAdditionalExerciseCard exercise={item.data} />
              </AccordionDetails>
            </QuestionAccordion>
          );
        }

        if (item.kind === "trophy") {
          return (
            <QuestionAccordion key={`trophy-${item.data.id}-${resetKey}`} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                    問題{index + 1}.
                  </Typography>
                  <EmojiEventsIcon
                    sx={{
                      color: item.data.isUnlocked ? "#FFD700" : "#999",
                      fontSize: 18,
                    }}
                  />
                  <Typography sx={{ mr: 1 }}>{item.data.title}</Typography>
                  <Chip
                    label="激ムズ"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      backgroundColor: "#B8860B",
                      color: "#fff",
                    }}
                  />
                  {isAchieved && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DojoTrophyCard trophyQuestion={item.data} />
              </AccordionDetails>
            </QuestionAccordion>
          );
        }

        // kind: "question"（通常設問）
        const q = item.data;
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

      {/* 未達成の通常設問だけ再出題 */}
      {unachievedRegularIds.length > 0 &&
        unachievedRegularIds.length <
          items.filter((i) => i.kind === "question").length &&
        onRetryWrong && (
          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={() => onRetryWrong(unachievedRegularIds)}
            >
              未達成の問題だけ再出題（{unachievedRegularIds.length}問）
            </Button>
          </Box>
        )}

      {/* エクスポートダイアログ */}
      <DojoExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        questionIds={regularQuestionIds}
        additionalIds={additionalExerciseIds}
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
