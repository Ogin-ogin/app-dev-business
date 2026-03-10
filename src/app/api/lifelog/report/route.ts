import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getWeekDateRange(year: number, week: number): { start: Date; end: Date } {
    // ISO week: week 1 is the week containing the first Thursday of January
    const jan4 = new Date(year, 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));

    const start = new Date(startOfWeek1);
    start.setDate(startOfWeek1.getDate() + (week - 1) * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { year, week } = body;
        const targetYear = Number(year) || new Date().getFullYear();
        const targetWeek = Number(week) || 1;

        const { start, end } = getWeekDateRange(targetYear, targetWeek);

        // Fetch all logs then filter by week
        const snapshot = await adminDb.collection('lifelogs').orderBy('date', 'desc').limit(500).get();

        const entries = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const dateObj = data.date?.toDate?.() || new Date(data.date);
                return {
                    id: doc.id,
                    date: dateObj.toISOString(),
                    mood: data.mood,
                    tags: data.tags || [],
                    reflection: data.reflection || '',
                    goalAchieved: data.goalAchieved || false,
                };
            })
            .filter(e => {
                const d = new Date(e.date);
                return d >= start && d <= end;
            });

        if (entries.length === 0) {
            return NextResponse.json({
                summary: `${targetYear}年第${targetWeek}週のログデータがありません。この週にログを記録してからレポートを生成してください。`,
                improvements: 'データが不足しています。毎日ログを記録することをお勧めします。',
                nextGoals: '来週は毎日ログを記録することを目標にしてみましょう。',
            });
        }

        const avgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
        const allTags = entries.flatMap(e => e.tags);
        const tagCounts: Record<string, number> = {};
        allTags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
        const goalAchievedCount = entries.filter(e => e.goalAchieved).length;

        const dataStr = JSON.stringify({
            week: `${targetYear}年第${targetWeek}週 (${start.toLocaleDateString('ja-JP')} 〜 ${end.toLocaleDateString('ja-JP')})`,
            entryCount: entries.length,
            avgMood: Math.round(avgMood * 10) / 10,
            goalAchievedCount,
            tagCounts,
            entries: entries.map(e => ({
                date: new Date(e.date).toLocaleDateString('ja-JP'),
                mood: e.mood,
                tags: e.tags,
                reflection: e.reflection,
                goalAchieved: e.goalAchieved,
            })),
        }, null, 2);

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
        const result = await model.generateContent(`
あなたは親切な生活習慣コーチです。以下のライフログデータを分析して、日本語で週次レポートを作成してください。

ログデータ:
${dataStr}

以下の3点について、それぞれ150〜250文字程度で具体的かつ前向きに記述してください：

1. **振り返りサマリー**: 今週の活動・気分・達成度の客観的なまとめ
2. **改善提案**: より良い生活習慣のための具体的なアドバイス
3. **来週の目標**: 実行可能な具体的な目標提案

必ず以下のJSON形式のみで返してください（マークダウンなし）：
{
  "summary": "振り返りサマリーのテキスト",
  "improvements": "改善提案のテキスト",
  "nextGoals": "来週の目標のテキスト"
}
`);

        const text = result.response.text().trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response format');

        const aiResult = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            summary: aiResult.summary,
            improvements: aiResult.improvements,
            nextGoals: aiResult.nextGoals,
        });
    } catch (error: any) {
        console.error('Error generating lifelog report:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
