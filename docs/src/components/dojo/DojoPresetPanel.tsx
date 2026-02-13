import React, { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {
  type DojoPreset,
  loadPresets,
  deletePreset,
  renamePreset,
} from "@site/src/lib/dojoPreset";

interface DojoPresetPanelProps {
  onSelect: (preset: DojoPreset) => void;
}

export const DojoPresetPanel: React.FC<DojoPresetPanelProps> = ({
  onSelect,
}) => {
  const [presets, setPresets] = useState<DojoPreset[]>([]);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [deletingPresetId, setDeletingPresetId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");

  const refresh = useCallback(() => setPresets(loadPresets()), []);

  useEffect(() => {
    refresh();
    // 他コンポーネント（DojoFilterPanel）から保存された際にも更新
    const handleStorage = () => refresh();
    window.addEventListener("dojoPresetsChanged", handleStorage);
    return () => window.removeEventListener("dojoPresetsChanged", handleStorage);
  }, [refresh]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingPresetId) return;
    deletePreset(deletingPresetId);
    refresh();
    setDeletingPresetId(null);
    setDeleteDialogOpen(false);
  }, [deletingPresetId, refresh]);

  const handleRenameOpen = useCallback(
    (id: string, currentName: string) => {
      setEditingPresetId(id);
      setPresetName(currentName);
      setRenameDialogOpen(true);
    },
    []
  );

  const handleRename = useCallback(() => {
    const name = presetName.trim();
    if (!name || !editingPresetId) return;
    renamePreset(editingPresetId, name);
    refresh();
    setPresetName("");
    setEditingPresetId(null);
    setRenameDialogOpen(false);
  }, [presetName, editingPresetId, refresh]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <>
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <BookmarkIcon fontSize="small" color="action" />
            <Typography fontWeight={500}>
              保存したプリセットから条件を読み込む
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {presets.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              保存済みのプリセットはありません
            </Typography>
          ) : (
            <List dense disablePadding>
              {presets.map((preset) => (
                <ListItem
                  key={preset.id}
                  disableGutters
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    px: 2,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ListItemText
                    primary={preset.name}
                    secondary={`作成日: ${formatDate(preset.createdAt)}`}
                    sx={{ flex: 1, minWidth: 0 }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onSelect(preset)}
                    sx={{ flexShrink: 0 }}
                  >
                    適用
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleRenameOpen(preset.id, preset.name)
                    }
                    title="名前を変更"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeletingPresetId(preset.id);
                      setDeleteDialogOpen(true);
                    }}
                    title="削除"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      {/* 名前変更ダイアログ */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>プリセット名を変更</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="新しい名前"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleRename}
            variant="contained"
            disabled={!presetName.trim()}
          >
            変更
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>プリセットを削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このプリセットを削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
