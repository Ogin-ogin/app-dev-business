"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Receipt, Loader2 } from "lucide-react";

type ReportData = {
    forecast: string;
    taxAdvice: string;
    summary: { totalIncome: number; totalExpense: number; netProfit: number };
    monthly?: Record<string, { income: number; expense: number }>;
};

export default function FinanceReportPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<ReportData | null>(null);
    const [error, setError] = useState("");

    async function generateReport() {
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const res = await fetch("/api/finance/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "レポート生成に失敗しました");
            setReport(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">AIレポート</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">収支データをAIが分析して売上予測・節税アドバイスを提供します</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-8">
                <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] rounded-md px-3 py-2 text-sm"
                >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-5 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? "分析中..." : "AIレポートを生成"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4 mb-6 text-sm">
                    {error}
                </div>
            )}

            {!report && !loading && !error && (
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-12 text-center">
                    <Sparkles className="w-10 h-10 text-[var(--color-accent)] mx-auto mb-4 opacity-50" />
                    <p className="text-black/50 dark:text-white/50 text-sm">「AIレポートを生成」ボタンを押すと、収支データをAIが分析します</p>
                </div>
            )}

            {loading && (
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-black/50 dark:text-white/50 text-sm">AIが収支データを分析しています...</p>
                </div>
            )}

            {report && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 text-center">
                            <div className="text-xs text-black/50 dark:text-white/50 mb-1">総収入</div>
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">¥{report.summary.totalIncome.toLocaleString()}</div>
                        </div>
                        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 text-center">
                            <div className="text-xs text-black/50 dark:text-white/50 mb-1">総支出</div>
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">¥{report.summary.totalExpense.toLocaleString()}</div>
                        </div>
                        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 text-center">
                            <div className="text-xs text-black/50 dark:text-white/50 mb-1">純利益</div>
                            <div className={`text-xl font-bold ${report.summary.netProfit >= 0 ? "text-[var(--color-accent)]" : "text-red-500"}`}>
                                ¥{report.summary.netProfit.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Forecast */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
                            <h2 className="font-semibold text-black dark:text-white">売上予測・改善提案</h2>
                        </div>
                        <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">{report.forecast}</p>
                    </div>

                    {/* Tax Advice */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Receipt className="w-5 h-5 text-blue-500" />
                            <h2 className="font-semibold text-black dark:text-white">節税アドバイス</h2>
                        </div>
                        <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">{report.taxAdvice}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
