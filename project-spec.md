# AIウェブアプリ販売プラットフォーム — プロジェクト仕様書

> Version 1.0 | 2026年3月

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [料金設定](#2-料金設定)
3. [システムアーキテクチャ](#3-システムアーキテクチャ)
4. [Notion風サイト仕様](#4-notion風サイト仕様)
5. [AI開発パイプライン](#5-ai開発パイプライン)
6. [既製品アプリ仕様](#6-既製品アプリ仕様)
7. [開発ロードマップ](#7-開発ロードマップ)
8. [セキュリティ・運用方針](#8-セキュリティ運用方針)
9. [環境変数チェックリスト](#9-環境変数チェックリスト)
10. [付録：競合比較](#10-付録競合比較)

---

## 1. プロジェクト概要

### 1.1 サービスコンセプト

**「AIで爆速・激安ウェブアプリ開発」** をコンセプトとしたマーケットプレイス型プラットフォーム。
競合（クラウドワークス等）の **1/10〜1/20の価格** で、AIエージェントを活用した高速開発を実現する。

| 項目 | 内容 |
|------|------|
| サービス種別 | AIウェブアプリ受注開発・販売プラットフォーム |
| ターゲット | 個人・フリーランス |
| ビジネスモデル | マーケットプレイス型（既製品販売 ＋ カスタム受注開発） |
| 主要技術 | Next.js / Vercel / Firebase / Gemini API / Claude API |

### 1.2 ビジネスモデル

| モデル | 内容 | 収益タイミング |
|--------|------|--------------|
| 既製品販売（買い切り） | 完成済みアプリを単発購入 | 即時 |
| 既製品販売（月額） | ホスティング込みの継続利用 | 毎月 |
| カスタム受注開発 | Geminiで要件整理 → Claude Codeで開発 | 前払い |
| 保守・サポート（月額） | 修正・アップデート対応 | 毎月 |

### 1.3 差別化ポイント

- **価格**：競合比1/10〜1/20（AIによる開発コスト削減）
- **スピード**：Gemini + Claude Codeによる並列開発で最短数日納品
- **透明性**：開発前にAIトークン量から見積もりを自動提示
- **品質**：オーナーによる最終チェックを経てから納品

---

## 2. 料金設定

### 2.1 既製品アプリ

| アプリ名 | ジャンル | 月額 | 買い切り |
|---------|---------|------|---------|
| SNS投稿AI量産ツール | マーケティング | ¥580/月 | ¥5,800 |
| フリーランス収支ダッシュボード | データ分析 | ¥680/月 | ¥6,800 |
| AIライフログ＆振り返りツール | ライフハック | ¥480/月 | ¥4,800 |

> 月額の買い切り換算倍率は10倍（業界標準）。14ヶ月以上使うなら買い切りがお得な設計。

### 2.2 カスタム受注開発

| 規模 | 内容 | 価格 |
|------|------|------|
| 小規模 | LP・シンプルツール（〜3画面） | ¥3,980〜¥9,800 |
| 中規模 | 管理画面・API連携（〜10画面） | ¥9,800〜¥29,800 |
| 大規模 | 複数機能・DB設計・認証込み | ¥29,800〜¥79,800 |

### 2.3 プラン・無料枠

| プラン | 使用AI | できること | 料金 |
|--------|--------|-----------|------|
| FREE | Gemini Flash 2.0 | 要件ヒアリング＋見積もりのみ（月3回） | ¥0 |
| STANDARD | Claude Sonnet | 既製品利用・カスタム開発発注 | 従量 |
| PRO（保守付き） | Claude Sonnet | 修正2回込み・優先対応 | +¥1,000〜/月 |

> 無料枠はGemini Flash（$0.075/MTok）を使用しコスト最小化。有料枠はClaude Sonnet APIを使用。

---

## 3. システムアーキテクチャ

### 3.1 全体フロー

```
ユーザー
  │
  ▼
Notion風サイト（Next.js + Vercel）
  │
  ▼
Geminiヒアリングチャット（要件整理）
  │
  ▼
仕様書自動生成（Markdown形式）→ Firestoreに保存
  │
  ▼
Claude Code API（並列開発）
  ├─ Agent A：フロントエンド（UI/コンポーネント）
  ├─ Agent B：バックエンド（API Routes）
  └─ Agent C：DB設計・Firebase Rules
  │
  ▼
オーナー最終チェック（マージ・動作確認）
  │
  ▼
ユーザーに納品 → フィードバック収集
```

### 3.2 技術スタック

| レイヤー | 技術 | 用途 | コスト |
|---------|------|------|--------|
| フロントエンド | Next.js 15 + Tailwind CSS | Notion風サイト全体 | 無料 |
| ホスティング | Vercel | デプロイ・CDN | 無料枠 |
| 認証 | Firebase Auth | Googleログイン・メール認証 | 無料枠 |
| DB（メイン） | Firebase Firestore | ユーザー・注文・商品データ | 無料枠 |
| DB（管理用） | Google Sheets API | 簡易管理・ログ・設定 | 無料 |
| ストレージ | Cloudflare R2 | 納品ファイル・アセット | 10GB無料 |
| 決済 | Stripe | 月額サブスク・買い切り・請求書 | 手数料3.6% |
| AI（無料枠） | Gemini Flash 2.0 | 要件ヒアリング・見積もり | $0.075/MTok |
| AI（有料枠） | Claude Sonnet API | 仕様書生成・コード開発 | $3/MTok |
| 開発エージェント | Claude Code API | 並列コード生成 | 従量課金 |

> **Supabaseは無料枠を使い切っているため不使用。** FirebaseとGoogle Sheetsで代替。

### 3.3 Firestoreコレクション設計

```
users/
  {uid}/
    email, plan, createdAt, stripeCustomerId

products/
  {productId}/
    name, genre, description, type(stock|custom),
    price(buyout), monthlyPrice, status(active|draft)

orders/
  {orderId}/
    userId, productId, type(subscription|buyout|custom),
    amount, status(pending|paid|delivered), createdAt

subscriptions/
  {subId}/
    userId, productId, stripeSubId,
    status(active|canceled), nextBilling

projects/
  {projectId}/
    orderId, specMarkdown, status(queued|building|review|done),
    deliverableUrl, feedback

chats/
  {chatId}/
    userId, projectId,
    messages: [{ role, content, timestamp }]
```

---

## 4. Notion風サイト仕様

### 4.1 ページ構成

| パス | ページ名 | 主な機能 |
|------|---------|---------|
| `/` | トップ（LP） | サービス説明・料金・CTA |
| `/products` | 商品一覧 | 既製品カタログ・フィルター・購入 |
| `/products/[id]` | 商品詳細 | デモ・仕様・購入ボタン |
| `/order` | カスタム発注 | Geminiチャット・要件入力 |
| `/dashboard` | マイページ | 購入済みアプリ・進捗・納品物 |
| `/feedback/[id]` | フィードバック | 完成品レビュー・評価入力 |
| `/admin` | 管理画面 | 注文管理・ステータス更新・納品 |

### 4.2 デザイン方針（Notion風）

- 白背景・黒文字・シンプルなタイポグラフィ（日本語対応）
- ブロックUIでコンテンツを構成（セクション単位のホバー強調）
- カラーアクセント：ライムグリーン `#d4ff47` をCTAに使用
- アニメーション：フェードイン・スライドのみ（過剰演出なし）
- レスポンシブ：モバイルファースト設計

### 4.3 主要コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `<GeminiChat />` | Gemini APIと接続したリアルタイムチャットUI |
| `<ProductCard />` | 商品カード（価格・プラン切替・購入ボタン付き） |
| `<PricingToggle />` | 月額/買い切りのスイッチUI |
| `<ProgressTracker />` | 開発進捗のステップ表示 |
| `<DeliverableViewer />` | 納品物プレビュー・ダウンロードリンク |
| `<FeedbackForm />` | 星評価＋テキストフィードバック入力 |

---

## 5. AI開発パイプライン

### 5.1 Geminiヒアリングフロー

ユーザーが話し言葉で入力 → Gemini Flashが以下を段階的に確認：

| ステップ | 確認内容 |
|---------|---------|
| ①機能整理 | 何ができるアプリか・主要機能3〜5個 |
| ②画面設計 | 必要な画面数・各画面の概要 |
| ③技術要件 | ログイン要否・DB要否・外部API連携 |
| ④デザイン | 参考サイト・カラー希望・雰囲気 |
| ⑤納期・予算 | 希望納期・予算上限 |

確認完了後、**Markdown形式の仕様書を自動生成**してFirestoreに保存。オーナーに通知。

#### Geminiシステムプロンプト（骨格）

```
あなたはウェブアプリ開発の要件定義アシスタントです。
ユーザーから作りたいアプリの要件をヒアリングし、
最終的に以下のMarkdown形式の仕様書を生成してください。

## ヒアリングのルール
- 一度に聞く質問は1つだけ
- 技術用語を使わず、平易な言葉で確認する
- 不明点は具体例を出して確認する
- 全項目が埋まったら「仕様書を作成します」と伝えて生成する

## 出力する仕様書の形式
# アプリ名
## 概要
## 主要機能リスト
## 画面一覧
## 技術要件
## デザイン要件
## 納期・予算
```

### 5.2 Claude Code並列開発

```
仕様書（Markdown）
  │
  ▼ タスク分割
  ├─ Agent A：フロントエンド
  │    - pages/ コンポーネント実装
  │    - Tailwind CSSスタイリング
  │    - API呼び出し処理
  │
  ├─ Agent B：バックエンド
  │    - app/api/ Route Handlers
  │    - 外部API連携
  │    - バリデーション・エラーハンドリング
  │
  └─ Agent C：インフラ・DB
       - Firestore Security Rules
       - TypeScript型定義
       - 環境変数・設定ファイル
  │
  ▼
オーナーがマージ・動作確認 → 納品
```

使用モデル：`claude-sonnet-4-20250514`（全エージェント共通）

### 5.3 コスト見積もり自動計算

| 項目 | 計算式 | 目安 |
|------|--------|------|
| Geminiヒアリング | 入力トークン × $0.075/MTok | ほぼ無視できる |
| 仕様書生成 | 出力トークン × $0.30/MTok | 数円〜数十円 |
| Claude Code開発 | 推定トークン × $3/MTok（入力）/ $15/MTok（出力） | 数百〜数千円 |
| Vercelデプロイ | 無料枠内なら$0 | 月100GB帯域まで無料 |

> 仕様書の機能数・複雑度から開発コストを事前試算してユーザーに提示する。

---

## 6. 既製品アプリ仕様

### 6.1 App1：SNS投稿AI量産ツール ★最優先

| 項目 | 内容 |
|------|------|
| 概要 | テーマ入力 → X/Instagram/LinkedIn向け投稿文を一括生成 |
| ターゲット | フリーランス・副業マーケター・個人事業主 |
| 主要機能 | ①テーマ・トーン入力 ②プラットフォーム選択 ③AI一括生成 ④コピー・履歴保存 |
| AI（無料枠） | Gemini Flash 2.0 |
| AI（有料枠） | Claude Sonnet |
| DB | Firebase Firestore（生成履歴）+ Google Sheets（使用量ログ） |
| 価格 | 月額¥580 / 買い切り¥5,800 |
| 文字数制限 | X: 140字 / Instagram: 2200字 / LinkedIn: 3000字 |

#### 画面一覧

```
/app/sns-post/
  ├─ /          ← メイン生成画面
  ├─ /history   ← 生成履歴
  └─ /settings  ← トーン・テンプレート設定
```

#### APIエンドポイント

```
POST /api/generate-posts
  body: { topic, tone, platforms[], count }
  res:  { posts: [{ platform, content, charCount }] }

GET  /api/posts/history
  res: { posts: [...] }

POST /api/posts/save
  body: { postId, content }
```

---

### 6.2 App2：フリーランス収支＆売上予測ダッシュボード

| 項目 | 内容 |
|------|------|
| 概要 | 売上・経費入力 → グラフ化 + AI来月予測＆節税アドバイス |
| ターゲット | 確定申告・資金繰りに悩むフリーランス全般 |
| 主要機能 | ①収支入力 ②月次グラフ ③AI予測 ④CSV書き出し（確定申告用） |
| AI | Gemini Pro（分析・アドバイス生成） |
| DB | Firebase Firestore |
| 価格 | 月額¥680 / 買い切り¥6,800 |

---

### 6.3 App3：AIライフログ＆振り返りツール

| 項目 | 内容 |
|------|------|
| 概要 | 毎日の作業・気分・目標をAIが分析して週次レポート生成 |
| ターゲット | 自己管理・生産性向上を目指す個人・フリーランス |
| 主要機能 | ①日次ログ入力 ②感情・作業タグ ③AI週次レポート ④目標達成率グラフ |
| AI | Gemini Flash（ログ分析） |
| DB | Google Sheets（ログ蓄積）+ Firebase Auth（認証のみ） |
| 価格 | 月額¥480 / 買い切り¥4,800 |

---

## 7. 開発ロードマップ

| フェーズ | 期間 | マイルストーン |
|---------|------|--------------|
| Phase 0：設計 | 〜Week 1 | 仕様確定・Firebase設定・Stripe設定 |
| Phase 1：サイト構築 | Week 1〜2 | Notion風Next.jsサイト（LP・商品一覧・認証） |
| Phase 2：App1開発 | Week 2〜3 | SNS投稿生成ツール完成・Vercelデプロイ |
| Phase 3：決済組込 | Week 3 | Stripe月額・買い切り実装・ダッシュボード |
| Phase 4：App2・3開発 | Week 3〜5 | 収支ダッシュボード・ライフログツール完成 |
| Phase 5：Geminiフロー | Week 5〜6 | ヒアリングチャット → 仕様書自動生成実装 |
| Phase 6：カスタム受注 | Month 2〜 | Claude Code並列開発パイプライン稼働 |

### 直近のNext Actions

1. FirebaseプロジェクトとStripeアカウントの作成
2. VercelにNext.jsプロジェクトをデプロイ（空でもOK）
3. Notion風LPのデザイン・コーディング
4. App1（SNS投稿ツール）のUI実装
5. Firebase Auth + Firestoreとの接続
6. Stripe決済フローの実装

---

## 8. セキュリティ・運用方針

### 8.1 セキュリティ

- APIキーはすべてVercel環境変数で管理（クライアントに露出しない）
- Firebase Security Rulesでユーザー単位のデータアクセス制御
- Stripe Webhookの署名検証を必ず実装
- Claude/Gemini APIのレート制限設定でコスト暴走を防止
- ユーザー入力はサーバーサイドでバリデーション

### 8.2 コスト管理

- Claude Code API：プロジェクト単位で `max_tokens` を設定（超過防止）
- Gemini API：無料枠ユーザーは月間リクエスト数を制限
- Firebase：Firestoreの読取回数をモニタリング
- 月次でGCP / Firebase / Anthropic / Vercelのコストをレビュー

### 8.3 カスタマーサポート

| 問い合わせ種別 | 対応方法 | 目標応答時間 |
|-------------|---------|------------|
| 技術的不具合 | メール・フォーム | 24時間以内 |
| 修正依頼（有料） | 専用フォームから受付 | 48時間以内 |
| 返金依頼 | Stripe管理画面から対応 | 72時間以内 |
| カスタム開発相談 | Geminiチャット → 見積もり提示 | 自動（即時） |

---

## 9. 環境変数チェックリスト

Vercelの環境変数に以下を設定する。

| 変数名 | 取得元 | 用途 |
|--------|--------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console | Firebase初期化 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console | Firebase初期化 |
| `FIREBASE_ADMIN_SDK_KEY` | Firebase Console（サービスアカウント） | サーバーサイド認証 |
| `GEMINI_API_KEY` | Google AI Studio | ヒアリング・仕様書生成 |
| `ANTHROPIC_API_KEY` | Anthropic Console | Claude Code開発 |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | 決済処理 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard | Webhook署名検証 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | フロント決済UI |
| `GOOGLE_SHEETS_SERVICE_ACCOUNT` | Google Cloud Console | Sheets API |
| `CLOUDFLARE_R2_ACCESS_KEY` | Cloudflare Dashboard | ファイルストレージ |

---

## 10. 付録：競合比較

| サービス | 価格帯 | スピード | カスタマイズ | AI活用 |
|---------|--------|---------|------------|--------|
| クラウドワークス | ¥50,000〜 | 2週間〜数ヶ月 | 高 | なし |
| Bubble（NoCode） | ¥30,000〜+月額 | 1週間〜 | 中 | 一部 |
| 海外AIエージェント | $200〜$2,000 | 数日〜1週間 | 低 | あり |
| **本サービス（目標）** | **¥3,980〜** | **最短2〜3日** | **高** | **フル活用** |

> 本サービスは価格・スピード・AI活用度のすべてで競合を上回ることを目標とする。
