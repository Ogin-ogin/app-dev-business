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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = adminDb
      .collection('fuman_posts')
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query;

    if (category && VALID_CATEGORIES.includes(category as FumanCategory)) {
      query = query.where('category', '==', category);
    }

    // offset via startAfter is complex without cursor; use limit+offset approach
    const snapshot = await query.limit(offset + limit).get();
    const docs = snapshot.docs.slice(offset);

    const posts = docs.map((doc) => {
      const data = doc.data();
      // Strip uid and embedding from public response
      const { uid: _uid, embedding: _embedding, ...rest } = data;
      return { id: doc.id, ...rest };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('GET /api/fuman-radar/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { text, category } = body as { text?: string; category?: string };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ error: 'text must be 500 characters or less' }, { status: 400 });
    }

    const trimmedText = text.trim();

    // Generate SHA-256 hash for dedup
    const textHash = crypto.createHash('sha256').update(trimmedText).digest('hex');

    // Check for duplicate
    const dupCheck = await adminDb
      .collection('fuman_posts')
      .where('textHash', '==', textHash)
      .limit(1)
      .get();

    if (!dupCheck.empty) {
      return NextResponse.json({ error: 'Duplicate post detected' }, { status: 409 });
    }

    // Run Gemini classification and embedding in parallel
    const [analysisResult, embeddingResult] = await Promise.all([
      analyzeComplaint(trimmedText),
      generateEmbedding(trimmedText),
    ]);

    const { category: aiCategory, sentiment, keywords, aiEmpathy } = analysisResult;

    // Resolve final category: prefer body param if valid, else AI result
    const finalCategory: FumanCategory =
      category && VALID_CATEGORIES.includes(category as FumanCategory)
        ? (category as FumanCategory)
        : aiCategory;

    const embeddingBase64 = embeddingToBase64(embeddingResult);

    const docData = {
      uid,
      text: trimmedText,
      textHash,
      category: finalCategory,
      sentiment,
      keywords,
      embedding: embeddingBase64,
      aiEmpathy,
      empathyCount: 0,
      source: (body.source === 'voice' ? 'voice' : 'user') as 'user' | 'voice',
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection('fuman_posts').add(docData);

    return NextResponse.json({ id: docRef.id, aiEmpathy }, { status: 201 });
  } catch (error) {
    console.error('POST /api/fuman-radar/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function analyzeComplaint(text: string): Promise<{
  category: FumanCategory;
  sentiment: number;
  keywords: string[];
  aiEmpathy: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const classifyPrompt = `以下の不満・苦情テキストを分析して、JSONで返してください。

テキスト: "${text}"

返すJSONの形式:
{
  "category": "economy|politics|healthcare|education|work|housing|transport|food|service|tech|other のいずれか",
  "sentiment": -1.0から1.0の数値（-1.0が最も否定的、1.0が最も肯定的）,
  "keywords": ["キーワード1", "キーワード2", "キーワード3"] // 3〜5個の日本語キーワード
}

JSONのみ返してください。`;

  const empathyPrompt = `以下の不満・苦情に対して、共感的な返答を日本語で1〜2文で返してください。返答のみ返してください。

不満・苦情: "${text}"`;

  // Run classify and empathy generation in parallel
  const [classifyResponse, empathyResponse] = await Promise.all([
    model.generateContent(classifyPrompt),
    model.generateContent(empathyPrompt),
  ]);

  const classifyText = classifyResponse.response.text().trim();
  const aiEmpathy = empathyResponse.response.text().trim();

  let category: FumanCategory = 'other';
  let sentiment = -0.5;
  let keywords: string[] = [];

  try {
    // Strip markdown code fences if present
    const jsonStr = classifyText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(jsonStr);

    if (parsed.category && VALID_CATEGORIES.includes(parsed.category)) {
      category = parsed.category;
    }
    if (typeof parsed.sentiment === 'number') {
      sentiment = Math.max(-1, Math.min(1, parsed.sentiment));
    }
    if (Array.isArray(parsed.keywords)) {
      keywords = parsed.keywords.slice(0, 5).map(String);
    }
  } catch {
    console.warn('Failed to parse Gemini classification response, using fallbacks');
  }

  return { category, sentiment, keywords, aiEmpathy };
}
