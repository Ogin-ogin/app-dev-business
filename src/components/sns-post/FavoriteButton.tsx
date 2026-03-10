"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface FavoriteButtonProps {
    postId: string;
    initialFavorite: boolean;
    onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ postId, initialFavorite, onToggle }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        const newFavoriteState = !isFavorite;

        // Optimistic update
        setIsFavorite(newFavoriteState);
        onToggle?.(newFavoriteState);

        try {
            const res = await fetch(`/api/posts/${postId}/favorite`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFavorite: newFavoriteState }),
            });

            if (!res.ok) {
                throw new Error('Failed to update favorite');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Revert on error
            setIsFavorite(!newFavoriteState);
            onToggle?.(!newFavoriteState);
            alert('Failed to update favorite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-md transition-colors ${
                isFavorite
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
            } disabled:opacity-50`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
    );
}
