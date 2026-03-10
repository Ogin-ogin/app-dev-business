"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

type ReportData = {
    summary: string;
    improvements: string;
    nextGoals: string;
};

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentWeek = getWeekNumber(currentDate);

export default function LifelogReportPage() {
    const [year, setYear] = useState(currentYear);
    const [week, setWeek] = useState(currentWeek);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<ReportData | null>(null);
    const [error, setError] = useState("");

    async function handleGenerate() {
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const res = await fetch("/api/lifelog/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year, week }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "エラーが発生しました");
            }
            const data = await res.json();
            setReport(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const weekOptions = Array.from({ length: 53 }, (_, i) => i + 1);
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">AIレポート</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">週次ログをAIが分析して振り返りレポートを生成します</p>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-black dark:text-white mb-4">対象週を選択</h2>
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs text-black/50 dark:text-white/50 mb-1.5">年</label>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            {yearOptions.map(y => (
                                <option key={y} value={y}>{y}年</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-black/50 dark:text-white/50 mb-1.5">週</label>
                        <select
                            value={week}
                            onChange={e => setWeek(Number(e.target.value))}
                            className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            {weekOptions.map(w => (
                                <option key={w} value={w}>第{w}週</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-5 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                生成中...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                AIレポートを生成
                            </>
                        )}
                    </button>
                </div>
                {week === currentWeek && year === currentYear && (
                    <p className="text-xs text-black/40 dark:text-white/40 mt-2">※ 現在の週（第{currentWeek}週）が選択されています</p>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-sm text-black/60 dark:text-white/60">AIがログを分析しています...</p>
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Report */}
            {report && !loading && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">📋</span>
                            <h3 className="text-base font-semibold text-black dark:text-white">週次サマリー</h3>
                        </div>
                        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
                    </div>

                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">💡</span>
                            <h3 className="text-base font-semibold text-black dark:text-white">改善提案</h3>
                        </div>
                        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{report.improvements}</p>
                    </div>

                    <div className="bg-white dark:bg-[#191919] border border-[var(--color-accent)]/30 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🎯</span>
                            <h3 className="text-base font-semibold text-black dark:text-white">来週の目標</h3>
                        </div>
                        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{report.nextGoals}</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!report && !loading && !error && (
                <div className="text-center py-16 text-black/40 dark:text-white/40">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">週と年を選択して「AIレポートを生成」ボタンを押してください</p>
                </div>
            )}
        </div>
    );
}
