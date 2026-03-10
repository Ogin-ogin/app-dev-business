"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getMoodBgColor(mood: number) {
    if (mood >= 4) return "bg-green-500/20 border-green-500/40";
    if (mood === 3) return "bg-yellow-500/20 border-yellow-500/40";
    if (mood > 0) return "bg-red-500/20 border-red-500/40";
    return "";
}

export default function LifelogCalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [entries, setEntries] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [year, month]);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch(`/api/lifelog?year=${year}&month=${month}&limit=100`);
            const data = await res.json();
            setEntries(data.entries || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    function prevMonth() {
        if (month === 1) { setYear(y => y - 1); setMonth(12); }
        else setMonth(m => m - 1);
        setSelectedDay(null);
    }

    function nextMonth() {
        if (month === 12) { setYear(y => y + 1); setMonth(1); }
        else setMonth(m => m + 1);
        setSelectedDay(null);
    }

    // Build calendar grid
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const entryMap: Record<string, LogEntry[]> = {};
    entries.forEach(e => {
        const dateKey = e.date.split("T")[0];
        if (!entryMap[dateKey]) entryMap[dateKey] = [];
        entryMap[dateKey].push(e);
    });

    function getAvgMood(dayEntries: LogEntry[]): number {
        if (dayEntries.length === 0) return 0;
        return Math.round(dayEntries.reduce((s, e) => s + e.mood, 0) / dayEntries.length);
    }

    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (cells.length % 7 !== 0) cells.push(null);

    const today = new Date().toISOString().split("T")[0];

    const selectedDateKey = selectedDay;
    const selectedEntries = selectedDateKey ? (entryMap[selectedDateKey] || []) : [];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">カレンダー</h1>
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1">月ごとのログを確認できます</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-md border border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-black dark:text-white min-w-[80px] text-center">
                        {year}年{month}月
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-md border border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs text-black/50 dark:text-white/50">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500/30 inline-block"></span>良い(4-5)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-500/30 inline-block"></span>普通(3)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/30 inline-block"></span>悪い(1-2)</span>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 mb-6">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS.map((d, i) => (
                        <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-black/50 dark:text-white/50"}`}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days */}
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-black/40 dark:text-white/40 text-sm">読み込み中...</div>
                ) : (
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (day === null) {
                                return <div key={`empty-${idx}`} className="aspect-square" />;
                            }
                            const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayEntries = entryMap[dateKey] || [];
                            const avgMood = getAvgMood(dayEntries);
                            const isToday = dateKey === today;
                            const isSelected = dateKey === selectedDay;
                            const weekday = new Date(year, month - 1, day).getDay();

                            return (
                                <button
                                    key={dateKey}
                                    onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs transition-all ${
                                        isSelected
                                            ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30"
                                            : avgMood > 0
                                                ? getMoodBgColor(avgMood)
                                                : "border-transparent hover:border-black/[0.1] dark:hover:border-white/[0.1]"
                                    } ${isToday ? "ring-2 ring-[var(--color-accent)]" : ""}`}
                                >
                                    <span className={`font-medium ${weekday === 0 ? "text-red-500" : weekday === 6 ? "text-blue-500" : "text-black dark:text-white"} ${isToday ? "font-bold" : ""}`}>
                                        {day}
                                    </span>
                                    {avgMood > 0 && (
                                        <span className="text-base leading-none mt-0.5">{MOOD_EMOJI[avgMood]}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal Overlay */}
            {selectedDay && (
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-black dark:text-white">
                            {new Date(selectedDay + "T00:00:00").toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "long" })}
                        </h2>
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"
                        >
                            <X className="w-4 h-4 text-black/50 dark:text-white/50" />
                        </button>
                    </div>

                    {selectedEntries.length === 0 ? (
                        <p className="text-sm text-black/50 dark:text-white/50">この日のログはありません</p>
                    ) : (
                        <div className="space-y-4">
                            {selectedEntries.map(entry => (
                                <div key={entry.id} className="border border-black/[0.06] dark:border-white/[0.06] rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{MOOD_EMOJI[entry.mood]}</span>
                                        <span className="text-sm font-medium text-black dark:text-white">{MOOD_LABEL[entry.mood]}</span>
                                        {entry.goalAchieved && (
                                            <span className="ml-auto text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded-full">目標達成</span>
                                        )}
                                    </div>
                                    {entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {entry.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-black/[0.05] dark:bg-white/[0.05] px-2 py-0.5 rounded-full text-black/60 dark:text-white/60">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    {entry.reflection && (
                                        <p className="text-sm text-black/70 dark:text-white/70">{entry.reflection}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
