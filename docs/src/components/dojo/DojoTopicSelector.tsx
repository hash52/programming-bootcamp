import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  Chip,
  Divider,
  styled,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  ALL_TOPIC_STRUCTURE,
  ALL_MAJOR_CHAPTERS,
  MAJOR_CHAPTER_LABELS,
  CATEGORY_SHORT_LABELS,
  getMajorChapterFromCategory,
  type MajorChapter,
  type Category,
} from "@site/src/structure";
import {
  ALL_EXTRA_THEMES,
  getAllExtraExerciseIds,
  getExtraQuestionIdsForGroup,
  getExtraQuestionIdsForTheme,
  buildExtraId,
} from "@site/src/extraExercises";
import type { ProgressRecord } from "@site/src/hooks/useStoredProgress";

/** 達成日からの経過日数 */
function getDaysAgo(isoString: string): number {
  return Math.floor(
    (Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24)
  );
}

/** 復習が必要とみなす日数閾値 */
const REVIEW_THRESHOLD_DAYS = 7;

interface DojoTopicSelectorProps {
  open: boolean;
  onClose: () => void;
  checkedQuestionIds: Set<string>;
  onConfirm: (ids: Set<string>) => void;
  progress: ProgressRecord;
}

/** 大章の下にある中章一覧を取得 */
function getCategoriesForMajor(major: MajorChapter): Category[] {
  return Array.from(
    new Set(
      ALL_TOPIC_STRUCTURE
        .filter((t) => getMajorChapterFromCategory(t.category) === major)
        .map((t) => t.category)
    )
  );
}

/** カテゴリ配下の全問題IDを取得 */
function getQuestionIdsForCategory(cat: Category): string[] {
  return ALL_TOPIC_STRUCTURE
    .filter((t) => t.category === cat)
    .flatMap((t) => t.questions.map((q) => q.id));
}

/** 大章配下の全問題IDを取得 */
function getQuestionIdsForMajor(major: MajorChapter): string[] {
  return getCategoriesForMajor(major).flatMap(getQuestionIdsForCategory);
}

/** トピック配下の全問題IDを取得 */
function getQuestionIdsForTopic(topicId: string, category: Category): string[] {
  const topic = ALL_TOPIC_STRUCTURE.find(
    (t) => t.id === topicId && t.category === category
  );
  return topic ? topic.questions.map((q) => q.id) : [];
}

/** 全問題数（通常問題 + 追加演習） */
const TOTAL_QUESTION_COUNT =
  ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions).length +
  getAllExtraExerciseIds().length;

/** チェック状態の計算 */
function getCheckState(
  ids: string[],
  checkedIds: Set<string>
): "checked" | "unchecked" | "indeterminate" {
  if (ids.length === 0) return "unchecked";
  const checkedCount = ids.filter((id) => checkedIds.has(id)).length;
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === ids.length) return "checked";
  return "indeterminate";
}

export const DojoTopicSelector: React.FC<DojoTopicSelectorProps> = ({
  open,
  onClose,
  checkedQuestionIds,
  onConfirm,
  progress,
}) => {
  // ローカル状態（確定前の編集用）
  const [localChecked, setLocalChecked] = useState<Set<string>>(
    new Set(checkedQuestionIds)
  );

  // ダイアログが開いたときに外部の状態を反映
  React.useEffect(() => {
    if (open) {
      setLocalChecked(new Set(checkedQuestionIds));
    }
  }, [open, checkedQuestionIds]);

  // 展開状態
  const [expandedMajors, setExpandedMajors] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Set<string>>>,
      key: string
    ) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    []
  );

  /** IDs群のチェック状態をトグル */
  const toggleIds = useCallback((ids: string[]) => {
    setLocalChecked((prev) => {
      const next = new Set(prev);
      const allChecked = ids.every((id) => next.has(id));
      if (allChecked) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  /** 全選択 */
  const handleSelectAll = useCallback(() => {
    const allIds = [
      ...ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions.map((q) => q.id)),
      ...getAllExtraExerciseIds(),
    ];
    setLocalChecked(new Set(allIds));
  }, []);

  /** 全解除 */
  const handleDeselectAll = useCallback(() => {
    setLocalChecked(new Set());
  }, []);

  /** 追加演習の「要復習」問題（REVIEW_THRESHOLD_DAYS日以上前に達成）を一括選択 */
  const handleSelectReview = useCallback(() => {
    const reviewIds = getAllExtraExerciseIds().filter((id) => {
      const entry = progress[id];
      return entry && getDaysAgo(entry.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
    });
    if (reviewIds.length === 0) return;
    setLocalChecked((prev) => {
      const next = new Set(prev);
      reviewIds.forEach((id) => next.add(id));
      return next;
    });
  }, [progress]);

  /** 追加演習の要復習問題数 */
  const reviewExtraCount = useMemo(
    () =>
      getAllExtraExerciseIds().filter((id) => {
        const entry = progress[id];
        return entry && getDaysAgo(entry.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
      }).length,
    [progress]
  );

  /** 確定 */
  const handleConfirm = () => {
    onConfirm(localChecked);
    onClose();
  };

  const totalSelected = localChecked.size;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { maxHeight: "80vh" } }}
    >
      {/* ヘッダー */}
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          出題範囲を選択
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={handleSelectAll}>
              全選択
            </Button>
            <Button variant="outlined" size="small" onClick={handleDeselectAll}>
              全解除
            </Button>
          </Box>
          <Chip
            label={`${totalSelected} / ${TOTAL_QUESTION_COUNT}問 選択中`}
            color={totalSelected > 0 ? "primary" : "default"}
            size="small"
          />
        </Box>
      </DialogTitle>

      <Divider />

      {/* ツリー本体（スクロール領域） */}
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {ALL_MAJOR_CHAPTERS.map((major) => {
            const categories = getCategoriesForMajor(major);
            if (categories.length === 0) return null;
            const majorIds = getQuestionIdsForMajor(major);
            const majorState = getCheckState(majorIds, localChecked);
            const isMajorExpanded = expandedMajors.has(major);
            const majorCheckedCount = majorIds.filter((id) =>
              localChecked.has(id)
            ).length;
            const reviewInMajor = majorIds.filter((id) => {
              const e = progress[id];
              return e && getDaysAgo(e.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
            }).length;

            return (
              <React.Fragment key={major}>
                {/* 大章 */}
                <ListItemButton
                  onClick={() => toggleExpand(setExpandedMajors, major)}
                  sx={{ py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={majorState === "checked"}
                      indeterminate={majorState === "indeterminate"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleIds(majorIds);
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight="bold">
                          {MAJOR_CHAPTER_LABELS[major]}
                        </Typography>
                        <CountChip
                          label={`${majorCheckedCount}/${majorIds.length}`}
                          size="small"
                          variant={majorCheckedCount > 0 ? "filled" : "outlined"}
                          color={majorCheckedCount > 0 ? "primary" : "default"}
                        />
                        {reviewInMajor > 0 && (
                          <ReviewChip
                            label={`要復習 ${reviewInMajor}問`}
                            size="small"
                            color="warning"
                          />
                        )}
                      </Box>
                    }
                  />
                  {isMajorExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={isMajorExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {categories.map((cat) => {
                      const catIds = getQuestionIdsForCategory(cat);
                      const catState = getCheckState(catIds, localChecked);
                      const isCatExpanded = expandedCategories.has(cat);
                      const topics = ALL_TOPIC_STRUCTURE.filter(
                        (t) => t.category === cat
                      );
                      const catCheckedCount = catIds.filter((id) =>
                        localChecked.has(id)
                      ).length;
                      const reviewInCat = catIds.filter((id) => {
                        const e = progress[id];
                        return e && getDaysAgo(e.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
                      }).length;

                      return (
                        <React.Fragment key={cat}>
                          {/* 中章 */}
                          <ListItemButton
                            sx={{ pl: 4, py: 0.5 }}
                            onClick={() =>
                              toggleExpand(setExpandedCategories, cat)
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Checkbox
                                edge="start"
                                checked={catState === "checked"}
                                indeterminate={catState === "indeterminate"}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleIds(catIds);
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  <Typography variant="body2" fontWeight={500}>
                                    {CATEGORY_SHORT_LABELS[cat]}
                                  </Typography>
                                  <CountChip
                                    label={`${catCheckedCount}/${catIds.length}`}
                                    size="small"
                                    variant={
                                      catCheckedCount > 0
                                        ? "filled"
                                        : "outlined"
                                    }
                                    color={
                                      catCheckedCount > 0
                                        ? "primary"
                                        : "default"
                                    }
                                  />
                                  {reviewInCat > 0 && (
                                    <ReviewChip
                                      label={`要復習 ${reviewInCat}問`}
                                      size="small"
                                      color="warning"
                                    />
                                  )}
                                </Box>
                              }
                            />
                            {isCatExpanded ? (
                              <ExpandLess fontSize="small" />
                            ) : (
                              <ExpandMore fontSize="small" />
                            )}
                          </ListItemButton>

                          <Collapse
                            in={isCatExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List disablePadding>
                              {topics.map((topic) => {
                                const topicIds = getQuestionIdsForTopic(
                                  topic.id,
                                  topic.category
                                );
                                const topicState = getCheckState(
                                  topicIds,
                                  localChecked
                                );
                                const topicKey = `${topic.category}/${topic.id}`;
                                const isTopicExpanded =
                                  expandedTopics.has(topicKey);
                                const reviewInTopic = topicIds.filter((id) => {
                                  const e = progress[id];
                                  return e && getDaysAgo(e.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
                                }).length;

                                return (
                                  <React.Fragment key={topicKey}>
                                    {/* 小章（トピック） */}
                                    <ListItemButton
                                      sx={{ pl: 7, py: 0.5 }}
                                      onClick={() =>
                                        toggleExpand(
                                          setExpandedTopics,
                                          topicKey
                                        )
                                      }
                                    >
                                      <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                          edge="start"
                                          checked={topicState === "checked"}
                                          indeterminate={
                                            topicState === "indeterminate"
                                          }
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleIds(topicIds);
                                          }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                          >
                                            <Typography variant="body2">
                                              {topic.label}
                                            </Typography>
                                            <CountChip
                                              label={`${topicIds.length}問`}
                                              size="small"
                                            />
                                            {reviewInTopic > 0 && (
                                              <ReviewChip
                                                label={`要復習 ${reviewInTopic}問`}
                                                size="small"
                                                color="warning"
                                              />
                                            )}
                                          </Box>
                                        }
                                      />
                                      {isTopicExpanded ? (
                                        <ExpandLess fontSize="small" />
                                      ) : (
                                        <ExpandMore fontSize="small" />
                                      )}
                                    </ListItemButton>

                                    <Collapse
                                      in={isTopicExpanded}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <List disablePadding>
                                        {topic.questions.map((q) => {
                                          const qEntry = progress[q.id];
                                          const qDaysAgo = qEntry
                                            ? getDaysAgo(qEntry.lastCheckedAt)
                                            : null;
                                          return (
                                          <ListItemButton
                                            key={q.id}
                                            dense
                                            sx={{ pl: 10, py: 0 }}
                                            onClick={() => toggleIds([q.id])}
                                          >
                                            <ListItemIcon
                                              sx={{ minWidth: 32 }}
                                            >
                                              <Checkbox
                                                edge="start"
                                                checked={localChecked.has(
                                                  q.id
                                                )}
                                                size="small"
                                              />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                  >
                                                    {q.title}
                                                  </Typography>
                                                  {qDaysAgo !== null && (
                                                    <ReviewChip
                                                      label={`${qDaysAgo}日前`}
                                                      size="small"
                                                      color={
                                                        qDaysAgo < REVIEW_THRESHOLD_DAYS
                                                          ? "success"
                                                          : qDaysAgo < 30
                                                          ? "warning"
                                                          : "error"
                                                      }
                                                    />
                                                  )}
                                                </Box>
                                              }
                                            />
                                          </ListItemButton>
                                          );
                                        })}
                                      </List>
                                    </Collapse>
                                  </React.Fragment>
                                );
                              })}
                            </List>
                          </Collapse>
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Collapse>
                <Divider />
              </React.Fragment>
            );
          })}

          {/* ─── 追加演習セクション ─── */}
          <Divider />
          <ListItemButton
            onClick={() => toggleExpand(setExpandedMajors, "__extra__")}
            sx={{ py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                edge="start"
                checked={getCheckState(getAllExtraExerciseIds(), localChecked) === "checked"}
                indeterminate={getCheckState(getAllExtraExerciseIds(), localChecked) === "indeterminate"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIds(getAllExtraExerciseIds());
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography fontWeight="bold">追加演習</Typography>
                  <CountChip
                    label={`${getAllExtraExerciseIds().filter((id) => localChecked.has(id)).length}/${getAllExtraExerciseIds().length}`}
                    size="small"
                    variant={getAllExtraExerciseIds().some((id) => localChecked.has(id)) ? "filled" : "outlined"}
                    color={getAllExtraExerciseIds().some((id) => localChecked.has(id)) ? "primary" : "default"}
                  />
                  <Typography variant="caption" color="text.secondary">
                    （コーディング問題）
                  </Typography>
                  {reviewExtraCount > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      sx={{ ml: "auto", py: 0, px: 1, fontSize: "0.7rem", lineHeight: 1.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectReview();
                      }}
                    >
                      要復習を選択（{reviewExtraCount}問）
                    </Button>
                  )}
                </Box>
              }
            />
            {expandedMajors.has("__extra__") ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={expandedMajors.has("__extra__")} timeout="auto" unmountOnExit>
            <List disablePadding>
              {ALL_EXTRA_THEMES.map((theme) => {
                const themeIds = getExtraQuestionIdsForTheme(theme.id);
                if (themeIds.length === 0) return null;
                const themeState = getCheckState(themeIds, localChecked);
                const themeKey = `extra-theme-${theme.id}`;
                const isThemeExpanded = expandedCategories.has(themeKey);
                const themeCheckedCount = themeIds.filter((id) => localChecked.has(id)).length;

                return (
                  <React.Fragment key={themeKey}>
                    {/* テーマ */}
                    <ListItemButton
                      sx={{ pl: 4, py: 0.5 }}
                      onClick={() => toggleExpand(setExpandedCategories, themeKey)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={themeState === "checked"}
                          indeterminate={themeState === "indeterminate"}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleIds(themeIds);
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight={500}>
                              {theme.label}
                            </Typography>
                            <CountChip
                              label={`${themeCheckedCount}/${themeIds.length}`}
                              size="small"
                              variant={themeCheckedCount > 0 ? "filled" : "outlined"}
                              color={themeCheckedCount > 0 ? "primary" : "default"}
                            />
                          </Box>
                        }
                      />
                      {isThemeExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </ListItemButton>

                    <Collapse in={isThemeExpanded} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {theme.groups.map((group) => {
                          const groupIds = getExtraQuestionIdsForGroup(group.id);
                          if (groupIds.length === 0) return null;
                          const groupState = getCheckState(groupIds, localChecked);
                          const groupKey = `extra-group-${group.id}`;
                          const isGroupExpanded = expandedTopics.has(groupKey);
                          const reviewInGroup = groupIds.filter((id) => {
                            const entry = progress[id];
                            return entry && getDaysAgo(entry.lastCheckedAt) >= REVIEW_THRESHOLD_DAYS;
                          }).length;

                          return (
                            <React.Fragment key={groupKey}>
                              {/* グループ */}
                              <ListItemButton
                                sx={{ pl: 7, py: 0.5 }}
                                onClick={() => toggleExpand(setExpandedTopics, groupKey)}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <Checkbox
                                    edge="start"
                                    checked={groupState === "checked"}
                                    indeterminate={groupState === "indeterminate"}
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleIds(groupIds);
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Typography variant="body2">
                                        {group.label}
                                      </Typography>
                                      <CountChip
                                        label={`${groupIds.length}問`}
                                        size="small"
                                      />
                                      {reviewInGroup > 0 && (
                                        <ReviewChip
                                          label={`要復習 ${reviewInGroup}問`}
                                          size="small"
                                          color="warning"
                                        />
                                      )}
                                    </Box>
                                  }
                                />
                                {isGroupExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                              </ListItemButton>

                              <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                  {group.exercises.map((exercise) => {
                                    const exerciseId = buildExtraId(theme.id, group.id, exercise.questionId);
                                    const progressEntry = progress[exerciseId];
                                    const daysAgo = progressEntry
                                      ? getDaysAgo(progressEntry.lastCheckedAt)
                                      : null;
                                    return (
                                      <ListItemButton
                                        key={exerciseId}
                                        dense
                                        sx={{ pl: 10, py: 0 }}
                                        onClick={() => toggleIds([exerciseId])}
                                      >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                          <Checkbox
                                            edge="start"
                                            checked={localChecked.has(exerciseId)}
                                            size="small"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                              <Typography variant="body2" color="text.secondary">
                                                {exercise.title}
                                              </Typography>
                                              {daysAgo !== null && (
                                                <ReviewChip
                                                  label={`${daysAgo}日前`}
                                                  size="small"
                                                  color={
                                                    daysAgo < REVIEW_THRESHOLD_DAYS
                                                      ? "success"
                                                      : daysAgo < 30
                                                      ? "warning"
                                                      : "error"
                                                  }
                                                />
                                              )}
                                            </Box>
                                          }
                                        />
                                      </ListItemButton>
                                    );
                                  })}
                                </List>
                              </Collapse>
                            </React.Fragment>
                          );
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </List>
          </Collapse>
        </List>
      </DialogContent>

      {/* フッター（常に下部に固定表示） */}
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={totalSelected === 0}
        >
          この範囲で決定（{totalSelected}問）
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CountChip = styled(Chip)({
  height: 20,
  fontSize: "0.7rem",
  fontWeight: "bold",
});

const ReviewChip = styled(Chip)({
  height: 18,
  fontSize: "0.65rem",
  fontWeight: "bold",
});
