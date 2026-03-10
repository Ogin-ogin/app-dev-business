import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's own posts
    const snapshot = await adminDb
      .collection('fuman_posts')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ report: null, stats: null });
    }

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        text: data.text,
        category: data.category,
        sentiment: data.sentiment,
        keywords: data.keywords || [],
        empathyCount: data.empathyCount || 0,
      };
    });

    // Compute stats
    const total = posts.length;
    const avgSentiment = posts.reduce((s, p) => s + p.sentiment, 0) / total;

    const categoryCounts: Record<string, number> = {};
    posts.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'other';

    const keywordCounts: Record<string, number> = {};
    posts.forEach((p) => {
      p.keywords.forEach((k: string) => {
        keywordCounts[k] = (keywordCounts[k] || 0) + 1;
      });
    });
    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    // Generate AI report
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const prompt = `以下はユーザーが投稿した不満データです。日本語で個人分析レポートを作成してください。

投稿数: ${total}件
平均感情スコア: ${avgSentiment.toFixed(2)}（-1.0〜1.0、低いほど不満が強い）
主なカテゴリ: ${topCategory}
頻出キーワード: ${topKeywords.join('、')}

カテゴリ分布:
${Object.entries(categoryCounts).map(([cat, count]) => `- ${cat}: ${count}件`).join('\n')}

最近の投稿サンプル（最大5件）:
${posts.slice(0, 5).map((p, i) => `${i + 1}. [${p.category}] ${p.text}`).join('\n')}

以下の構成でレポートを書いてください:
1. 不満の傾向サマリー（2〜3文）
2. 主な不満のカテゴリと特徴
3. 感情スコアの解説
4. 前向きなアドバイス（1〜2文）`;

    const result = await model.generateContent(prompt);
    const report = result.response.text();

    return NextResponse.json({
      report,
      stats: { total, avgSentiment, topCategory, topKeywords },
    });
  } catch (error) {
    console.error('GET /api/fuman-radar/my-report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
