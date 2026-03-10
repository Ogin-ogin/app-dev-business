"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  postId: string;
  initialCount: number;
  initialEmpathized?: boolean;
}

export default function EmpathyButton({ postId, initialCount, initialEmpathized = false }: Props) {
  const [count, setCount] = useState(initialCount);
  const [empathized, setEmpathized] = useState(initialEmpathized);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;

    // Optimistic update
    const prevCount = count;
    const prevEmpathized = empathized;
    setEmpathized(!empathized);
    setCount(empathized ? count - 1 : count + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/fuman-radar/posts/${postId}/empathy`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed");
      }
    } catch {
      // Revert on error
      setEmpathized(prevEmpathized);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 ${
        empathized
          ? "border-red-300 text-red-500 bg-red-50 dark:bg-red-900/20"
          : "border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 hover:border-red-300 hover:text-red-500"
      }`}
    >
      <Heart
        className="w-4 h-4"
        fill={empathized ? "currentColor" : "none"}
      />
      <span>{count}</span>
    </button>
  );
}
