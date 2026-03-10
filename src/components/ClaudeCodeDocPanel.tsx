"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

export default function ClaudeCodeDocPanel({ doc, title }: { doc: string; title: string }) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(doc);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleDownload() {
        const blob = new Blob([doc], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_")}_spec.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl overflow-hidden bg-white dark:bg-[#1a1a1a]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[var(--color-accent)] text-black px-2 py-0.5 rounded font-bold">MD</span>
                    <span className="text-sm font-semibold">Claude Code用ドキュメント</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "コピー済み" : "コピー"}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                    >
                        <Download className="w-3.5 h-3.5" />
                        .mdダウンロード
                    </button>
                </div>
            </div>

            {/* Document Content */}
            <pre className="p-5 text-xs leading-relaxed text-black/80 dark:text-white/80 font-mono whitespace-pre-wrap overflow-x-auto max-h-[500px] overflow-y-auto">
                {doc}
            </pre>

            {/* Usage hint */}
            <div className="px-5 py-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
                <p className="text-xs text-black/40 dark:text-white/40">
                    💡 このMarkdownファイルをプロジェクトフォルダに保存し、Claude Codeに「TASK.mdを読んで開発を始めて」と指示してください。
                </p>
            </div>
        </div>
    );
}
