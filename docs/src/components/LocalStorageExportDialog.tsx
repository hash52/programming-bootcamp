import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {
  downloadLocalStorageJson,
  loadLocalStorageExportUserName,
} from "@site/src/lib/localStorageExport";

interface LocalStorageExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LocalStorageExportDialog({
  open,
  onClose,
}: LocalStorageExportDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const trimmedName = name.trim();

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(loadLocalStorageExportUserName());
    setError("");
  }, [open]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!trimmedName) {
      setError("氏名を入力してください");
      return;
    }

    try {
      const fileName = downloadLocalStorageJson(trimmedName);
      setSuccessMessage(`${fileName} をダウンロードしました`);
      handleClose();
    } catch {
      setError("ダウンロードに失敗しました。再度お試しください");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>学習データをJSONで保存</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            保存された情報をJSONで出力します。
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="氏名"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            error={!!error}
            helperText={error || "ファイル名: 氏名_YYYYMMDD_HHmmss.json"}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmedName) {
                handleSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleSubmit}
            disabled={!trimmedName}
          >
            ダウンロード
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={2500}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
