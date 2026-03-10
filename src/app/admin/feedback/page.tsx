"use client";

import { useEffect, useState } from "react";

type Feedback = {
    id: string;
    productId?: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={star <= rating ? "text-yellow-400" : "text-black/10 dark:text-white/10"}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    async function fetchFeedbacks() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/feedback");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setFeedbacks(data.feedbacks || []);
        } catch {
            setError("フィードバックデータの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    const avgRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
        : "—";

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">フィードバック</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                    ユーザーからのレビューを確認します
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Summary */}
            {!loading && feedbacks.length > 0 && (
                <div className="flex gap-6 mb-6">
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5 flex items-center gap-4">
                        <div>
                            <div className="text-xs text-black/50 dark:text-white/50 mb-1">件数</div>
                            <div className="text-2xl font-bold text-black dark:text-white">{feedbacks.length}</div>
                        </div>
                        <div className="w-px h-10 bg-black/[0.08] dark:bg-white/[0.08]" />
                        <div>
                            <div className="text-xs text-black/50 dark:text-white/50 mb-1">平均評価</div>
                            <div className="text-2xl font-bold text-yellow-500">{avgRating}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-black/40 dark:text-white/40">
                        読み込み中...
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-16 text-sm text-black/50 dark:text-white/50">
                        フィードバックがありません
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-black/[0.05] dark:border-white/[0.05]">
                                <tr className="text-left text-black/50 dark:text-white/50">
                                    <th className="px-4 py-3 font-medium">商品ID</th>
                                    <th className="px-4 py-3 font-medium">評価</th>
                                    <th className="px-4 py-3 font-medium">コメント</th>
                                    <th className="px-4 py-3 font-medium">日付</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                {feedbacks.map(fb => (
                                    <tr key={fb.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                                        <td className="px-4 py-3 font-mono text-xs text-black/50 dark:text-white/50">
                                            {fb.productId || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StarRating rating={fb.rating || 0} />
                                        </td>
                                        <td className="px-4 py-3 text-black/70 dark:text-white/70 max-w-[300px]">
                                            {fb.comment || <span className="text-black/30 dark:text-white/30 italic">コメントなし</span>}
                                        </td>
                                        <td className="px-4 py-3 text-black/50 dark:text-white/50 whitespace-nowrap">
                                            {fb.createdAt
                                                ? new Date(fb.createdAt).toLocaleDateString("ja-JP")
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
