"use client";

import { Shield, Database, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">設定</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          プライバシー・データ・サービスについての説明
        </p>
      </div>

      {/* Privacy Policy */}
      <section className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-none">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-black dark:text-white">
            プライバシーポリシー
          </h2>
        </div>

        <div className="space-y-3 text-sm text-black/70 dark:text-white/70 leading-relaxed">
          <p>
            不満レーダーでは、ユーザーのプライバシー保護を最優先にしています。
          </p>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">完全匿名投稿</h3>
            <p>
              すべての投稿は匿名で処理されます。投稿内容に個人を特定できる情報は記録されず、
              他のユーザーや第三者に開示されることはありません。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">データの利用目的</h3>
            <p>
              収集したデータは社会課題の傾向分析や、AIによる共感・サポート機能の改善にのみ使用されます。
              商業目的での第三者への提供は一切行いません。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">データの削除</h3>
            <p>
              投稿の削除を希望する場合は、サポートまでお問い合わせください。
              アカウント削除時には関連するすべてのデータを削除します。
            </p>
          </div>
        </div>
      </section>

      {/* About Data */}
      <section className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-none">
            <Database className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-base font-semibold text-black dark:text-white">
            データについて
          </h2>
        </div>

        <div className="space-y-3 text-sm text-black/70 dark:text-white/70 leading-relaxed">
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">収集する情報</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>投稿テキスト（匿名）</li>
              <li>選択したカテゴリ</li>
              <li>AIが分析した感情スコアとキーワード</li>
              <li>投稿日時</li>
              <li>共感ボタンのクリック数</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">AI分析処理</h3>
            <p>
              投稿テキストはGemini AIにより感情分析、キーワード抽出、共感メッセージ生成に使用されます。
              処理は自動化されており、人間が個別の投稿を閲覧することはありません。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">ベクトル埋め込み</h3>
            <p>
              UMAPマップ機能では、投稿テキストを数値ベクトルに変換して類似度を計算します。
              これにより、意味的に近い投稿を視覚的にクラスタリングして表示します。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">音声通話データ</h3>
            <p>
              AI愚痴通話では、音声データはGemini AIによりリアルタイムで処理され、サーバーには保存されません。
              会話内容は個人を特定できない形で不満データの傾向分析に活用される場合があります。
              テキストとして保存されるのは、通話後にユーザーが明示的に「投稿する」を選択した場合のみです。
            </p>
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-none">
            <CreditCard className="w-4 h-4 text-black dark:text-white" />
          </div>
          <h2 className="text-base font-semibold text-black dark:text-white">
            サービスについて
          </h2>
        </div>

        <div className="space-y-4 text-sm text-black/70 dark:text-white/70 leading-relaxed">
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-1">無料プラン</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>タイムライン閲覧・投稿</li>
              <li>探索機能（カテゴリ・キーワード検索）</li>
              <li>マイ投稿一覧</li>
              <li>個人レポート（基本）</li>
              <li>AI愚痴通話（共感AIとリアルタイム音声対話）</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-2">分析者プラン</h3>
            <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-lg px-4 py-3 mb-2">
              <div className="font-semibold text-black dark:text-white text-base">
                ¥980 / 月
              </div>
              <div className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                年払いで20%オフ
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>UMAPマップ（意味的クラスタリング）</li>
              <li>AI対話分析（データについて質問し放題）</li>
              <li>トレンド分析（時系列推移）</li>
              <li>高度な個人レポート</li>
              <li>APIアクセス（近日公開）</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
