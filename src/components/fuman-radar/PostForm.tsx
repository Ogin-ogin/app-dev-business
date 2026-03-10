"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const CATEGORIES: { value: string; label: string }[] = [
    { value: "economy", label: "経済・お金" },
    { value: "politics", label: "政治" },
    { value: "healthcare", label: "医療・健康" },
    { value: "education", label: "教育" },
    { value: "work", label: "仕事・職場" },
    { value: "housing", label: "住まい" },
    { value: "transport", label: "交通" },
    { value: "food", label: "食事・飲食" },
    { value: "service", label: "サービス・接客" },
    { value: "tech", label: "テクノロジー" },
    { value: "other", label: "その他" },
];

interface Props {
    onPosted: (post: any) => void;
}

export default function PostForm({ onPosted }: Props) {
    const [text, setText] = useState("");
    const [category, setCategory] = useState("other");
    const [loading, setLoading] = useState(false);
    const [posted, setPosted] = useState<any>(null);
    const [error, setError] = useState("");

    const MAX_CHARS = 500;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError("");
        setPosted(null);

        try {
            const res = await fetch("/api/fuman-radar/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim(), category }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "投稿に失敗しました");
            }

            const data = await res.json();
            setPosted(data);
            onPosted(data);
            setText("");
            setCategory("other");
        } catch (err: any) {
            setError(err.message || "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
            <h2 className="text-base font-semibold text-black dark:text-white mb-4">不満を投稿する</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Textarea */}
                <div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                        placeholder="今感じている不満や困りごとを書いてください..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-black/[0.1] dark:border-white/[0.1] bg-zinc-50 dark:bg-black/30 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition"
                        disabled={loading}
                    />
                    <div className="flex justify-end mt-1">
                        <span className={`text-xs ${text.length >= MAX_CHARS ? "text-red-500" : "text-black/40 dark:text-white/40"}`}>
                            {text.length} / {MAX_CHARS}
                        </span>
                    </div>
                </div>

                {/* Category selector */}
                <div>
                    <label className="block text-xs font-medium text-black/60 dark:text-white/60 mb-1.5">
                        カテゴリ
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-md border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] text-black dark:text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="flex items-center gap-2 bg-[var(--color-accent)] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                投稿中...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                投稿する
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* AI Empathy Response */}
            {posted?.aiEmpathy && (
                <div className="mt-4 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-black/60 dark:text-white/60">AIからの共感メッセージ</span>
                    </div>
                    <p className="text-sm text-black dark:text-white leading-relaxed">{posted.aiEmpathy}</p>
                </div>
            )}
        </div>
    );
}
