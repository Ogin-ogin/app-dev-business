"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/fuman-radar/PostCard";
import { Info } from "lucide-react";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/fuman-radar/posts?limit=50");
        if (!res.ok) throw new Error("投稿の取得に失敗しました");
        const data = await res.json();
        setPosts(data.posts ?? data ?? []);
      } catch (err: any) {
        setError(err.message ?? "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">マイ投稿</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          あなたが投稿した不満の一覧です。投稿は完全匿名で公開されています。
        </p>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-black dark:text-white mt-0.5 flex-none" />
        <p className="text-sm text-black dark:text-white">
          マイ投稿機能は近日アップデート予定です。現在は全体の最新投稿が表示されます。
        </p>
      </div>

      {loading && (
        <div className="text-sm text-black/50 dark:text-white/50 py-8 text-center">
          読み込み中...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-sm text-black/50 dark:text-white/50 py-8 text-center">
          投稿がありません
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
