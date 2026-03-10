"use client";

import { useEffect, useState } from "react";

type User = {
    id: string;
    email?: string;
    plan?: "FREE" | "STANDARD" | "PRO";
    createdAt?: string;
    lastLoginAt?: string;
};

const PLAN_STYLES: Record<string, string> = {
    FREE: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    STANDARD: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PRO: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setUsers(data.users || []);
        } catch {
            setError("ユーザーデータの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">ユーザー管理</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                    最新100件のユーザーを表示しています（合計: {loading ? "—" : users.length.toLocaleString()}件）
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-black/40 dark:text-white/40">
                        読み込み中...
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-sm text-black/50 dark:text-white/50">
                        ユーザーデータがありません
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-black/[0.05] dark:border-white/[0.05]">
                                <tr className="text-left text-black/50 dark:text-white/50">
                                    <th className="px-4 py-3 font-medium">メールアドレス</th>
                                    <th className="px-4 py-3 font-medium">プラン</th>
                                    <th className="px-4 py-3 font-medium">登録日</th>
                                    <th className="px-4 py-3 font-medium">最終ログイン</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                                        <td className="px-4 py-3 font-medium text-black dark:text-white">
                                            {user.email || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                PLAN_STYLES[user.plan || "FREE"]
                                            }`}>
                                                {user.plan || "FREE"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-black/50 dark:text-white/50">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("ja-JP")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-black/50 dark:text-white/50">
                                            {user.lastLoginAt
                                                ? new Date(user.lastLoginAt).toLocaleDateString("ja-JP")
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
