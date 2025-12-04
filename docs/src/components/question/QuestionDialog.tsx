import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { QuestionRenderer } from "../QuestionRenderer";

interface QuestionDialogProps {
  questionId: string | null;
  onClose: () => void;
}

export const QuestionDialog: React.FC<QuestionDialogProps> = ({
  questionId,
  onClose,
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
