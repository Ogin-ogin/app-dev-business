"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Clock, BarChart2, Settings, ArrowLeft } from "lucide-react";
import React from "react";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "ダッシュボード", href: "/app/finance", icon: LayoutDashboard },
        { name: "収支入力", href: "/app/finance/add", icon: PlusCircle },
        { name: "履歴", href: "/app/finance/history", icon: Clock },
        { name: "AIレポート", href: "/app/finance/report", icon: BarChart2 },
        { name: "設定", href: "/app/finance/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] p-4 flex flex-col">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="font-bold text-lg">収支ダッシュボード</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Finance Tracker AI</div>
                </div>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    {navItems.map((item) => {
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
                                <Icon className="w-4 h-4" />
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
