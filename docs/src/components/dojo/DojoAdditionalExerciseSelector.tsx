import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  ALL_ADDITIONAL_EXERCISES,
  type AdditionalCategory,
} from "@site/src/additionalExercises";
import { Difficulty } from "@site/src/structure";
import type { AdditionalExerciseProgressRecord } from "@site/src/hooks/useAdditionalExerciseProgress";

interface DojoAdditionalExerciseSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedAdditionalIds: Set<string>;
  onConfirm: (ids: Set<string>) => void;
  additionalProgress: AdditionalExerciseProgressRecord;
}

const CATEGORY_LABELS: Record<AdditionalCategory, string> = {
  java: "Java 追加演習",
  sql: "SQL 追加演習",
  comprehensive: "総合演習",
};

const CATEGORY_ORDER: AdditionalCategory[] = ["java", "sql", "comprehensive"];

const DIFFICULTY_COLOR: Record<Difficulty, "success" | "warning" | "error"> = {
  [Difficulty.Easy]: "success",
  [Difficulty.Medium]: "warning",
  [Difficulty.Hard]: "error",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
};

export const DojoAdditionalExerciseSelector: React.FC<
  DojoAdditionalExerciseSelectorProps
> = ({ open, onClose, selectedAdditionalIds, onConfirm, additionalProgress }) => {
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());

  // ダイアログが開いたとき外部状態を同期
  useEffect(() => {
    if (open) {
      setLocalSelected(new Set(selectedAdditionalIds));
    }
  }, [open, selectedAdditionalIds]);

  const toggleId = useCallback((id: string) => {
    setLocalSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleIds = useCallback((ids: string[]) => {
    setLocalSelected((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setLocalSelected(new Set(ALL_ADDITIONAL_EXERCISES.map((ex) => ex.id)));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setLocalSelected(new Set());
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(localSelected);
    onClose();
  }, [onConfirm, onClose, localSelected]);

  /** カテゴリ別の演習一覧 */
  const exercisesByCategory = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      exercises: ALL_ADDITIONAL_EXERCISES.filter((ex) => ex.category === cat),
    }));
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="span">
            追加演習を選択
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Button size="small" onClick={handleSelectAll}>
              全選択
            </Button>
            <Button size="small" onClick={handleDeselectAll}>
              全解除
            </Button>
            <Typography variant="body2" color="text.secondary">
              {localSelected.size}問選択中
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2 }}>
        {exercisesByCategory.map(({ category, exercises }, catIdx) => {
          const categoryIds = exercises.map((ex) => ex.id);
          const allCatSelected =
            categoryIds.length > 0 &&
            categoryIds.every((id) => localSelected.has(id));
          const someCatSelected = categoryIds.some((id) =>
            localSelected.has(id)
          );

          return (
            <Box key={category} mb={catIdx < exercisesByCategory.length - 1 ? 2 : 0}>
              {/* カテゴリヘッダー */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py={0.5}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {CATEGORY_LABELS[category]}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    ml={0.5}
                  >
                    （{exercises.length}問）
                  </Typography>
                </Typography>
                {exercises.length > 0 && (
                  <Box display="flex" gap={0.5}>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => toggleIds(categoryIds)}
                    >
                      {allCatSelected ? "全解除" : "全選択"}
                    </Button>
                  </Box>
                )}
              </Box>
              <Divider />

              {exercises.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  py={1}
                  pl={1}
                >
                  （問題なし）
                </Typography>
              ) : (
                exercises.map((ex) => {
                  const achieved =
                    !!additionalProgress[ex.id]?.lastSolvedAt;
                  return (
                    <Box
                      key={ex.id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={0.5}
                      pl={1}
                    >
                      <Checkbox
                        checked={localSelected.has(ex.id)}
                        onChange={() => toggleId(ex.id)}
                        size="small"
                        sx={{ p: 0.5 }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {ex.title}
                      </Typography>
                      <Chip
                        label={DIFFICULTY_LABELS[ex.difficulty]}
                        size="small"
                        color={DIFFICULTY_COLOR[ex.difficulty]}
                        variant="outlined"
                      />
                      {achieved && (
                        <CheckCircleIcon
                          color="success"
                          fontSize="small"
                          titleAccess="達成済み"
                        />
                      )}
                      {ex.prerequisiteTopicId && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          (前提: {ex.prerequisiteTopicId})
                        </Typography>
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={localSelected.size === 0}
        >
          この条件で決定（{localSelected.size}問）
        </Button>
      </DialogActions>
    </Dialog>
  );
};
