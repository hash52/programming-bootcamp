import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  LinearProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ALL_TOPIC_STRUCTURE, CATEGORIES_LABELS } from "@site/src/structure";
import { ChevronDown } from "mdi-material-ui";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Chart.js 登録
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Legend
);

/** localStorage キー */
const STORAGE_KEY_PROGRESS = "questionProgress";
const STORAGE_KEY_HISTORY = "progressHistory";

/** 設問ごとの進捗状態 */
interface QuestionProgress {
  /** チェック済みかどうか */
  checked: boolean;
  /** 最後にチェックした日（ISO文字列） */
  lastCheckedAt: string | null;
}

/** 全設問分の進捗をまとめたレコード（questionId -> 状態） */
type ProgressRecord = Record<string, QuestionProgress>;

/** 折れ線グラフ用履歴データ */
type ProgressHistory = Record<string, number>; // 例: { "2025-10-01": 45, ... }

/**
 * 折れ線グラフ表示コンポーネント
 * @param history localStorageから取得した日別達成率
 */
const ProgressLineChart: FC<{ history: ProgressHistory }> = ({ history }) => {
  const entries = Object.entries(history).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  if (entries.length === 0)
    return (
      <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
        <Typography color="text.secondary">
          進捗の記録がまだありません
        </Typography>
      </Paper>
    );

  // 最初の1日前を0%で追加する ---
  const firstDate = new Date(entries[0][0]);
  const dayBefore = new Date(firstDate);
  dayBefore.setDate(firstDate.getDate() - 1);
  const zeroDate = dayBefore.toISOString().split("T")[0];

  // グラフ描画データ
  const labels = [zeroDate, ...entries.map(([date]) => date)];
  const data = [0, ...entries.map(([, value]) => value)];

  const chartData = {
    labels,
    datasets: [
      {
        label: "全体達成率（％）",
        data,
        borderColor: "#1976d2",
        backgroundColor: "#1976d2",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#1976d2",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#555",
        },
        grid: {
          color: "#eee",
        },
      },
      x: {
        ticks: {
          color: "#555",
        },
        grid: {
          color: "#fafafa",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `達成率：${ctx.raw}%`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

/**
 * 指定された日付からの経過日数を文字列で返す
 * @param dateString ISO文字列の日付またはnull
 * @returns "未チェック" / "今日" / "X日前"
 */
function daysSince(dateString: string | null): string {
  if (!dateString) return "未チェック";
  const diff =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24);
  const days = Math.floor(diff);
  if (days === 0) return "今日";
  if (days === 1) return "1日前";
  return `${days}日前`;
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
  if (diff > 10) return "#e53935"; // 赤系
  if (diff > 5) return "#fb8c00"; // オレンジ系
  return "#43a047"; // 緑系
}

/**
 * 進捗率に応じたプログレスバー色を返す
 * @param ratio 達成率（0〜1.0）
 * @returns カラーコード（#hex形式）
 */
function getProgressColor(ratio: number): string {
  if (ratio == 1.0) return "#1e88e5"; // 完了時：青
  if (ratio < 0.4) return "#e53935"; // 0〜39%：赤
  if (ratio < 0.8) return "#fb8c00"; // 40〜79%：オレンジ
  return "#43a047"; // 80%以上：緑
}

/**
 * LinearProgressに中央ラベル（％）を重ねたプログレスバー
 * @param value - 進捗率（0〜100）
 */
const ProgressBarWithLabel: FC<{ value: number }> = ({ value }) => {
  const color = getProgressColor(value / 100);
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* バー本体 */}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#eee",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
          },
        }}
      />
      {/* 中央ラベル（%表示） */}
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          fontWeight: "bold",
          color: value === 100 ? "#fff" : "#333",
          lineHeight: "10px",
          fontSize: "0.75rem",
        }}
      >
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  );
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
  const [progress, setProgress] = useState<ProgressRecord>({});
  const [history, setHistory] = useState<ProgressHistory>({});
  /** モックデータ: 学習進捗履歴テスト用（日別達成率） */
  /** モックデータ: 学習進捗履歴テスト用（日別達成率） */
  const mockedHistory: ProgressHistory = {
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

  // 初期化: localStorageから読み込み
  useEffect(() => {
    const storedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (storedProgress) setProgress(JSON.parse(storedProgress));
    const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  /** 全体達成率を算出 */
  const calcOverallProgress = (data: ProgressRecord): number => {
    const allQuestions = ALL_TOPIC_STRUCTURE.flatMap((t) => t.questions);
    const done = allQuestions.filter((q) => data[q.id]?.checked).length;
    return allQuestions.length
      ? Math.round((done / allQuestions.length) * 100)
      : 0;
  };

  /** 当日の履歴を更新 */
  const updateProgressHistory = (ratio: number) => {
    const today = new Date().toISOString().split("T")[0];
    const updated: ProgressHistory = { ...history, [today]: ratio };
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  };

  /**
   * チェックボックス操作時に進捗を更新
   * @param id 設問ID（例：spring/mvc_intro#q1）
   * @param checked チェック状態
   */
  const updateProgress = (id: string, checked: boolean) => {
    const updated: ProgressRecord = {
      ...progress,
      [id]: {
        checked,
        lastCheckedAt: checked ? new Date().toISOString() : null,
      },
    };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));

    // 最新のupdatedデータを使って正しい進捗率を計算
    // 非同期更新のため、stateのprogressを使うと1回遅れになる
    const overall = calcOverallProgress(updated);
    updateProgressHistory(overall);
  };

  /**
   * トピック単位の達成率を計算
   * @param topicId トピックID
   * @returns 達成率（0〜1.0）
   */
  const getTopicProgress = (topicId: string) => {
    const topic = ALL_TOPIC_STRUCTURE.find((t) => t.id === topicId);
    if (!topic) return 0;
    const done = topic.questions.filter((q) => progress[q.id]?.checked).length;
    return topic.questions.length ? done / topic.questions.length : 0;
  };

  /**
   * カテゴリ単位の達成率を計算
   * @param category カテゴリID
   * @returns 達成率（0〜1.0）
   */
  const getCategoryProgress = (category: string) => {
    const allQuestions = ALL_TOPIC_STRUCTURE.flatMap((t) =>
      t.category === category ? t.questions : []
    );
    const done = allQuestions.filter((q) => progress[q.id]?.checked).length;
    return allQuestions.length ? done / allQuestions.length : 0;
  };

  /** 全カテゴリ一覧を重複除去して抽出 */
  const categories = Array.from(
    new Set(ALL_TOPIC_STRUCTURE.map((t) => t.category))
  );

  return (
    <PageContainer>
      {/* 折れ線グラフ */}
      <OverAllProgressCard>
        <OverAllProgressTitle>全体達成率の推移</OverAllProgressTitle>
        <OverAllProgressChartBox>
          {/* ここを mockedHistory に変更するとテスト表示可能 */}
          <ProgressLineChart history={history} />
        </OverAllProgressChartBox>
      </OverAllProgressCard>

      {/* 進捗一覧 */}
      <CategoryProgressStack>
        {categories.map((cat) => {
          const topics = ALL_TOPIC_STRUCTURE.filter((t) => t.category === cat);
          const catRatio = getCategoryProgress(cat);
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
                  const topicRatio = getTopicProgress(topic.id);
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
                          const qProg = progress[q.id];
                          return (
                            <QuestionRowBox key={q.id}>
                              {/* 設問タイトル＋チェックボックス */}
                              <QuestionRowLeftBox>
                                <Checkbox
                                  checked={qProg?.checked || false}
                                  onChange={(e) =>
                                    updateProgress(q.id, e.target.checked)
                                  }
                                />
                                <QuestionTitle
                                  onClick={() => window.open(q.id, "_blank")} // 別タブで問題ページを開く
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
  height: 300,
}));

/** 全体進捗タイトル */
const OverAllProgressTitle: FC<PropsWithChildren> = ({ children }) => {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
  }));

  return <StyledTypography variant="h6">{children}</StyledTypography>;
};

/** 折れ線グラフエリア */
const OverAllProgressChartBox = styled(Box)({
  height: 240,
});

/** カテゴリごとの進捗一覧エリア */
const CategoryProgressStack: FC<PropsWithChildren> = ({ children }) => {
  return <Stack spacing={3}>{children}</Stack>;
};

/** カテゴリの表示エリア */
const CategoryProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: `${Number(theme.shape.borderRadius) * 2}px`,
  background: "linear-gradient(135deg, #f7f7f7, #fafafa)",
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
