"use client";
import Link from "next/link";
import { ChevronRight, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SAMPLE_DATA = [
  { month: "10月", income: 280000, expense: 75000 },
  { month: "11月", income: 310000, expense: 92000 },
  { month: "12月", income: 350000, expense: 110000 },
  { month: "1月", income: 290000, expense: 68000 },
  { month: "2月", income: 320000, expense: 85000 },
  { month: "3月", income: 328000, expense: 89400 },
];

const SAMPLE_ENTRIES = [
  { type: "income", category: "Webデザイン案件", amount: 85000, date: "3/8", memo: "○○株式会社" },
  { type: "expense", category: "Adobe CC", amount: -6480, date: "3/5", memo: "月額サブスク" },
  { type: "income", category: "コンサルティング", amount: 50000, date: "3/3", memo: "△△様" },
  { type: "expense", category: "サーバー代", amount: -1980, date: "3/1", memo: "Vercel Pro" },
  { type: "income", category: "ライティング案件", amount: 28000, date: "2/28", memo: "" },
];

export default function FinanceDemoPage() {
  const totalIncome = 328000;
  const totalExpense = 89400;
  const profit = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Demo Banner */}
      <div className="sticky top-0 z-50 bg-[var(--color-accent)] text-black px-4 py-2.5 flex items-center justify-between text-sm font-medium">
        <span>🎮 デモモード — サンプルデータを表示中</span>
        <Link href="/products/freelance-dashboard" className="flex items-center gap-1 underline underline-offset-2 font-semibold">
          本登録して使う <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">収支ダッシュボード</h1>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">2026年3月のサンプルデータ</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs bg-black/[0.05] dark:bg-white/[0.08] text-black/60 dark:text-white/60">2026年</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "収入合計", value: totalIncome, color: "text-green-500", icon: <TrendingUp className="w-4 h-4" /> },
            { label: "支出合計", value: totalExpense, color: "text-red-500", icon: <TrendingDown className="w-4 h-4" /> },
            { label: "純利益", value: profit, color: "text-[var(--color-accent)]", icon: <Minus className="w-4 h-4" /> },
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
              <div className={`flex items-center gap-1.5 ${card.color} mb-2 text-xs font-medium`}>
                {card.icon} {card.label}
              </div>
              <div className="text-xl font-bold text-black dark:text-white">
                ¥{card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6">
          <h2 className="font-semibold text-black dark:text-white mb-4">月次推移</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DATA} barGap={2}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} tickFormatter={v => `¥${v/10000}万`} />
                <Tooltip formatter={(v) => `¥${Number(v).toLocaleString()}`} contentStyle={{ background: "#191919", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="income" fill="#22c55e" radius={[3,3,0,0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6">
          <h2 className="font-semibold text-black dark:text-white mb-4">最近の収支</h2>
          <div className="space-y-3">
            {SAMPLE_ENTRIES.map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${entry.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{entry.category}</p>
                    {entry.memo && <p className="text-xs text-black/40 dark:text-white/40">{entry.memo}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${entry.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {entry.type === "income" ? "+" : ""}¥{Math.abs(entry.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-black/40 dark:text-white/40">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl p-6 text-center space-y-3">
          <p className="font-semibold text-black dark:text-white">自分のデータで試してみましょう</p>
          <p className="text-sm text-black/60 dark:text-white/60">登録するとデータ入力・AI分析・CSV書き出しが使えます</p>
          <Link href="/products/freelance-dashboard" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--color-accent)", color: "#000" }}>
            <Zap className="w-4 h-4" /> ¥680/月で始める
          </Link>
        </div>
      </div>
    </div>
  );
}
