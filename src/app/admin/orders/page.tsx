"use client";

import { useEffect, useState } from "react";

type Order = {
    id: string;
    userId?: string;
    userEmail?: string;
    productName?: string;
    amount?: number;
    status?: "pending" | "paid" | "delivered";
    createdAt?: string;
};

const STATUS_LABELS: Record<string, string> = {
    pending: "保留中",
    paid: "支払済",
    delivered: "配送済",
};

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/orders");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch {
            setError("注文データの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: string, status: string) {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (!res.ok) throw new Error("Failed to update");
            setOrders(prev =>
                prev.map(o => (o.id === id ? { ...o, status: status as Order["status"] } : o))
            );
        } catch {
            alert("ステータスの更新に失敗しました");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">注文管理</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">最新100件の注文を表示しています</p>
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
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-sm text-black/50 dark:text-white/50">
                        注文データがありません
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-black/[0.05] dark:border-white/[0.05]">
                                <tr className="text-left text-black/50 dark:text-white/50">
                                    <th className="px-4 py-3 font-medium">注文ID</th>
                                    <th className="px-4 py-3 font-medium">ユーザー</th>
                                    <th className="px-4 py-3 font-medium">商品</th>
                                    <th className="px-4 py-3 font-medium text-right">金額</th>
                                    <th className="px-4 py-3 font-medium">ステータス</th>
                                    <th className="px-4 py-3 font-medium">日付</th>
                                    <th className="px-4 py-3 font-medium">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                                        <td className="px-4 py-3 font-mono text-xs text-black/50 dark:text-white/50">
                                            {order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-4 py-3 text-black/70 dark:text-white/70">
                                            {order.userEmail || order.userId?.slice(0, 10) || "—"}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-black dark:text-white">
                                            {order.productName || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-black dark:text-white">
                                            {order.amount != null ? `¥${order.amount.toLocaleString()}` : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                STATUS_STYLES[order.status || "pending"]
                                            }`}>
                                                {STATUS_LABELS[order.status || "pending"]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-black/50 dark:text-white/50">
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString("ja-JP")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status || "pending"}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                                className="border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919] rounded px-2 py-1 text-xs disabled:opacity-50"
                                            >
                                                <option value="pending">保留中</option>
                                                <option value="paid">支払済</option>
                                                <option value="delivered">配送済</option>
                                            </select>
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
