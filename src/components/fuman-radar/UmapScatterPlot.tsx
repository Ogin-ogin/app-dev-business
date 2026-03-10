"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_LABELS: Record<string, string> = {
  economy: "経済・お金",
  politics: "政治",
  healthcare: "医療・健康",
  education: "教育",
  work: "仕事・職場",
  housing: "住まい",
  transport: "交通",
  food: "食事・飲食",
  service: "サービス・接客",
  tech: "テクノロジー",
  other: "その他",
};

const CATEGORY_COLORS_HEX: Record<string, string> = {
  economy: "#3b82f6",
  politics: "#8b5cf6",
  healthcare: "#22c55e",
  education: "#14b8a6",
  work: "#f97316",
  housing: "#f59e0b",
  transport: "#0ea5e9",
  food: "#ef4444",
  service: "#ec4899",
  tech: "#7c3aed",
  other: "#6b7280",
};

interface DataPoint {
  id: string;
  x: number;
  y: number;
  category: string;
  sentiment: number;
}

interface Props {
  data: DataPoint[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d: DataPoint = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-lg px-3 py-2 text-sm shadow-md">
      <div className="font-medium text-black dark:text-white">
        {CATEGORY_LABELS[d.category] ?? d.category}
      </div>
      <div className="text-black/60 dark:text-white/60">
        感情スコア: {d.sentiment.toFixed(2)}
      </div>
    </div>
  );
}

export default function UmapScatterPlot({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-black/50 dark:text-white/50 text-sm">
        データなし。まず投稿を集めてUMAPを計算してください。
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, DataPoint[]> = {};
  for (const point of data) {
    if (!grouped[point.category]) grouped[point.category] = [];
    grouped[point.category].push(point);
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
        <XAxis
          dataKey="x"
          type="number"
          name="X"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          dataKey="y"
          type="number"
          name="Y"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => CATEGORY_LABELS[value] ?? value}
          iconType="circle"
          iconSize={8}
        />
        {Object.entries(grouped).map(([category, points]) => (
          <Scatter
            key={category}
            name={category}
            data={points}
            fill={CATEGORY_COLORS_HEX[category] ?? "#6b7280"}
            opacity={0.8}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
