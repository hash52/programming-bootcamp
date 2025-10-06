import { Paper, Typography } from "@mui/material";
import { FC } from "react";
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

/** 折れ線グラフ用履歴データ */
type ProgressHistory = Record<string, number>; // 例: { "2025-10-01": 45, ... }

/**
 * 折れ線グラフ表示コンポーネント
 * @param history localStorageから取得した日別達成率
 */
export const ProgressLineChart: FC<{ history: ProgressHistory }> = ({
  history,
}) => {
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
