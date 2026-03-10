"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, Zap, ChevronRight } from "lucide-react";

const DEMO_RESULT = {
  twitter: `AIで作業効率が3倍に！SNS投稿の悩みから解放されました。テーマを入力するだけで、各プラットフォームに最適な投稿が一括生成されます。フリーランスの方に特におすすめ。 #AI活用 #副業 #マーケティング`,
  instagram: `✨ SNS運用、もっとラクにできます\n\nAIに任せたら投稿作成が10分→1分に！\nプロ品質の文章を自動生成してくれるので\n毎日の発信が楽しくなりました😊\n\n▼使ってみたい方はプロフのリンクから\n\n#AI活用 #SNS運用 #フリーランス #副業 #マーケティング #時短術`,
  linkedin: `SNS投稿の自動化により、マーケティング業務の効率化を実現しました。\n\nこれまで各プラットフォームごとに30分かけていた投稿作成が、AIの活用により大幅に短縮。品質を維持しながらも、コンテンツ作成にかかるコストを削減できました。\n\nデジタルマーケティングに携わる方々にとって、AI活用は今や必須スキルだと感じています。`
};

export default function SnsPostDemoPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("casual");
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCta, setShowCta] = useState(false);

  const tones = [
    { id: "professional", label: "Professional" },
    { id: "casual", label: "Casual" },
    { id: "enthusiastic", label: "Enthusiastic" },
    { id: "humorous", label: "Humorous" },
  ];

  function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setLoading(false);
    }, 1500);
  }

  function handleCopy(text: string, key: string) {
    setShowCta(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Demo Banner */}
      <div className="sticky top-0 z-50 bg-[var(--color-accent)] text-black px-4 py-2.5 flex items-center justify-between text-sm font-medium">
        <span>🎮 デモモード — サンプルデータを表示中</span>
        <Link href="/products/sns-post-ai" className="flex items-center gap-1 underline underline-offset-2 font-semibold">
          本登録して使う <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">SNS投稿AI量産ツール</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">テーマを入力してAIに投稿を生成させてみましょう</p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-black dark:text-white">投稿のテーマ</h2>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="例: フリーランスでの時間管理術について"
            rows={3}
            className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-transparent px-3 py-2 text-sm text-black dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
          <div>
            <p className="text-xs text-black/50 dark:text-white/50 mb-2">トーン</p>
            <div className="flex flex-wrap gap-2">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    tone === t.id
                      ? "text-black"
                      : "bg-black/[0.05] dark:bg-white/[0.08] text-black/70 dark:text-white/70 hover:bg-black/[0.1] dark:hover:bg-white/[0.12]"
                  }`}
                  style={tone === t.id ? { background: "var(--color-accent)" } : undefined}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ background: "var(--color-accent)", color: "#000" }}
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> 生成中...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> 投稿を生成する</>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {[
              { key: "twitter", label: "𝕏  Twitter / X", charLimit: 280 },
              { key: "instagram", label: "📸  Instagram", charLimit: 2200 },
              { key: "linkedin", label: "in  LinkedIn", charLimit: 3000 },
            ].map(({ key, label, charLimit }) => {
              const text = result[key as keyof typeof result];
              return (
                <div key={key} className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-black dark:text-white">{label}</span>
                    <span className="text-xs text-black/40 dark:text-white/40">{text.length} / {charLimit}文字</span>
                  </div>
                  <p className="text-sm text-black/80 dark:text-white/80 whitespace-pre-wrap leading-relaxed">{text}</p>
                  <button
                    onClick={() => handleCopy(text, key)}
                    className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> コピー
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {showCta && (
          <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl p-6 text-center space-y-3">
            <p className="font-semibold text-black dark:text-white">気に入りましたか？</p>
            <p className="text-sm text-black/60 dark:text-white/60">本登録するとコピー・履歴保存・テンプレート機能が使えます</p>
            <Link href="/products/sns-post-ai" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--color-accent)", color: "#000" }}>
              <Zap className="w-4 h-4" /> ¥580/月で始める
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
