import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Difficulty } from "@site/src/structure";
import { type AdditionalExercise } from "@site/src/additionalExercises";
import {
  useAdditionalExerciseProgress,
} from "@site/src/hooks/useAdditionalExerciseProgress";
import { daysAgo } from "@site/src/components/lib/date";

// @ts-expect-error: Webpackのrequire.contextをTypeScriptが認識しない
const additionalContext = require.context(
  "../../questions/additional",
  true,
  /\.mdx$/
);

// @ts-expect-error: Webpackのrequire.contextをTypeScriptが認識しない
const trophyContext = require.context(
  "../../questions/trophy",
  true,
  /\.mdx$/
);

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

interface DojoAdditionalExerciseCardProps {
  exercise: AdditionalExercise;
}

/**
 * 追加演習カードコンポーネント。
 * MDX ファイルを動的にロードして問題文・模範解答を表示し、
 * 「✓ 解いた！」ボタンで LocalStorage に完了状態を保存する。
 */
export const DojoAdditionalExerciseCard: React.FC<DojoAdditionalExerciseCardProps> =
  ({ exercise }) => {
    const { additionalProgress, markAdditionalSolved } =
      useAdditionalExerciseProgress();

    const prog = additionalProgress[exercise.id];
    const isSolved = !!prog?.lastSolvedAt;

    const lastSolvedText = React.useMemo(() => {
      if (!prog?.lastSolvedAt) return null;
      const diff = daysAgo(new Date(), new Date(prog.lastSolvedAt));
      if (diff === 0) return "今日";
      if (diff === 1) return "昨日";
      return `${diff}日前`;
    }, [prog?.lastSolvedAt]);

    // MDXロード
    const [dirPath, fileNamePart] = exercise.id.replace(/^additional\//, "").split("#");
    const filePath = `./${dirPath}/${fileNamePart}.mdx`;
    const Module = additionalContext.keys().includes(filePath)
      ? additionalContext(filePath)
      : null;

    return (
      <CardBox>
        {/* ヘッダー */}
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1.5}>
          <AdditionalBadge label="追加演習" size="small" />
          <Chip
            label={DIFFICULTY_LABELS[exercise.difficulty]}
            size="small"
            color={DIFFICULTY_COLORS[exercise.difficulty]}
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          {isSolved && (
            <CheckCircleIcon color="success" fontSize="small" />
          )}
        </Box>

        {/* MDX コンテンツ */}
        <Box sx={{ "& h2": { fontSize: "1rem", fontWeight: "bold", mt: 1, mb: 0.5 } }}>
          {Module ? (
            <Module.default />
          ) : (
            <Typography color="error" variant="body2">
              問題ファイルが見つかりません: {exercise.id}
            </Typography>
          )}
        </Box>

        {/* フッター：達成ボタン + 最終解答日 */}
        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <Button
            variant={isSolved ? "outlined" : "contained"}
            color="success"
            size="small"
            startIcon={
              isSolved ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />
            }
            onClick={() => markAdditionalSolved(exercise.id)}
          >
            {isSolved ? "解いた！（もう一度マーク）" : "✓ 解いた！"}
          </Button>
          {lastSolvedText && (
            <Typography variant="caption" color="text.secondary">
              最終解答：{lastSolvedText}
            </Typography>
          )}
        </Box>
      </CardBox>
    );
  };

// ─── Trophy 用カード ───────────────────────────────────────────────────────

interface DojoTrophyCardProps {
  trophyQuestion: {
    id: string;
    title: string;
    topicId: string;
    category: string;
    isUnlocked: boolean;
  };
}

/**
 * 激ムズ問題（トロフィー）カードコンポーネント。
 * 解放条件未達の場合は locked 表示。
 */
export const DojoTrophyCard: React.FC<DojoTrophyCardProps> = ({
  trophyQuestion,
}) => {
  const { trophyProgress, markTrophySolved } = useAdditionalExerciseProgress();

  const prog = trophyProgress[trophyQuestion.id];
  const isSolved = !!prog?.solvedAt;

  const solvedText = React.useMemo(() => {
    if (!prog?.solvedAt) return null;
    const diff = daysAgo(new Date(), new Date(prog.solvedAt));
    if (diff === 0) return "今日";
    if (diff === 1) return "昨日";
    return `${diff}日前`;
  }, [prog?.solvedAt]);

  // MDXロード
  const [dirPath, fileNamePart] = trophyQuestion.id
    .replace(/^trophy\//, "")
    .split("#");
  const filePath = `./${dirPath}/${fileNamePart}.mdx`;
  const Module = trophyContext.keys().includes(filePath)
    ? trophyContext(filePath)
    : null;

  if (!trophyQuestion.isUnlocked) {
    return (
      <LockedCardBox>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <TrophyBadge label="激ムズ" size="small" />
          <Typography variant="body2" color="text.disabled">
            {trophyQuestion.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.disabled">
          🔒 このトロフィー問題は、前のトピックをすべて 100% 達成すると解放されます。
        </Typography>
      </LockedCardBox>
    );
  }

  return (
    <TrophyCardBox>
      {/* ヘッダー */}
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1.5}>
        <TrophyBadge label="激ムズ" size="small" />
        <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 20 }} />
        {isSolved && (
          <CheckCircleIcon color="success" fontSize="small" />
        )}
      </Box>

      {/* MDX コンテンツ */}
      <Box sx={{ "& h2": { fontSize: "1rem", fontWeight: "bold", mt: 1, mb: 0.5 } }}>
        {Module ? (
          <Module.default />
        ) : (
          <Typography color="error" variant="body2">
            問題ファイルが見つかりません: {trophyQuestion.id}
          </Typography>
        )}
      </Box>

      {/* フッター */}
      <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
        <Button
          variant={isSolved ? "outlined" : "contained"}
          size="small"
          startIcon={
            isSolved ? <CheckCircleIcon /> : <EmojiEventsIcon />
          }
          sx={{
            color: isSolved ? undefined : "#fff",
            backgroundColor: isSolved ? undefined : "#B8860B",
            "&:hover": { backgroundColor: isSolved ? undefined : "#DAA520" },
          }}
          onClick={() => markTrophySolved(trophyQuestion.id)}
        >
          {isSolved ? "クリア済み（再マーク）" : "🏆 クリア！"}
        </Button>
        {solvedText && (
          <Typography variant="caption" color="text.secondary">
            クリア日：{solvedText}
          </Typography>
        )}
      </Box>
    </TrophyCardBox>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────

const CardBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(33,150,243,0.06)"
      : "rgba(33,150,243,0.04)",
}));

const TrophyCardBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `2px solid #DAA520`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(218,165,32,0.08)"
      : "rgba(255,215,0,0.06)",
}));

const LockedCardBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  opacity: 0.6,
}));

const AdditionalBadge = styled(Chip)({
  backgroundColor: "#1565C0",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "0.65rem",
  height: 20,
});

const TrophyBadge = styled(Chip)({
  backgroundColor: "#B8860B",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "0.65rem",
  height: 20,
});
