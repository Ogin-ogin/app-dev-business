"use client";

import { useState } from "react";
import { X, Copy, Check, Edit2 } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import PostEditor from "./PostEditor";
import RegenerateButton from "./RegenerateButton";

interface Post {
    id: string;
    topic: string;
    tone: string;
    generatedPosts: {
        twitter: string;
        linkedin: string;
        instagram: string;
    };
    editedPosts?: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    isFavorite?: boolean;
    isTemplate?: boolean;
    templateName?: string;
}

interface PostDetailModalProps {
    post: Post;
    onClose: () => void;
    onUpdate: (updatedPost: Post) => void;
}

export default function PostDetailModal({ post, onClose, onUpdate }: PostDetailModalProps) {
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [currentPost, setCurrentPost] = useState(post);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSaveTemplate = async () => {
        const templateName = prompt('Enter template name (optional):', currentPost.topic);
        if (templateName !== null) {
            try {
                const res = await fetch(`/api/posts/${currentPost.id}/template`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isTemplate: true, templateName: templateName || undefined }),
                });
                if (res.ok) {
                    alert('Saved as template!');
                    const updated = { ...currentPost, isTemplate: true, templateName };
                    setCurrentPost(updated);
                    onUpdate(updated);
                }
            } catch (error) {
                alert('Failed to save template');
            }
        }
    };

    const getContent = (platform: 'twitter' | 'linkedin' | 'instagram') => {
        return currentPost.editedPosts?.[platform] || currentPost.generatedPosts[platform];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#191919] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-start sticky top-0 bg-white dark:bg-[#191919] z-10">
                    <div className="pr-8 flex-1">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1">Generated Content</h3>
                                <p className="text-sm text-black/60 dark:text-white/60">Topic: {currentPost.topic}</p>
                            </div>
                            <FavoriteButton
                                postId={currentPost.id}
                                initialFavorite={currentPost.isFavorite || false}
                                onToggle={(isFav) => {
                                    const updated = { ...currentPost, isFavorite: isFav };
                                    setCurrentPost(updated);
                                    onUpdate(updated);
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSaveTemplate}
                            className="mt-3 text-xs text-[var(--color-accent)] font-medium hover:underline"
                        >
                            {currentPost.isTemplate ? '✓ Saved as Template' : '+ Save as Template'}
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {(Object.keys(currentPost.generatedPosts) as Array<"twitter" | "linkedin" | "instagram">).map((platform, i) => {
                        const content = getContent(platform);
                        if (!content) return null;

                        const isEditing = editingPlatform === platform;

                        return (
                            <div key={platform} className="bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/[0.1] dark:border-white/[0.1] overflow-hidden">
                                <div className="px-4 py-3 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                                    <span className="font-medium capitalize text-sm">
                                        {platform === "twitter" ? "X (Twitter)" : platform}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {!isEditing && (
                                            <>
                                                <button
                                                    onClick={() => setEditingPlatform(platform)}
                                                    className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    Edit
                                                </button>
                                                <RegenerateButton
                                                    platform={platform}
                                                    postId={currentPost.id}
                                                    onRegenerate={(newContent) => {
                                                        const updated = {
                                                            ...currentPost,
                                                            editedPosts: {
                                                                ...currentPost.editedPosts,
                                                                [platform]: newContent,
                                                            },
                                                        };
                                                        setCurrentPost(updated);
                                                        onUpdate(updated);
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    {isEditing ? (
                                        <PostEditor
                                            platform={platform}
                                            initialContent={content}
                                            postId={currentPost.id}
                                            onSave={(newContent) => {
                                                const updated = {
                                                    ...currentPost,
                                                    editedPosts: {
                                                        ...currentPost.editedPosts,
                                                        [platform]: newContent,
                                                    },
                                                };
                                                setCurrentPost(updated);
                                                onUpdate(updated);
                                                setEditingPlatform(null);
                                            }}
                                            onCancel={() => setEditingPlatform(null)}
                                        />
                                    ) : (
                                        <>
                                            <p className="whitespace-pre-wrap text-sm text-black/80 dark:text-white/80 leading-relaxed">
                                                {content}
                                            </p>
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={() => copyToClipboard(content, i)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-black/[0.05] dark:bg-white/[0.1] px-3 py-1.5 rounded-md"
                                                >
                                                    {copiedIndex === i ? (
                                                        <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
