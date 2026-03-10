"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const MOOD_OPTIONS = [
    { value: 1, emoji: "😔", label: "とても悪い" },
    { value: 2, emoji: "😕", label: "悪い" },
    { value: 3, emoji: "😐", label: "普通" },
    { value: 4, emoji: "🙂", label: "良い" },
    { value: 5, emoji: "😊", label: "とても良い" },
];

const TAG_OPTIONS = ["仕事", "勉強", "運動", "読書", "趣味", "家事", "外出", "休息"];

export default function AddLifelogPage() {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [mood, setMood] = useState<number>(3);
    const [tags, setTags] = useState<string[]>([]);
    const [reflection, setReflection] = useState("");
    const [goalAchieved, setGoalAchieved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function toggleTag(tag: string) {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!date || !mood) return;

        setLoading(true);
        try {
            const res = await fetch("/api/lifelog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, mood, tags, reflection, goalAchieved }),
            });

            if (!res.ok) throw new Error("Failed to save");

            setSuccess(true);
            setTimeout(() => {
                router.push("/app/lifelog");
            }, 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-lg font-semibold text-black dark:text-white">保存しました！</p>
                <p className="text-sm text-black/50 dark:text-white/50 mt-1">ログ一覧に移動します...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">新規記録</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">今日の振り返りを記録しましょう</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 space-y-6">
                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>

                {/* Mood */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-3">気分スコア</label>
                    <div className="flex gap-2">
                        {MOOD_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setMood(opt.value)}
                                title={opt.label}
                                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border transition-all ${
                                    mood === opt.value
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                        : "border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                }`}
                            >
                                <span className="text-2xl">{opt.emoji}</span>
                                <span className="text-xs text-black/50 dark:text-white/50 hidden sm:block">{opt.value}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-center text-black/50 dark:text-white/50 mt-2">
                        選択中: {MOOD_OPTIONS.find(o => o.value === mood)?.emoji} {MOOD_OPTIONS.find(o => o.value === mood)?.label}
                    </p>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-3">作業タグ（複数選択可）</label>
                    <div className="grid grid-cols-4 gap-2">
                        {TAG_OPTIONS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`py-2 px-2 rounded-md text-xs font-medium border transition-all ${
                                    tags.includes(tag)
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-black dark:text-white"
                                        : "border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reflection */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                        今日の振り返り
                        <span className="ml-1 text-black/40 dark:text-white/40 font-normal">（任意）</span>
                    </label>
                    <textarea
                        value={reflection}
                        onChange={e => setReflection(e.target.value)}
                        placeholder="何をした？感じたこと、気づきなど..."
                        rows={4}
                        className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                    />
                </div>

                {/* Goal Achieved */}
                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={goalAchieved}
                            onChange={e => setGoalAchieved(e.target.checked)}
                            className="w-4 h-4 rounded accent-[var(--color-accent)]"
                        />
                        <span className="text-sm font-medium text-black/70 dark:text-white/70">今日の目標を達成した</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--color-accent)] text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                    {loading ? "保存中..." : "保存する"}
                </button>
            </form>
        </div>
    );
}
