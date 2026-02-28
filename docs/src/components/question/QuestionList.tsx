import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useColorMode } from "@docusaurus/theme-common";
import { QuestionRenderer } from "../QuestionRenderer";
import { QuestionErrorBoundary } from "./QuestionErrorBoundary";
import { ALL_TOPIC_STRUCTURE } from "@site/src/structure";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";

interface QuestionListProps {
  topicId: string;
  category: string;
  randomOrder?: boolean;
  // ⚠️ 以下のpropsは道場機能の仮実装で追加されたが、現在は未使用
  achievementFilter?: "all" | "achieved" | "unachieved";
  daysAgoFilter?: "all" | "1" | "3" | "7" | "14" | "30";
}

export const QuestionList: React.FC<QuestionListProps> = ({
  topicId,
  category,
  randomOrder = false,
  achievementFilter = "all",  // 仮実装：現在は未使用
  daysAgoFilter = "all",      // 仮実装：現在は未使用
}) => {
  // Docusaurusのダーク/ライトモードを取得してMUIテーマに反映
  const { colorMode } = useColorMode();
  const muiTheme = useMemo(
    () => createTheme({ palette: { mode: colorMode === "dark" ? "dark" : "light" } }),
    [colorMode]
  );

  // structure.tsから該当トピックの全質問を取得
  const topic = ALL_TOPIC_STRUCTURE.find(
    (t) => t.id === topicId && t.category === category
  );

  // 進捗管理フック
  const { progress } = useStoredProgress();

  if (!topic || !topic.questions) {
    return (
      <Typography color="error">演習問題が見つかりません</Typography>
    );
  }

  // ランダム出題の場合、シャッフル
  let questions = topic.questions;
  if (randomOrder) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box mt={4}>
        {questions.map((question, index) => {
          const isAchieved = !!progress[question.id];

          return (
            <Accordion
              key={question.id}
              sx={{ mb: 2 }}
              defaultExpanded={!isAchieved}  // 未達成は開く、達成済みは閉じる
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>
                    <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                      問題{index + 1}.
                    </Box>
                    {question.title}
                  </Typography>
                  {isAchieved && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <QuestionErrorBoundary questionId={question.id}>
                  <QuestionRenderer
                    id={question.id}
                    mode="embedded"
                    showTitle={false}
                  />
                </QuestionErrorBoundary>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </ThemeProvider>
  );
};
