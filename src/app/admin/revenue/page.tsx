"use client";

import { useEffect, useState } from "react";

type Order = {
    id: string;
    amount?: number;
    status?: string;
    createdAt?: string;
};

type MonthlyRevenue = {
    month: string;
    count: number;
    total: number;
};

export default function AdminRevenuePage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/orders");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch {
            setError("売上データの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    // Aggregate by month
    const monthlyMap = new Map<string, MonthlyRevenue>();
    for (const order of orders) {
        if (!order.createdAt) continue;
        const date = new Date(order.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        if (!monthlyMap.has(key)) {
            monthlyMap.set(key, { month: label, count: 0, total: 0 });
        }
        const entry = monthlyMap.get(key)!;
        entry.count += 1;
        entry.total += order.amount || 0;
    }
    const monthly = Array.from(monthlyMap.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([, v]) => v);

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentYearPrefix = `${now.getFullYear()}-`;

    const thisMonthOrders = orders.filter(o => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
        );
    });
    const thisYearOrders = orders.filter(o => {
        if (!o.createdAt) return false;
        return new Date(o.createdAt).getFullYear() === now.getFullYear();
    });

    const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + (o.amount || 0), 0);
    const thisYearRevenue = thisYearOrders.reduce((s, o) => s + (o.amount || 0), 0);
    const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);

    // suppress unused variable warnings
    void currentMonthKey;
    void currentYearPrefix;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">売上レポート</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">月次売上の集計を確認します</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "今月の売上", value: thisMonthRevenue, count: thisMonthOrders.length },
                    { label: "今年の売上", value: thisYearRevenue, count: thisYearOrders.length },
                    { label: "累計売上", value: totalRevenue, count: orders.length },
                ].map(card => (
                    <div
                        key={card.label}
                        className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5"
                    >
                        <div className="text-xs text-black/50 dark:text-white/50 mb-2">{card.label}</div>
                        {loading ? (
                            <div className="h-8 w-28 bg-black/[0.05] dark:bg-white/[0.05] rounded animate-pulse mb-1" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-[var(--color-accent)]">
                                    ¥{card.value.toLocaleString()}
                                </div>
                                <div className="text-xs text-black/40 dark:text-white/40 mt-1">
                                    {card.count}件
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Monthly Table */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-black/[0.05] dark:border-white/[0.05]">
                    <h2 className="text-base font-semibold text-black dark:text-white">月別売上</h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-black/40 dark:text-white/40">
                        読み込み中...
                    </div>
                ) : monthly.length === 0 ? (
                    <div className="text-center py-16 text-sm text-black/50 dark:text-white/50">
                        売上データがありません
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b border-black/[0.05] dark:border-white/[0.05]">
                            <tr className="text-left text-black/50 dark:text-white/50">
                                <th className="px-4 py-3 font-medium">月</th>
                                <th className="px-4 py-3 font-medium text-right">件数</th>
                                <th className="px-4 py-3 font-medium text-right">売上合計</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                            {monthly.map(row => (
                                <tr key={row.month} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                                    <td className="px-4 py-3 font-medium text-black dark:text-white">{row.month}</td>
                                    <td className="px-4 py-3 text-right text-black/70 dark:text-white/70">{row.count}件</td>
                                    <td className="px-4 py-3 text-right font-semibold text-[var(--color-accent)]">
                                        ¥{row.total.toLocaleString()}
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
