import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたはHoshiAppのAI開発コンサルタントです。
クライアントがどんなウェブアプリを作りたいのかを、会話を通じて詳細にヒアリングします。

## ヒアリングの流れ

以下の項目を1〜2個ずつ、自然な会話のテンポで順番に聞いてください。
一度に全部聞かず、回答に応じて深掘りしてください。

1. **アプリの概要**: 何を作りたいか、どんな課題を解決したいか
2. **ターゲットユーザー**: 誰が使うか（個人/法人/年齢層/職種など）
3. **主要機能**: 必ず必要な機能を3〜7個（優先度も聞く）
4. **画面構成**: どんな画面が必要か（一覧/詳細/入力フォーム/ダッシュボードなど）
5. **データ**: 何を保存・管理するか（ユーザー情報/商品/予約など）
6. **外部連携**: 決済/メール/SNS/地図など必要か
7. **デザイン**: 参考サイト・雰囲気（シンプル/モダン/にぎやか/ビジネス風）
8. **技術的な希望**: スマホ対応必須か、ログイン機能は必要か
9. **予算感**: 小規模（¥3,980〜9,800）/ 中規模（¥9,800〜29,800）/ 大規模（¥29,800〜79,800）
10. **納期**: いつまでに欲しいか

全項目が出揃ったら「これで必要な情報が揃いました。仕様書を作成します！」と伝えて、
"SPEC_READY" とだけ返してください（他のテキストは不要）。`;

const DOC_GENERATION_PROMPT = (chatHistory: string) => `
以下はクライアントとのヒアリング会話です。この内容をもとに、以下の2つを生成してください。

## ヒアリング内容
${chatHistory}

---

## 出力1: spec JSON

\`\`\`json
{
  "spec": {
    "title": "アプリ名（仮）",
    "overview": "アプリの概要（2〜3文）",
    "target": "ターゲットユーザー",
    "features": [
      { "name": "機能名", "description": "詳細", "priority": "必須/あれば良い" }
    ],
    "screens": ["画面1", "画面2"],
    "data": ["管理するデータ1", "管理するデータ2"],
    "integrations": ["外部連携1"],
    "design": "デザイン方針",
    "auth": true,
    "responsive": true,
    "budget": "予算帯",
    "deadline": "希望納期",
    "estimate": "見積もり金額（概算）",
    "timeline": "開発期間（概算）"
  }
}
\`\`\`

## 出力2: Claude Code用TASK.md

---CLAUDE_CODE_DOC_START---
# [アプリ名] 開発仕様書

> ⚠️ このドキュメントはクライアントヒアリングをもとにAIが生成しました。
> 開発開始前に内容を確認・調整してください。

## プロジェクト概要
[概要を記載]

## ターゲットユーザー
[ターゲットを記載]

## 技術スタック（推奨）
- フロントエンド: Next.js 16 App Router + Tailwind CSS
- バックエンド: Firebase Firestore + Firebase Auth
- AI機能: Gemini API / Claude API（必要な場合）
- 決済: Stripe（必要な場合）
- デプロイ: Vercel

## 機能一覧

### 必須機能
[機能名、詳細、実装方針を箇条書き]

### あれば良い機能
[オプション機能]

## 画面一覧
| 画面名 | パス | 概要 |
|--------|------|------|
| [画面名] | /[path] | [概要] |

## データ構造（Firestore）
\`\`\`
コレクション名: [name]
  - field1: type // 説明
  - field2: type // 説明
\`\`\`

## 外部連携
[必要な外部サービスと用途]

## 開発タスク

### Phase 1: 基盤構築
- [ ] プロジェクト初期化（Next.js + Tailwind）
- [ ] Firebase設定（Firestore + Auth）
- [ ] 環境変数設定

### Phase 2: コア機能
[主要機能のタスクをチェックリスト形式で詳細に]

### Phase 3: UI/UX
- [ ] 全画面のUI実装
- [ ] レスポンシブ対応
- [ ] ローディング・エラー状態

### Phase 4: 外部連携
[決済・メールなど必要な連携タスク]

### Phase 5: テスト・デプロイ
- [ ] 動作テスト
- [ ] Vercelデプロイ
- [ ] 本番環境変数設定

## 見積もり・スケジュール
- **予算**: [金額]
- **開発期間**: [期間]
- **希望納期**: [日付]

## クライアントへの確認事項
[不明点や要確認事項があればここに記載]
---CLAUDE_CODE_DOC_END---

最後に必ず「【仕様書完成】」というテキストを含めてください。
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, sessionId } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'messages is required' }, { status: 400 });
        }

        // ログイン必須チェック
        const uid = await getUidFromRequest(req);
        if (!uid) {
            return NextResponse.json({ error: 'ログインが必要です', requireLogin: true }, { status: 401 });
        }

        // 新規セッション開始（最初のメッセージ）時のみクレジット確認
        const isNewSession = !sessionId;
        if (isNewSession) {
            // 受付上限チェック（未完了プロジェクトが10件以上なら受付停止）
            const ORDER_LIMIT = 10;
            const activeProjectsSnap = await adminDb.collection('projects')
                .where('status', 'in', ['pending', 'paid'])
                .count()
                .get();
            const activeCount = activeProjectsSnap.data().count;
            if (activeCount >= ORDER_LIMIT) {
                return NextResponse.json({
                    error: `現在、受付件数が上限（${ORDER_LIMIT}件）に達しているため、新規のヒアリングを受け付けていません。しばらくお待ちの上、再度お試しください。`,
                    ordersFull: true,
                }, { status: 503 });
            }

            // 既存の無料利用履歴確認
            const usageRef = adminDb.collection('usage').doc(uid);
            const usageDoc = await usageRef.get();
            const usedFreeTrial = usageDoc.data()?.orderChatUsed === true;

            if (usedFreeTrial) {
                // 残クレジット確認
                const creditsSnap = await adminDb.collection('order_credits')
                    .where('uid', '==', uid)
                    .where('remaining', '>', 0)
                    .limit(1)
                    .get();

                if (creditsSnap.empty) {
                    return NextResponse.json({
                        error: 'ヒアリング回数の上限に達しました。プランを購入してください。',
                        requireCredits: true,
                    }, { status: 403 });
                }
            }
        }

        const currentSessionId = sessionId || adminDb.collection('chat_sessions').doc().id;

        // Anthropic形式のメッセージ変換
        const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content,
        }));

        let reply: string;
        let specGenerated = false;
        let claudeCodeDoc = '';

        // Sonnetでヒアリング会話
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: anthropicMessages,
        });

        reply = response.content[0].type === 'text' ? response.content[0].text : '';

        // SPEC_READYが返ってきたらOpusでドキュメント生成
        if (reply.trim() === 'SPEC_READY') {
            specGenerated = true;

            // 会話履歴を整形
            const chatHistory = messages
                .map((m: { role: string; content: string }) =>
                    `${m.role === 'user' ? 'クライアント' : 'AI'}: ${m.content}`
                )
                .join('\n\n');

            const docResponse = await anthropic.messages.create({
                model: 'claude-opus-4-6',
                max_tokens: 4096,
                messages: [{ role: 'user', content: DOC_GENERATION_PROMPT(chatHistory) }],
            });

            reply = docResponse.content[0].type === 'text' ? docResponse.content[0].text : '';

            // CLAUDE_CODE_DOC抽出
            const docMatch = reply.match(/---CLAUDE_CODE_DOC_START---([\s\S]*?)---CLAUDE_CODE_DOC_END---/);
            if (docMatch) {
                claudeCodeDoc = docMatch[1].trim();
            }
        }

        // Firestore保存
        const sessionRef = adminDb.collection('chat_sessions').doc(currentSessionId);
        await sessionRef.set(
            {
                uid,
                messages: [...messages, { role: 'assistant', content: reply }],
                updatedAt: new Date(),
                specGenerated,
                ...(claudeCodeDoc && { claudeCodeDoc }),
            },
            { merge: true }
        );

        const sessionDoc = await sessionRef.get();
        if (!sessionDoc.data()?.createdAt) {
            await sessionRef.set({ createdAt: new Date() }, { merge: true });
        }

        // 新規セッション開始時：無料試用フラグを記録
        if (isNewSession) {
            await adminDb.collection('usage').doc(uid).set(
                { orderChatUsed: true },
                { merge: true }
            );
        }

        return NextResponse.json(
            { reply, sessionId: currentSessionId, specGenerated, claudeCodeDoc },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in order chat:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
