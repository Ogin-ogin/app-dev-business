'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Send, Loader2, FileCheck, Info } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const INITIAL_MESSAGE: Message = {
    role: 'assistant',
    content: 'こんにちは！HoshiAppのAI開発コンサルタントです。どんなアプリを作りたいですか？まずはざっくりと教えてください！',
};

export default function OrderPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [specGenerated, setSpecGenerated] = useState(false);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const [parsedSummary, setParsedSummary] = useState<string>('');
    const [claudeCodeDoc, setClaudeCodeDoc] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Try to extract spec JSON from the last assistant message when spec is generated
    useEffect(() => {
        if (!specGenerated) return;
        const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
        if (!lastAssistant) return;
        try {
            const jsonMatch = lastAssistant.content.match(/\{[\s\S]*"spec"[\s\S]*"summary"[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setParsedSpec(parsed.spec);
                setParsedSummary(parsed.summary);
            }
        } catch {
            // Spec JSON extraction failed silently; user can still save without parsed data
        }
    }, [specGenerated, messages]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = { role: 'user', content: trimmed };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/order/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    sessionId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'エラーが発生しました');
            }

            const assistantMessage: Message = { role: 'assistant', content: data.reply };
            setMessages((prev) => [...prev, assistantMessage]);
            setSessionId(data.sessionId);
            if (data.specGenerated) {
                setSpecGenerated(true);
            }
            if (data.claudeCodeDoc) {
                setClaudeCodeDoc(data.claudeCodeDoc);
            }
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `エラーが発生しました: ${err.message}。もう一度お試しください。`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleCheckout = async (plan: 'single' | 'triple') => {
        setIsSaving(true);
        try {
            const priceId = plan === 'single'
                ? process.env.NEXT_PUBLIC_PRICE_ORDER_SINGLE
                : process.env.NEXT_PUBLIC_PRICE_ORDER_TRIPLE;

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    mode: 'payment',
                    metadata: {
                        chatSessionId: sessionId,
                        plan,
                        spec: JSON.stringify(parsedSpec || { title: 'カスタムアプリ' }),
                        claudeCodeDoc: claudeCodeDoc.slice(0, 500), // Stripeのmetadataは500文字制限
                    },
                    successPath: `/order/success?chatSession=${sessionId}&plan=${plan}`,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Checkout失敗');
            window.location.href = data.url;
        } catch (err: any) {
            alert(`エラー: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Plan Selection Modal */}
            {showPlanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-1 text-black dark:text-white">プランを選択</h2>
                        <p className="text-sm text-black/50 dark:text-white/50 mb-3">仕様書・開発ドキュメントの取得プランを選んでください</p>
                        <div className="mb-4 p-3 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] text-xs text-black/60 dark:text-white/60 leading-relaxed">
                            ※ この費用は仕様書の生成・取得に対するものです。完成品のご利用には別途費用（買い切りまたはサブスク）が発生します。
                        </div>
                        <div className="space-y-3 mb-5">
                            <button
                                onClick={() => handleCheckout('single')}
                                disabled={isSaving}
                                className="w-full flex items-center justify-between bg-black dark:bg-white text-white dark:text-black rounded-xl px-5 py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <div className="text-left">
                                    <div className="font-bold">1回プラン</div>
                                    <div className="text-sm opacity-70">今すぐ1件の仕様書を取得</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">¥330</div>
                                    <div className="text-xs opacity-60">税込</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleCheckout('triple')}
                                disabled={isSaving}
                                className="w-full flex items-center justify-between bg-[var(--color-accent)] text-black rounded-xl px-5 py-4 hover:opacity-90 transition-opacity disabled:opacity-50 relative"
                            >
                                <span className="absolute -top-2.5 left-4 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">お得</span>
                                <div className="text-left">
                                    <div className="font-bold">3回パック</div>
                                    <div className="text-sm opacity-70">1回あたり¥220 × 3回分</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">¥660</div>
                                    <div className="text-xs opacity-60">税込</div>
                                </div>
                            </button>
                        </div>
                        {isSaving && (
                            <div className="flex items-center justify-center gap-2 text-sm text-black/50 dark:text-white/50 mb-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                決済ページに移動中...
                            </div>
                        )}
                        <button
                            onClick={() => setShowPlanModal(false)}
                            className="w-full text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors py-2"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            )}
            <Header />
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">カスタムAI開発</h1>
                    <p className="text-black/60 dark:text-white/60 text-sm">
                        AIコンサルタントがあなたの要件をヒアリングし、仕様書と見積もりを自動生成します。
                    </p>
                </div>

                {/* Fee disclosure */}
                <div className="mb-6 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-4 h-4 mt-0.5 shrink-0 text-black/50 dark:text-white/50" />
                        <div className="text-sm text-black/70 dark:text-white/70 space-y-2 leading-relaxed">
                            <p className="font-semibold text-black dark:text-white">ご利用前にご確認ください</p>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2">
                                    <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 inline-block" />
                                    <span><strong>ヒアリング料（¥330〜）</strong>は、仕様書・開発ドキュメントの生成・取得に対する費用です。</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 inline-block" />
                                    <span>開発完了後の<strong>完成品のご利用には別途費用</strong>が発生します。APIや外部サービスを使わないアプリは<strong>買い切り</strong>、AI機能・クラウド費用が継続的に発生するアプリは<strong>月額サブスク</strong>でのご提供となります。</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 inline-block" />
                                    <span>仕様書の内容をもとに開発を進めるかどうかは、最終的にお客様がご判断いただけます。</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex-1 border border-black/[0.1] dark:border-white/[0.1] rounded-xl flex flex-col overflow-hidden bg-black/[0.01] dark:bg-white/[0.01] min-h-0">
                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0 mt-1">
                                        <Sparkles className="w-4 h-4 text-black" />
                                    </div>
                                )}
                                <div
                                    className={`p-4 rounded-xl max-w-[80%] text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                                        msg.role === 'user'
                                            ? 'bg-[var(--color-accent)] text-black'
                                            : 'bg-white dark:bg-[#222] border border-black/[0.05] dark:border-white/[0.05]'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-3 self-start">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0 mt-1">
                                    <Sparkles className="w-4 h-4 text-black" />
                                </div>
                                <div className="bg-white dark:bg-[#222] border border-black/[0.05] dark:border-white/[0.05] p-4 rounded-xl text-sm shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-black/40 dark:text-white/40" />
                                    <span className="text-black/40 dark:text-white/40">考え中...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Spec Generated CTA */}
                    {specGenerated && (
                        <div className="px-4 py-3 bg-[var(--color-accent)]/10 border-t border-[var(--color-accent)]/20 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <FileCheck className="w-4 h-4 text-[var(--color-accent)]" />
                                <span className="font-medium">仕様書が完成しました！</span>
                            </div>
                            <button
                                onClick={() => setShowPlanModal(true)}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-[var(--color-accent)] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                <FileCheck className="w-4 h-4" />
                                仕様書を取得する
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919]">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="メッセージを入力してください..."
                                disabled={isLoading}
                                className="w-full bg-black/[0.03] dark:bg-white/[0.05] border-none rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
