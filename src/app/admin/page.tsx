"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingCart, DollarSign, MessageSquare } from "lucide-react";

type Stats = {
    totalUsers: number;
    monthlyOrderCount: number;
    monthlyRevenue: number;
    totalFeedbacks: number;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/stats");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setStats(data);
        } catch {
            setError("統計情報の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    const kpiCards = [
        {
            label: "総ユーザー数",
            value: stats ? stats.totalUsers.toLocaleString() : "—",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: "今月の注文数",
            value: stats ? stats.monthlyOrderCount.toLocaleString() : "—",
            icon: ShoppingCart,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/20",
        },
        {
            label: "今月の売上",
            value: stats ? `¥${stats.monthlyRevenue.toLocaleString()}` : "—",
            icon: DollarSign,
            color: "text-[var(--color-accent)]",
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
            label: "フィードバック件数",
            value: stats ? stats.totalFeedbacks.toLocaleString() : "—",
            icon: MessageSquare,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">管理ダッシュボード</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">プラットフォームの概要を確認します</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <Icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                                <span className="text-sm text-black/60 dark:text-white/60">{card.label}</span>
                            </div>
                            {loading ? (
                                <div className="h-8 w-24 bg-black/[0.05] dark:bg-white/[0.05] rounded animate-pulse" />
                            ) : (
                                <div className="text-2xl font-bold text-black dark:text-white">{card.value}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                <h2 className="text-base font-semibold text-black dark:text-white mb-4">クイックアクセス</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "注文管理", href: "/admin/orders" },
                        { label: "ユーザー管理", href: "/admin/users" },
                        { label: "フィードバック", href: "/admin/feedback" },
                        { label: "売上レポート", href: "/admin/revenue" },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="flex items-center justify-center py-3 px-4 border border-black/[0.1] dark:border-white/[0.1] rounded-lg text-sm font-medium text-black/70 dark:text-white/70 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
