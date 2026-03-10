"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Shared wrapper
// ─────────────────────────────────────────────────────────────────────────────
function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-[#0f0f0f] rounded-xl overflow-hidden border border-white/[0.08] p-3 space-y-2 text-xs select-none pointer-events-none font-sans">
      {/* fake browser bar */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-400 opacity-70" />
        <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70" />
        <div className="w-2 h-2 rounded-full bg-green-400 opacity-70" />
        <div className="flex-1 bg-white/[0.06] rounded px-2 py-0.5 text-[10px] text-white/30 ml-2">
          localhost:3000
        </div>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SNS Post AI Preview
// ─────────────────────────────────────────────────────────────────────────────
export function SnsPostPreview({ slide = 0 }: { slide?: number }) {
  return (
    <PreviewShell>
      {slide === 0 && (
        <div className="space-y-2">
          {/* header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-white/80 font-semibold text-[11px] tracking-tight">
              SNS Poster AI
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: "#d4ff47", color: "#0f0f0f" }}
            >
              Pro
            </span>
          </div>
          {/* textarea */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-2.5 min-h-[48px]">
            <span className="text-white/25 text-[10px]">今日のテーマを入力...</span>
          </div>
          {/* tone buttons */}
          <div className="flex gap-1 flex-wrap">
            {[
              { label: "Professional", accent: false },
              { label: "Casual", accent: false },
              { label: "Enthusiastic", accent: true },
              { label: "Humorous", accent: false },
            ].map(({ label, accent }) => (
              <span
                key={label}
                className="text-[9px] px-2 py-0.5 rounded-full border"
                style={
                  accent
                    ? {
                        background: "#d4ff4722",
                        borderColor: "#d4ff47",
                        color: "#d4ff47",
                      }
                    : {
                        background: "transparent",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.45)",
                      }
                }
              >
                {label}
              </span>
            ))}
          </div>
          {/* generate button */}
          <button
            className="w-full py-2 rounded-lg text-[10px] font-bold tracking-wide"
            style={{ background: "#d4ff47", color: "#0f0f0f" }}
          >
            ✦ 投稿を生成する
          </button>
        </div>
      )}

      {slide === 1 && (
        <div className="space-y-2">
          <span className="text-white/60 text-[10px] font-medium px-0.5">生成結果</span>
          {/* X card */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-[10px] font-semibold">𝕏 Twitter / X</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30 text-[9px]">137文字</span>
                <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-white/55 text-[10px] leading-relaxed">
              今日からSNS投稿がもっと楽に！AIが最適な投稿を自動生成。時間を大幅に節約しながら、エンゲージメントも向上します✨
            </p>
          </div>
          {/* Instagram card */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-[10px] font-semibold">📸 Instagram</span>
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/55 text-[10px] leading-relaxed">
              AIでSNS運用を革命的に効率化🚀 プロ品質の投稿をワンクリックで生成！
            </p>
            <p className="text-[9px]" style={{ color: "#d4ff47", opacity: 0.7 }}>
              #マーケティング #AI活用 #副業
            </p>
          </div>
          {/* LinkedIn card */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-[10px] font-semibold">in LinkedIn</span>
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/55 text-[10px] leading-relaxed">
              SNS運用の効率化を実現するAIツールを活用し、質の高いコンテンツを継続的に発信することで、ブランド価値の向上が期待できます。
            </p>
          </div>
        </div>
      )}

      {slide === 2 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">生成履歴</span>
          {[
            { date: "3/10", topic: "AIツールで副業収益アップ", platforms: ["X", "IG", "LI"] },
            { date: "3/9", topic: "リモートワーク生産性向上術", platforms: ["X", "IG", "LI"] },
            { date: "3/7", topic: "ChatGPTプロンプト活用法", platforms: ["X", "LI"] },
            { date: "3/5", topic: "フリーランス案件獲得のコツ", platforms: ["X", "IG"] },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5"
            >
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-white/30 text-[9px]">{item.date}</span>
                <span className="text-white/60 text-[10px] truncate">{item.topic}</span>
              </div>
              <div className="flex gap-1 ml-2 shrink-0">
                {item.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[8px] px-1 py-0.5 rounded"
                    style={{
                      background: "rgba(212,255,71,0.12)",
                      color: "#d4ff47",
                      border: "1px solid rgba(212,255,71,0.2)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PreviewShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Finance Dashboard Preview
// ─────────────────────────────────────────────────────────────────────────────
export function FinancePreview({ slide = 0 }: { slide?: number }) {
  return (
    <PreviewShell>
      {slide === 0 && (
        <div className="space-y-2">
          {/* header */}
          <div className="flex items-center justify-between px-0.5">
            <span className="text-white/80 font-semibold text-[11px]">収支ダッシュボード</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.07] text-white/40">2026</span>
          </div>
          {/* summary cards */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-white/40 text-[8px]">収入合計</span>
              </div>
              <p className="text-green-400 text-[10px] font-bold">¥328,000</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-white/40 text-[8px]">支出合計</span>
              </div>
              <p className="text-red-400 text-[10px] font-bold">¥89,400</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-1.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4ff47" }} />
                <span className="text-white/40 text-[8px]">純利益</span>
              </div>
              <p className="text-[10px] font-bold" style={{ color: "#d4ff47" }}>¥238,600</p>
            </div>
          </div>
          {/* bar chart */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2">
            <span className="text-white/30 text-[9px]">月別収支（Oct〜Mar）</span>
            <div className="flex items-end justify-around mt-2 h-14 gap-1">
              {[
                { income: 55, expense: 28 },
                { income: 62, expense: 32 },
                { income: 48, expense: 25 },
                { income: 70, expense: 30 },
                { income: 58, expense: 22 },
                { income: 80, expense: 35 },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                  <div className="flex items-end gap-0.5 h-12">
                    <div
                      className="w-2 rounded-t-sm bg-green-500 opacity-75"
                      style={{ height: `${bar.income}%` }}
                    />
                    <div
                      className="w-2 rounded-t-sm bg-red-400 opacity-75"
                      style={{ height: `${bar.expense}%` }}
                    />
                  </div>
                  <span className="text-white/20 text-[7px]">
                    {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {slide === 1 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">最近の収支</span>
          {[
            { color: "bg-green-400", label: "Webデザイン案件", amount: "+¥85,000", date: "3/8", income: true },
            { color: "bg-red-400", label: "Adobe CC", amount: "-¥6,480", date: "3/5", income: false },
            { color: "bg-green-400", label: "コンサルティング", amount: "+¥50,000", date: "3/3", income: true },
            { color: "bg-red-400", label: "サーバー代", amount: "-¥1,980", date: "3/1", income: false },
            { color: "bg-green-400", label: "ライティング案件", amount: "+¥28,000", date: "2/28", income: true },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                <span className="text-white/60 text-[10px] truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: item.income ? "#4ade80" : "#f87171" }}
                >
                  {item.amount}
                </span>
                <span className="text-white/25 text-[9px]">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide === 2 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 px-0.5">
            <span className="text-white/80 font-semibold text-[11px]">AIレポート</span>
            <span style={{ color: "#d4ff47" }} className="text-[11px]">✦</span>
          </div>
          {/* report text */}
          <div
            className="rounded-lg p-2.5 border text-[10px] leading-relaxed text-white/65"
            style={{ background: "rgba(212,255,71,0.05)", borderColor: "rgba(212,255,71,0.15)" }}
          >
            3月の収支分析: 先月比+12%の増収です。Adobe CCなどのサブスク費用を見直すことで、さらに月2万円の節約が可能です。Webデザイン案件が収益の柱となっています。
          </div>
          {/* advice cards */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2">
              <span className="text-sm leading-none mt-0.5">💡</span>
              <div>
                <p className="text-white/70 text-[10px] font-medium">サブスク最適化</p>
                <p className="text-white/40 text-[9px] mt-0.5">未使用サービスを3件削減で¥12,000/月の節約</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2">
              <span className="text-sm leading-none mt-0.5">📈</span>
              <div>
                <p className="text-white/70 text-[10px] font-medium">収益拡大チャンス</p>
                <p className="text-white/40 text-[9px] mt-0.5">コンサル案件の単価を15%上げる交渉余地あり</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PreviewShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lifelog Preview
// ─────────────────────────────────────────────────────────────────────────────
export function LifelogPreview({ slide = 0 }: { slide?: number }) {
  return (
    <PreviewShell>
      {slide === 0 && (
        <div className="space-y-2">
          {/* header */}
          <div className="flex items-center justify-between px-0.5">
            <span className="text-white/80 font-semibold text-[11px]">今日のログ</span>
            <span className="text-white/35 text-[9px]">3月10日（月）</span>
          </div>
          {/* streak badges */}
          <div className="flex gap-1.5">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50">
              週平均気分 😊 4.2
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50">
              🔥 連続15日
            </span>
          </div>
          {/* log entry 1 */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">😊</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">良好</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.07] text-white/40">集中できた</span>
            </div>
            <p className="text-white/55 text-[10px] leading-relaxed">
              午前中に企画書完成。タスク消化率85%で順調な一日だった。
            </p>
          </div>
          {/* log entry 2 */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">😐</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">普通</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.07] text-white/40">疲れ気味</span>
            </div>
            <p className="text-white/55 text-[10px] leading-relaxed">
              夕方から集中力が落ちた。明日は休憩を意識して取り入れる。
            </p>
          </div>
        </div>
      )}

      {slide === 1 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">カレンダー</span>
          {/* day headers */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {["月", "火", "水", "木", "金", "土", "日"].map((d) => (
              <div key={d} className="text-[8px] text-white/25 py-0.5">{d}</div>
            ))}
          </div>
          {/* calendar grid — 5 weeks */}
          {[
            [
              { day: 3, mood: 4, emoji: "🙂" },
              { day: 4, mood: 5, emoji: "😊" },
              { day: 5, mood: 3, emoji: "😐" },
              { day: 6, mood: 4, emoji: "🙂" },
              { day: 7, mood: 2, emoji: "😕" },
              { day: 8, mood: 5, emoji: "😊" },
              { day: 9, mood: 4, emoji: "🙂" },
            ],
            [
              { day: 10, mood: 4, emoji: "😊", today: true },
              { day: 11, mood: 3, emoji: "😐" },
              { day: 12, mood: 5, emoji: "😊" },
              { day: 13, mood: 4, emoji: "🙂" },
              { day: 14, mood: 3, emoji: "😐" },
              { day: 15, mood: 1, emoji: "😔" },
              { day: 16, mood: 4, emoji: "🙂" },
            ],
            [
              { day: 17, mood: 5, emoji: "😊" },
              { day: 18, mood: 4, emoji: "🙂" },
              { day: 19, mood: 3, emoji: "😐" },
              { day: 20, mood: 4, emoji: "🙂" },
              { day: 21, mood: 5, emoji: "😊" },
              { day: 22, mood: 2, emoji: "😕" },
              { day: 23, mood: 4, emoji: "🙂" },
            ],
          ].map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5">
              {week.map((cell) => (
                <div
                  key={cell.day}
                  className="flex flex-col items-center py-0.5 rounded"
                  style={
                    (cell as { today?: boolean }).today
                      ? { background: "#d4ff4722", border: "1px solid #d4ff4755" }
                      : {}
                  }
                >
                  <span className="text-[8px]">{cell.emoji}</span>
                  <span
                    className="text-[7px]"
                    style={{
                      color: (cell as { today?: boolean }).today
                        ? "#d4ff47"
                        : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {cell.day}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {slide === 2 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 px-0.5">
            <span className="text-white/80 font-semibold text-[11px]">AI週次レポート</span>
            <span style={{ color: "#d4ff47" }} className="text-[11px]">✦</span>
          </div>
          {/* week badge + score */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/45">
              3/4〜3/10
            </span>
            <span className="text-[10px] font-semibold" style={{ color: "#d4ff47" }}>
              週間スコア 82/100
            </span>
          </div>
          {/* insights */}
          <div className="space-y-1.5">
            {[
              {
                icon: "✦",
                title: "集中時間が改善",
                body: "午前のフォーカスセッションが先週比+25分増加しました",
              },
              {
                icon: "⚡",
                title: "睡眠との相関",
                body: "7時間以上の睡眠日に気分スコアが平均1.2点高くなっています",
              },
              {
                icon: "🎯",
                title: "来週の推奨",
                body: "水曜日に意識的な休憩を入れると週後半のパフォーマンス向上が見込めます",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2"
              >
                <span
                  className="text-[10px] mt-0.5 shrink-0"
                  style={i === 0 ? { color: "#d4ff47" } : {}}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-white/70 text-[10px] font-medium">{item.title}</p>
                  <p className="text-white/40 text-[9px] mt-0.5 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PreviewShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuman Radar Preview
// ─────────────────────────────────────────────────────────────────────────────
export function FumanRadarPreview({ slide = 0 }: { slide?: number }) {
  return (
    <PreviewShell>
      {slide === 0 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">
            タイムライン 不満レーダー
          </span>
          {[
            {
              category: "仕事",
              catColor: "bg-red-500/20 text-red-400 border-red-500/30",
              text: "上司がMTGを急に入れてくる。全員のカレンダー確認してから設定してほしい...",
              empathy: 47,
            },
            {
              category: "経済",
              catColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
              text: "電気代が去年の2倍になってる。値上がりが止まらなくてもう限界。節約も限界...",
              empathy: 89,
            },
            {
              category: "住まい",
              catColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
              text: "アパートの更新料が高すぎる。2年ごとに家賃1ヶ月分って何の意味があるの...",
              empathy: 32,
            },
          ].map((post, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border ${post.catColor}`}
                >
                  {post.category}
                </span>
                <span className="text-[9px] text-white/30">
                  わかる{" "}
                  <span className="text-white/55 font-semibold">{post.empathy}</span>
                </span>
              </div>
              <p className="text-white/55 text-[10px] leading-relaxed line-clamp-2">
                {post.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {slide === 1 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">UMAPマップ</span>
          {/* scatter plot */}
          <div
            className="relative w-full rounded-lg border border-white/[0.07] overflow-hidden"
            style={{ background: "#0a0a0a", aspectRatio: "4/3" }}
          >
            {/* work cluster — red dots, top-left area */}
            {[
              { x: 18, y: 32 }, { x: 23, y: 40 }, { x: 28, y: 28 },
              { x: 21, y: 48 }, { x: 30, y: 38 }, { x: 16, y: 42 },
              { x: 25, y: 55 },
            ].map((dot, i) => (
              <div
                key={`r${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: i % 3 === 0 ? "6px" : "4px",
                  height: i % 3 === 0 ? "6px" : "4px",
                  background: "rgba(239,68,68,0.75)",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
            {/* economy cluster — orange dots */}
            {[
              { x: 62, y: 22 }, { x: 67, y: 30 }, { x: 70, y: 18 },
              { x: 64, y: 38 }, { x: 73, y: 28 }, { x: 59, y: 26 },
              { x: 68, y: 42 },
            ].map((dot, i) => (
              <div
                key={`o${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: i % 2 === 0 ? "5px" : "4px",
                  height: i % 2 === 0 ? "5px" : "4px",
                  background: "rgba(249,115,22,0.75)",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
            {/* housing cluster — blue dots */}
            {[
              { x: 52, y: 62 }, { x: 58, y: 70 }, { x: 55, y: 75 },
              { x: 62, y: 65 }, { x: 48, y: 68 }, { x: 60, y: 78 },
            ].map((dot, i) => (
              <div
                key={`b${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: i % 3 === 0 ? "6px" : "4px",
                  height: i % 3 === 0 ? "6px" : "4px",
                  background: "rgba(96,165,250,0.75)",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
            {/* scattered purple dots */}
            {[
              { x: 40, y: 20 }, { x: 80, y: 55 }, { x: 35, y: 72 },
              { x: 75, y: 70 }, { x: 10, y: 80 }, { x: 85, y: 15 },
              { x: 45, y: 45 },
            ].map((dot, i) => (
              <div
                key={`p${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: "3px",
                  height: "3px",
                  background: "rgba(167,139,250,0.6)",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
          </div>
          {/* legend */}
          <div className="flex items-center gap-3 px-0.5">
            {[
              { color: "bg-red-500", label: "仕事" },
              { color: "bg-orange-500", label: "経済" },
              { color: "bg-blue-400", label: "住まい" },
              { color: "bg-purple-400", label: "その他" },
            ].map((leg) => (
              <div key={leg.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-sm ${leg.color} opacity-75`} />
                <span className="text-[8px] text-white/35">{leg.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {slide === 2 && (
        <div className="space-y-2">
          <span className="text-white/80 font-semibold text-[11px] px-0.5">AI愚痴通話</span>
          {/* phone icon with pulse rings */}
          <div className="flex flex-col items-center py-4 space-y-3">
            <div className="relative flex items-center justify-center">
              {/* pulse rings — static visual */}
              <div
                className="absolute rounded-full opacity-10"
                style={{
                  width: "72px",
                  height: "72px",
                  border: "2px solid #d4ff47",
                }}
              />
              <div
                className="absolute rounded-full opacity-20"
                style={{
                  width: "56px",
                  height: "56px",
                  border: "2px solid #d4ff47",
                }}
              />
              {/* main circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#d4ff47" }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "#0f0f0f" }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
            </div>
            {/* timer */}
            <p className="text-white/80 text-xl font-mono font-semibold tracking-widest">
              00:32
            </p>
            <p className="text-white/35 text-[10px]">AIが聞いています...</p>
            {/* controls */}
            <div className="flex items-center gap-4 mt-1">
              <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2z" />
                </svg>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </PreviewShell>
  );
}
