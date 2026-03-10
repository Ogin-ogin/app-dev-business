"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface RecommendResult {
    reply: string;
    recommended: string[];
}

const PRODUCT_NAMES: Record<string, string> = {
    "sns-post-ai": "SNS投稿AI量産ツール",
    "freelance-dashboard": "フリーランス収支ダッシュボード",
    "life-log-tool": "AIライフログ＆振り返り",
};

export default function RecommendWidget() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RecommendResult | null>(null);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setResult(null);
        setError("");

        try {
            const res = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResult(data);
        } catch (e: any) {
            setError("エラーが発生しました。もう一度お試しください。");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mb-12 border border-[var(--color-accent)]/30 rounded-2xl p-6 bg-[var(--color-accent)]/5">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-lg font-semibold">AIに相談する（無料）</h2>
            </div>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                欲しいアプリや解決したい課題を入力すると、ぴったりな既製品をAIが紹介します。
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="例：SNSの投稿を自動で作りたい、収支を管理したい..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-black/[0.12] dark:border-white/[0.12] bg-white dark:bg-[#232323] text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-4 py-2.5 bg-[var(--color-accent)] text-black font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    相談する
                </button>
            </form>

            {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
            )}

            {result && (
                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#232323] border border-black/[0.08] dark:border-white/[0.08]">
                    <p className="text-sm text-black/80 dark:text-white/80 whitespace-pre-wrap leading-relaxed">{result.reply}</p>
                    {result.recommended.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {result.recommended.map(id => (
                                <Link
                                    key={id}
                                    href={`/products/${id}`}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-[var(--color-accent)]/10 text-black dark:text-white rounded-lg hover:bg-[var(--color-accent)]/20 transition-colors"
                                >
                                    {PRODUCT_NAMES[id] || id}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
