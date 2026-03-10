"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, BarChart2, Shield } from "lucide-react";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "ダッシュボード", href: "/admin", icon: LayoutDashboard },
        { name: "注文管理", href: "/admin/orders", icon: ShoppingCart },
        { name: "ユーザー管理", href: "/admin/users", icon: Users },
        { name: "フィードバック", href: "/admin/feedback", icon: MessageSquare },
        { name: "売上レポート", href: "/admin/revenue", icon: BarChart2 },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] p-4 flex flex-col">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-5 h-5 text-[var(--color-accent)]" />
                        <div className="font-bold text-lg text-black dark:text-white">管理画面</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-accent)] text-black">
                        ADMIN
                    </span>
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
            <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
