import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { ALL_TOPIC_STRUCTURE, CATEGORIES_LABELS } from "@site/src/structure";
import { QuestionList } from "@site/src/components/question/QuestionList";

type AchievementFilter = "all" | "achieved" | "unachieved";
type DaysAgoFilter = "all" | "1" | "3" | "7" | "14" | "30";

/**
 * 演習問題道場のコンテンツコンポーネント
 *
 * ⚠️ 現在は仮実装
 * - カテゴリ・トピック選択とランダム出題のみ実装済み
 * - 達成状態フィルタ（achievementFilter）と日数フィルタ（daysAgoFilter）のUIは存在するが、
 *   QuestionListコンポーネント側でのフィルタリングロジックは未実装
 * - 今後、改めて仕様をプランニングして本格実装予定
 */
export const DojoContent: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [randomOrder, setRandomOrder] = useState<boolean>(false);
  const [achievementFilter, setAchievementFilter] =
    useState<AchievementFilter>("all");
  const [daysAgoFilter, setDaysAgoFilter] = useState<DaysAgoFilter>("all");
  const [showQuestions, setShowQuestions] = useState<boolean>(false);

  // カテゴリ変更時、トピック選択をリセット
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
    setTopicId("");
    setShowQuestions(false);
  };

  // トピック変更時
  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    setTopicId(event.target.value);
    setShowQuestions(false);
  };

  // 演習問題を生成
  const handleGenerate = () => {
    if (category && topicId) {
      setShowQuestions(true);
    }
  };

  // 選択されたカテゴリに属するトピック一覧
  const availableTopics = ALL_TOPIC_STRUCTURE.filter(
    (t) => t.category === category
  );

  return (
    <Box maxWidth="1200px" mx="auto">
      <Typography variant="body1" color="text.secondary" mb={4}>
        カテゴリとトピックを選択して、演習問題に取り組みましょう。
      </Typography>

      {/* 出題条件フォーム */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          出題条件を設定
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label">カテゴリ</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="カテゴリ"
            onChange={handleCategoryChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxWidth: "600px",
                },
              },
            }}
          >
            {Object.entries(CATEGORIES_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key} sx={{ whiteSpace: "normal" }}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} disabled={!category}>
          <InputLabel id="topic-label">トピック</InputLabel>
          <Select
            labelId="topic-label"
            value={topicId}
            label="トピック"
            onChange={handleTopicChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxWidth: "600px",
                },
              },
            }}
          >
            {availableTopics.map((topic) => (
              <MenuItem
                key={topic.id}
                value={topic.id}
                sx={{ whiteSpace: "normal" }}
              >
                {topic.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="achievement-filter-label">達成状態</InputLabel>
          <Select
            labelId="achievement-filter-label"
            value={achievementFilter}
            label="達成状態"
            onChange={(e) =>
              setAchievementFilter(e.target.value as AchievementFilter)
            }
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="unachieved">未達成のみ</MenuItem>
            <MenuItem value="achieved">達成済みのみ</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="days-ago-filter-label">
            復習対象（達成日）
          </InputLabel>
          <Select
            labelId="days-ago-filter-label"
            value={daysAgoFilter}
            label="復習対象（達成日）"
            onChange={(e) => setDaysAgoFilter(e.target.value as DaysAgoFilter)}
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="1">昨日以前に達成</MenuItem>
            <MenuItem value="3">3日前以前に達成</MenuItem>
            <MenuItem value="7">7日前以前に達成（1週間）</MenuItem>
            <MenuItem value="14">14日前以前に達成（2週間）</MenuItem>
            <MenuItem value="30">30日前以前に達成（1ヶ月）</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={randomOrder}
              onChange={(e) => setRandomOrder(e.target.checked)}
            />
          }
          label="ランダム出題"
        />

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGenerate}
            disabled={!category || !topicId}
          >
            演習問題を生成
          </Button>
        </Box>
      </Paper>

      {/* 生成された演習問題リスト */}
      {showQuestions && category && topicId && (
        <QuestionList
          topicId={topicId}
          category={category}
          randomOrder={randomOrder}
          achievementFilter={achievementFilter}
          daysAgoFilter={daysAgoFilter}
        />
      )}
    </Box>
  );
};
