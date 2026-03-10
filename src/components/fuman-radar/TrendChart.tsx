"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendItem {
  id: string;
  totalPosts: number;
  categoryCounts: Record<string, number>;
}

interface Props {
  data: TrendItem[];
}

export default function TrendChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-black/50 dark:text-white/50 text-sm">
        トレンドデータがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
        <XAxis
          dataKey="id"
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "var(--tw-prose-body, #fff)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
          labelFormatter={(label) => `期間: ${label}`}
          formatter={(value: any) => [value, "投稿数"]}
        />
        <Bar dataKey="totalPosts" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
