"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";

interface PostEditorProps {
    platform: 'twitter' | 'linkedin' | 'instagram';
    initialContent: string;
    postId: string;
    onSave: (content: string) => void;
    onCancel: () => void;
}

const CHAR_LIMITS = {
    twitter: 280,
    linkedin: 3000,
    instagram: 2200,
};

export default function PostEditor({ platform, initialContent, postId, onSave, onCancel }: PostEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [saving, setSaving] = useState(false);

    const charLimit = CHAR_LIMITS[platform];
    const charCount = content.length;
    const isOverLimit = charCount > charLimit;

    const handleSave = async () => {
        if (isOverLimit) {
            alert(`Content exceeds ${charLimit} character limit`);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/posts/${postId}/edit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, content }),
            });

            if (!res.ok) {
                throw new Error('Failed to save');
            }

            onSave(content);
        } catch (error) {
            console.error('Error saving edit:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.1] dark:border-white/[0.1] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent min-h-[120px] resize-none"
            />
            <div className="flex items-center justify-between">
                <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-black/50 dark:text-white/50'}`}>
                    {charCount} / {charLimit}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm border border-black/[0.1] dark:border-white/[0.1] rounded-md hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center gap-1.5"
                    >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || isOverLimit}
                        className="px-3 py-1.5 text-sm bg-[var(--color-accent)] text-black font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        <Save className="w-3.5 h-3.5" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
