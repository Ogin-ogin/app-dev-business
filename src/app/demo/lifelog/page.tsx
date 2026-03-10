"use client";
import Link from "next/link";
import { ChevronRight, Flame, Zap } from "lucide-react";

const MOOD_MAP: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😔", label: "最悪", color: "text-red-500" },
  2: { emoji: "😕", label: "悪い", color: "text-orange-500" },
  3: { emoji: "😐", label: "普通", color: "text-yellow-500" },
  4: { emoji: "🙂", label: "良い", color: "text-lime-500" },
  5: { emoji: "😊", label: "最高", color: "text-green-500" },
};

const SAMPLE_LOGS = [
  { id: 1, mood: 5, tags: ["集中できた", "目標達成"], text: "午前中に企画書を完成。タスク消化率85%で今月最高の生産性でした。", goalAchieved: true, date: "今日" },
  { id: 2, mood: 3, tags: ["疲れ気味", "残業"], text: "夕方から集中力が落ちた。休息が必要かも。明日は早めに上がる。", goalAchieved: false, date: "今日" },
  { id: 3, mood: 4, tags: ["運動", "読書"], text: "30分ジョギング。「深く考える力」読了。充実した一日。", goalAchieved: true, date: "昨日" },
  { id: 4, mood: 2, tags: ["体調不良"], text: "頭痛があり早退。無理しないことも大切。", goalAchieved: false, date: "3/8" },
];

const CALENDAR_DATA = [
  [0,0,5,4,4,3,5],
  [4,3,2,4,5,4,3],
  [5,4,4,3,4,5,4],
  [3,2,3,4,4,5,5],
  [4,5,0,0,0,0,0],
];
const WEEKDAYS = ["月","火","水","木","金","土","日"];

export default function LifelogDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="sticky top-0 z-50 bg-[var(--color-accent)] text-black px-4 py-2.5 flex items-center justify-between text-sm font-medium">
        <span>🎮 デモモード — サンプルデータを表示中</span>
        <Link href="/products/life-log-tool" className="flex items-center gap-1 underline underline-offset-2 font-semibold">
          本登録して使う <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">今日のログ</h1>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">2026年3月10日（月）</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-black/50 dark:text-white/50">週平均気分</div>
              <div className="text-sm font-bold">😊 4.2</div>
            </div>
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-black/50 dark:text-white/50">連続記録</div>
              <div className="text-sm font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> 15日</div>
            </div>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-3">
          {SAMPLE_LOGS.map(log => {
            const mood = MOOD_MAP[log.mood];
            return (
              <div key={log.id} className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-semibold ${mood.color}`}>{mood.label}</span>
                      {log.goalAchieved && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--color-accent)", color: "#000" }}>目標達成</span>
                      )}
                      {log.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-black/60 dark:text-white/60">{t}</span>
                      ))}
                    </div>
                    <p className="text-sm text-black/70 dark:text-white/70">{log.text}</p>
                  </div>
                  <span className="text-xs text-black/30 dark:text-white/30 shrink-0">{log.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6">
          <h2 className="font-semibold text-black dark:text-white mb-4">3月のカレンダー</h2>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-[10px] font-medium text-black/40 dark:text-white/40 py-1">{d}</div>
            ))}
            {CALENDAR_DATA.flat().map((mood, i) => {
              const day = i - 1;
              const isToday = day === 9;
              const m = MOOD_MAP[mood];
              return (
                <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-xs ${isToday ? "ring-2 ring-[var(--color-accent)]" : ""} ${mood === 0 ? "opacity-0" : ""}`}>
                  {mood > 0 && <span className="text-sm">{m.emoji}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-2xl p-6 text-center space-y-3">
          <p className="font-semibold text-black dark:text-white">自分のログを記録してみましょう</p>
          <p className="text-sm text-black/60 dark:text-white/60">登録するとAI週次レポート・目標設定・連続記録機能が使えます</p>
          <Link href="/products/life-log-tool" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--color-accent)", color: "#000" }}>
            <Zap className="w-4 h-4" /> ¥480/月で始める
          </Link>
        </div>
      </div>
    </div>
  );
}
