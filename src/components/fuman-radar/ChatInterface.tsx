"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const INITIAL_AI_MESSAGE: Message = {
  role: "ai",
  text: "こんにちは！不満レーダーのデータについて何でも質問してください。カテゴリ別の傾向や、特定の分野の不満など分析できます。",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_AI_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "ai" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/fuman-radar/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) {
        throw new Error("APIエラーが発生しました");
      }

      const data = await res.json();
      const aiMsg: Message = {
        role: "ai",
        text: data.reply ?? data.text ?? "応答を取得できませんでした。",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        role: "ai",
        text: `エラー: ${err.message ?? "不明なエラーが発生しました"}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
      {/* Message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ maxHeight: "400px", minHeight: "300px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--color-accent)] text-black"
                  : "bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] text-black dark:text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-black/40 dark:text-white/40" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-black/[0.1] dark:border-white/[0.1] p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={loading}
            className="flex-1 text-sm bg-zinc-50 dark:bg-black/30 border border-black/[0.1] dark:border-white/[0.1] rounded-full px-4 py-2 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-accent)] text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
