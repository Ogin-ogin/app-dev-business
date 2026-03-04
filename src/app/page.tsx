import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Zap, Code, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 w-full mx-auto max-w-5xl flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl text-[var(--color-notion-text)] dark:text-white">
            Your ideas, turned into{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">working web apps.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-accent)]/80 -z-10 -rotate-1 rounded-sm"></span>
            </span>
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 mb-10 max-w-2xl leading-relaxed">
            10x faster. 20x cheaper. We use advanced AI agents to build, deploy, and ship high-quality web applications for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/order"
              className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-8 py-3.5 rounded-md font-medium text-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Start custom build <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.08] text-black dark:text-white px-8 py-3.5 rounded-md font-medium text-lg hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors whitespace-nowrap"
            >
              Browse ready apps
            </Link>
          </div>
        </section>

        {/* Feature Highlights - Block-like Notion style */}
        <section className="px-6 py-20 w-full mx-auto max-w-5xl border-t border-black/[0.05] dark:border-white/[0.05]">
          <h2 className="text-3xl font-bold mb-12 text-center">Why choose our AI Platform</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Unbeatable Speed</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                Parallel AI development pipeline using Claude and Gemini. What takes weeks now takes days.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drastically Cheaper</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                Costs as low as 1/20th of traditional outsourcing. Direct AI interactions eliminate agency overhead.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 text-black dark:text-[var(--color-accent)]">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm">
                Next.js, Firebase, and Vercel stack. Apps are delivered fully functional, tested, and scalable.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
