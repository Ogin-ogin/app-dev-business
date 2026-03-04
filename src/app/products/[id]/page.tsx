import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Check, Zap } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    // Mock data for demo purposes
    const product = {
        id: params.id,
        name: "SNS投稿AI量産ツール",
        category: "Marketing",
        monthly: 580,
        buyout: 5800,
        desc: "テーマ入力からX/Instagram/LinkedIn向け投稿文を一括生成するツール。フリーランスや副業マーケターに最適です。AIが各プラットフォームに最適なトーンと文字数で自動生成します。",
        features: [
            "テーマ・トーン入力",
            "プラットフォーム一括選択 (X / Insta / LinkedIn)",
            "Gemini Flash 2.0 / Claude Sonnet 対応",
            "生成履歴の自動保存",
            "テンプレート保存機能"
        ]
    };

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

                                {/* Buyout Plan */}
                                <label className="border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border border-black/[0.2] dark:border-white/[0.2]"></div>
                                        <div>
                                            <div className="font-semibold">Lifetime Buyout</div>
                                            <div className="text-sm text-black/60 dark:text-white/60">One-time payment</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-lg">¥{product.buyout}</div>
                                    </div>
                                </label>
                            </div>

                            <button className="w-full bg-[var(--color-accent)] text-black font-semibold rounded-lg py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                <Zap className="w-5 h-5" /> Get Instant Access
                            </button>
                            <p className="text-center text-xs text-black/50 dark:text-white/50 mt-4">
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
