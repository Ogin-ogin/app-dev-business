"use client";

import { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";

interface Template {
    id: string;
    topic: string;
    tone: string;
    templateName?: string;
    generatedPosts: {
        twitter: string;
        linkedin: string;
        instagram: string;
    };
}

interface TemplateSelectorProps {
    onSelect: (template: Template) => void;
    onClose: () => void;
}

export default function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
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
        fetchTemplates();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#191919] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <h3 className="text-lg font-bold">Select Template</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <p className="text-center text-black/60 dark:text-white/60 py-8">Loading templates...</p>
                    ) : templates.length === 0 ? (
                        <p className="text-center text-black/60 dark:text-white/60 py-8">
                            No templates saved yet. Save a post as template from the history page.
                        </p>
                    ) : (
                        <div className="grid gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        onSelect(template);
                                        onClose();
                                    }}
                                    className="text-left p-4 border border-black/[0.1] dark:border-white/[0.1] rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="font-medium mb-1">
                                        {template.templateName || template.topic}
                                    </div>
                                    <div className="text-xs text-black/50 dark:text-white/50 capitalize">
                                        Tone: {template.tone}
                                    </div>
                                    <div className="text-xs text-black/40 dark:text-white/40 mt-2 line-clamp-2">
                                        {template.generatedPosts.twitter}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
