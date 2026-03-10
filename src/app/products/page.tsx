import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecommendWidget from "@/components/RecommendWidget";
import Link from "next/link";
import { ArrowRight, Star, Play } from "lucide-react";

export const metadata: Metadata = {
    title: "既製品アプリ一覧",
    description:
        "HoshiAppが提供するAI搭載の既製品ウェブアプリ一覧。SNS投稿自動生成ツール・フリーランス収支ダッシュボードなど。月額¥480〜の手頃な価格でご利用いただけます。",
};

// Simple colored app icon component
function AppIcon({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${color}`}>
            {children}
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.floor(rating) ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-black/20 dark:text-white/20"}`} />
            ))}
            <span className="text-xs text-black/50 dark:text-white/50 ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ProductsPage() {
    const products = [
        {
            id: "sns-post-ai",
            name: "SNS投稿AI量産ツール",
            category: "Marketing",
            monthly: 580,
            desc: "テーマ入力からX/Instagram/LinkedIn向け投稿文を一括生成するツール。フリーランスや副業マーケターに最適。",
            icon: "✦",
            iconBg: "bg-purple-500/20 dark:bg-purple-500/20",
            rating: 4.8,
            reviews: 124,
            demoHref: "/demo/sns-post",
            tags: ["AI生成", "SNS", "マーケティング"],
        },
        {
            id: "freelance-dashboard",
            name: "フリーランス収支ダッシュボード",
            category: "Data Analysis",
            monthly: 680,
            desc: "売上・経費入力でグラフ化＋AIによる来月予測＆節税アドバイス。確定申告対策に。",
            icon: "📊",
            iconBg: "bg-green-500/20",
            rating: 4.6,
            reviews: 89,
            demoHref: "/demo/finance",
            tags: ["収支管理", "AI分析", "確定申告"],
        },
        {
            id: "life-log-tool",
            name: "AIライフログ＆振り返り",
            category: "Productivity",
            monthly: 480,
            desc: "毎日の作業・気分のログからAIが週次レポートと分析を自動生成。習慣化・自己改善に。",
            icon: "📓",
            iconBg: "bg-blue-500/20",
            rating: 4.7,
            reviews: 203,
            demoHref: "/demo/lifelog",
            tags: ["習慣化", "ログ", "AI分析"],
        },
        {
            id: "fuman-radar",
            name: "不満レーダー",
            category: "Market Research",
            monthly: 500,
            desc: "民衆の不満・愚痴を匿名収集してAIが分析・可視化。リアルな市場ニーズを低コストで把握。",
            icon: "📡",
            iconBg: "bg-red-500/20",
            rating: 4.5,
            reviews: 67,
            demoHref: "/demo/fuman-radar",
            tags: ["市場調査", "UMAP", "AI分析"],
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-4">既製品アプリ一覧</h1>
                    <p className="text-black/60 dark:text-white/60">
                        すぐに使えるAIツールを月額サブスクリプションでご利用いただけます。AI利用料・ホスティング費用込み。
                    </p>
                </div>

                <RecommendWidget />

                <div className="grid md:grid-cols-2 gap-5">
                    {products.map(p => (
                        <div key={p.id} className="border border-black/[0.1] dark:border-white/[0.1] rounded-2xl bg-white dark:bg-[#191919] overflow-hidden hover:border-black/[0.2] dark:hover:border-white/[0.2] transition-colors group">
                            {/* Card body */}
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <AppIcon color={p.iconBg}>{p.icon}</AppIcon>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-black/[0.05] dark:bg-white/[0.1] rounded text-black/70 dark:text-white/70">
                                                {p.category}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-semibold text-black dark:text-white leading-tight group-hover:text-[var(--color-accent)] transition-colors">
                                            {p.name}
                                        </h2>
                                        <StarRating rating={p.rating} />
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-bold text-lg text-black dark:text-white">¥{p.monthly.toLocaleString()}</div>
                                        <div className="text-xs text-black/50 dark:text-white/50">/ 月</div>
                                    </div>
                                </div>

                                <p className="text-sm text-black/70 dark:text-white/70 mb-4 leading-relaxed">{p.desc}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {p.tags.map(t => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-black/60 dark:text-white/60">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2">
                                    <Link
                                        href={p.demoHref}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[var(--color-accent)]/40 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]/10 text-black dark:text-white"
                                    >
                                        <Play className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                                        デモを試す
                                    </Link>
                                    <Link
                                        href={`/products/${p.id}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-black"
                                        style={{ background: "var(--color-accent)" }}
                                    >
                                        詳細・登録 <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
