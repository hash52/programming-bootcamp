import React, { useMemo, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import {
  buildPresetFromState,
  savePreset,
} from "@site/src/lib/dojoPreset";
import {
  ALL_TOPIC_STRUCTURE,
  Difficulty,
  MAJOR_CHAPTER_LABELS,
  getMajorChapterFromCategory,
  type QuestionType,
  type MajorChapter,
} from "@site/src/structure";
import {
  type AchievementFilter,
  type DaysAgoFilter,
  type OrderMode,
  countFilteredQuestions,
} from "@site/src/lib/dojoFilter";
import { type ProgressRecord } from "@site/src/hooks/useStoredProgress";
import type { AdditionalExerciseProgressRecord } from "@site/src/hooks/useAdditionalExerciseProgress";

interface DojoFilterPanelProps {
  /** 選択中の問題ID */
  checkedQuestionIds: Set<string>;
  /** ツリー選択ダイアログを開く */
  onOpenSelector: () => void;
  /** 問題タイプ */
  selectedTypes: Set<QuestionType>;
  onTypesChange: (types: Set<QuestionType>) => void;
  /** 難易度 */
  selectedDifficulties: Set<Difficulty>;
  onDifficultiesChange: (diffs: Set<Difficulty>) => void;
  /** 達成状態 */
  achievementFilter: AchievementFilter;
  onAchievementFilterChange: (f: AchievementFilter) => void;
  /** 最終チェック日 */
  daysAgoFilter: DaysAgoFilter;
  onDaysAgoFilterChange: (f: DaysAgoFilter) => void;
  /** 出題順 */
  orderMode: OrderMode;
  onOrderModeChange: (m: OrderMode) => void;
  /** 出題数 */
  questionLimit: number | null;
  onQuestionLimitChange: (limit: number | null) => void;
  /** 全問出題フラグ */
  allQuestions: boolean;
  onAllQuestionsChange: (val: boolean) => void;
  /** 進捗データ */
  progress: ProgressRecord;
  /** 演習開始 */
  onStart: () => void;
  // ── 追加演習フィルター ─────────────────────────────────────
  /** 選択された追加演習IDのセット */
  selectedAdditionalIds: Set<string>;
  /** 追加演習選択ダイアログを開く */
  onOpenAdditionalSelector: () => void;
  /** 追加演習の進捗データ */
  additionalProgress: AdditionalExerciseProgressRecord;
  /** 激ムズ問題（トロフィー）を含める */
  includeTrophy: boolean;
  onIncludeTrophyChange: (val: boolean) => void;
  /** トロフィー問題の解放済み数 */
  unlockedTrophyCount: number;
  /** トロフィー問題の全体数 */
  totalTrophyCount: number;
}

const ALL_TYPES: QuestionType[] = ["KNOW", "READ", "WRITE"];
const ALL_DIFFICULTIES: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
};

export const DojoFilterPanel: React.FC<DojoFilterPanelProps> = ({
  checkedQuestionIds,
  onOpenSelector,
  selectedTypes,
  onTypesChange,
  selectedDifficulties,
  onDifficultiesChange,
  achievementFilter,
  onAchievementFilterChange,
  daysAgoFilter,
  onDaysAgoFilterChange,
  orderMode,
  onOrderModeChange,
  questionLimit,
  onQuestionLimitChange,
  allQuestions,
  onAllQuestionsChange,
  progress,
  onStart,
  selectedAdditionalIds,
  onOpenAdditionalSelector,
  additionalProgress,
  includeTrophy,
  onIncludeTrophyChange,
  unlockedTrophyCount,
  totalTrophyCount,
}) => {
  // プリセット保存
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savePresetName, setSavePresetName] = useState("");

  const handleSavePreset = useCallback(() => {
    const name = savePresetName.trim();
    if (!name) return;
    const preset = buildPresetFromState(name, {
      checkedQuestionIds,
      selectedTypes,
      selectedDifficulties,
      achievementFilter,
      daysAgoFilter,
      orderMode,
      questionLimit,
      allQuestions,
      selectedAdditionalIds,
      includeTrophy,
    });
    savePreset(preset);
    setSavePresetName("");
    setSaveDialogOpen(false);
    // DojoPresetPanel に変更を通知
    window.dispatchEvent(new Event("dojoPresetsChanged"));
  }, [
    savePresetName,
    checkedQuestionIds,
    selectedTypes,
    selectedDifficulties,
    achievementFilter,
    daysAgoFilter,
    orderMode,
    questionLimit,
    allQuestions,
    selectedAdditionalIds,
    includeTrophy,
  ]);

  /** 選択中の出題範囲を大章ごとに集計 */
  const rangeSummary = useMemo(() => {
    const counts = new Map<MajorChapter, number>();
    ALL_TOPIC_STRUCTURE.forEach((t) => {
      const major = getMajorChapterFromCategory(t.category);
      t.questions.forEach((q) => {
        if (checkedQuestionIds.has(q.id)) {
          counts.set(major, (counts.get(major) || 0) + 1);
        }
      });
    });
    return counts;
  }, [checkedQuestionIds]);

  /** フィルタ適用後の問題数 */
  const filteredCount = useMemo(
    () =>
      countFilteredQuestions({
        selectedQuestionIds: checkedQuestionIds,
        selectedTypes,
        selectedDifficulties,
        achievementFilter,
        daysAgoFilter,
        progress,
      }),
    [
      checkedQuestionIds,
      selectedTypes,
      selectedDifficulties,
      achievementFilter,
      daysAgoFilter,
      progress,
    ]
  );

  // filteredCountが変化したらquestionLimitをクランプ
  const effectiveLimit = useMemo(() => {
    if (allQuestions || questionLimit === null) return filteredCount;
    return Math.min(questionLimit, filteredCount);
  }, [allQuestions, questionLimit, filteredCount]);

  const isSliderDisabled = allQuestions || filteredCount === 0;

  /** 選択中の追加演習のうち達成済みの数 */
  const achievedCount = useMemo(
    () =>
      [...selectedAdditionalIds].filter(
        (id) => !!additionalProgress[id]?.lastSolvedAt
      ).length,
    [selectedAdditionalIds, additionalProgress]
  );

  const toggleType = (type: QuestionType) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    onTypesChange(next);
  };

  const toggleDifficulty = (diff: Difficulty) => {
    const next = new Set(selectedDifficulties);
    if (next.has(diff)) next.delete(diff);
    else next.add(diff);
    onDifficultiesChange(next);
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          出題条件を設定
        </Typography>

        {/* 出題範囲 */}
        <SectionLabel>出題範囲</SectionLabel>
        <Box mb={2}>
          <Button variant="outlined" onClick={onOpenSelector}>
            出題範囲を選択する
          </Button>
          {rangeSummary.size > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
              {Array.from(rangeSummary.entries()).map(([major, count]) => (
                <Chip
                  key={major}
                  label={`${MAJOR_CHAPTER_LABELS[major]}(${count}問)`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 問題タイプ */}
        <SectionLabel>問題タイプ</SectionLabel>
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
          {ALL_TYPES.map((type) => {
            const isSelected = selectedTypes.has(type);
            return (
              <FilterChip
                key={type}
                icon={isSelected ? <CheckIcon fontSize="small" /> : undefined}
                label={type}
                onClick={() => toggleType(type)}
                variant={isSelected ? "filled" : "outlined"}
                color={isSelected ? "primary" : "default"}
                sx={!isSelected ? { opacity: 0.5 } : undefined}
              />
            );
          })}
        </Box>

        {/* 難易度 */}
        <SectionLabel>難易度</SectionLabel>
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
          {ALL_DIFFICULTIES.map((diff) => {
            const isSelected = selectedDifficulties.has(diff);
            return (
              <FilterChip
                key={diff}
                icon={isSelected ? <CheckIcon fontSize="small" /> : undefined}
                label={DIFFICULTY_LABELS[diff]}
                onClick={() => toggleDifficulty(diff)}
                variant={isSelected ? "filled" : "outlined"}
                color={isSelected ? "primary" : "default"}
                sx={!isSelected ? { opacity: 0.5 } : undefined}
              />
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 進捗フィルター */}
        <SectionLabel>進捗フィルター</SectionLabel>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            達成状態
          </Typography>
          <ToggleButtonGroup
            value={achievementFilter}
            exclusive
            onChange={(_, val) => {
              if (val !== null) {
                onAchievementFilterChange(val as AchievementFilter);
                // 未達成のみ選択時は最終チェック日をリセット
                if (val === "unachieved") {
                  onDaysAgoFilterChange("all");
                }
              }
            }}
            size="small"
          >
            <ToggleButton value="all">すべて</ToggleButton>
            <ToggleButton value="unachieved">未達成のみ</ToggleButton>
            <ToggleButton value="achieved">達成済みのみ</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Collapse in={achievementFilter !== "unachieved"}>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              最終チェック日
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={daysAgoFilter}
                onChange={(e) =>
                  onDaysAgoFilterChange(e.target.value as DaysAgoFilter)
                }
              >
                <MenuItem value="all">すべて</MenuItem>
                <MenuItem value="3">3日以上前</MenuItem>
                <MenuItem value="7">7日以上前</MenuItem>
                <MenuItem value="14">14日以上前</MenuItem>
                <MenuItem value="30">30日以上前</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        {/* 出題設定 */}
        <SectionLabel>出題設定</SectionLabel>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            出題順
          </Typography>
          <ToggleButtonGroup
            value={orderMode}
            exclusive
            onChange={(_, val) => {
              if (val !== null) onOrderModeChange(val as OrderMode);
            }}
            size="small"
          >
            <ToggleButton value="sequential">章の順番</ToggleButton>
            <ToggleButton value="random">ランダム</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            出題数
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={allQuestions}
                onChange={(e) => onAllQuestionsChange(e.target.checked)}
              />
            }
            label="全問出題"
          />
          <Collapse in={!allQuestions}>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <Slider
                value={effectiveLimit}
                onChange={(_, val) =>
                  onQuestionLimitChange(val as number)
                }
                min={filteredCount > 0 ? 1 : 0}
                max={Math.max(filteredCount, 1)}
                sx={{ flex: 1, maxWidth: 300 }}
                disabled={isSliderDisabled}
              />
              <TextField
                type="number"
                size="small"
                value={effectiveLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) {
                    onQuestionLimitChange(
                      Math.min(val, filteredCount)
                    );
                  }
                }}
                slotProps={{
                  htmlInput: { min: 1, max: filteredCount },
                }}
                sx={{ width: 80 }}
                disabled={isSliderDisabled}
              />
              <Typography variant="body2" color="text.secondary">
                / {filteredCount}問
              </Typography>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 追加演習 */}
        <SectionLabel>追加演習</SectionLabel>
        <Box mb={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={onOpenAdditionalSelector}
          >
            追加演習を選択する
          </Button>
          {selectedAdditionalIds.size > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
              <Chip
                label={`${selectedAdditionalIds.size}問選択中`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {achievedCount > 0 && (
                <Chip
                  label={`うち${achievedCount}問達成済み`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>
        <Box mb={2}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeTrophy}
                  onChange={(e) => onIncludeTrophyChange(e.target.checked)}
                />
              }
              label={
                <Box component="span" display="flex" alignItems="center" gap={0.5}>
                  激ムズ問題（トロフィー）を含める
                  {totalTrophyCount > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      （解放済み: {unlockedTrophyCount}/{totalTrophyCount}）
                    </Typography>
                  )}
                </Box>
              }
            />
            {includeTrophy && unlockedTrophyCount < totalTrophyCount && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                ※ 解放条件未達の問題は locked 表示になります
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* サマリー */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            フィルタ適用後:{" "}
            <Typography component="span" fontWeight="bold" color="primary">
              {filteredCount}問
            </Typography>
          </Typography>
        </Box>

        {/* プリセット保存 */}
        <Box mb={2}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => {
              setSavePresetName("");
              setSaveDialogOpen(true);
            }}
            size="small"
          >
            現在の条件をプリセットとして保存
          </Button>
        </Box>

        {/* 開始ボタン */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onStart}
          disabled={
            filteredCount === 0 &&
            selectedAdditionalIds.size === 0 &&
            !includeTrophy
          }
          sx={{ py: 1.5, fontSize: "1.1rem" }}
        >
          演習を開始する
        </Button>
      </CardContent>

      {/* プリセット保存ダイアログ */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>プリセットを保存</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="プリセット名"
            placeholder="例: 苦手なJava問題"
            value={savePresetName}
            onChange={(e) => setSavePresetName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={handleSavePreset}
            variant="contained"
            disabled={!savePresetName.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const SectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "0.95rem",
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const FilterChip = styled(Chip)({
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontWeight: 500,
});
