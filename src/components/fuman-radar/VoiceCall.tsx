"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, RotateCcw } from "lucide-react";
import { useGeminiLive } from "@/hooks/useGeminiLive";

const CONSENT_KEY = "fuman-radar-voice-consent";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Privacy Consent Dialog ───────────────────────────────────────────────────

function ConsentDialog({ onConsent }: { onConsent: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-base font-semibold text-black dark:text-white">
          音声通話について
        </h2>
        <div className="space-y-3 text-sm text-black/70 dark:text-white/70 leading-relaxed">
          <p>音声通話機能をご利用前に、以下をご確認ください。</p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
              <span>会話はGemini AI（Google）によりリアルタイムで処理されます。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
              <span>音声データはサーバーに保存されません。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
              <span>
                会話内容は<strong>個人を特定できない形</strong>で、不満データの傾向分析に活用される場合があります。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
              <span>
                テキストとして保存されるのは、通話後にあなたが「投稿する」を選択した場合のみです。
              </span>
            </li>
          </ul>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm text-black dark:text-white">
            上記を理解し、同意します
          </span>
        </label>

        <button
          disabled={!checked}
          onClick={onConsent}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: checked ? "var(--color-accent)" : undefined,
            color: checked ? "#000" : undefined,
            border: !checked ? "1px solid rgba(255,255,255,0.1)" : undefined,
          }}
        >
          同意して始める
        </button>
      </div>
    </div>
  );
}

// ─── Pulse Animation ──────────────────────────────────────────────────────────

function PulseRing({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <>
          <div
            className="absolute w-32 h-32 rounded-full opacity-20 animate-ping"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute w-24 h-24 rounded-full opacity-30 animate-ping"
            style={{ background: "var(--color-accent)", animationDelay: "0.3s" }}
          />
        </>
      )}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: active ? "var(--color-accent)" : "rgba(212,255,71,0.15)" }}
      >
        <Phone
          className="w-8 h-8"
          style={{ color: active ? "#000" : "var(--color-accent)" }}
        />
      </div>
    </div>
  );
}

// ─── Post-Call: Save as Post ──────────────────────────────────────────────────

function SaveAsPost({
  transcript,
  onSaved,
}: {
  transcript: { role: "user" | "ai"; text: string }[];
  onSaved: () => void;
}) {
  const userText = transcript
    .filter((t) => t.role === "user")
    .map((t) => t.text)
    .join(" ");
  const [text, setText] = useState(userText.slice(0, 500));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/fuman-radar/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), source: "voice" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "投稿に失敗しました");
      }
      setSaved(true);
      setTimeout(onSaved, 1500);
    } catch (e: any) {
      setSaveError(e.message || "投稿に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <p className="text-sm text-center py-4" style={{ color: "var(--color-accent)" }}>
        投稿しました！
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-black/60 dark:text-white/60">
        通話内容を匿名で投稿できます。編集してから投稿してください。
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        rows={4}
        className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-transparent px-3 py-2 text-sm text-black dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        placeholder="愚痴の内容..."
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-black/40 dark:text-white/40">{text.length}/500</span>
        {saveError && <span className="text-xs text-red-500">{saveError}</span>}
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !text.trim()}
        className="w-full py-2 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        style={{ background: "var(--color-accent)", color: "#000" }}
      >
        {saving ? "投稿中..." : "匿名で投稿する"}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VoiceCall() {
  const { status, transcript, error, isMuted, duration, startCall, endCall, toggleMute, resetCall } =
    useGeminiLive();

  const [showConsent, setShowConsent] = useState(false);
  const [showSavePost, setShowSavePost] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  function handleCallPress() {
    if (typeof window !== "undefined" && !localStorage.getItem(CONSENT_KEY)) {
      setShowConsent(true);
    } else {
      startCall();
    }
  }

  function handleConsent() {
    localStorage.setItem(CONSENT_KEY, "true");
    setShowConsent(false);
    startCall();
  }

  const isActive = status === "active";
  const isConnecting = status === "connecting";
  const isEnded = status === "ended";
  const isError = status === "error";

  return (
    <>
      {showConsent && <ConsentDialog onConsent={handleConsent} />}

      <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl overflow-hidden">
        {/* ── IDLE / CONNECTING / ACTIVE ── */}
        {!isEnded && (
          <div className="flex flex-col items-center justify-center py-16 px-6 space-y-8">
            {/* Visual indicator */}
            <PulseRing active={isActive} />

            {/* Status text */}
            <div className="text-center space-y-1">
              {status === "idle" && (
                <>
                  <p className="font-semibold text-black dark:text-white">AIに愚痴を聞いてもらう</p>
                  <p className="text-sm text-black/50 dark:text-white/50">
                    アドバイスなし。ただひたすら聞いてくれます。
                  </p>
                </>
              )}
              {isConnecting && (
                <p className="text-sm text-black/60 dark:text-white/60 animate-pulse">接続中...</p>
              )}
              {isActive && (
                <p className="text-2xl font-mono font-semibold text-black dark:text-white">
                  {formatDuration(duration)}
                </p>
              )}
            </div>

            {/* Error */}
            {isError && error && (
              <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Idle / Error: Start call button */}
              {(status === "idle" || isError) && (
                <button
                  onClick={isError ? resetCall : handleCallPress}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                  style={{ background: "var(--color-accent)", color: "#000" }}
                >
                  {isError ? (
                    <>
                      <RotateCcw className="w-4 h-4" /> リトライ
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" /> 通話を始める
                    </>
                  )}
                </button>
              )}

              {/* Active: Mute + End */}
              {isActive && (
                <>
                  <button
                    onClick={toggleMute}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-black/[0.1] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors"
                    title={isMuted ? "ミュート解除" : "ミュート"}
                  >
                    {isMuted ? (
                      <MicOff className="w-5 h-5 text-red-500" />
                    ) : (
                      <Mic className="w-5 h-5 text-black dark:text-white" />
                    )}
                  </button>
                  <button
                    onClick={endCall}
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors"
                    title="通話終了"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Connecting indicator */}
            {isConnecting && (
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-accent)",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ENDED ── */}
        {isEnded && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-black dark:text-white">通話終了</h2>
              <span className="text-sm text-black/50 dark:text-white/50 font-mono">
                {formatDuration(duration)}
              </span>
            </div>

            {/* Transcript */}
            {transcript.length > 0 && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {transcript.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        entry.role === "user"
                          ? "bg-black/[0.05] dark:bg-white/[0.08] text-black dark:text-white rounded-br-sm"
                          : "text-black dark:text-white rounded-bl-sm"
                      }`}
                      style={
                        entry.role === "ai"
                          ? { background: "var(--color-accent)", color: "#000" }
                          : undefined
                      }
                    >
                      {entry.text}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}

            {transcript.length === 0 && (
              <p className="text-sm text-black/40 dark:text-white/40 text-center py-4">
                トランスクリプトがありません
              </p>
            )}

            {/* Save as post */}
            {!showSavePost ? (
              <div className="flex gap-3">
                {transcript.some((t) => t.role === "user") && (
                  <button
                    onClick={() => setShowSavePost(true)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[var(--color-accent)] text-black dark:text-white hover:bg-[var(--color-accent)]/10 transition-colors"
                  >
                    不満として投稿する
                  </button>
                )}
                <button
                  onClick={resetCall}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: "var(--color-accent)", color: "#000" }}
                >
                  新しい通話を始める
                </button>
              </div>
            ) : (
              <SaveAsPost transcript={transcript} onSaved={resetCall} />
            )}
          </div>
        )}
      </div>

      {/* Info cards */}
      {status === "idle" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            { title: "傾聴", desc: "アドバイスなし。ただひたすら聞いてくれます。" },
            { title: "匿名", desc: "通話内容はサーバーに保存されません。" },
            { title: "共感", desc: "あなたの気持ちに寄り添い、感情を言語化します。" },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl px-4 py-3 space-y-1"
            >
              <p className="text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
                {card.title}
              </p>
              <p className="text-xs text-black/60 dark:text-white/60">{card.desc}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
