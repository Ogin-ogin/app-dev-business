"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Check, Zap, Loader2, Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SnsPostPreview, FinancePreview, LifelogPreview, FumanRadarPreview } from "@/components/app-previews/AppPreviews";

type ProductInfo = {
    name: string;
    category: string;
    monthly: number;
    desc: string;
    features: string[];
    priceEnvKey: string;
    demoHref: string;
    rating: number;
    reviews: number;
    slideLabels: string[];
    PreviewComponent: React.ComponentType<{ slide: number }>;
};

const PRODUCTS: Record<string, ProductInfo> = {
    "sns-post-ai": {
        name: "SNS投稿AI量産ツール",
        category: "Marketing",
        monthly: 580,
        desc: "テーマ入力からX/Instagram/LinkedIn向け投稿文を一括生成するツール。フリーランスや副業マーケターに最適です。AIが各プラットフォームに最適なトーンと文字数で自動生成します。",
        features: [
            "テーマ・トーン入力",
            "プラットフォーム一括選択 (X / Insta / LinkedIn)",
            "Gemini Flash 2.0 / Claude Sonnet 対応",
            "生成履歴の自動保存",
            "テンプレート保存機能",
        ],
        priceEnvKey: "NEXT_PUBLIC_PRICE_APP1_MONTHLY",
        demoHref: "/demo/sns-post",
        rating: 4.8,
        reviews: 124,
        slideLabels: ["入力画面", "生成結果", "履歴"],
        PreviewComponent: SnsPostPreview,
    },
    "freelance-dashboard": {
        name: "フリーランス収支ダッシュボード",
        category: "Data Analysis",
        monthly: 680,
        desc: "売上・経費入力でグラフ化＋AIによる来月予測＆節税アドバイス。フリーランスや個人事業主の確定申告・収支管理に最適です。",
        features: [
            "収支入力・編集・削除",
            "月次グラフ（Recharts）",
            "AI売上予測・節税アドバイス",
            "カテゴリ管理（プリセット＋カスタム）",
            "CSV書き出し（BOM付きUTF-8）",
        ],
        priceEnvKey: "NEXT_PUBLIC_PRICE_APP2_MONTHLY",
        demoHref: "/demo/finance",
        rating: 4.6,
        reviews: 89,
        slideLabels: ["ダッシュボード", "収支一覧", "AIレポート"],
        PreviewComponent: FinancePreview,
    },
    "life-log-tool": {
        name: "AIライフログ＆振り返り",
        category: "Productivity",
        monthly: 480,
        desc: "毎日の作業・気分のログからAIが週次レポートと分析を自動生成。習慣化・生産性向上・自己改善に最適です。",
        features: [
            "日次ログ入力（気分・タグ・メモ）",
            "カレンダービュー",
            "AI週次レポート生成",
            "目標設定・達成率グラフ",
            "連続記録ストリーク",
        ],
        priceEnvKey: "NEXT_PUBLIC_PRICE_APP3_MONTHLY",
        demoHref: "/demo/lifelog",
        rating: 4.7,
        reviews: 203,
        slideLabels: ["今日のログ", "カレンダー", "AIレポート"],
        PreviewComponent: LifelogPreview,
    },
    "fuman-radar": {
        name: "不満レーダー",
        category: "Market Research",
        monthly: 500,
        desc: "民衆の不満・愚痴を匿名収集してAIが分析・可視化。開発者・事業者がリアルな市場ニーズを低コストで把握できます。投稿者（無料）と分析者（¥500/月）の2面マーケットプレイス型。",
        features: [
            "匿名愚痴投稿（投稿者：無料）",
            "AI共感コメント自動生成",
            "「わかる」共感ボタン",
            "UMAP散布図可視化（分析者向け）",
            "AI対話分析・カテゴリ探索（分析者向け）",
            "トレンド時系列グラフ（分析者向け）",
            "個人不満分析レポート",
        ],
        priceEnvKey: "NEXT_PUBLIC_PRICE_APP4_MONTHLY",
        demoHref: "/demo/fuman-radar",
        rating: 4.5,
        reviews: 67,
        slideLabels: ["タイムライン", "UMAPマップ", "AI愚痴通話"],
        PreviewComponent: FumanRadarPreview,
    },
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
    return (
        <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.floor(rating) ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-black/20 dark:text-white/20"}`} />
            ))}
            <span className="text-sm font-medium text-black dark:text-white">{rating.toFixed(1)}</span>
            <span className="text-sm text-black/40 dark:text-white/40">({reviews}件のレビュー)</span>
        </div>
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const [loadingPlan, setLoadingPlan] = useState<"monthly" | null>(null);
    const [slide, setSlide] = useState(0);

    const productId = params.id as string;
    const product = PRODUCTS[productId] || PRODUCTS["sns-post-ai"];
    const { PreviewComponent } = product;

    async function handleCheckout(plan: "monthly") {
        setLoadingPlan(plan);
        try {
            const priceId = process.env[product.priceEnvKey];
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, mode: "subscription" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Checkout failed");
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            setLoadingPlan(null);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> 一覧に戻る
                </Link>

                {/* Screenshot Carousel */}
                <div className="mb-12">
                    <div className="relative">
                        {/* Preview */}
                        <div className="rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06]">
                            <PreviewComponent slide={slide} />
                        </div>

                        {/* Nav arrows */}
                        <button
                            onClick={() => setSlide(s => Math.max(0, s - 1))}
                            disabled={slide === 0}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center disabled:opacity-0 hover:bg-black/80 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                        <button
                            onClick={() => setSlide(s => Math.min(2, s + 1))}
                            disabled={slide === 2}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center disabled:opacity-0 hover:bg-black/80 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Slide indicators + labels */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {product.slideLabels.map((label, i) => (
                            <button
                                key={i}
                                onClick={() => setSlide(i)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    slide === i
                                        ? "text-black"
                                        : "bg-black/[0.05] dark:bg-white/[0.08] text-black/50 dark:text-white/50 hover:bg-black/[0.1]"
                                }`}
                                style={slide === i ? { background: "var(--color-accent)" } : undefined}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Details */}
                    <div>
                        <span className="text-xs font-medium px-2 py-1 bg-black/[0.05] dark:bg-white/[0.1] rounded text-black/80 dark:text-white/80 mb-3 inline-block">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
                        <div className="mb-6">
                            <StarRating rating={product.rating} reviews={product.reviews} />
                        </div>
                        <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed mb-8">
                            {product.desc}
                        </p>

                        {/* Demo CTA */}
                        <Link
                            href={product.demoHref}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--color-accent)]/40 text-sm font-semibold mb-8 hover:bg-[var(--color-accent)]/10 transition-colors text-black dark:text-white"
                        >
                            <Play className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                            無料でデモを試す
                        </Link>

                        <h3 className="font-semibold text-xl mb-4">Key Features</h3>
                        <ul className="flex flex-col gap-3">
                            {product.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-full bg-[var(--color-accent)]/20 p-1 text-black dark:text-[var(--color-accent)]">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-black/80 dark:text-white/80">{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Pricing Card */}
                    <div>
                        <div className="border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-8 bg-white dark:bg-[#191919] sticky top-24 shadow-sm">
                            <h3 className="text-2xl font-bold mb-6">Pricing</h3>

                            <div className="flex flex-col gap-4 mb-6">
                                <label className="border border-black/[0.1] dark:border-[var(--color-accent)]/50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                                    <div className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-xl pointer-events-none"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-4 border-[var(--color-accent)] bg-white"></div>
                                        <div>
                                            <div className="font-semibold">Monthly Plan</div>
                                            <div className="text-sm text-black/60 dark:text-white/60">Hosting & updates included</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-lg">¥{product.monthly}</div>
                                        <div className="text-xs text-black/60 dark:text-white/60">/ month</div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={product.demoHref}
                                    className="w-full border border-black/[0.15] dark:border-white/[0.15] text-black dark:text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-sm"
                                >
                                    <Play className="w-4 h-4" /> 無料デモを試す
                                </Link>
                                <button
                                    onClick={() => handleCheckout("monthly")}
                                    disabled={loadingPlan !== null}
                                    className="w-full bg-[var(--color-accent)] text-black font-semibold rounded-lg py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loadingPlan === "monthly" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Zap className="w-5 h-5" />
                                    )}
                                    月額プランで始める ¥{product.monthly}/月
                                </button>
                            </div>
                            <p className="text-center text-xs text-black/50 dark:text-white/50 mt-3">
                                月額プランにはAI利用料・ホスティング費用が含まれます
                            </p>
                            <p className="text-center text-xs text-black/50 dark:text-white/50 mt-1">
                                Powered by Stripe. Cancel anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
