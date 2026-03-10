"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Plus } from "lucide-react";
import Link from "next/link";

type Entry = {
    id: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    date: string;
    memo: string;
};

type MonthlyData = {
    month: string;
    収入: number;
    支出: number;
    純利益: number;
};

const MONTHS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

export default function FinanceDashboard() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, [year]);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch(`/api/finance?year=${year}`);
            const data = await res.json();
            setEntries(data.entries || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const monthlyData: MonthlyData[] = MONTHS.map((month, i) => {
        const monthEntries = entries.filter(e => new Date(e.date).getMonth() === i);
        const income = monthEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
        const expense = monthEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
        return { month, 収入: income, 支出: expense, 純利益: income - expense };
    });

    const recentEntries = [...entries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">収支ダッシュボード</h1>
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1">収入・支出を管理してAIが分析します</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] rounded-md px-3 py-1.5 text-sm"
                    >
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}年</option>
                        ))}
                    </select>
                    <Link
                        href="/app/finance/add"
                        className="flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
                    >
                        <Plus className="w-4 h-4" /> 収支を追加
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        総収入
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ¥{totalIncome.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mb-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        総支出
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ¥{totalExpense.toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mb-2">
                        <DollarSign className="w-4 h-4 text-[var(--color-accent)]" />
                        純利益
                    </div>
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-[var(--color-accent)]" : "text-red-500"}`}>
                        ¥{netProfit.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 mb-8">
                <h2 className="text-base font-semibold mb-4 text-black dark:text-white">{year}年 月次収支</h2>
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-black/40 dark:text-white/40 text-sm">読み込み中...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `¥${(v/10000).toFixed(0)}万`} />
                            <Tooltip formatter={(v) => `¥${Number(v).toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="収入" fill="#4ade80" radius={[3,3,0,0]} />
                            <Bar dataKey="支出" fill="#f87171" radius={[3,3,0,0]} />
                            <Bar dataKey="純利益" fill="#d4ff47" radius={[3,3,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Recent Entries */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-black dark:text-white">最近の収支</h2>
                    <Link href="/app/finance/history" className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white">
                        すべて見る →
                    </Link>
                </div>
                {loading ? (
                    <div className="text-sm text-black/40 dark:text-white/40">読み込み中...</div>
                ) : recentEntries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-black/50 dark:text-white/50 mb-4">まだデータがありません</p>
                        <Link href="/app/finance/add" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
                            最初の収支を追加する
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                        {recentEntries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${entry.type === "income" ? "bg-green-400" : "bg-red-400"}`} />
                                    <div>
                                        <div className="text-sm font-medium text-black dark:text-white">{entry.category}</div>
                                        <div className="text-xs text-black/50 dark:text-white/50">
                                            {new Date(entry.date).toLocaleDateString("ja-JP")}
                                            {entry.memo && ` · ${entry.memo}`}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${entry.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                    {entry.type === "income" ? "+" : "-"}¥{entry.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
