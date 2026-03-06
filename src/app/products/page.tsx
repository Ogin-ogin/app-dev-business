import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "既製品アプリ一覧",
    description:
        "HoshiAppが提供するAI搭載の既製品ウェブアプリ一覧。SNS投稿自動生成ツール・フリーランス収支ダッシュボードなど。月額¥480〜の手頃な価格でご利用いただけます。",
};

export default function ProductsPage() {
    const products = [
        {
            id: "sns-post-ai",
            name: "SNS投稿AI量産ツール",
            category: "Marketing",
            monthly: 580,
            buyout: 5800,
            desc: "テーマ入力からX/Instagram/LinkedIn向け投稿文を一括生成するツール。"
        },
        {
            id: "freelance-dashboard",
            name: "フリーランス収支ダッシュボード",
            category: "Data Analysis",
            monthly: 680,
            buyout: 6800,
            desc: "売上・経費入力でグラフ化＋AIによる来月予測＆節税アドバイス。"
        },
        {
            id: "life-log-tool",
            name: "AIライフログ＆振り返り",
            category: "Productivity",
            monthly: 480,
            buyout: 4800,
            desc: "毎日の作業・気分のログからAIが週次レポートと分析を自動生成。"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">既製品アプリ一覧</h1>
                    <p className="text-black/60 dark:text-white/60">
                        すぐに使えるAIツールを月額サブスクリプションまたは買い切りでご利用いただけます。
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {products.map(p => (
                        <Link href={`/products/${p.id}`} key={p.id} className="block group">
                            <div className="p-6 border border-black/[0.1] dark:border-white/[0.1] rounded-xl hover:border-black/[0.2] dark:hover:border-white/[0.2] transition-colors bg-white dark:bg-[#191919]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-medium px-2 py-1 bg-black/[0.05] dark:bg-white/[0.1] rounded text-black/80 dark:text-white/80 mb-3 inline-block">
                                            {p.category}
                                        </span>
                                        <h2 className="text-2xl font-semibold group-hover:underline underline-offset-4 decoration-[var(--color-accent)]">{p.name}</h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-lg">¥{p.monthly.toLocaleString()} <span className="text-sm font-normal text-black/60 dark:text-white/60">/ 月</span></div>
                                        <div className="text-sm text-black/60 dark:text-white/60">または ¥{p.buyout.toLocaleString()} 買い切り</div>
                                    </div>
                                </div>
                                <p className="text-black/80 dark:text-white/80 mb-6">{p.desc}</p>
                                <div className="font-medium flex items-center gap-1 group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent)] transition-colors">
                                    詳細を見る <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
