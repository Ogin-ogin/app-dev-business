"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Product name lookup (matches products/[id]/page.tsx mock data)
const PRODUCT_NAMES: Record<string, string> = {
    "sns-post-ai": "SNS投稿AI量産ツール",
    "1": "SNS投稿AI量産ツール",
};

function getProductName(id: string): string {
    return PRODUCT_NAMES[id] ?? `商品 (${id})`;
}

export default function FeedbackPage() {
    const params = useParams();
    const productId = String(params.id);
    const productName = getProductName(productId);

    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) {
            setError("評価を選択してください");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating, comment }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "送信に失敗しました");
            }
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "送信に失敗しました");
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-10 max-w-md w-full text-center">
                    <CheckCircle2 className="w-14 h-14 text-[var(--color-accent)] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
                        ありがとうございました！
                    </h1>
                    <p className="text-black/60 dark:text-white/60 text-sm mb-6">
                        「{productName}」へのフィードバックを受け付けました。
                        今後のサービス改善に活かします。
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> 商品一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-8 max-w-md w-full">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> 戻る
                </Link>

                <h1 className="text-xl font-bold text-black dark:text-white mb-1">
                    フィードバック
                </h1>
                <p className="text-sm text-black/50 dark:text-white/50 mb-6">
                    {productName}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-3">
                            評価 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-9 h-9 transition-colors ${
                                            star <= (hovered || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-black/15 dark:text-white/15"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-black/50 dark:text-white/50 mt-2">
                                {["", "非常に悪い", "悪い", "普通", "良い", "非常に良い"][rating]}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-2">
                            コメント（任意）
                        </label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows={4}
                            placeholder="ご意見・ご感想をお書きください..."
                            className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#111] rounded-lg px-4 py-3 text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[var(--color-accent)] text-black font-semibold rounded-lg py-3 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "送信中..." : "フィードバックを送信"}
                    </button>
                </form>
            </div>
        </div>
    );
}
