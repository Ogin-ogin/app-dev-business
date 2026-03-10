"use client";

import { useState, useEffect, useCallback } from "react";
import PostForm from "@/components/fuman-radar/PostForm";
import PostCard from "@/components/fuman-radar/PostCard";

export default function FumanRadarPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fuman-radar/posts?limit=10");
      if (!res.ok) throw new Error("投稿の取得に失敗しました");
      const data = await res.json();
      setPosts(data.posts ?? data ?? []);
    } catch (err: any) {
      setError(err.message ?? "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handlePosted() {
    fetchPosts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">タイムライン</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          みんなの不満をリアルタイムで共有・共感
        </p>
      </div>

      <PostForm onPosted={handlePosted} />

      <div>
        <h2 className="text-base font-semibold text-black dark:text-white mb-3">
          最新の不満
        </h2>

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
            投稿がありません。最初の不満を投稿してみましょう！
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
    </div>
  );
}
