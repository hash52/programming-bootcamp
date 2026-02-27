import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: React.ReactNode;
  questionId: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 問題の描画エラーを捕捉し、エラーがあった問題だけに
 * エラーメッセージを表示するError Boundary
 */
export class QuestionErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[QuestionErrorBoundary] 問題 ${this.props.questionId} の描画に失敗しました:`,
      error,
      info
    );
  }

  render() {
    if (this.state.hasError) {
      return <QuestionErrorFallback questionId={this.props.questionId} />;
    }
    return this.props.children;
  }
}

export const QuestionErrorFallback: React.FC<{ questionId: string }> = ({
  questionId,
}) => (
  <Box
    p={2}
    display="flex"
    alignItems="flex-start"
    gap={1}
    sx={{ color: "error.main" }}
  >
    <ErrorOutlineIcon fontSize="small" sx={{ mt: 0.3, flexShrink: 0 }} />
    <Box>
      <Typography variant="body2" fontWeight="bold">
        この問題の表示中にエラーが発生しました
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        問題ID: {questionId}
      </Typography>
    </Box>
  </Box>
);
