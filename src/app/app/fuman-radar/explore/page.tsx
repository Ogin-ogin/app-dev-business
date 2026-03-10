"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import PostCard from "@/components/fuman-radar/PostCard";
import CategoryFilter from "@/components/fuman-radar/CategoryFilter";

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const fetchPosts = useCallback(async (category: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (category) params.set("category", category);
      const res = await fetch(`/api/fuman-radar/posts?${params.toString()}`);
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
    fetchPosts(selectedCategory);
  }, [selectedCategory, fetchPosts]);

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
  }

  // Client-side text filter
  const filteredPosts = searchText.trim()
    ? posts.filter((p) =>
        p.text?.toLowerCase().includes(searchText.trim().toLowerCase())
      )
    : posts;

  // Build category counts from current posts
  const counts: Record<string, number> = {};
  for (const p of posts) {
    if (p.category) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">探索</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          カテゴリや検索でみんなの不満を探す
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="キーワードで検索..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition"
        />
      </div>

      {/* Category filter */}
      <CategoryFilter
        value={selectedCategory}
        onChange={handleCategoryChange}
        counts={counts}
      />

      {/* Post count */}
      {!loading && (
        <p className="text-sm text-black/50 dark:text-white/50">
          {filteredPosts.length}件の投稿
        </p>
      )}

      {/* Posts grid */}
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

      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-sm text-black/50 dark:text-white/50 py-8 text-center">
          投稿が見つかりませんでした
        </div>
      )}

      {!loading && filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
