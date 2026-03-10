"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import {
    SnsPostPreview,
    FinancePreview,
    LifelogPreview,
    FumanRadarPreview,
} from "@/components/app-previews/AppPreviews";

const APPS = [
    {
        id: "sns-post-ai",
        name: "SNS投稿AI量産ツール",
        desc: "テーマ入力→X/Instagram/LinkedIn向け投稿文を一括生成",
        monthly: 580,
        demoHref: "/demo/sns-post",
        accent: "#a78bfa",
        Preview: SnsPostPreview,
    },
    {
        id: "freelance-dashboard",
        name: "フリーランス収支管理",
        desc: "収支入力でグラフ化＋AIによる節税アドバイス",
        monthly: 680,
        demoHref: "/demo/finance",
        accent: "#4ade80",
        Preview: FinancePreview,
    },
    {
        id: "life-log-tool",
        name: "AIライフログ",
        desc: "毎日のログからAIが週次レポートと分析を自動生成",
        monthly: 480,
        demoHref: "/demo/lifelog",
        accent: "#60a5fa",
        Preview: LifelogPreview,
    },
    {
        id: "fuman-radar",
        name: "不満レーダー",
        desc: "不満を匿名収集してAIが分析・UMAP可視化",
        monthly: 500,
        demoHref: "/demo/fuman-radar",
        accent: "#f87171",
        Preview: FumanRadarPreview,
    },
];

export default function AppShowcase() {
    const [active, setActive] = useState(0);
    const [slide, setSlide] = useState(0);

    // Auto-rotate apps every 4s
    useEffect(() => {
        const t = setInterval(() => {
            setActive(a => (a + 1) % APPS.length);
            setSlide(0);
        }, 7000);
        return () => clearInterval(t);
    }, []);

    const app = APPS[active];
    const { Preview } = app;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8 items-center">
            {/* Left: App list */}
            <div className="w-full lg:w-72 shrink-0 space-y-2">
                {APPS.map((a, i) => (
                    <button
                        key={a.id}
                        onClick={() => { setActive(i); setSlide(0); }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                            active === i
                                ? "bg-white dark:bg-[#1e1e1e] shadow-md border-transparent"
                                : "border-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                        }`}
                        style={active === i ? { borderLeft: `3px solid ${a.accent}` } : {}}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`font-semibold text-sm ${active === i ? "text-black dark:text-white" : "text-black/50 dark:text-white/50"}`}>
                                {a.name}
                            </span>
                            {active === i && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: a.accent, color: "#000" }}>
                                    ¥{a.monthly}/月
                                </span>
                            )}
                        </div>
                        {active === i && (
                            <p className="text-xs text-black/50 dark:text-white/50 mt-1 leading-relaxed">
                                {a.desc}
                            </p>
                        )}
                    </button>
                ))}

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 px-4 pt-2">
                    {APPS.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => { setActive(i); setSlide(0); }}
                            className="h-1 rounded-full cursor-pointer transition-all duration-300"
                            style={{
                                width: active === i ? 24 : 6,
                                background: active === i ? app.accent : "rgba(0,0,0,0.15)",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 w-full min-w-0">
                <div
                    key={active}
                    className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/[0.08] dark:ring-white/[0.06]"
                    style={{ animation: "fadeSlideIn 0.4s ease" }}
                >
                    <Preview slide={slide} />
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 mt-4">
                    <Link
                        href={app.demoHref}
                        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80"
                        style={{ borderColor: app.accent, color: app.accent }}
                    >
                        <Play className="w-3.5 h-3.5" /> デモを試す
                    </Link>
                    <Link
                        href={`/products/${app.id}`}
                        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-black transition-opacity hover:opacity-80"
                        style={{ background: app.accent }}
                    >
                        詳細を見る <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
