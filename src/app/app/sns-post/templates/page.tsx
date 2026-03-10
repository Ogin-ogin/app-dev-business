"use client";

import { useState, useEffect } from "react";
import { FileText, Eye, Trash2, Save } from "lucide-react";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [editingName, setEditingName] = useState<string | null>(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts/templates?limit=50');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data.posts);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Remove this template?')) return;

        try {
            const res = await fetch(`/api/posts/${postId}/template`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isTemplate: false }),
            });

            if (res.ok) {
                setTemplates(prev => prev.filter(p => p.id !== postId));
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
        }
    };

    const handleRename = async (postId: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/template`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isTemplate: true, templateName: newName }),
            });

            if (res.ok) {
                setTemplates(prev => prev.map(p =>
                    p.id === postId ? { ...p, templateName: newName } : p
                ));
                setEditingName(null);
                setNewName("");
            }
        } catch (error) {
            console.error('Error renaming template:', error);
            alert('Failed to rename template');
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
                    <FileText className="w-6 h-6" />
                    Templates
                </h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    Saved templates you can reuse for new posts.
                </p>
            </div>

            {loading ? (
                <p className="text-center text-black/60 dark:text-white/60 py-8">Loading templates...</p>
            ) : templates.length === 0 ? (
                <div className="bg-white dark:bg-[#191919] rounded-xl border border-black/[0.1] dark:border-white/[0.1] p-12 text-center">
                    <FileText className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-black/60 dark:text-white/60">No templates yet.</p>
                    <p className="text-sm text-black/40 dark:text-white/40 mt-2">
                        Save posts as templates from the history page.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white dark:bg-[#191919] rounded-xl border border-black/[0.1] dark:border-white/[0.1] p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {editingName === template.id ? (
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder="Template name"
                                                className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.1] dark:border-white/[0.1] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleRename(template.id)}
                                                className="px-3 py-1 bg-[var(--color-accent)] text-black rounded-md text-sm font-medium hover:opacity-90"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingName(null);
                                                    setNewName("");
                                                }}
                                                className="px-3 py-1 border border-black/[0.1] dark:border-white/[0.1] rounded-md text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <h3
                                            className="font-medium mb-1 truncate cursor-pointer hover:text-[var(--color-accent)]"
                                            onClick={() => {
                                                setEditingName(template.id);
                                                setNewName(template.templateName || template.topic);
                                            }}
                                        >
                                            {template.templateName || template.topic}
                                        </h3>
                                    )}
                                    <p className="text-xs text-black/50 dark:text-white/50 capitalize mb-2">
                                        {template.tone} • {formatDate(template.createdAt)}
                                    </p>
                                    <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">
                                        {template.generatedPosts?.twitter}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedPost(template)}
                                        className="p-2 rounded-md text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                                        title="View details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 rounded-md text-red-500 hover:text-red-600 transition-colors"
                                        title="Delete template"
                                    >
                                        <Trash2 className="w-5 h-5" />
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
                                <h3 className="text-lg font-bold mb-1">{selectedPost.templateName || selectedPost.topic}</h3>
                                <p className="text-sm text-black/60 dark:text-white/60 capitalize">Tone: {selectedPost.tone}</p>
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
