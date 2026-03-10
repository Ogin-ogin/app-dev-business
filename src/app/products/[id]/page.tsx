"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Check, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

type ProductInfo = {
    name: string;
    category: string;
    monthly: number;
    desc: string;
    features: string[];
    priceEnvKey: string;
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
    },
};

export default function ProductDetailPage() {
    const params = useParams();
    const [loadingPlan, setLoadingPlan] = useState<"monthly" | null>(null);

    const productId = params.id as string;
    const product = PRODUCTS[productId] || PRODUCTS["sns-post-ai"];

    async function handleCheckout(plan: "monthly") {
        setLoadingPlan(plan);
        try {
            const priceId = process.env[product.priceEnvKey];
            const mode = "subscription";

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, mode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            if (data.url) {
                window.location.href = data.url;
            }
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
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Details */}
                    <div>
                        <span className="text-xs font-medium px-2 py-1 bg-black/[0.05] dark:bg-white/[0.1] rounded text-black/80 dark:text-white/80 mb-4 inline-block">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
                        <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed mb-8">
                            {product.desc}
                        </p>

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

                            <div className="flex flex-col gap-4 mb-8">
                                {/* Monthly Plan */}
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

                            {/* Checkout Buttons */}
                            <div className="flex flex-col gap-3">
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
