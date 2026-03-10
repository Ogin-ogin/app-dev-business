"use client";
import Link from "next/link";
import { ChevronRight, Heart, Zap, Phone } from "lucide-react";

const SAMPLE_POSTS = [
  {
    id: "1", category: "仕事", categoryColor: "bg-red-500/20 text-red-400",
    text: "上司が毎週MTGを急に入れてくる。全員のカレンダーを確認してから設定してほしい。もう限界。",
    keywords: ["職場", "上司", "会議"],
    empathy: 47, sentiment: -0.8,
    aiEmpathy: "それはほんとうにきついよね。毎週急に入れられたら集中できないし、計画も立てられないもんね。",
  },
  {
    id: "2", category: "経済", categoryColor: "bg-orange-500/20 text-orange-400",
    text: "電気代が去年と比べて2倍近くになってる。給料は全然上がらないのに出費だけ増える一方。",
    keywords: ["光熱費", "物価", "生活費"],
    empathy: 89, sentiment: -0.9,
    aiEmpathy: "わかるわかる。これだけ値上がりが続いてたら家計が本当に苦しいよね。",
  },
  {
    id: "3", category: "住まい", categoryColor: "bg-blue-500/20 text-blue-400",
    text: "アパートの更新料が高すぎる。礼金・敷金・更新料、全部廃止してほしい。",
    keywords: ["家賃", "更新料", "賃貸"],
    empathy: 32, sentiment: -0.7,
    aiEmpathy: "更新のたびにこんな費用がかかるのはほんとう理不尽だよね。",
  },
  {
    id: "4", category: "サービス", categoryColor: "bg-purple-500/20 text-purple-400",
    text: "ネット回線の速度が夜になると激遅になる。お金払ってるのになんで使えないの。",
    keywords: ["インターネット", "通信", "速度"],
    empathy: 56, sentiment: -0.6,
    aiEmpathy: "夜に使えないのはほんとう困るよね。仕事や趣味にも影響が出るもんね。",
  },
];

export default function FumanRadarDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="sticky top-0 z-50 bg-[var(--color-accent)] text-black px-4 py-2.5 flex items-center justify-between text-sm font-medium">
        <span>🎮 デモモード — サンプルデータを表示中</span>
        <Link href="/products/fuman-radar" className="flex items-center gap-1 underline underline-offset-2 font-semibold">
          本登録して使う <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">不満レーダー — タイムライン</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">みんなの不満をリアルタイムで共有・共感</p>
        </div>

        {/* Disabled post form hint */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-black/40 dark:text-white/40">今感じている不満や困りごとを書いてください...</p>
          <Link href="/products/fuman-radar" className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--color-accent)", color: "#000" }}>
            登録して投稿
          </Link>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {SAMPLE_POSTS.map(post => (
            <div key={post.id} className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.categoryColor}`}>{post.category}</span>
                <div className="flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                  <Heart className="w-3.5 h-3.5" /> {post.empathy}
                </div>
              </div>
              <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed">{post.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.keywords.map(k => (
                  <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-black/50 dark:text-white/50">#{k}</span>
                ))}
              </div>
              {/* AI Empathy */}
              <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: "var(--color-accent)", color: "#000" }}>
                💬 {post.aiEmpathy}
              </div>
            </div>
          ))}
        </div>

        {/* Voice demo CTA */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)" }}>
            <Phone className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-black dark:text-white text-sm">AI愚痴通話も体験できます</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">AIが共感的にあなたの愚痴を聞いてくれます</p>
          </div>
          <Link href="/products/fuman-radar" className="shrink-0 text-xs font-semibold underline underline-offset-2" style={{ color: "var(--color-accent)" }}>
            登録して試す →
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl p-6 text-center space-y-3">
          <p className="font-semibold text-black dark:text-white">投稿して共感を集めましょう</p>
          <p className="text-sm text-black/60 dark:text-white/60">投稿者は無料。分析者プラン（¥500/月）でUMAP・AI分析が使えます</p>
          <Link href="/products/fuman-radar" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--color-accent)", color: "#000" }}>
            <Zap className="w-4 h-4" /> 無料で投稿を始める
          </Link>
        </div>
      </div>
    </div>
  );
}
