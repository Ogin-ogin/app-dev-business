"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import EmpathyButton from "./EmpathyButton";

const CATEGORY_LABELS: Record<string, string> = {
  economy: "経済・お金",
  politics: "政治",
  healthcare: "医療・健康",
  education: "教育",
  work: "仕事・職場",
  housing: "住まい",
  transport: "交通",
  food: "食事・飲食",
  service: "サービス・接客",
  tech: "テクノロジー",
  other: "その他",
};

const CATEGORY_COLORS: Record<string, string> = {
  economy: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  politics: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  healthcare: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  education: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  work: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  housing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  transport: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  food: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  service: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  tech: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function relativeTime(createdAt: any): string {
  let date: Date;
  if (!createdAt) return "";
  if (createdAt?.toDate) {
    date = createdAt.toDate();
  } else if (createdAt?._seconds) {
    date = new Date(createdAt._seconds * 1000);
  } else {
    date = new Date(createdAt);
  }
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "今";
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

interface Post {
  id: string;
  text: string;
  category: string;
  sentiment: number;
  keywords: string[];
  aiEmpathy: string;
  empathyCount: number;
  createdAt: any;
  source: string;
}

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [showEmpathy, setShowEmpathy] = useState(false);

  const sentimentDotColor =
    post.sentiment < -0.3
      ? "bg-red-500"
      : post.sentiment > 0.3
      ? "bg-green-500"
      : "bg-yellow-400";

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const categoryColor =
    CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.other;

  return (
    <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 space-y-3">
      {/* Top row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}
        >
          {categoryLabel}
        </span>
        <span
          className={`w-2 h-2 rounded-full inline-block ${sentimentDotColor}`}
          title={`感情スコア: ${post.sentiment.toFixed(2)}`}
        />
        <span className="text-xs text-black/40 dark:text-white/40 ml-auto">
          {relativeTime(post.createdAt)}
        </span>
        {(post.source === "seed" || post.source === "import") && (
          <span className="text-[10px] text-black/40 dark:text-white/40 bg-black/[0.05] dark:bg-white/[0.05] px-1.5 py-0.5 rounded">
            {post.source}
          </span>
        )}
      </div>

      {/* Post text */}
      <p className="text-sm text-black dark:text-white leading-relaxed">
        {post.text}
      </p>

      {/* Keywords */}
      {post.keywords && post.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.keywords.map((kw, i) => (
            <span
              key={i}
              className="text-[11px] bg-black/[0.05] dark:bg-white/[0.07] text-black/60 dark:text-white/60 px-2 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center gap-2 pt-1">
        <EmpathyButton
          postId={post.id}
          initialCount={post.empathyCount ?? 0}
        />
        {post.aiEmpathy && (
          <button
            onClick={() => setShowEmpathy((v) => !v)}
            className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors ml-auto"
          >
            AIの共感
            {showEmpathy ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Expandable AI empathy */}
      {showEmpathy && post.aiEmpathy && (
        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-black/50 dark:text-white/50 mb-1">
            AIからの共感
          </p>
          <p className="text-sm text-black dark:text-white leading-relaxed">
            {post.aiEmpathy}
          </p>
        </div>
      )}
    </div>
  );
}
