"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    User,
    FileText,
    Phone,
    Map,
    MessageCircle,
    TrendingUp,
    Settings,
    ArrowLeft,
} from "lucide-react";
import React from "react";

const freeNavItems = [
    { name: "タイムライン", href: "/app/fuman-radar", icon: Home },
    { name: "探索", href: "/app/fuman-radar/explore", icon: Search },
    { name: "マイ投稿", href: "/app/fuman-radar/my-posts", icon: User },
    { name: "個人レポート", href: "/app/fuman-radar/my-report", icon: FileText },
    { name: "AI愚痴通話", href: "/app/fuman-radar/voice", icon: Phone },
];

const paidNavItems = [
    { name: "UMAPマップ", href: "/app/fuman-radar/map", icon: Map },
    { name: "AI対話分析", href: "/app/fuman-radar/chat", icon: MessageCircle },
    { name: "トレンド", href: "/app/fuman-radar/trends", icon: TrendingUp },
    { name: "設定", href: "/app/fuman-radar/settings", icon: Settings },
];

export default function FumanRadarLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] p-4 flex flex-col">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="font-bold text-lg text-black dark:text-white">不満レーダー</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Fuman Radar</div>
                </div>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    {freeNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                    isActive
                                        ? "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white"
                                        : "text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white"
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Divider for analyst section */}
                    <div className="hidden md:block pt-3 pb-1">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/30 px-3">
                            分析者向け
                        </div>
                    </div>
                    <div className="md:hidden flex items-center px-2">
                        <div className="h-px flex-1 bg-black/[0.1] dark:bg-white/[0.1]" />
                    </div>

                    {paidNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                    isActive
                                        ? "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white"
                                        : "text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white"
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
