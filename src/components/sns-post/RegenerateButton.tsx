"use client";

import { useState } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

interface RegenerateButtonProps {
    platform: 'twitter' | 'linkedin' | 'instagram';
    postId: string;
    onRegenerate: (newContent: string) => void;
}

export default function RegenerateButton({ platform, postId, onRegenerate }: RegenerateButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleRegenerate = async (action?: 'improve' | 'shorten') => {
        setLoading(true);
        setShowMenu(false);

        try {
            const res = await fetch(`/api/posts/${postId}/regenerate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, action }),
            });

            if (!res.ok) {
                throw new Error('Failed to regenerate');
            }

            const data = await res.json();
            onRegenerate(data.content);
        } catch (error) {
            console.error('Error regenerating:', error);
            alert('Failed to regenerate post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <div className="flex items-center gap-0 border border-black/[0.1] dark:border-white/[0.1] rounded-md overflow-hidden">
                <button
                    onClick={() => handleRegenerate()}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors disabled:opacity-50"
                    title="Regenerate"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Regenerating...' : 'Regenerate'}
                </button>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    disabled={loading}
                    className="px-2 py-1.5 border-l border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors disabled:opacity-50"
                    title="More options"
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                </button>
            </div>

            {showMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-md shadow-lg py-1 min-w-[140px] z-10">
                    <button
                        onClick={() => handleRegenerate('improve')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                        Improve
                    </button>
                    <button
                        onClick={() => handleRegenerate('shorten')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                        Shorten
                    </button>
                </div>
            )}
        </div>
    );
}
