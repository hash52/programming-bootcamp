import { FC, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  LinearProgress,
  Paper,
  Stack,
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

  return (
    <Paper sx={{ p: 2, mb: 3, height: 300 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        全体達成率の推移
      </Typography>
      <Box sx={{ height: 240 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
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
const ProgressWithLabel: FC<{ value: number }> = ({ value }) => {
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
  const mockedHistory: ProgressHistory = {
    "2025-10-01": 10,
    "2025-10-02": 25,
    "2025-10-03": 40,
    "2025-10-05": 60,
    "2025-10-06": 75,
    "2025-10-07": 80,
    "2025-10-08": 90,
    "2025-10-09": 100,
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
    <Box sx={{ p: 3 }}>
      {/* 折れ線グラフ */}
      {/* ここを mockedHistory に変更するとテスト表示可能 */}
      <ProgressLineChart history={history} />

      {/* 進捗一覧 */}
      <Stack spacing={3}>
        {categories.map((cat) => {
          const topics = ALL_TOPIC_STRUCTURE.filter((t) => t.category === cat);
          const catRatio = getCategoryProgress(cat);
          const catValue = catRatio * 100;
          const categoryLabel = CATEGORIES_LABELS[cat];

          return (
            <Paper
              key={cat}
              sx={{
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                background: "linear-gradient(135deg, #f7f7f7, #fafafa)",
              }}
            >
              {/* カテゴリ名＋進捗バー */}
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                {categoryLabel}
              </Typography>
              <ProgressWithLabel value={catValue} />

              {/* トピックごとのAccordion */}
              <Stack sx={{ mt: 2 }}>
                {topics.map((topic) => {
                  const topicRatio = getTopicProgress(topic.id);
                  const topicValue = topicRatio * 100;
                  return (
                    <Accordion
                      key={topic.id}
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        "&:before": { display: "none" }, // デフォルト線を消す
                        boxShadow: 1,
                      }}
                    >
                      <AccordionSummary expandIcon={<ChevronDown />}>
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* トピックタイトル */}
                          <Typography
                            sx={{
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "color 0.2s, text-decoration 0.2s",
                              "&:hover": {
                                textDecoration: "underline",
                                color: "#0d47a1",
                              },
                            }}
                            onClick={() =>
                              window.open(
                                `${topic.category}/${topic.id}`,
                                "_blank"
                              )
                            }
                          >
                            {topic.label}
                          </Typography>

                          {/* トピック進捗バー */}
                          <Box sx={{ width: 150 }}>
                            <ProgressWithLabel value={topicValue} />
                          </Box>
                        </Box>
                      </AccordionSummary>

                      {/* 設問リスト */}
                      <AccordionDetails>
                        {topic.questions.map((q) => {
                          const qProg = progress[q.id];
                          return (
                            <Box
                              key={q.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #eee",
                                py: 0.5,
                              }}
                            >
                              {/* 設問タイトル＋チェックボックス */}
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Checkbox
                                  checked={qProg?.checked || false}
                                  onChange={(e) =>
                                    updateProgress(q.id, e.target.checked)
                                  }
                                />
                                <Typography
                                  noWrap
                                  sx={{
                                    maxWidth: 400,
                                    cursor: "pointer",
                                    "&:hover": {
                                      textDecoration: "underline",
                                      color: "#0d47a1",
                                    },
                                  }}
                                  onClick={() => window.open(q.id, "_blank")} // 別タブで問題ページを開く
                                >
                                  {q.title}
                                </Typography>
                              </Box>
                              {/* 経過日数表示（色付き） */}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getDateColor(
                                    qProg?.lastCheckedAt || null
                                  ),
                                }}
                              >
                                {daysSince(qProg?.lastCheckedAt || null)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};
