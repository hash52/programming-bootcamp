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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ALL_TOPIC_STRUCTURE,
  CATEGORIES_LABELS,
  Difficulty,
} from "@site/src/structure";
import { ChevronDown } from "mdi-material-ui";

/** ローカルストレージに保存する際のキー名 */
const STORAGE_KEY = "questionProgress";

/**
 * 各設問の達成状態を表すデータ構造
 * - `checked`: チェック済みかどうか
 * - `lastCheckedAt`: 最後にチェックをつけた日付（ISO文字列）
 */
interface QuestionProgress {
  checked: boolean;
  lastCheckedAt: string | null;
}

/** 全設問分の進捗をまとめたレコード（questionId -> 状態） */
type ProgressRecord = Record<string, QuestionProgress>;

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
          color: value == 100 ? "#fff" : "#333",
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
 * - トピック・カテゴリ別に学習状況を一覧表示
 * - チェックボックスで達成状況を更新
 * - localStorageに永続保存
 * - 達成率をLinearProgress＋％表示で可視化
 */
export const Dashboard: FC = () => {
  /** 設問ごとの進捗情報（localStorage永続化対象） */
  const [progress, setProgress] = useState<ProgressRecord>({});

  /** 初回マウント時にlocalStorageから進捗を復元 */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProgress(JSON.parse(stored));
  }, []);

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /**
   * トピック単位の達成率を計算
   * @param topicId トピックID
   * @returns 達成率（0〜1.0）
   */
  const getTopicProgress = (topicId: string) => {
    const topic = ALL_TOPIC_STRUCTURE.find((t) => t.id === topicId);
    if (!topic) return 0;
    const total = topic.questions.length;
    const done = topic.questions.filter((q) => progress[q.id]?.checked).length;
    return total ? done / total : 0;
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
    const total = allQuestions.length;
    const done = allQuestions.filter((q) => progress[q.id]?.checked).length;
    return total ? done / total : 0;
  };

  /** 全カテゴリ一覧を重複除去して抽出 */
  const categories = Array.from(
    new Set(ALL_TOPIC_STRUCTURE.map((t) => t.category))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {categories.map((cat) => {
          // 該当カテゴリのトピック一覧を抽出
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
                                color: "#0d47a1", // 濃い青
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => {
                              window.open(
                                `${topic.category}/${topic.id}`,
                                "_blank"
                              );
                            }}
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
                        {topic.questions
                          .sort(
                            (a, b) =>
                              a.difficulty - b.difficulty ||
                              a.title.localeCompare(b.title)
                          )
                          .map((q) => {
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
                                        color: "#0d47a1",
                                        textDecoration: "underline",
                                      },
                                    }}
                                    onClick={() => {
                                      // 別タブで問題ページを開く
                                      window.open(q.id, "_blank");
                                    }}
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
