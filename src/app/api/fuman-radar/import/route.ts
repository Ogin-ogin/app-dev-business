import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';
import { generateEmbedding, embeddingToBase64 } from '@/lib/embeddings';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FumanCategory } from '@/types/firestore';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const VALID_CATEGORIES: FumanCategory[] = [
  'economy', 'politics', 'healthcare', 'education', 'work',
  'housing', 'transport', 'food', 'service', 'tech', 'other',
];

async function analyzeAndEmbed(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const classifyPrompt = `以下の不満テキストを分析してJSONで返してください。
テキスト: "${text}"
形式: {"category":"economy|politics|healthcare|education|work|housing|transport|food|service|tech|other","sentiment":-1.0から1.0,"keywords":["kw1","kw2","kw3"]}
JSONのみ返してください。`;

  const empathyPrompt = `以下の不満に共感的な返答を日本語で1文で返してください。返答のみ返してください。
不満: "${text}"`;

  const [classifyResponse, empathyResponse, embeddingResult] = await Promise.all([
    model.generateContent(classifyPrompt),
    model.generateContent(empathyPrompt),
    generateEmbedding(text),
  ]);

  const classifyText = classifyResponse.response.text().trim();
  const aiEmpathy = empathyResponse.response.text().trim();

  let category: FumanCategory = 'other';
  let sentiment = -0.5;
  let keywords: string[] = [];

  try {
    const jsonStr = classifyText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (parsed.category && VALID_CATEGORIES.includes(parsed.category)) category = parsed.category;
    if (typeof parsed.sentiment === 'number') sentiment = Math.max(-1, Math.min(1, parsed.sentiment));
    if (Array.isArray(parsed.keywords)) keywords = parsed.keywords.slice(0, 5).map(String);
  } catch {
    // use fallbacks
  }

  return { category, sentiment, keywords, aiEmpathy, embedding: embeddingToBase64(embeddingResult) };
}

export async function POST(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { posts } = body as { posts: { text: string; source?: string }[] };

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'posts array is required' }, { status: 400 });
    }

    // Process up to 50 posts per request
    const toProcess = posts.slice(0, 50);
    let imported = 0;
    let errors = 0;

    for (const item of toProcess) {
      try {
        const text = item.text?.trim();
        if (!text || text.length > 500) { errors++; continue; }

        const textHash = crypto.createHash('sha256').update(text).digest('hex');

        // Check for duplicate
        const dupCheck = await adminDb.collection('fuman_posts').where('textHash', '==', textHash).limit(1).get();
        if (!dupCheck.empty) { errors++; continue; }

        const { category, sentiment, keywords, aiEmpathy, embedding } = await analyzeAndEmbed(text);

        await adminDb.collection('fuman_posts').add({
          uid,
          text,
          textHash,
          category,
          sentiment,
          keywords,
          embedding,
          aiEmpathy,
          empathyCount: 0,
          source: (item.source as 'seed' | 'import') || 'import',
          createdAt: new Date(),
        });

        imported++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({ imported, errors });
  } catch (error) {
    console.error('POST /api/fuman-radar/import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
