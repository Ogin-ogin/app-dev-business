"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle, Clock, ExternalLink } from "lucide-react";

type Hearing = {
    id: string;
    title: string;
    uid: string | null;
    messageCount: number;
    claudeCodeDoc: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    paid: boolean;
    projectId: string | null;
    projectStatus: string | null;
};

function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("ja-JP", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
    });
}

function HearingRow({ h }: { h: Hearing }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden bg-white dark:bg-[#191919]">
            {/* Header row */}
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors"
            >
                <div className="p-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06]">
                    <FileText className="w-4 h-4 text-black/60 dark:text-white/60" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-black dark:text-white truncate">
                            {h.title}
                        </span>
                        {h.paid ? (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <CheckCircle className="w-2.5 h-2.5" /> 購入済
                            </span>
                        ) : (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                <Clock className="w-2.5 h-2.5" /> 未購入
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-black/40 dark:text-white/40">
                        <span>UID: {h.uid ? h.uid.slice(0, 12) + "…" : "不明"}</span>
                        <span>会話: {h.messageCount}件</span>
                        <span>完了: {formatDate(h.updatedAt)}</span>
                    </div>
                </div>

                {open ? (
                    <ChevronUp className="w-4 h-4 text-black/40 dark:text-white/40 shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-black/40 dark:text-white/40 shrink-0" />
                )}
            </button>

            {/* Expanded: spec doc */}
            {open && (
                <div className="border-t border-black/[0.06] dark:border-white/[0.06] px-5 py-4">
                    {h.projectId && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-black/50 dark:text-white/50">
                            <ExternalLink className="w-3 h-3" />
                            プロジェクトID: <span className="font-mono">{h.projectId}</span>
                            {h.projectStatus && (
                                <span className="px-2 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08]">
                                    {h.projectStatus}
                                </span>
                            )}
                        </div>
                    )}

                    {h.claudeCodeDoc ? (
                        <div className="bg-black/[0.03] dark:bg-black/50 rounded-xl p-4 overflow-x-auto">
                            <pre className="text-[11px] text-black/80 dark:text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                                {h.claudeCodeDoc}
                            </pre>
                        </div>
                    ) : (
                        <p className="text-sm text-black/40 dark:text-white/40 italic">
                            仕様書ドキュメントが見つかりません（仕様書生成後に購入していない可能性があります）
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminHearingsPage() {
    const [hearings, setHearings] = useState<Hearing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/hearings")
            .then(r => r.json())
            .then(d => setHearings(d.sessions || []))
            .catch(() => setError("データの取得に失敗しました"))
            .finally(() => setLoading(false));
    }, []);

    const paidCount = hearings.filter(h => h.paid).length;
    const unpaidCount = hearings.length - paidCount;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">ヒアリング一覧</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                    AIヒアリングで仕様書が完成したセッション一覧
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "合計", value: hearings.length, color: "text-black dark:text-white" },
                    { label: "購入済み", value: paidCount, color: "text-green-600 dark:text-green-400" },
                    { label: "未購入", value: unpaidCount, color: "text-yellow-600 dark:text-yellow-400" },
                ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-xl p-4 text-center">
                        <div className={`text-2xl font-bold ${c.color}`}>
                            {loading ? "—" : c.value}
                        </div>
                        <div className="text-xs text-black/50 dark:text-white/50 mt-1">{c.label}</div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
                    ))}
                </div>
            ) : hearings.length === 0 ? (
                <div className="text-center py-16 text-sm text-black/40 dark:text-white/40">
                    ヒアリング完了済みのセッションがありません
                </div>
            ) : (
                <div className="space-y-3">
                    {hearings.map(h => (
                        <HearingRow key={h.id} h={h} />
                    ))}
                </div>
            )}
        </div>
    );
}
