"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const INCOME_CATEGORIES = ["売上", "業務委託", "副業収入", "投資収入", "その他収入"];
const EXPENSE_CATEGORIES = ["通信費", "交通費", "書籍・教材", "ソフトウェア", "広告費", "外注費", "食費（交際費）", "家賃（在宅）", "その他経費"];

export default function AddFinancePage() {
    const router = useRouter();
    const [type, setType] = useState<"income" | "expense">("income");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [memo, setMemo] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const finalCategory = category === "カスタム" ? customCategory : category;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!finalCategory || !amount || !date) return;

        setLoading(true);
        try {
            const res = await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, category: finalCategory, amount: Number(amount), date, memo }),
            });

            if (!res.ok) throw new Error("Failed to save");

            setSuccess(true);
            setTimeout(() => {
                router.push("/app/finance");
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
                <p className="text-sm text-black/50 dark:text-white/50 mt-1">ダッシュボードに移動します...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">収支を追加</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">収入または支出を記録します</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 space-y-5">
                {/* Type Toggle */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">種別</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setType("income"); setCategory(""); }}
                            className={`flex-1 py-2.5 rounded-md text-sm font-semibold border transition-colors ${
                                type === "income"
                                    ? "bg-green-500 text-white border-green-500"
                                    : "border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                            }`}
                        >
                            収入
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType("expense"); setCategory(""); }}
                            className={`flex-1 py-2.5 rounded-md text-sm font-semibold border transition-colors ${
                                type === "expense"
                                    ? "bg-red-500 text-white border-red-500"
                                    : "border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                            }`}
                        >
                            支出
                        </button>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">カテゴリ</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                        className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                        <option value="">選択してください</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="カスタム">カスタム入力</option>
                    </select>
                    {category === "カスタム" && (
                        <input
                            type="text"
                            value={customCategory}
                            onChange={e => setCustomCategory(e.target.value)}
                            placeholder="カテゴリ名を入力"
                            required
                            className="mt-2 w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    )}
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">金額（円）</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="例: 50000"
                        min="1"
                        required
                        className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>

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

                {/* Memo */}
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">メモ（任意）</label>
                    <input
                        type="text"
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                        placeholder="例: クライアントA案件"
                        className="w-full border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
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
