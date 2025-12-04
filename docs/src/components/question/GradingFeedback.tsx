import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";

interface GradingFeedbackProps {
  isCorrect: boolean;
}

const FeedbackBox = styled(Box)<{ isCorrect: boolean }>(
  ({ theme, isCorrect }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${isCorrect ? theme.palette.success.main : theme.palette.error.main}`,
    backgroundColor: isCorrect
      ? "rgba(46, 125, 50, 0.08)"  // 非常に薄い緑
      : "rgba(211, 47, 47, 0.08)",  // 非常に薄い赤
    color: theme.palette.text.primary,
  })
);

export const GradingFeedback: React.FC<GradingFeedbackProps> = ({
  isCorrect,
}) => {
  return (
    <FeedbackBox isCorrect={isCorrect}>
      {isCorrect ? (
        <>
          <CheckCircleIcon color="success" />
          <Typography variant="body1" fontWeight="bold">
            正解です！
          </Typography>
        </>
      ) : (
        <>
          <CancelIcon color="error" />
          <Typography variant="body1" fontWeight="bold">
            不正解です。もう一度確認してください。
          </Typography>
        </>
      )}
    </FeedbackBox>
  );
};
