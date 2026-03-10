"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import UmapScatterPlot from "@/components/fuman-radar/UmapScatterPlot";
import PaidFeatureGate from "@/components/fuman-radar/PaidFeatureGate";

interface UmapData {
  coordinates: Array<{
    id: string;
    x: number;
    y: number;
    category: string;
    sentiment: number;
  }>;
  computedAt?: string;
}

export default function MapPage() {
  const [umapData, setUmapData] = useState<UmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState("");

  async function fetchUmap() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fuman-radar/umap");
      if (!res.ok) throw new Error("UMAPデータの取得に失敗しました");
      const data = await res.json();
      setUmapData(data);
    } catch (err: any) {
      setError(err.message ?? "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecompute() {
    setRecomputing(true);
    setError("");
    try {
      const res = await fetch("/api/fuman-radar/umap", { method: "POST" });
      if (!res.ok) throw new Error("UMAP計算に失敗しました");
      const data = await res.json();
      setUmapData(data);
    } catch (err: any) {
      setError(err.message ?? "エラーが発生しました");
    } finally {
      setRecomputing(false);
    }
  }

  useEffect(() => {
    fetchUmap();
  }, []);

  const coordinates = umapData?.coordinates ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">UMAPマップ</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            投稿の意味的な分布を2D空間で可視化
          </p>
        </div>
        <button
          onClick={handleRecompute}
          disabled={recomputing || loading}
          className="flex items-center gap-2 text-sm bg-[var(--color-accent)] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-none"
        >
          <RefreshCw className={`w-4 h-4 ${recomputing ? "animate-spin" : ""}`} />
          {recomputing ? "計算中..." : "再計算"}
        </button>
      </div>

      {umapData?.computedAt && (
        <p className="text-xs text-black/40 dark:text-white/40">
          最終計算: {new Date(umapData.computedAt).toLocaleString("ja-JP")}
        </p>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <PaidFeatureGate featureName="umap">
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4">
          {loading ? (
            <div className="flex items-center justify-center h-[400px] text-sm text-black/50 dark:text-white/50">
              読み込み中...
            </div>
          ) : (
            <UmapScatterPlot data={coordinates} />
          )}
        </div>
      </PaidFeatureGate>

      {!loading && coordinates.length > 0 && (
        <p className="text-xs text-black/40 dark:text-white/40 text-center">
          {coordinates.length}件の投稿をプロット中
        </p>
      )}
    </div>
  );
}
