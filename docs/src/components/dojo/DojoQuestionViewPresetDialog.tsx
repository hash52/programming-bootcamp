import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface DojoQuestionViewPresetDialogProps {
  /** ダイアログの開閉状態 */
  open: boolean;
  /** ダイアログをクローズするコールバック */
  onClose: () => void;
  /**
   * 保存時のコールバック
   * @param name プリセット名
   * @param excludeAchieved 達成済み除外フラグ
   */
  onSave: (name: string, excludeAchieved: boolean) => void;
}

export const DojoQuestionViewPresetDialog: React.FC<
  DojoQuestionViewPresetDialogProps
> = ({ open, onClose, onSave }) => {
  const [presetName, setPresetName] = useState("");
  const [excludeAchieved, setExcludeAchieved] = useState(false);

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim(), excludeAchieved);
      setPresetName("");
      setExcludeAchieved(false);
    }
  };

  const handleClose = () => {
    setPresetName("");
    setExcludeAchieved(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && presetName.trim()) {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>プリセットとして保存</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* プリセット名入力 */}
          <TextField
            autoFocus
            fullWidth
            label="プリセット名"
            placeholder="例: Java基本+演習"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
          />

          {/* 保存モード選択 */}
          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              保存モード
            </Typography>
            <RadioGroup
              value={excludeAchieved ? "exclude" : "normal"}
              onChange={(e) => setExcludeAchieved(e.target.value === "exclude")}
            >
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      通常保存
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      現在の全てのフィルタ条件と問題を保存します
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="exclude"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      達成済み除外で保存
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      達成済みの問題を除外した状態で保存します
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!presetName.trim()}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};
