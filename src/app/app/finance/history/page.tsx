"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Entry = {
    id: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    date: string;
    memo: string;
};

export default function FinanceHistoryPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState("");

    useEffect(() => {
        fetchData();
    }, [year, month]);

    async function fetchData() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ year: String(year) });
            if (month) params.set("month", month);
            const res = await fetch(`/api/finance?${params}`);
            const data = await res.json();
            setEntries(data.entries || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("この項目を削除しますか？")) return;
        await fetch(`/api/finance?id=${id}`, { method: "DELETE" });
        setEntries(prev => prev.filter(e => e.id !== id));
    }

    const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);
    const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">収支履歴</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">過去の収支を確認・管理します</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] rounded-md px-3 py-1.5 text-sm"
                >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] rounded-md px-3 py-1.5 text-sm"
                >
                    <option value="">全月</option>
                    {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={String(i+1)}>{i+1}月</option>
                    ))}
                </select>
                <div className="flex gap-2">
                    {(["all", "income", "expense"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                                filter === f
                                    ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                                    : "border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60"
                            }`}
                        >
                            {f === "all" ? "すべて" : f === "income" ? "収入" : "支出"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary row */}
            <div className="flex gap-4 mb-4 text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">収入合計: ¥{totalIncome.toLocaleString()}</span>
                <span className="text-red-600 dark:text-red-400 font-medium">支出合計: ¥{totalExpense.toLocaleString()}</span>
                <span className={`font-medium ${totalIncome - totalExpense >= 0 ? "text-[var(--color-accent)]" : "text-red-500"}`}>
                    純利益: ¥{(totalIncome - totalExpense).toLocaleString()}
                </span>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-black/40 dark:text-white/40">読み込み中...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-sm text-black/50 dark:text-white/50">データがありません</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b border-black/[0.05] dark:border-white/[0.05]">
                            <tr className="text-left text-black/50 dark:text-white/50">
                                <th className="px-4 py-3 font-medium">日付</th>
                                <th className="px-4 py-3 font-medium">種別</th>
                                <th className="px-4 py-3 font-medium">カテゴリ</th>
                                <th className="px-4 py-3 font-medium">メモ</th>
                                <th className="px-4 py-3 font-medium text-right">金額</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                            {filtered.map(entry => (
                                <tr key={entry.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                                    <td className="px-4 py-3 text-black/70 dark:text-white/70">
                                        {new Date(entry.date).toLocaleDateString("ja-JP")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            entry.type === "income"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                            {entry.type === "income" ? "収入" : "支出"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-black dark:text-white">{entry.category}</td>
                                    <td className="px-4 py-3 text-black/50 dark:text-white/50 max-w-[200px] truncate">{entry.memo || "—"}</td>
                                    <td className={`px-4 py-3 text-right font-semibold ${
                                        entry.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    }`}>
                                        {entry.type === "income" ? "+" : "-"}¥{entry.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="text-black/20 dark:text-white/20 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
