"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Flame, SmilePlus } from "lucide-react";

type LogEntry = {
    id: string;
    date: string;
    mood: number;
    tags: string[];
    reflection: string;
    goalAchieved: boolean;
};

const MOOD_EMOJI = ["", "😔", "😕", "😐", "🙂", "😊"];
const MOOD_LABEL = ["", "とても悪い", "悪い", "普通", "良い", "とても良い"];

function getMoodColor(mood: number) {
    if (mood >= 4) return "text-green-500";
    if (mood === 3) return "text-yellow-500";
    return "text-red-500";
}

function calcStreak(entries: LogEntry[]): number {
    if (entries.length === 0) return 0;
    const dates = [...new Set(entries.map(e => e.date.split("T")[0]))].sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    let current = today;
    for (const date of dates) {
        if (date === current) {
            streak++;
            const d = new Date(current);
            d.setDate(d.getDate() - 1);
            current = d.toISOString().split("T")[0];
        } else {
            break;
        }
    }
    return streak;
}

function calcWeeklyAvgMood(entries: LogEntry[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekEntries = entries.filter(e => new Date(e.date) >= oneWeekAgo);
    if (weekEntries.length === 0) return 0;
    const avg = weekEntries.reduce((s, e) => s + e.mood, 0) / weekEntries.length;
    return Math.round(avg * 10) / 10;
}

export default function LifelogPage() {
    const [entries, setEntries] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch("/api/lifelog?limit=20");
            const data = await res.json();
            setEntries(data.entries || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const today = new Date().toISOString().split("T")[0];
    const todayEntries = entries.filter(e => e.date.startsWith(today));
    const recentEntries = [...entries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    const streak = calcStreak(entries);
    const weeklyAvgMood = calcWeeklyAvgMood(entries);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">今日のログ</h1>
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                        {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                    </p>
                </div>
                <Link
                    href="/app/lifelog/add"
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
                >
                    <Plus className="w-4 h-4" /> 新規記録
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mb-2">
                        <SmilePlus className="w-4 h-4 text-[var(--color-accent)]" />
                        今週の気分平均
                    </div>
                    {loading ? (
                        <div className="text-2xl font-bold text-black/30 dark:text-white/30">--</div>
                    ) : weeklyAvgMood > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{MOOD_EMOJI[Math.round(weeklyAvgMood)]}</span>
                            <span className="text-2xl font-bold text-black dark:text-white">{weeklyAvgMood}</span>
                            <span className="text-sm text-black/50 dark:text-white/50">/ 5</span>
                        </div>
                    ) : (
                        <div className="text-sm text-black/40 dark:text-white/40">データなし</div>
                    )}
                </div>
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mb-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        記録ストリーク
                    </div>
                    {loading ? (
                        <div className="text-2xl font-bold text-black/30 dark:text-white/30">--</div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-black dark:text-white">{streak}</span>
                            <span className="text-sm text-black/50 dark:text-white/50">日連続</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's logs */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-black dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> 今日の記録
                    </h2>
                </div>
                {loading ? (
                    <div className="text-sm text-black/40 dark:text-white/40">読み込み中...</div>
                ) : todayEntries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-black/50 dark:text-white/50 mb-4">今日のログはまだありません</p>
                        <Link
                            href="/app/lifelog/add"
                            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
                        >
                            <Plus className="w-4 h-4" /> 今日のログを記録する
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayEntries.map(entry => (
                            <div key={entry.id} className="border border-black/[0.06] dark:border-white/[0.06] rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{MOOD_EMOJI[entry.mood]}</span>
                                    <span className={`text-sm font-medium ${getMoodColor(entry.mood)}`}>{MOOD_LABEL[entry.mood]}</span>
                                    {entry.goalAchieved && (
                                        <span className="ml-auto text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded-full">目標達成</span>
                                    )}
                                </div>
                                {entry.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {entry.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-black/[0.05] dark:bg-white/[0.05] px-2 py-0.5 rounded-full text-black/60 dark:text-white/60">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                {entry.reflection && (
                                    <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">{entry.reflection}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent logs */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-black dark:text-white">直近のログ</h2>
                    <Link href="/app/lifelog/calendar" className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white">
                        カレンダーで見る →
                    </Link>
                </div>
                {loading ? (
                    <div className="text-sm text-black/40 dark:text-white/40">読み込み中...</div>
                ) : recentEntries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-black/50 dark:text-white/50">まだログがありません</p>
                    </div>
                ) : (
                    <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                        {recentEntries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{MOOD_EMOJI[entry.mood]}</span>
                                    <div>
                                        <div className="text-sm font-medium text-black dark:text-white">
                                            {new Date(entry.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}
                                        </div>
                                        <div className="text-xs text-black/50 dark:text-white/50">
                                            {entry.tags.slice(0, 3).join(" · ")}
                                            {entry.reflection && ` · ${entry.reflection.slice(0, 20)}${entry.reflection.length > 20 ? "..." : ""}`}
                                        </div>
                                    </div>
                                </div>
                                {entry.goalAchieved && (
                                    <span className="text-xs text-[var(--color-accent)]">✓ 目標達成</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
