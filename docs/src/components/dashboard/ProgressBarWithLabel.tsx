import { Box, LinearProgress, Typography } from "@mui/material";
import { FC } from "react";

/**
 * 進捗率に応じたプログレスバー色を返す
 * @param ratio 達成率（0〜1.0）
 * @returns カラーコード（#hex形式）
 */
function getProgressColor(ratio: number): string {
  if (ratio == 1.0) return "#1e88e5"; // 完了時：青
  if (ratio < 0.4) return "#e53935"; // 0〜39%：赤
  if (ratio < 0.8) return "#fb8c00"; // 40〜79%：オレンジ
  return "#43a047"; // 80%以上：緑
}

/**
 * LinearProgressに中央ラベル（％）を重ねたプログレスバー
 * @param value - 進捗率（0〜100）
 */
export const ProgressBarWithLabel: FC<{ value: number }> = ({ value }) => {
  const color = getProgressColor(value / 100);
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* バー本体 */}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#eee",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
          },
        }}
      />
      {/* 中央ラベル（%表示） */}
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          fontWeight: "bold",
          color: value === 100 ? "#fff" : "#333",
          lineHeight: "10px",
          fontSize: "0.75rem",
        }}
      >
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  );
};
