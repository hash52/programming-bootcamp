import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { encodeShareData } from "@site/src/lib/dojoShare";

interface DojoExportDialogProps {
  open: boolean;
  onClose: () => void;
  questionIds: string[];
}

export const DojoExportDialog: React.FC<DojoExportDialogProps> = ({
  open,
  onClose,
  questionIds,
}) => {
  const [copied, setCopied] = useState(false);
  const jsonText = encodeShareData(questionIds);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
    } catch {
      // フォールバック
      const textarea = document.createElement("textarea");
      textarea.value = jsonText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>この問題セットを共有</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={1}>
            以下のJSON文字列を共有してください（{questionIds.length}問）
          </Typography>
          <TextField
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            value={jsonText}
            slotProps={{
              input: { readOnly: true },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>閉じる</Button>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            コピー
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          コピーしました
        </Alert>
      </Snackbar>
    </>
  );
};
