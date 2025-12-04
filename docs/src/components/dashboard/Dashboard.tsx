import { FC, PropsWithChildren, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ALL_TOPIC_STRUCTURE, CATEGORIES_LABELS } from "@site/src/structure";
import { ChevronDown } from "mdi-material-ui";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import { ProgressBarWithLabel } from "./ProgressBarWithLabel";
import { ProgressLineChart } from "./ProgressLineChart";
import {
  calcCategoryProgressRate,
  calcTopicProgressRate,
} from "../lib/calcProgressRate";
import { daysAgo } from "../lib/date";
import { QuestionDialog } from "../question/QuestionDialog";

/**
 * dateStringからの経過日数を文字列で返す
 * 現在日時が2025-10-02T00:00:00の場合
 * - 2025-10-01T23:59:59 → "昨日"
 * @param dateString ISO文字列の日付またはnull
 * @returns "未チェック" / "今日" / "昨日" / "X日前"
 */
function daysSince(dateString: string | null): string {
  if (!dateString) return "未チェック";

  const target = new Date(dateString);
  const now = new Date();

  const diffDays = daysAgo(now, target);

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  return `${diffDays}日前`;
}

/**
 * 経過日数に応じて文字色を返す
 * - 10日以上：赤（要復習）
 * - 5〜9日：オレンジ（やや古い）
 * - 0〜4日：緑（最近）
 * - 未チェック：グレー
 */
function getDateColor(dateString: string | null): string {
  if (!dateString) return "#999";
  const diff =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24);
  if (diff >= 7) return "#e53935"; // 赤系
  if (diff >= 3) return "#fb8c00"; // オレンジ系
  return "#43a047"; // 緑系
}

/** モックデータ: 学習進捗履歴テスト用（日別達成率） */
const mockedHistory = {
  "2025-10-01": 3,
  "2025-10-02": 5,
  "2025-10-03": 8,
  "2025-10-04": 10,
  "2025-10-05": 12,
  "2025-10-06": 15,
  "2025-10-07": 18,
  "2025-10-08": 22,
  "2025-10-09": 27,
  "2025-10-10": 32,
  "2025-10-11": 36,
  "2025-10-12": 40,
  "2025-10-13": 45,
  "2025-10-14": 48,
  "2025-10-15": 52,
  "2025-10-16": 57,
  "2025-10-17": 61,
  "2025-10-18": 64,
  "2025-10-19": 69,
  "2025-10-20": 73,
  "2025-10-21": 77,
  "2025-10-22": 82,
  "2025-10-23": 85,
  "2025-10-24": 88,
  "2025-10-25": 91,
  "2025-10-26": 94,
  "2025-10-27": 96,
  "2025-10-28": 98,
  "2025-10-29": 100,
};

/**
 * 学習進捗ダッシュボード
 *
 * - 全体の学習進捗を折れ線グラフで表示
 * - トピック・カテゴリ別に学習状況を一覧表示
 * - チェックボックスで達成状況を更新
 * - localStorageに永続保存
 * - 達成率をLinearProgress＋％表示で可視化
 */
export const Dashboard: FC = () => {
  const storedProgress = useStoredProgress();

  /** 全カテゴリ一覧を重複除去して抽出 */
  const categories = Array.from(
    new Set(ALL_TOPIC_STRUCTURE.map((t) => t.category))
  );

  /** 選択された質問のコンテキスト情報（ダイアログ表示＋ナビゲーション用） */
  const [selectedQuestionContext, setSelectedQuestionContext] = useState<{
    questionId: string;
    topicQuestions: Array<{ id: string; title: string }>;
    currentIndex: number;
  } | null>(null);

  /** 前の問題に移動 */
  const handlePrevious = () => {
    if (!selectedQuestionContext) return;
    const { topicQuestions, currentIndex } = selectedQuestionContext;
    if (currentIndex > 0) {
      const prevQuestion = topicQuestions[currentIndex - 1];
      setSelectedQuestionContext({
        questionId: prevQuestion.id,
        topicQuestions,
        currentIndex: currentIndex - 1,
      });
    }
  };

  /** 次の問題に移動 */
  const handleNext = () => {
    if (!selectedQuestionContext) return;
    const { topicQuestions, currentIndex } = selectedQuestionContext;
    if (currentIndex < topicQuestions.length - 1) {
      const nextQuestion = topicQuestions[currentIndex + 1];
      setSelectedQuestionContext({
        questionId: nextQuestion.id,
        topicQuestions,
        currentIndex: currentIndex + 1,
      });
    }
  };

  return (
    <PageContainer>
      {/* 折れ線グラフ */}
      <OverAllProgressCard>
        <OverAllProgressTitle>全体達成率の推移</OverAllProgressTitle>
        {/* ここを mockedHistory に変更するとテスト表示可能 */}
        <ProgressLineChart history={storedProgress.history} />
      </OverAllProgressCard>

      {/* 進捗一覧 */}
      <CategoryProgressStack>
        {categories.map((cat) => {
          const topics = ALL_TOPIC_STRUCTURE.filter((t) => t.category === cat);
          const catRatio = calcCategoryProgressRate(
            cat,
            storedProgress.progress
          );
          const catValue = catRatio * 100;
          const categoryLabel = CATEGORIES_LABELS[cat];

          return (
            <CategoryProgressCard key={cat}>
              {/* カテゴリ名＋進捗バー */}
              <CategoryTitle>{categoryLabel}</CategoryTitle>
              <ProgressBarWithLabel value={catValue} />

              {/* トピックごとのAccordion */}
              <TopicProgressStack>
                {topics.map((topic) => {
                  const topicRatio = calcTopicProgressRate(
                    topic.id,
                    storedProgress.progress
                  );
                  const topicValue = topicRatio * 100;
                  return (
                    <TopicProgressAccordion key={topic.id}>
                      <AccordionSummary expandIcon={<ChevronDown />}>
                        <TopicProgressBox>
                          {/* トピックタイトル */}
                          <TopicTitle
                            onClick={() =>
                              window.open(
                                `${topic.category}/${topic.id}`,
                                "_blank"
                              )
                            }
                          >
                            {topic.label}
                          </TopicTitle>

                          {/* トピック進捗バー */}
                          <TopicProgressBarBox>
                            <ProgressBarWithLabel value={topicValue} />
                          </TopicProgressBarBox>
                        </TopicProgressBox>
                      </AccordionSummary>

                      {/* 設問リスト */}
                      <AccordionDetails>
                        {topic.questions.map((q) => {
                          const qProg = storedProgress.progress[q.id];
                          return (
                            <QuestionRowBox key={q.id}>
                              {/* 設問タイトル＋チェックボックス */}
                              <QuestionRowLeftBox>
                                <Checkbox
                                  checked={Boolean(qProg?.lastCheckedAt)}
                                  onChange={(e) =>
                                    storedProgress.updateProgress(
                                      q.id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <QuestionTitle
                                  onClick={() => {
                                    const topicQuestions = topic.questions;
                                    const currentIndex = topicQuestions.findIndex(
                                      (question) => question.id === q.id
                                    );
                                    setSelectedQuestionContext({
                                      questionId: q.id,
                                      topicQuestions,
                                      currentIndex,
                                    });
                                  }}
                                >
                                  {q.title}
                                </QuestionTitle>
                              </QuestionRowLeftBox>
                              {/* 経過日数表示（色付き） */}
                              <QuestionDaysSinceText
                                lastCheckedAt={qProg?.lastCheckedAt}
                              />
                            </QuestionRowBox>
                          );
                        })}
                      </AccordionDetails>
                    </TopicProgressAccordion>
                  );
                })}
              </TopicProgressStack>
            </CategoryProgressCard>
          );
        })}
      </CategoryProgressStack>

      {/* QuestionDialog */}
      <QuestionDialog
        questionId={selectedQuestionContext?.questionId ?? null}
        onClose={() => setSelectedQuestionContext(null)}
        showNavigation={true}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={
          selectedQuestionContext
            ? selectedQuestionContext.currentIndex > 0
            : false
        }
        hasNext={
          selectedQuestionContext
            ? selectedQuestionContext.currentIndex <
              selectedQuestionContext.topicQuestions.length - 1
            : false
        }
      />
    </PageContainer>
  );
};

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

/** 全体進捗の表示エリア */
const OverAllProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
}));

/** 全体進捗タイトル */
const OverAllProgressTitle: FC<PropsWithChildren> = ({ children }) => {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
  }));

  return <StyledTypography variant="h6">{children}</StyledTypography>;
};

/** カテゴリごとの進捗一覧エリア */
const CategoryProgressStack: FC<PropsWithChildren> = ({ children }) => {
  return <Stack spacing={3}>{children}</Stack>;
};

/** カテゴリの表示エリア */
const CategoryProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  borderRadius: `${Number(theme.shape.borderRadius) * 2}px`,
  background:
    theme.palette.mode === "dark"
      ? "#1b263b" // ← ダーク時：背景が黒でも浮かない深めの紺
      : "linear-gradient(135deg, #f7f7f7, #fafafa)", // ← ライト時：既存の明るいグラデーション
}));

/** カテゴリタイトル */
const CategoryTitle: FC<PropsWithChildren> = ({ children }) => {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
  }));
  return <StyledTypography variant="h6">{children}</StyledTypography>;
};

/** トピックごとの進捗一覧エリア */
const TopicProgressStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

/** トピックタイトル＋進捗バーエリア */
const TopicProgressBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

/** トピックタイトル */
const TopicTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  cursor: "pointer",
  transition: "color 0.2s, text-decoration 0.2s",
  "&:hover": {
    textDecoration: "underline",
    color: "#0d47a1",
  },
}));

const TopicProgressBarBox = styled(Box)({
  width: 150,
});

/** トピックごとの進捗エリア */
const TopicProgressAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  "&:before": { display: "none" }, // デフォルト線を消す
  boxShadow: theme.shadows[1],
}));

/** 設問表示エリア */
const QuestionRowBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #eee",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

const QuestionRowLeftBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

/** 設問タイトル（クリックで問題ページを開く） */
const QuestionTitle = styled(Typography)({
  maxWidth: 400,
  cursor: "pointer",
  whiteSpace: "normal", // 折り返しを許可
  wordBreak: "break-word", // 長文時の改行制御
  transition: "color 0.2s, text-decoration 0.2s",
  "&:hover": {
    textDecoration: "underline",
    color: "#0d47a1",
  },
});

/** 経過日数表示（色付き） */
const QuestionDaysSinceText: FC<{ lastCheckedAt: string | undefined }> = ({
  lastCheckedAt,
}) => {
  const color = getDateColor(lastCheckedAt ?? null);
  const daysSinceText = daysSince(lastCheckedAt ?? null);
  const StyledTypography = styled(Typography)({
    color,
    flexShrink: 0, // はみ出し防止
    marginLeft: "auto", // 常に右端に配置
    alignSelf: "center", // 垂直方向中央
  });
  return <StyledTypography variant="body2">{daysSinceText}</StyledTypography>;
};
