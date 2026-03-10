"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free",
  STANDARD: "Standard",
  PRO: "Pro (月額)",
  PRO_LIFETIME: "Pro (買い切り)",
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "bg-black/[0.05] text-black/60 dark:bg-white/[0.05] dark:text-white/60",
  STANDARD: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  PRO: "bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)]",
  PRO_LIFETIME: "bg-[var(--color-accent)]/20 text-black dark:text-[var(--color-accent)]",
};

export default function SubscriptionStatus() {
  const { currentUser } = useAuth();
  const { plan, loading } = useSubscription();

  if (loading) {
    return (
      <div className="mb-8 p-4 bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl animate-pulse h-16" />
    );
  }

  const label = PLAN_LABELS[plan] ?? plan;
  const colorClass = PLAN_COLORS[plan] ?? PLAN_COLORS.FREE;

  return (
    <div className="mb-8 p-5 bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-black/40 dark:text-white/40 mb-1">ログイン中</p>
        <p className="text-sm font-medium text-black dark:text-white">
          {currentUser?.displayName ?? currentUser?.email ?? "—"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-black/40 dark:text-white/40 mb-1">現在のプラン</p>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
