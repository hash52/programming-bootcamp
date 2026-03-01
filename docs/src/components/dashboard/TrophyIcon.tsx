import React from "react";
import { Tooltip, IconButton, Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LockIcon from "@mui/icons-material/Lock";

/**
 * トロフィーアイコンの状態。
 * - "locked"   : 解放条件未達（前のトピックに未完あり）→ グレーの🔒
 * - "unlocked" : 解放済み・未クリア                    → ゴールドのアウトライン🏆
 * - "solved"   : クリア済み                            → 塗りつぶしゴールド🏆
 */
export type TrophyState = "locked" | "unlocked" | "solved";

interface TrophyIconProps {
  /** トロフィーの状態 */
  state: TrophyState;
  /** クリック時のコールバック（任意）。クリック可能な場合はアイコンボタンになる。 */
  onClick?: () => void;
  /** カーソル表示等に使うサイズ（デフォルト: "small"） */
  size?: "small" | "medium";
}

const TROPHY_CONFIG: Record<
  TrophyState,
  { icon: React.ReactNode; tooltip: string; color: string }
> = {
  locked: {
    icon: <LockIcon fontSize="inherit" />,
    tooltip: "前のトピックをすべて 100% 達成すると激ムズ問題が解放されます",
    color: "#9e9e9e",
  },
  unlocked: {
    icon: <EmojiEventsOutlinedIcon fontSize="inherit" />,
    tooltip: "激ムズ問題が解放されました！挑戦してみましょう",
    color: "#DAA520",
  },
  solved: {
    icon: <EmojiEventsIcon fontSize="inherit" />,
    tooltip: "激ムズ問題クリア済み！",
    color: "#FFD700",
  },
};

/**
 * ダッシュボードのトピックヘッダーなどに配置するトロフィーアイコン。
 * 状態（locked / unlocked / solved）に応じてアイコンと色が変わる。
 */
export const TrophyIcon: React.FC<TrophyIconProps> = ({
  state,
  onClick,
  size = "small",
}) => {
  const { icon, tooltip, color } = TROPHY_CONFIG[state];
  const fontSize = size === "small" ? 18 : 24;

  const iconEl = (
    <Box
      component="span"
      sx={{
        fontSize,
        color,
        display: "inline-flex",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.15s ease, opacity 0.15s ease",
        "&:hover": onClick
          ? { transform: "scale(1.2)", opacity: 0.85 }
          : undefined,
      }}
    >
      {icon}
    </Box>
  );

  return (
    <Tooltip title={tooltip} arrow placement="top">
      {onClick ? (
        <IconButton
          size="small"
          onClick={onClick}
          sx={{ p: 0.25, color }}
        >
          {icon}
        </IconButton>
      ) : (
        iconEl
      )}
    </Tooltip>
  );
};
