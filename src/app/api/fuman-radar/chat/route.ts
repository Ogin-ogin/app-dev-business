import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, history = [] } = body as {
      message: string;
      history?: { role: 'user' | 'model'; text: string }[];
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Fetch recent posts as RAG context (no uid, no embedding)
    const snapshot = await adminDb
      .collection('fuman_posts')
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();

    const contextPosts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        category: data.category,
        sentiment: data.sentiment,
        keywords: data.keywords,
        empathyCount: data.empathyCount,
      };
    });

    const systemPrompt = `あなたは「不満レーダー」というサービスの AI アナリストです。
ユーザーからの不満・愚痴データを収集・分析するプラットフォームです。

## 最新の不満投稿データ（${contextPosts.length}件）
${JSON.stringify(contextPosts, null, 2)}

## あなたの役割
- 不満データのトレンドや傾向を分析する
- カテゴリ別の特徴を説明する
- ビジネスインサイトを提供する
- 日本語で回答する
- データに基づいた具体的な分析を提供する`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'はい、不満レーダーのデータアナリストとしてお手伝いします。どのような分析が必要ですか？' }] },
        ...history.map((h) => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
      ],
    });

    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('POST /api/fuman-radar/chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
