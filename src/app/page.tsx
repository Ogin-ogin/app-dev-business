import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Zap, Code, Rocket, CheckCircle } from "lucide-react";
import AppShowcase from "@/components/AppShowcase";

export const metadata: Metadata = {
  title: "HoshiApp | AIで爆速・激安ウェブアプリ開発",
  description:
    "AIエージェントを活用し、クラウドワークスの1/10〜1/20の価格で高品質なウェブアプリを最短数日で納品。既製品アプリの利用からカスタム受注開発まで対応。",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-36 w-full mx-auto max-w-5xl flex flex-col items-center text-center animate-fade-in">
          <div
            className="inline-flex items-center gap-2 border text-sm px-4 py-1.5 rounded-full mb-8 font-medium animate-slide-up"
            style={{
              background: "var(--color-accent)",
              borderColor: "transparent",
              color: "#000",
              animationDelay: "0.1s",
            }}
          >
            <span>⭐</span>
            AIが作る。あなたが輝く。
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-[var(--color-notion-text)] dark:text-white leading-tight animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            あなたのアイデアを、
            <br />
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">最速でアプリにする。</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 -z-10 -rotate-1 rounded-sm"
                style={{ background: "var(--color-accent)", opacity: 0.5 }}
              ></span>
            </span>
          </h1>
          <p
            className="text-xl text-black/60 dark:text-white/60 mb-4 max-w-2xl leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            クラウドワークスの{" "}
            <strong className="text-black dark:text-white">1/10〜1/20の価格</strong>{" "}で、
            AIエージェントが高品質なウェブアプリを{" "}
            <strong className="text-black dark:text-white">最短数日</strong>{" "}で納品します。
          </p>
          <p
            className="text-base text-black/40 dark:text-white/40 mb-10 animate-slide-up"
            style={{ animationDelay: "0.35s" }}
          >
            既製品アプリの即時購入 ／ ゼロからのカスタム開発、どちらも対応
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 items-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/order"
              className="flex items-center gap-2 text-black px-8 py-3.5 rounded-full font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 whitespace-nowrap shadow-lg"
              style={{ background: "var(--color-accent)" }}
            >
              無料で開発相談する <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.08] text-black dark:text-white px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-all hover:scale-105 whitespace-nowrap"
            >
              既製品アプリを見る
            </Link>
          </div>
        </section>

        {/* Social Proof Numbers */}
        <section className="px-6 py-10 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>1/20</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">競合比の価格</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>最短2日</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">納品スピード</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>¥3,980〜</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-1">開発スタート価格</p>
            </div>
          </div>
        </section>

        {/* App Showcase (animated) */}
        <section className="border-t border-black/[0.05] dark:border-white/[0.05] py-20 overflow-hidden">
          <div className="w-full max-w-5xl mx-auto px-6 mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">今すぐ使える既製品アプリ</h2>
            <p className="text-black/50 dark:text-white/50">
              月額サブスクリプションで即日スタート。AI利用料・ホスティング込み。
            </p>
          </div>
          <AppShowcase />
        </section>

        {/* Feature Highlights */}
        <section className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <h2 className="text-3xl font-bold mb-4 text-center">なぜ HoshiApp が選ばれるのか</h2>
          <p className="text-center text-black/50 dark:text-white/50 mb-12">
            AIエージェントの力で、従来の開発会社に不可能だったことを実現します
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "圧倒的なスピード",
                desc: "Claude × Gemini の並列AI開発パイプラインで、従来なら週単位の作業を数日に短縮。",
              },
              {
                icon: Rocket,
                title: "驚異的なコスパ",
                desc: "クラウドワークスの1/10〜1/20の価格。AIによる開発コスト削減を全額ユーザーに還元。",
              },
              {
                icon: Code,
                title: "即戦力クオリティ",
                desc: "Next.js・Firebase・Vercelスタックで本番対応。オーナーの最終チェックを経て納品。",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.03] transition-all duration-300 group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--color-accent)", opacity: 0.9 }}
                >
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <h2 className="text-3xl font-bold mb-4 text-center">カスタム開発料金</h2>
          <p className="text-center text-black/50 dark:text-white/50 mb-12">
            シンプルで分かりやすい料金設定。まずは無料相談から。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 小規模 */}
            <div className="p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors">
              <h3 className="font-semibold text-lg mb-1">小規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">LP・シンプルツール（〜3画面）</p>
              <p className="text-3xl font-bold mb-6">¥3,980<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["3画面まで", "レスポンシブ対応", "Vercelデプロイ込み"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* 中規模 */}
            <div className="p-6 rounded-2xl border-2 relative" style={{ borderColor: "var(--color-accent)" }}>
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-black text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "var(--color-accent)" }}
              >人気</span>
              <h3 className="font-semibold text-lg mb-1">中規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">管理画面・API連携（〜10画面）</p>
              <p className="text-3xl font-bold mb-6">¥9,800<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["10画面まで", "Firebase認証・DB連携", "外部API連携", "Vercelデプロイ込み"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* 大規模 */}
            <div className="p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors">
              <h3 className="font-semibold text-lg mb-1">大規模</h3>
              <p className="text-black/50 dark:text-white/50 text-sm mb-4">複数機能・DB設計・認証込み</p>
              <p className="text-3xl font-bold mb-6">¥29,800<span className="text-base font-normal text-black/50 dark:text-white/50">〜</span></p>
              <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {["画面数無制限", "DB設計・セキュリティ設定", "決済（Stripe）連携", "保守サポートオプション"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                    {f}
                  </li>
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
            className="inline-flex items-center gap-2 text-black px-8 py-3.5 rounded-full font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg"
            style={{ background: "var(--color-accent)" }}
          >
            無料で相談する <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
