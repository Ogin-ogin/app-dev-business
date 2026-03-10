"use client";

import { useState, useEffect } from "react";
import { Clock, Search } from "lucide-react";
import FavoriteButton from "@/components/sns-post/FavoriteButton";
import PostDetailModal from "@/components/sns-post/PostDetailModal";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTone, setSelectedTone] = useState("");

    const fetchHistory = async (query = "", tone = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (tone) params.append('tone', tone);
            params.append('limit', '20');

            const res = await fetch(`/api/posts/search?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.posts);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(searchQuery, selectedTone);
    }, [searchQuery, selectedTone]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold mb-2">Generation History</h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    View your previously generated posts and reuse them.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex items-center bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-lg p-2 w-full md:max-w-sm">
                    <Search className="w-4 h-4 text-black/40 dark:text-white/40 ml-2" />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full px-3"
                    />
                </div>
                <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                    <option value="">All Tones</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="humorous">Humorous</option>
                </select>
            </div>

            <div className="border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden bg-white dark:bg-[#191919]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 bg-black/[0.02] dark:bg-white/[0.02]">
                            <th className="font-medium p-4 font-normal">Date</th>
                            <th className="font-medium p-4 font-normal">Topic</th>
                            <th className="font-medium p-4 font-normal">Tone</th>
                            <th className="font-medium p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-black/40 dark:text-white/40">Loading history...</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-black/40 dark:text-white/40">No history found. Generate some posts first!</td></tr>
                        ) : history.map((item: any) => (
                            <tr key={item.id} className="border-b border-black/[0.05] dark:border-white/[0.05] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-black/60 dark:text-white/60 flex items-center gap-2 whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="p-4 font-medium truncate max-w-[200px] md:max-w-xs">{item.topic}</td>
                                <td className="p-4 text-black/60 dark:text-white/60 capitalize">{item.tone}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <FavoriteButton
                                            postId={item.id}
                                            initialFavorite={item.isFavorite || false}
                                            onToggle={(isFav) => {
                                                setHistory(prev => prev.map(p =>
                                                    p.id === item.id ? { ...p, isFavorite: isFav } : p
                                                ));
                                            }}
                                        />
                                        <button
                                            onClick={() => setSelectedPost(item)}
                                            className="text-[var(--color-accent)] font-medium text-xs hover:underline"
                                        >
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onUpdate={(updatedPost) => {
                        setSelectedPost(updatedPost);
                        setHistory(prev => prev.map(p =>
                            p.id === updatedPost.id ? updatedPost : p
                        ));
                    }}
                />
            )}
        </div>
    );
}
