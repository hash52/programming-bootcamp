import { FC, PropsWithChildren, useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ALL_TOPIC_STRUCTURE,
  ALL_MAJOR_CHAPTERS,
  MAJOR_CHAPTER_LABELS,
  CATEGORY_SHORT_LABELS,
  getMajorChapterFromCategory,
} from "@site/src/structure";
import { ChevronDown } from "mdi-material-ui";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import { useAdditionalExerciseProgress } from "@site/src/hooks/useAdditionalExerciseProgress";
import { ProgressBarWithLabel } from "./ProgressBarWithLabel";
import { ProgressLineChart } from "./ProgressLineChart";
import {
  calcCategoryProgressRate,
  calcTopicProgressRate,
  calcMajorChapterProgressRate,
  calcTopicProgressCount,
  calcCategoryProgressCount,
  calcMajorChapterProgressCount,
} from "../lib/calcProgressRate";
import { isTrophyUnlocked } from "@site/src/lib/dojoFilter";
import { daysAgo } from "../lib/date";
import { QuestionDialog } from "../question/QuestionDialog";
import { LearningGuideDialog } from "./LearningGuideDialog";
import { TrophyIcon, type TrophyState } from "./TrophyIcon";

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
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();
  const storedProgress = useStoredProgress();
  const { trophyProgress } = useAdditionalExerciseProgress();

  // HACK: DocCategoryGeneratedIndexPage は DocProvider 外で DocBreadcrumbs をレンダリングするため、
  // useDoc() ベースのswizzleを廃止し useLocation() に変更した。
  // しかし useLocation() では frontMatter を参照できないため "/" のパンくずを非表示にできない。
  // そのためコンポーネント側で .breadcrumbs を CSS で非表示にすることで対処する。
  useEffect(() => {
    const style = document.createElement('style');
    style.dataset.hackId = 'dashboard-hide-breadcrumbs';
    // HACK: パンくずリスト非表示後に残る上部余白を除去する。
    // Docusaurus の article 要素は breadcrumbs 用の上部余白を持つため、
    // breadcrumbs 非表示と同時に article の padding-top / margin-top もリセットする。
    style.textContent = [
      '.breadcrumbs { display: none !important; }',
      'article { padding-top: 0 !important; margin-top: 0 !important; }',
    ].join('\n');
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  /** 学習ガイドダイアログの開閉状態 */
  const [learningGuideOpen, setLearningGuideOpen] = useState(false);

  /** トロフィー問題ダイアログで表示する問題ID */
  const [trophyDialogId, setTrophyDialogId] = useState<string | null>(null);

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
      {/* 学習ガイドバナー */}
      <GuideBanner onClick={() => setLearningGuideOpen(true)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <MenuBookIcon sx={{ color: "#F57C00", fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              はじめに読もう：学習ガイド
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ロードマップ・ダッシュボードの使い方・学習のコツをまとめています
            </Typography>
          </Box>
        </Box>
      </GuideBanner>

      {/* 折れ線グラフ */}
      <OverAllProgressCard>
        <OverAllProgressTitle>全体達成率の推移</OverAllProgressTitle>
        {/* ここを mockedHistory に変更するとテスト表示可能 */}
        <ProgressLineChart history={storedProgress.history} />
      </OverAllProgressCard>

      {/* 進捗一覧（大章 → 中章 → トピック の3階層） */}
      <MajorChapterStack>
        {ALL_MAJOR_CHAPTERS.map((major) => {
          const majorCategories = Array.from(
            new Set(
              ALL_TOPIC_STRUCTURE
                .filter((t) => getMajorChapterFromCategory(t.category) === major)
                .map((t) => t.category)
            )
          );
          if (majorCategories.length === 0) return null;

          const majorRatio = calcMajorChapterProgressRate(
            major,
            storedProgress.progress
          );
          const majorValue = majorRatio * 100;
          const majorCount = calcMajorChapterProgressCount(
            major,
            storedProgress.progress
          );
          const isSingleCategory = majorCategories.length === 1;

          /** トピック一覧のレンダリング（中章・単一カテゴリ共通） */
          const renderTopics = (cat: typeof majorCategories[number]) => {
            const topics = ALL_TOPIC_STRUCTURE.filter(
              (t) => t.category === cat
            );
            return (
              <TopicProgressStack>
                {topics.map((topic) => {
                  const topicRatio = calcTopicProgressRate(
                    topic.id,
                    storedProgress.progress
                  );
                  const topicValue = topicRatio * 100;
                  const topicCount = calcTopicProgressCount(
                    topic.id,
                    storedProgress.progress
                  );
                  return (
                    <TopicProgressAccordion key={topic.id}>
                      <AccordionSummary expandIcon={<ChevronDown />}>
                        <TopicProgressBox>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TopicTitle>{topic.label}</TopicTitle>
                            <Tooltip title="教材を開く">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  history.push(
                                    `${siteConfig.baseUrl}${topic.category}/${topic.id.replace(/^\d+_/, "")}`
                                  );
                                }}
                              >
                                <ExitToAppIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {topic.trophyQuestion && (() => {
                              const isUnlocked = isTrophyUnlocked(topic, storedProgress.progress);
                              const isSolved = !!trophyProgress[topic.trophyQuestion!.id]?.solvedAt;
                              const trophyState: TrophyState = !isUnlocked
                                ? "locked"
                                : isSolved
                                ? "solved"
                                : "unlocked";
                              return (
                                <Box
                                  component="span"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTrophyDialogId(topic.trophyQuestion!.id);
                                  }}
                                >
                                  <TrophyIcon state={trophyState} />
                                </Box>
                              );
                            })()}
                          </Box>
                          <ProgressWithCountBox>
                            <ProgressCountChip
                              label={`${topicCount.done} / ${topicCount.total}`}
                              size="small"
                              variant="outlined"
                            />
                            <TopicProgressBarBox>
                              <ProgressBarWithLabel value={topicValue} />
                            </TopicProgressBarBox>
                          </ProgressWithCountBox>
                        </TopicProgressBox>
                      </AccordionSummary>

                      <AccordionDetails>
                        {topic.questions.map((q) => {
                          const qProg = storedProgress.progress[q.id];
                          return (
                            <QuestionRowBox key={q.id}>
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
                                    const currentIndex =
                                      topicQuestions.findIndex(
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
            );
          };

          // 大章内の全トロフィー取得済みかチェック
          const majorTrophyTopics = ALL_TOPIC_STRUCTURE.filter(
            (t) => getMajorChapterFromCategory(t.category) === major && t.trophyQuestion
          );
          const allMajorTrophiesSolved =
            majorTrophyTopics.length > 0 &&
            majorTrophyTopics.every((t) => !!trophyProgress[t.trophyQuestion!.id]?.solvedAt);

          return (
            <MajorChapterAccordion key={major} >
              <AccordionSummary expandIcon={<ChevronDown />}>
                <MajorChapterSummaryBox>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MajorChapterTitle>
                      {MAJOR_CHAPTER_LABELS[major]}
                    </MajorChapterTitle>
                    {allMajorTrophiesSolved && (
                      <TrophyIcon state="solved" />
                    )}
                  </Box>
                  <ProgressWithCountBox>

                    <ProgressCountChip
                      label={`${majorCount.done} / ${majorCount.total}`}
                      size="small"
                      variant="outlined"
                    />
                    <MajorChapterProgressBarBox>
                      <ProgressBarWithLabel value={majorValue} />
                    </MajorChapterProgressBarBox>
                  </ProgressWithCountBox>
                </MajorChapterSummaryBox>
              </AccordionSummary>

              <AccordionDetails>
                {isSingleCategory ? (
                  /* 単一カテゴリの場合は中章レベルを省略 */
                  renderTopics(majorCategories[0])
                ) : (
                  /* 複数カテゴリの場合は中章Accordionを表示 */
                  <CategorySubStack>
                    {majorCategories.map((cat) => {
                      const catValue =
                        calcCategoryProgressRate(
                          cat,
                          storedProgress.progress
                        ) * 100;
                      const catCount = calcCategoryProgressCount(
                        cat,
                        storedProgress.progress
                      );

                      return (
                        <CategorySubAccordion key={cat} >
                          <AccordionSummary expandIcon={<ChevronDown />}>
                            <CategorySubSummaryBox>
                              <CategorySubTitle>
                                {CATEGORY_SHORT_LABELS[cat]}
                              </CategorySubTitle>
                              <ProgressWithCountBox>
                                <ProgressCountChip
                                  label={`${catCount.done} / ${catCount.total}`}
                                  size="small"
                                  variant="outlined"
                                />
                                <CategorySubProgressBarBox>
                                  <ProgressBarWithLabel value={catValue} />
                                </CategorySubProgressBarBox>
                              </ProgressWithCountBox>
                            </CategorySubSummaryBox>
                          </AccordionSummary>

                          <AccordionDetails>
                            {renderTopics(cat)}
                          </AccordionDetails>
                        </CategorySubAccordion>
                      );
                    })}
                  </CategorySubStack>
                )}
              </AccordionDetails>
            </MajorChapterAccordion>
          );
        })}
      </MajorChapterStack>

      {/* 学習ガイドダイアログ */}
      <LearningGuideDialog
        open={learningGuideOpen}
        onClose={() => setLearningGuideOpen(false)}
      />

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

      {/* トロフィー問題ダイアログ */}
      <QuestionDialog
        questionId={trophyDialogId}
        onClose={() => setTrophyDialogId(null)}
        showNavigation={false}
      />
    </PageContainer>
  );
};

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
}));

/** 学習ガイドバナー */
const GuideBanner = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  borderLeft: `4px solid #F57C00`,
  background:
    theme.palette.mode === "dark"
      ? "#1b263b"
      : "linear-gradient(135deg, #FFF8F0, #FFF3E0)",
  transition: "box-shadow 0.2s, transform 0.2s",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-1px)",
  },
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

/** 大章ごとの進捗一覧エリア */
const MajorChapterStack: FC<PropsWithChildren> = ({ children }) => {
  return <Stack spacing={3}>{children}</Stack>;
};

/** 大章Accordion */
const MajorChapterAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: `${Number(theme.shape.borderRadius) * 2}px !important`,
  background:
    theme.palette.mode === "dark"
      ? "#1b263b"
      : "linear-gradient(135deg, #f7f7f7, #fafafa)",
  "&:before": { display: "none" },
}));

/** 大章Summary内のレイアウト */
const MajorChapterSummaryBox = styled(Box)({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

/** 大章タイトル */
const MajorChapterTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.25rem",
});

/** 大章の進捗バー幅 */
const MajorChapterProgressBarBox = styled(Box)({
  width: 200,
  flexShrink: 0,
});

/** 中章の一覧エリア */
const CategorySubStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
}));

/** 中章Accordion */
const CategorySubAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px !important`,
  "&:before": { display: "none" },
}));

/** 中章Summary内のレイアウト */
const CategorySubSummaryBox = styled(Box)({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

/** 中章タイトル */
const CategorySubTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.1rem",
});

/** 中章の進捗バー幅 */
const CategorySubProgressBarBox = styled(Box)({
  width: 180,
  flexShrink: 0,
});

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
const TopicTitle = styled(Typography)({
  fontWeight: 500,
});

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
  cursor: "pointer",
  transition: "color 0.2s, text-decoration 0.2s",
  "&:hover": {
    textDecoration: "underline",
    color: "#0d47a1",
  },
});

/** 進捗バー＋個数チップのラッパー */
const ProgressWithCountBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  marginLeft: 16,
  gap: 8,
});

/** 個数チップ */
const ProgressCountChip = styled(Chip)({
  fontWeight: "bold",
  fontSize: "0.75rem",
  height: 22,
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
