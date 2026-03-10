"use client";

import { useState, useEffect } from "react";
import { Star, Eye } from "lucide-react";
import FavoriteButton from "@/components/sns-post/FavoriteButton";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts/favorites?limit=50');
            if (res.ok) {
                const data = await res.json();
                setFavorites(data.posts);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = (postId: string, isFavorite: boolean) => {
        if (!isFavorite) {
            // Remove from list
            setFavorites(prev => prev.filter(p => p.id !== postId));
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    Favorites
                </h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    Posts you've marked as favorites.
                </p>
            </div>

            {loading ? (
                <p className="text-center text-black/60 dark:text-white/60 py-8">Loading favorites...</p>
            ) : favorites.length === 0 ? (
                <div className="bg-white dark:bg-[#191919] rounded-xl border border-black/[0.1] dark:border-white/[0.1] p-12 text-center">
                    <Star className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-black/60 dark:text-white/60">No favorites yet.</p>
                    <p className="text-sm text-black/40 dark:text-white/40 mt-2">
                        Star posts from the history page to save them here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {favorites.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-[#191919] rounded-xl border border-black/[0.1] dark:border-white/[0.1] p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium mb-1 truncate">{post.topic}</h3>
                                    <p className="text-xs text-black/50 dark:text-white/50 capitalize mb-2">
                                        {post.tone} • {formatDate(post.createdAt)}
                                    </p>
                                    <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">
                                        {post.generatedPosts?.twitter}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FavoriteButton
                                        postId={post.id}
                                        initialFavorite={true}
                                        onToggle={(isFav) => handleFavoriteToggle(post.id, isFav)}
                                    />
                                    <button
                                        onClick={() => setSelectedPost(post)}
                                        className="p-2 rounded-md text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                                        title="View details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedPost(null)}>
                    <div
                        className="bg-white dark:bg-[#191919] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-start">
                            <div className="pr-8">
                                <h3 className="text-lg font-bold mb-1">Generated Content</h3>
                                <p className="text-sm text-black/60 dark:text-white/60">Topic: {selectedPost.topic}</p>
                            </div>
                            <button onClick={() => setSelectedPost(null)} className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05]">&times;</button>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            {(Object.keys(selectedPost.generatedPosts || {}) as Array<"twitter" | "linkedin" | "instagram">).map((platform) => {
                                const content = selectedPost.generatedPosts[platform];
                                if (!content) return null;
                                return (
                                    <div key={platform} className="bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/[0.1] dark:border-white/[0.1] overflow-hidden">
                                        <div className="px-4 py-2 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                                            <span className="font-medium capitalize text-sm">{platform === "twitter" ? "X (Twitter)" : platform}</span>
                                        </div>
                                        <div className="p-4">
                                            <p className="whitespace-pre-wrap text-sm text-black/80 dark:text-white/80">{content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
