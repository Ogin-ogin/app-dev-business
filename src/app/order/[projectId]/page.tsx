import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClaudeCodeDocPanel from '@/components/ClaudeCodeDocPanel';
import { CheckCircle, Clock, Truck, FileText, Users, Palette, DollarSign, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';

interface ProjectSpec {
    title: string;
    purpose: string;
    features: string[];
    target: string;
    design: string;
    estimate: string;
    timeline: string;
}

interface Project {
    id: string;
    title: string;
    spec: ProjectSpec;
    summary: string;
    claudeCodeDoc?: string;
    status: 'pending' | 'in_progress' | 'delivered';
    createdAt: string;
}

async function getProject(projectId: string): Promise<Project | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/order/project/${projectId}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

const STATUS_CONFIG = {
    pending: {
        label: '受付中',
        icon: Clock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    in_progress: {
        label: '開発中',
        icon: CheckCircle,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    delivered: {
        label: '納品済み',
        icon: Truck,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
    },
};

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;
    const project = await getProject(projectId);

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-2xl font-bold mb-2">プロジェクトが見つかりません</p>
                        <p className="text-black/60 dark:text-white/60 mb-6">URLを確認してください。</p>
                        <Link
                            href="/order"
                            className="bg-[var(--color-accent)] text-black px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            新しく相談する
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const spec = project.spec || {};

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-sm text-black/40 dark:text-white/40 mb-1">プロジェクト詳細</p>
                            <h1 className="text-3xl font-bold">{project.title || spec.title || 'カスタムアプリ'}</h1>
                        </div>
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}
                        >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                        </span>
                    </div>
                    {project.createdAt && (
                        <p className="text-sm text-black/40 dark:text-white/40 mt-2">
                            作成日: {new Date(project.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                    )}
                </div>

                {/* Spec Cards */}
                <div className="grid gap-4">
                    {/* Purpose */}
                    {spec.purpose && (
                        <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-[var(--color-accent)]" />
                                <h2 className="font-semibold text-sm">アプリの目的</h2>
                            </div>
                            <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{spec.purpose}</p>
                        </div>
                    )}

                    {/* Features */}
                    {spec.features && spec.features.length > 0 && (
                        <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                            <div className="flex items-center gap-2 mb-3">
                                <Layers className="w-4 h-4 text-[var(--color-accent)]" />
                                <h2 className="font-semibold text-sm">主要機能</h2>
                            </div>
                            <ul className="space-y-2">
                                {spec.features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
                                        <span className="mt-0.5 w-5 h-5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center text-xs font-bold shrink-0">
                                            {i + 1}
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Target + Design side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {spec.target && (
                            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-4 h-4 text-[var(--color-accent)]" />
                                    <h2 className="font-semibold text-sm">ターゲットユーザー</h2>
                                </div>
                                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{spec.target}</p>
                            </div>
                        )}
                        {spec.design && (
                            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Palette className="w-4 h-4 text-[var(--color-accent)]" />
                                    <h2 className="font-semibold text-sm">デザイン方針</h2>
                                </div>
                                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{spec.design}</p>
                            </div>
                        )}
                    </div>

                    {/* Estimate + Timeline side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {spec.estimate && (
                            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                                <div className="flex items-center gap-2 mb-3">
                                    <DollarSign className="w-4 h-4 text-[var(--color-accent)]" />
                                    <h2 className="font-semibold text-sm">見積もり</h2>
                                </div>
                                <p className="text-lg font-bold text-[var(--color-accent)]">{spec.estimate}</p>
                            </div>
                        )}
                        {spec.timeline && (
                            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 bg-white dark:bg-[#1a1a1a]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
                                    <h2 className="font-semibold text-sm">開発期間</h2>
                                </div>
                                <p className="text-lg font-bold">{spec.timeline}</p>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {project.summary && (
                        <div className="border border-[var(--color-accent)]/30 rounded-xl p-5 bg-[var(--color-accent)]/5">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-[var(--color-accent)]" />
                                <h2 className="font-semibold text-sm">仕様書サマリー</h2>
                            </div>
                            <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                                {project.summary}
                            </p>
                        </div>
                    )}
                </div>

                {/* Claude Code Document */}
                {project.claudeCodeDoc && (
                    <div className="mt-6">
                        <ClaudeCodeDocPanel
                            doc={project.claudeCodeDoc}
                            title={project.title || 'spec'}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex gap-3 flex-wrap">
                    <Link
                        href="/order"
                        className="text-sm font-medium px-5 py-2.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] hover:border-black/30 dark:hover:border-white/30 transition-colors"
                    >
                        新しく相談する
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
