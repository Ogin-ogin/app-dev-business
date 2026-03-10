"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function FinanceSettingsPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [downloading, setDownloading] = useState(false);

    async function handleCSVExport() {
        setDownloading(true);
        try {
            const res = await fetch(`/api/finance?year=${year}`);
            const data = await res.json();
            const entries = data.entries || [];

            const header = "日付,種別,カテゴリ,金額,メモ\n";
            const rows = entries.map((e: any) => {
                const date = new Date(e.date).toLocaleDateString("ja-JP");
                const type = e.type === "income" ? "収入" : "支出";
                return `${date},${type},${e.category},${e.amount},"${e.memo || ""}"`;
            }).join("\n");

            const bom = "\uFEFF";
            const blob = new Blob([bom + header + rows], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `収支_${year}年.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">設定</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">データのエクスポートなどを行います</p>
            </div>

            <div className="max-w-lg space-y-6">
                {/* CSV Export */}
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                    <h2 className="font-semibold text-black dark:text-white mb-1">CSV書き出し</h2>
                    <p className="text-sm text-black/50 dark:text-white/50 mb-4">確定申告用にCSVファイルをダウンロードします</p>
                    <div className="flex items-center gap-3">
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-zinc-900 rounded-md px-3 py-2 text-sm"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}年</option>)}
                        </select>
                        <button
                            onClick={handleCSVExport}
                            disabled={downloading}
                            className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            {downloading ? "作成中..." : "CSVダウンロード"}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6">
                    <h2 className="font-semibold text-black dark:text-white mb-1">収支ダッシュボードについて</h2>
                    <ul className="text-sm text-black/60 dark:text-white/60 space-y-1 mt-3 list-disc list-inside">
                        <li>収支データはFirestoreに安全に保存されます</li>
                        <li>AIレポートはGemini AIで生成されます</li>
                        <li>CSVはBOM付きUTF-8形式（Excel対応）</li>
                        <li>価格: 月額¥680 / 買い切り¥6,800</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
