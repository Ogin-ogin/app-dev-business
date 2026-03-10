"use client";

import { useState, useEffect } from "react";
import TrendChart from "@/components/fuman-radar/TrendChart";
import PaidFeatureGate from "@/components/fuman-radar/PaidFeatureGate";

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

interface TrendItem {
  id: string;
  totalPosts: number;
  categoryCounts: Record<string, number>;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/fuman-radar/trends");
        if (!res.ok) throw new Error("トレンドデータの取得に失敗しました");
        const data = await res.json();
        setTrends(data.trends ?? data ?? []);
      } catch (err: any) {
        setError(err.message ?? "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">トレンド</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          不満の投稿数の時系列推移とカテゴリ別分布
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <PaidFeatureGate featureName="trends">
        {/* Chart */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-black dark:text-white mb-4">
            投稿数の推移
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-[300px] text-sm text-black/50 dark:text-white/50">
              読み込み中...
            </div>
          ) : (
            <TrendChart data={trends} />
          )}
        </div>

        {/* Table */}
        {!loading && trends.length > 0 && (
          <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.1] dark:border-white/[0.1]">
              <h2 className="text-sm font-semibold text-black dark:text-white">
                詳細データ
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-black/50 dark:text-white/50">
                      期間
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-black/50 dark:text-white/50">
                      総投稿数
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-black/50 dark:text-white/50">
                      主なカテゴリ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((item) => {
                    const topCat = item.categoryCounts
                      ? Object.entries(item.categoryCounts).sort(
                          ([, a], [, b]) => b - a
                        )[0]
                      : null;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-black/[0.05] dark:border-white/[0.05] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-3 text-black dark:text-white font-medium">
                          {item.id}
                        </td>
                        <td className="px-5 py-3 text-right text-black dark:text-white">
                          {item.totalPosts}
                        </td>
                        <td className="px-5 py-3 text-black/60 dark:text-white/60">
                          {topCat
                            ? `${CATEGORY_LABELS[topCat[0]] ?? topCat[0]} (${topCat[1]})`
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PaidFeatureGate>
    </div>
  );
}
