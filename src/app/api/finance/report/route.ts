import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUidFromRequest } from '@/lib/get-uid-from-request';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { year } = body;

        // 1ユーザー1回制限
        const uid = await getUidFromRequest(req);
        if (uid) {
            const usageRef = adminDb.collection('usage').doc(uid);
            const usageDoc = await usageRef.get();
            if (usageDoc.data()?.financeReportGenerated) {
                return NextResponse.json(
                    { error: 'AIレポートは1アカウント1回までご利用いただけます。' },
                    { status: 403 }
                );
            }
            await usageRef.set({ financeReportGenerated: true }, { merge: true });
        }
        const targetYear = year || new Date().getFullYear();

        // Fetch this year's data
        const snapshot = await adminDb.collection('finances').orderBy('date', 'desc').limit(500).get();

        const entries = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: data.type,
                    category: data.category,
                    amount: data.amount,
                    date: data.date?.toDate?.()?.toISOString?.() || data.date,
                    memo: data.memo,
                };
            })
            .filter(e => new Date(e.date).getFullYear() === Number(targetYear));

        if (entries.length === 0) {
            return NextResponse.json({
                forecast: 'データが不足しています。まず収支データを入力してください。',
                taxAdvice: 'データが不足しています。',
                summary: { totalIncome: 0, totalExpense: 0, netProfit: 0 }
            });
        }

        // Compute summary
        const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
        const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
        const netProfit = totalIncome - totalExpense;

        // Monthly breakdown
        const monthly: Record<string, { income: number; expense: number }> = {};
        entries.forEach(e => {
            const m = new Date(e.date).getMonth() + 1;
            const key = `${m}月`;
            if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
            if (e.type === 'income') monthly[key].income += e.amount;
            else monthly[key].expense += e.amount;
        });

        const dataStr = JSON.stringify({ totalIncome, totalExpense, netProfit, monthly, entries: entries.slice(0, 50) }, null, 2);

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
        const result = await model.generateContent(`
あなたは個人事業主・フリーランス向けの財務アドバイザーです。以下の${targetYear}年の収支データを分析して、日本語でアドバイスを提供してください。

収支データ:
${dataStr}

以下の2点について、それぞれ200〜300文字程度で具体的にアドバイスしてください：

1. **売上予測・改善提案**: 現在のトレンドから今後の売上予測と改善提案
2. **節税アドバイス**: 経費計上できる項目や節税のポイント

JSON形式で返してください：
{
  "forecast": "売上予測・改善提案のテキスト",
  "taxAdvice": "節税アドバイスのテキスト"
}
`);

        const text = result.response.text().trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response');

        const aiResult = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            ...aiResult,
            summary: { totalIncome, totalExpense, netProfit },
            monthly,
        });
    } catch (error: any) {
        console.error('Error generating finance report:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
