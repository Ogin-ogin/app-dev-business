"use client";

import ChatInterface from "@/components/fuman-radar/ChatInterface";
import PaidFeatureGate from "@/components/fuman-radar/PaidFeatureGate";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">AI対話分析</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          不満レーダーのデータについてAIと対話しながら深掘り分析
        </p>
      </div>

      {/* Feature description */}
      <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-none">
            <MessageCircle className="w-4 h-4 text-black dark:text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-black dark:text-white mb-1">
              できること
            </h2>
            <ul className="text-sm text-black/60 dark:text-white/60 space-y-1 list-disc list-inside">
              <li>カテゴリ別の不満トレンドを質問する</li>
              <li>特定キーワードに関する投稿を分析してもらう</li>
              <li>感情スコアの分布についてインサイトを得る</li>
              <li>社会的な課題パターンを発見する</li>
            </ul>
          </div>
        </div>
      </div>

      <PaidFeatureGate featureName="chat">
        <ChatInterface />
      </PaidFeatureGate>
    </div>
  );
}
