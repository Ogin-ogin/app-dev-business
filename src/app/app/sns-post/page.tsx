"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";

export default function GeneratorPage() {
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setResult(null); // Clear previous results

        try {
            const response = await fetch('/api/generate-posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, tone }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate posts');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error: any) {
            console.error('Error calling generate API:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold mb-2">Create New Post</h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    Enter your topic and tone. Our AI will craft optimized posts for X, LinkedIn, and Instagram.
                </p>
            </div>

            <div className="bg-white dark:bg-[#191919] p-6 rounded-xl border border-black/[0.1] dark:border-white/[0.1] shadow-sm flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium mb-2">What is the post about?</label>
                    <textarea
                        className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.1] dark:border-white/[0.1] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent min-h-[100px]"
                        placeholder="e.g., Announcing a new AI platform that builds web apps 10x faster..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Select Tone</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["Professional", "Casual", "Enthusiastic", "Humorous"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t.toLowerCase())}
                                className={`py-2 px-3 text-sm rounded-md border text-center transition-colors ${tone === t.toLowerCase()
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-black dark:text-white font-medium"
                                    : "border-black/[0.1] dark:border-white/[0.1] text-black/70 dark:text-white/70 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!topic || loading}
                    className="mt-2 w-full bg-[var(--color-accent)] text-black font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Generate Posts
                </button>
            </div>

            {result && (
                <div className="flex flex-col gap-6 mt-4">
                    <h2 className="text-xl font-semibold">Generated Posts</h2>

                    {(Object.keys(result) as Array<"twitter" | "linkedin" | "instagram">).map((platform, i) => (
                        <div key={platform} className="bg-white dark:bg-[#191919] rounded-xl border border-black/[0.1] dark:border-white/[0.1] overflow-hidden">
                            <div className="bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 border-b border-black/[0.1] dark:border-white/[0.1] flex justify-between items-center">
                                <span className="font-medium capitalize flex items-center gap-2 text-sm">
                                    {platform === "twitter" ? "X (Twitter)" : platform}
                                </span>
                                <span className="text-xs text-black/50 dark:text-white/50">{result[platform].length} chars</span>
                            </div>
                            <div className="p-4">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/80 dark:text-white/80">{result[platform]}</p>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => copyToClipboard(result[platform], i)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-black/[0.05] dark:bg-white/[0.1] px-3 py-1.5 rounded-md"
                                    >
                                        {copiedIndex === i ? (
                                            <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
