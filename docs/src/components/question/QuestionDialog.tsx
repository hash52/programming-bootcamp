import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { QuestionRenderer } from "../QuestionRenderer";

interface QuestionDialogProps {
  questionId: string | null;
  onClose: () => void;
  // ナビゲーション機能
  showNavigation?: boolean;      // ナビゲーションボタンを表示するか（デフォルト: false）
  onPrevious?: () => void;       // 前の問題に移動
  onNext?: () => void;           // 次の問題に移動
  hasPrevious?: boolean;         // 前の問題が存在するか
  hasNext?: boolean;             // 次の問題が存在するか
}

export const QuestionDialog: React.FC<QuestionDialogProps> = ({
  questionId,
  onClose,
  showNavigation = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  if (!questionId) return null;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* 左ナビゲーションボタン（前へ） */}
      {showNavigation && (
        <IconButton
          aria-label="previous"
          onClick={onPrevious}
          disabled={!hasPrevious}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {/* 右ナビゲーションボタン（次へ） */}
      {showNavigation && (
        <IconButton
          aria-label="next"
          onClick={onNext}
          disabled={!hasNext}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}

      <DialogContent dividers>
        <QuestionRenderer
          id={questionId}
          mode="dialog"
          showTitle={true}
          showHintLink={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
