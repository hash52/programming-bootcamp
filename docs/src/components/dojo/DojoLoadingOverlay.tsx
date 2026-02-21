import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SettingsIcon from "@mui/icons-material/Settings";

interface DojoLoadingOverlayProps {
  questionCount: number;
  /**
   * true になると完了アニメーションを開始する。
   * MIN_DISPLAY_MS 未満であれば残り時間まで待ってから完了する。
   */
  triggerComplete: boolean;
  onComplete: () => void;
}

// フェーズラベルは純粋に装飾（実際の処理進捗とは無関係）
const PHASES = [
  "問題セットを照合中",
  "最適な出題順を決定中",
  "問題データを読み込み中",
] as const;

/** フェーズラベルが切り替わる間隔（装飾用） */
const PHASE_INTERVAL_MS = 600;
/** triggerComplete が来ても最低これだけは表示する */
const MIN_DISPLAY_MS = 800;

export const DojoLoadingOverlay: React.FC<DojoLoadingOverlayProps> = ({
  questionCount,
  triggerComplete,
  onComplete,
}) => {
  // プログレスバーの値（実態とは無関係）
  const [progress, setProgress] = useState(0);
  // 完了アニメーション時は高速トランジションに切り替える
  const [barTransitionMs, setBarTransitionMs] = useState(1500);

  // フェーズラベルのインデックス（装飾用）
  const [currentPhase, setCurrentPhase] = useState(0);
  // 全フェーズ完了フラグ（すべて ✓ にするタイミング）
  const [allDone, setAllDone] = useState(false);

  const startTimeRef = useRef(Date.now());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // マウント直後: 0% → 85% を ease-out 1.5s でアニメーション
  // （50ms 遅延で CSS transition が確実に発火するようにする）
  useEffect(() => {
    const t = setTimeout(() => setProgress(85), 50);
    return () => clearTimeout(t);
  }, []);

  // フェーズラベルを装飾的に進める（最終フェーズで止まる）
  useEffect(() => {
    if (currentPhase >= PHASES.length - 1) return;
    const t = setTimeout(() => setCurrentPhase((p) => p + 1), PHASE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // 完了シグナル: 85% → 100% を 0.4s で完了し、全フェーズ ✓ にしてから遷移
  useEffect(() => {
    if (!triggerComplete) return;
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    const t = setTimeout(() => {
      setBarTransitionMs(400);
      setProgress(100);
      setAllDone(true);
      setTimeout(() => onCompleteRef.current(), 500);
    }, remaining);
    return () => clearTimeout(t);
  }, [triggerComplete]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Paper
        elevation={8}
        sx={{ width: 480, maxWidth: "90vw", borderRadius: 3, p: 4 }}
      >
        {/* ヘッダー */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <SettingsIcon
            sx={{
              fontSize: 28,
              color: "primary.main",
              animation: "spin 1.5s linear infinite",
              "@keyframes spin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            演習問題を生成中...
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {questionCount}問
        </Typography>

        {/* プログレスバー（実態とは無関係にアニメーション） */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 3,
            height: 8,
            borderRadius: 4,
            "& .MuiLinearProgress-bar": {
              transition: `transform ${barTransitionMs}ms cubic-bezier(0.0, 0.0, 0.2, 1.0)`,
            },
          }}
        />

        {/* フェーズラベル（装飾） */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {PHASES.map((label, index) => {
            const isDone = allDone || index < currentPhase;
            const isActive = !allDone && index === currentPhase;
            const isPending = !allDone && index > currentPhase;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  opacity: isPending ? 0.4 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {isDone && (
                  <CheckCircleIcon
                    sx={{ fontSize: 20, color: "success.main", flexShrink: 0 }}
                  />
                )}
                {isActive && (
                  <CircularProgress size={20} thickness={5} sx={{ flexShrink: 0 }} />
                )}
                {isPending && (
                  <RadioButtonUncheckedIcon
                    sx={{ fontSize: 20, color: "text.disabled", flexShrink: 0 }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={isActive ? "bold" : "normal"}
                  color={isActive ? "text.primary" : "text.secondary"}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};
