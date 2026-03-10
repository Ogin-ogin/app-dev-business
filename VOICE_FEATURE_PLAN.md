# AI愚痴通話 — 音声通話機能の実装プラン

## Context

不満レーダーに「AIに愚痴を聞いてもらう」音声通話機能を追加する。
Gemini 2.5 Flash Native Audio（Live API）を使い、ブラウザから直接リアルタイム音声対話を行う。
通話後、会話内容を匿名の不満投稿として保存するオプションも提供する。
併せて、入力・会話データを個人を特定できない形で利用する旨をユーザーに明示する。

---

## アーキテクチャ

```
ブラウザ (マイク) ──WebSocket──> Gemini Live API (native audio)
ブラウザ (スピーカー) <──WebSocket── Gemini Live API
```

- **クライアントサイド直接接続**: Vercelサーバーレスでは永続WebSocket不可のため、ブラウザからGemini Live APIへ直接接続
- **SDK**: `@google/genai`（新SDK）を追加。既存の`@google/generative-ai`と共存可能
- **API Key**: `NEXT_PUBLIC_GEMINI_API_KEY` でクライアントに公開（Google Cloud ConsoleでHTTPリファラー制限を設定）
- **モデル**: `gemini-2.5-flash-native-audio-preview-12-2025`

---

## 新規ファイル（3つ）

### 1. `src/hooks/useGeminiLive.ts` — Gemini Live APIフック

**状態管理:**
- `status`: `'idle' | 'connecting' | 'active' | 'ending' | 'ended' | 'error'`
- `transcript`: `{ role: 'user' | 'ai'; text: string }[]`
- `error`, `isMuted`, `duration`（秒）

**主要関数:**

`startCall()`:
1. `getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } })`
2. AudioWorklet（Blob URL）でマイク音声をPCM 16bit化 → base64 → `session.sendRealtimeInput()`
3. Gemini Live API接続:
```ts
import { GoogleGenAI, Modality } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
const session = await ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  config: {
    responseModalities: [Modality.AUDIO],
    systemInstruction: SYSTEM_PROMPT,  // 愚痴の聞き方.mdベース
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } },
  },
  callbacks: { onopen, onmessage, onerror, onclose },
});
```

`onmessage`: AI音声を24kHz PCMとしてデコード → AudioBufferSourceNodeで順次再生。テキスト部分はtranscriptに蓄積

`endCall()`: session.close()、MediaStream停止、AudioContext閉じる

`toggleMute()`: MediaStreamのaudioトラックを有効/無効切替

**システムプロンプト**（`愚痴の聞き方.md`ベース）:
```
あなたは共感的な愚痴聞き相手です。カール・ロジャーズの来談者中心療法に基づき、
無条件の肯定的配慮で相手の話を聞きます。

【3段階の対話フロー】
1. 愚痴聞き段階：状況を理解し、相槌を打ちながら傾聴する
2. 感情緩和段階：相手の感情を言語化し、気持ちを楽にする
3. 終了段階：自然に会話を締めくくる

【禁止事項】アドバイスしない／自分の話をしない／価値判断しない

【話し方】タメ口でカジュアル／短い応答(1-2文)／相槌多用(うんうん、そうなんだ、わかるわかる)
感情をひらがなで強調(つらかったね、くやしいよね)／沈黙を尊重／日本語で会話
```

**音声処理の詳細:**
- マイク: AudioWorkletでFloat32→Int16 PCM→base64、16kHz送信
- 再生: base64→Int16→Float32→AudioBuffer(24kHz)→AudioBufferSourceNode、キュー方式で順次再生
- AudioWorkletはBlobURL方式（public/静的ファイル不要）
- エコーキャンセル: ブラウザ組み込み`echoCancellation`を使用

**トランスクリプト取得:**
- AI側: `responseModalities`に`Modality.TEXT`も追加して、テキストも受信
- ユーザー側: Web Speech API (`SpeechRecognition`)を並行実行。非対応ブラウザではAI側のみ記録

### 2. `src/components/fuman-radar/VoiceCall.tsx` — 通話UIコンポーネント

**UI状態遷移:**

| 状態 | 表示内容 |
|------|---------|
| **idle** | 大きな通話ボタン（Phone icon）、「AIに愚痴を聞いてもらう」タイトル、機能説明 |
| **connecting** | パルスアニメーション、「接続中...」 |
| **active** | 通話時間(MM:SS)、パルスアニメーション、ミュートボタン(Mic/MicOff)、終了ボタン(赤) |
| **ended** | 「通話終了」＋時間、トランスクリプト表示、「不満として投稿する」ボタン、「新しい通話」ボタン |
| **error** | エラーメッセージ、リトライボタン |

**プライバシー同意ダイアログ**（初回通話前に表示）:
- タイトル: 「音声通話について」
- 内容: 会話はGemini AIがリアルタイム処理／音声データはサーバーに保存されない／会話内容は個人を特定できない形で不満データの傾向分析に活用される場合がある／同意した場合のみ通話開始
- チェックボックス + 「同意して始める」ボタン
- 同意は`localStorage`キー`fuman-radar-voice-consent`に保存

**通話後の投稿フロー:**
- 「不満として投稿する」クリック → ユーザーの発言部分を要約したテキストを編集可能テキストエリアに表示
- `POST /api/fuman-radar/posts` に `{ text, source: 'voice' }` で送信

**デザイン**: 既存ダークモード・Notion風UI、`var(--color-accent)` = #d4ff47

### 3. `src/app/app/fuman-radar/voice/page.tsx` — 通話ページ

シンプルなラッパーページ。VoiceCallコンポーネントを表示。

---

## 既存ファイルの変更（4つ）

### 1. `src/app/app/fuman-radar/layout.tsx`

`freeNavItems`に追加（「個人レポート」の後）:
```ts
{ name: "AI愚痴通話", href: "/app/fuman-radar/voice", icon: Phone }
```
`lucide-react`から`Phone`をインポート追加。

### 2. `src/types/firestore.ts`

`FumanPost.source`型を更新:
```ts
source: 'user' | 'seed' | 'import' | 'voice';
```

### 3. `src/app/api/fuman-radar/posts/route.ts`

POSTハンドラで`source: 'voice'`を受け付ける:
```ts
source: (body.source === 'voice' ? 'voice' : 'user'),
```

### 4. `src/app/app/fuman-radar/settings/page.tsx`

「データについて」セクションに「音声通話データ」項目を追加:
- 音声データはGemini AIによりリアルタイムで処理され、サーバーには保存されません
- 会話内容は個人を特定できない形で、不満データの傾向分析に活用される場合があります
- テキストとして保存されるのはユーザーが明示的に「投稿する」を選択した場合のみです

---

## 依存パッケージ追加

```
npm install @google/genai
```

既存`@google/generative-ai`と別パッケージ。共存可能。

---

## 実装順序

| Step | 内容 | ファイル |
|------|------|---------|
| 1 | `npm install @google/genai` | package.json |
| 2 | `useGeminiLive`フック実装 | src/hooks/useGeminiLive.ts |
| 3 | `VoiceCall`コンポーネント実装 | src/components/fuman-radar/VoiceCall.tsx |
| 4 | 通話ページ作成 | src/app/app/fuman-radar/voice/page.tsx |
| 5 | レイアウトにナビ追加 | src/app/app/fuman-radar/layout.tsx |
| 6 | 型定義・API更新 | src/types/firestore.ts, posts/route.ts |
| 7 | 設定ページにプライバシー項目追加 | settings/page.tsx |
| 8 | ビルド確認 | `npm run build` |

---

## 注意点

- **ブラウザ互換性**: AudioWorkletは全モダンブラウザ対応。非対応時はエラーメッセージ表示
- **iOS Safari**: AudioContext開始にユーザージェスチャー必須 → 通話ボタンクリック内で`audioContext.resume()`
- **通話時間制限**: 初期実装では10分制限（8分で警告）を設けてAPIコスト管理
- **API Key**: `NEXT_PUBLIC_GEMINI_API_KEY`をVercel環境変数に追加必要（Google CloudでHTTPリファラー制限設定推奨）

---

## 検証方法

1. `npm run build` 成功
2. 通話ページアクセス → プライバシー同意ダイアログ表示
3. 同意後 → マイク許可 → AI接続 → 音声対話が成立
4. 通話終了 → トランスクリプト表示 → 「不満として投稿する」で投稿成功
5. 設定ページに音声通話データの説明が表示される
6. サイドバーに「AI愚痴通話」リンクが表示される

---

## 既存ファイル参照（実装時に読むべきファイル）

- `src/app/app/fuman-radar/chat/page.tsx` — チャットUI参考
- `src/components/fuman-radar/ChatInterface.tsx` — メッセージバブルのスタイル参考
- `src/app/api/fuman-radar/posts/route.ts` — POST API（source追加先）
- `src/contexts/AuthContext.tsx` — 認証パターン
- `愚痴の聞き方.md` — システムプロンプト元
- `ABOUT_GEMINI_2.5_FLASH_LIVE_PREVIEW.md` — Live APIモデル仕様
