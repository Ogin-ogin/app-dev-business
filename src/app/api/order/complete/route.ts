import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { chatSessionId, plan } = await req.json();

        if (!chatSessionId) {
            return NextResponse.json({ error: 'chatSessionId is required' }, { status: 400 });
        }

        // チャットセッションから仕様書データを取得
        const sessionDoc = await adminDb.collection('chat_sessions').doc(chatSessionId).get();
        if (!sessionDoc.exists) {
            return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
        }

        const sessionData = sessionDoc.data()!;

        // spec JSONをメッセージから抽出
        let spec = { title: 'カスタムアプリ' };
        let claudeCodeDoc = sessionData.claudeCodeDoc || '';

        const messages: { role: string; content: string }[] = sessionData.messages || [];
        const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
        if (lastAssistant) {
            try {
                const jsonMatch = lastAssistant.content.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[1]);
                    if (parsed.spec) spec = parsed.spec;
                }
            } catch {
                // spec抽出失敗は無視
            }
        }

        const uid = sessionData.uid || null;

        // projectsコレクションに保存
        const docRef = await adminDb.collection('projects').add({
            title: (spec as any).title || 'カスタムアプリ',
            spec,
            claudeCodeDoc,
            chatSessionId,
            uid,
            plan: plan || 'single',
            status: 'pending',
            paid: true,
            createdAt: new Date(),
        });

        // 3回パックの場合はクレジットを付与（残り2回）
        if (plan === 'triple' && uid) {
            await adminDb.collection('order_credits').add({
                chatSessionId,
                uid,
                remaining: 2,
                plan: 'triple',
                createdAt: new Date(),
            });
        }

        // 1回プランの場合も無料試用フラグをリセット（次回もクレジット必要）
        // triple購入でも次回はクレジットから消費されるのでリセット不要
        if (uid && plan === 'single') {
            // 単発購入済みユーザーは無料試用フラグを維持（再度は購入必要）
        }

        // セッションにprojectIdを記録
        await adminDb.collection('chat_sessions').doc(chatSessionId).set(
            { projectId: docRef.id, completed: true },
            { merge: true }
        );

        return NextResponse.json({ projectId: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error completing order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
