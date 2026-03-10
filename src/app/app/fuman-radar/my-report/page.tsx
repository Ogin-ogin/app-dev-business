"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, TrendingUp, Hash, BarChart2 } from "lucide-react";

interface ReportData {
  postCount: number;
  avgSentiment: number;
  topCategory: string;
  topKeywords: string[];
  reportText: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  economy: "経済・お金",
  politics: "政治",
  healthcare: "医療・健康",
  education: "教育",
  work: "仕事・職場",
  housing: "住まい",
  transport: "交通",
  food: "食事・飲食",
  service: "サービス・接客",
  tech: "テクノロジー",
  other: "その他",
};

export default function MyReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/fuman-radar/my-report");
        if (!res.ok) throw new Error("レポートの取得に失敗しました");
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message ?? "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">個人レポート</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          あなたの投稿傾向をAIが分析します
        </p>
      </div>

      {loading && (
        <div className="text-sm text-black/50 dark:text-white/50 py-8 text-center">
          読み込み中...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && report && report.postCount === 0 && (
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-8 text-center space-y-3">
          <FileText className="w-10 h-10 text-black/20 dark:text-white/20 mx-auto" />
          <p className="text-sm text-black/60 dark:text-white/60">
            まだ投稿がありません。不満を投稿してレポートを生成しましょう！
          </p>
          <Link
            href="/app/fuman-radar"
            className="inline-block bg-[var(--color-accent)] text-black font-semibold text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            投稿する
          </Link>
        </div>
      )}

      {!loading && !error && report && report.postCount > 0 && (
        <div className="space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                <span className="text-xs text-black/50 dark:text-white/50">投稿数</span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white">
                {report.postCount}
              </div>
            </div>

            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-black/40 dark:text-white/40" />
                <span className="text-xs text-black/50 dark:text-white/50">平均感情スコア</span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white">
                {typeof report.avgSentiment === "number"
                  ? report.avgSentiment.toFixed(2)
                  : "-"}
              </div>
            </div>

            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-black/40 dark:text-white/40" />
                <span className="text-xs text-black/50 dark:text-white/50">主なカテゴリ</span>
              </div>
              <div className="text-lg font-bold text-black dark:text-white">
                {CATEGORY_LABELS[report.topCategory] ?? report.topCategory ?? "-"}
              </div>
            </div>

            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-black/40 dark:text-white/40" />
                <span className="text-xs text-black/50 dark:text-white/50">頻出キーワード</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {report.topKeywords && report.topKeywords.length > 0 ? (
                  report.topKeywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs bg-black/[0.05] dark:bg-white/[0.07] text-black/70 dark:text-white/70 px-2 py-0.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-black/40 dark:text-white/40">-</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Report */}
          {report.reportText ? (
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
              <h2 className="text-base font-semibold text-black dark:text-white mb-3">
                AIによる分析レポート
              </h2>
              <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                {report.reportText}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5 text-center">
              <p className="text-sm text-black/50 dark:text-white/50">
                AIレポートはまだ生成されていません。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
