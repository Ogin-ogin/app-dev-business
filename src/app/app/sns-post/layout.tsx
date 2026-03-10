"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Clock, Settings, ArrowLeft, Star, FileText } from "lucide-react";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Generate", href: "/app/sns-post", icon: PenTool },
        { name: "History", href: "/app/sns-post/history", icon: Clock },
        { name: "Favorites", href: "/app/sns-post/favorites", icon: Star },
        { name: "Templates", href: "/app/sns-post/templates", icon: FileText },
        { name: "Settings", href: "/app/sns-post/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] p-4 flex flex-col">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="font-bold text-lg">SNS Poster AI</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Pro Plan Active</div>
                </div>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                        ? "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white"
                                        : "text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
