"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatSession = searchParams.get("chatSession");
    const plan = searchParams.get("plan");
    const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

    useEffect(() => {
        if (!chatSession) {
            router.replace("/order");
            return;
        }
        saveSpec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatSession]);

    async function saveSpec() {
        try {
            const res = await fetch("/api/order/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatSessionId: chatSession, plan }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setStatus("done");
            setTimeout(() => router.push(`/order/${data.projectId}`), 3000);
        } catch (e: any) {
            console.error(e);
            setStatus("error");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
            <div className="text-center max-w-sm">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                        <p className="text-lg font-semibold text-black dark:text-white">仕様書を保存中...</p>
                        <p className="text-sm text-black/50 dark:text-white/50 mt-1">少々お待ちください</p>
                    </>
                )}
                {status === "done" && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-black dark:text-white">お支払いありがとうございます！</p>
                        <p className="text-sm text-black/50 dark:text-white/50 mt-1">仕様書の準備ができました。</p>
                        <p className="text-xs text-black/30 dark:text-white/30 mt-4">3秒後に仕様書ページへ移動します...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <p className="text-lg font-semibold text-black dark:text-white">エラーが発生しました</p>
                        <p className="text-sm text-black/50 dark:text-white/50 mt-1 mb-4">お手数ですが、サポートにご連絡ください。</p>
                        <button onClick={() => router.push("/order")} className="text-sm underline">
                            ヒアリングページに戻る
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)]" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
