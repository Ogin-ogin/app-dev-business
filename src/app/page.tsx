import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Zap, Code, Rocket, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "HoshiApp | AIで爆速・激安ウェブアプリ開発",
  description:
    "AIエージェントを活用し、クラウドワークスの1/10〜1/20の価格で高品質なウェブアプリを最短数日で納品。既製品アプリの利用からカスタム受注開発まで対応。",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 w-full mx-auto max-w-5xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-black/70 dark:text-white/70 text-sm px-4 py-1.5 rounded-full mb-8 font-medium">
            <span className="text-[var(--color-accent)]">⭐</span>
            AIが作る。あなたが輝く。
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl text-[var(--color-notion-text)] dark:text-white leading-tight">
            あなたのアイデアを、
            <br />
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">最速でアプリにする。</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-accent)]/80 -z-10 -rotate-1 rounded-sm"></span>
            </span>
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 mb-4 max-w-2xl leading-relaxed">
            クラウドワークスの <strong className="text-black dark:text-white">1/10〜1/20の価格</strong> で、
            AIエージェントが高品質なウェブアプリを <strong className="text-black dark:text-white">最短数日</strong> で納品します。
          </p>
          <p className="text-base text-black/40 dark:text-white/40 mb-10">
            既製品アプリの即時購入 ／ ゼロからのカスタム開発、どちらも対応
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/order"
              className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-8 py-3.5 rounded-md font-medium text-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              無料で開発相談する <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.08] text-black dark:text-white px-8 py-3.5 rounded-md font-medium text-lg hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors whitespace-nowrap"
            >
              既製品アプリを見る
            </Link>
          </div>
        </section>

        {/* Social Proof Numbers */}
        <section className="px-6 py-10 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[var(--color-accent)]">1/20</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">競合比の価格</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-accent)]">最短2日</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">納品スピード</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-accent)]">¥3,980〜</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">開発スタート価格</p>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <h2 className="text-3xl font-bold mb-4 text-center">なぜ HoshiApp が選ばれるのか</h2>
          <p className="text-center text-black/50 dark:text-white/50 mb-12">
            AIエージェントの力で、従来の開発会社に不可能だったことを実現します
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">圧倒的なスピード</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                Claude × Gemini の並列AI開発パイプラインで、従来なら週単位の作業を数日に短縮。
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">驚異的なコスパ</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                クラウドワークスの1/10〜1/20の価格。AIによる開発コスト削減を全額ユーザーに還元。
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">即戦力クオリティ</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                Next.js・Firebase・Vercelスタックで本番対応。オーナーの最終チェックを経て納品。
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <h2 className="text-3xl font-bold mb-4 text-center">料金プラン</h2>
          <p className="text-center text-black/50 dark:text-white/50 mb-12">
            シンプルで分かりやすい料金設定。まずは無料相談から。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 小規模 */}
            <div className="p-6 rounded-lg border border-black/[0.08] dark:border-white/[0.08]">
              <h3 className="font-semibold text-lg mb-1">小規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">LP・シンプルツール（〜3画面）</p>
              <p className="text-3xl font-bold mb-6">¥3,980<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["3画面まで", "レスポンシブ対応", "Vercelデプロイ込み"].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />{f}</li>
                ))}
              </ul>
            </div>
            {/* 中規模 */}
            <div className="p-6 rounded-lg border-2 border-[var(--color-accent)] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-black text-xs font-bold px-3 py-1 rounded-full">人気</span>
              <h3 className="font-semibold text-lg mb-1">中規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">管理画面・API連携（〜10画面）</p>
              <p className="text-3xl font-bold mb-6">¥9,800<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["10画面まで", "Firebase認証・DB連携", "外部API連携", "Vercelデプロイ込み"].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />{f}</li>
                ))}
              </ul>
            </div>
            {/* 大規模 */}
            <div className="p-6 rounded-lg border border-black/[0.08] dark:border-white/[0.08]">
              <h3 className="font-semibold text-lg mb-1">大規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">複数機能・DB設計・認証込み</p>
              <p className="text-3xl font-bold mb-6">¥29,800<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["画面数無制限", "DB設計・セキュリティ設定", "決済（Stripe）連携", "保守サポートオプション"].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05] text-center">
          <h2 className="text-3xl font-bold mb-4">まずは無料で相談してみませんか？</h2>
          <p className="text-black/50 dark:text-white/50 mb-8 max-w-lg mx-auto">
            AIが要件をヒアリングして自動で見積もりを出します。費用・納期の確認だけでもOKです。
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-black px-8 py-3.5 rounded-md font-medium text-lg hover:opacity-90 transition-opacity"
          >
            無料で相談する <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
