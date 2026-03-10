import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const PRODUCTS = [
    {
        id: 'sns-post-ai',
        name: 'SNS投稿AI量産ツール',
        category: 'Marketing',
        monthly: 580,
        desc: 'テーマ入力からX/Instagram/LinkedIn向け投稿文を一括生成するツール。フリーランスや副業マーケターに最適。AIが各プラットフォームに最適なトーンと文字数で自動生成します。',
        keywords: ['SNS', 'Twitter', 'X', 'Instagram', 'LinkedIn', '投稿', 'マーケティング', 'ライティング', 'コンテンツ', '文章生成'],
    },
    {
        id: 'freelance-dashboard',
        name: 'フリーランス収支ダッシュボード',
        category: 'Data Analysis',
        monthly: 680,
        desc: '売上・経費入力でグラフ化＋AIによる来月予測＆節税アドバイス。フリーランスや個人事業主の確定申告・収支管理に最適。',
        keywords: ['収支', '売上', '経費', '会計', '節税', 'フリーランス', '個人事業主', '確定申告', 'グラフ', '財務'],
    },
    {
        id: 'life-log-tool',
        name: 'AIライフログ＆振り返り',
        category: 'Productivity',
        monthly: 480,
        desc: '毎日の作業・気分のログからAIが週次レポートと分析を自動生成。習慣化・生産性向上・自己改善に最適。',
        keywords: ['日記', 'ログ', '生産性', '習慣', '振り返り', 'レポート', 'メンタル', '作業記録', '目標'],
    },
    {
        id: 'fuman-radar',
        name: '不満レーダー',
        category: 'Market Research',
        monthly: 500,
        desc: '民衆の不満・愚痴を匿名収集してAIが分析・可視化。開発者・事業者がリアルな市場ニーズを低コストで把握できます。投稿者は無料、分析者は月額¥500。',
        keywords: ['不満', '愚痴', 'リサーチ', '市場調査', 'ニーズ', '分析', '可視化', 'データ', 'マーケティング', '消費者', '口コミ', 'フィードバック'],
    },
];

const SYSTEM_PROMPT = `あなたはHoshiAppの既製品アプリレコメンダーです。
ユーザーが欲しいアプリや解決したい課題を説明したら、以下の既製品アプリの中からぴったりなものを紹介してください。

## 既製品アプリ一覧
${PRODUCTS.map(p => `### ${p.name}（¥${p.monthly}/月）
- カテゴリ: ${p.category}
- 説明: ${p.desc}
- ID: ${p.id}
`).join('\n')}

## 応答ルール
- 2〜3文で簡潔に紹介する
- 合うアプリがあれば「おすすめは〇〇です！」と具体名を出す
- 完全に合うものがない場合は「現在ぴったりなアプリはありませんが、カスタム開発で対応できます」と伝える
- 最後に必ずJSON形式で推薦IDを返す: {"recommended": ["id1"]} または {"recommended": []}
- 日本語で回答する`;

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json({ error: 'query is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: `ユーザーの要望: ${query.trim()}` },
        ]);
        const text = result.response.text();

        // Extract recommended IDs from JSON in response
        let recommended: string[] = [];
        const jsonMatch = text.match(/\{"recommended":\s*\[([^\]]*)\]\}/);
        if (jsonMatch) {
            const ids = jsonMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
            recommended = ids.filter(id => PRODUCTS.some(p => p.id === id));
        }

        // Remove the JSON from the display text
        const displayText = text.replace(/\{"recommended":\s*\[[^\]]*\]\}/, '').trim();

        return NextResponse.json({ reply: displayText, recommended });
    } catch (error: any) {
        console.error('Recommend error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
