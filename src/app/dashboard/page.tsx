import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import Link from "next/link";
import { ExternalLink, Settings } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
            <Header />
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">My Dashboard</h1>
                        <p className="text-black/60 dark:text-white/60 text-sm">Manage your purchased apps and active subscriptions.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-medium border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] px-4 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                    </button>
                </div>

                <SubscriptionStatus />

                {/* Apps List */}
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Active Apps</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Example App */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-black dark:text-white">SNS投稿AI量産ツール</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)] rounded">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60 mb-6 flex-1">
                            Monthly Subscription. Next billing date: Apr 4, 2026.
                        </p>
                        <div className="flex gap-3">
                            <Link href="/app/sns-post" className="flex-1 flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
                                Open App <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* App2: Finance Dashboard */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-black dark:text-white">収支ダッシュボード</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)] rounded">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60 mb-6 flex-1">
                            収入・支出を記録してAIが売上予測・節税アドバイスを提供します。
                        </p>
                        <div className="flex gap-3">
                            <Link href="/app/finance" className="flex-1 flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
                                Open App <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* App3: ライフログ */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-black dark:text-white">AIライフログ</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)] rounded">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60 mb-6 flex-1">
                            毎日の作業・気分を記録してAIが週次レポートと振り返りを自動生成します。
                        </p>
                        <div className="flex gap-3">
                            <Link href="/app/lifelog" className="flex-1 flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
                                Open App <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* App4: 不満レーダー */}
                    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-black dark:text-white">不満レーダー</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)] rounded">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60 mb-6 flex-1">
                            匿名愚痴投稿＋AI分析で市場の不満データを可視化。投稿者無料、分析者¥500/月。
                        </p>
                        <div className="flex gap-3">
                            <Link href="/app/fuman-radar" className="flex-1 flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
                                Open App <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
