# HoshiApp - プロジェクト全体タスク管理

## ビジネス概要

| 項目 | 内容 |
|------|------|
| サービス名 | HoshiApp (AI Webアプリ開発プラットフォーム) |
| コンセプト | AIで爆速・激安ウェブアプリ開発 |
| ターゲット | 個人・フリーランス・小規模事業者 |
| 技術スタック | Next.js 16, Tailwind 4, Firebase, Gemini AI, Stripe |

### 収益モデル

| モデル | 価格帯 | 状態 |
|--------|--------|------|
| 既製品アプリ（月額） | ¥480-680/月 | App1のみ実装済 |
| 既製品アプリ（買い切り） | ¥4,800-6,800 | UI作成済・決済未実装 |
| カスタム開発（小規模） | ¥3,980-9,800 | 未実装 |
| カスタム開発（中規模） | ¥9,800-29,800 | 未実装 |
| カスタム開発（大規模） | ¥29,800-79,800 | 未実装 |

---

## 進捗サマリー

| Phase | ステータス | 完了率 |
|-------|-----------|--------|
| Phase 0: 基盤構築 | ✅完了 | 100% |
| Phase 1: マーケティングサイト | ✅完了 | 100% |
| Phase 2: App1 (SNS投稿ツール) | ✅完了 | 100% |
| Phase 3: 認証・決済基盤 | ✅完了 | 100% |
| Phase 3.5: 動作確認・環境修正 | ✅完了 | 100% |
| Phase 4: App2 (収支ダッシュボード) | ✅完了 | 100% |
| Phase 5: App3 (ライフログ) | ✅完了 | 100% |
| Phase 4.5: App4 (不満レーダー) | 🔧進行中 | 85% |
| Phase 6: カスタム開発フロー | ✅完了 | 100% |
| Phase 7: 管理・運用機能 | ✅完了 | 100% |

**全体進捗**: 8/9フェーズ完了 🔧 (App4 不満レーダー 進行中)

---

## Phase 0: 基盤構築 ✅完了

| # | タスク | 状態 | 備考 |
|---|-------|------|------|
| 0-1 | Next.js 16 + App Router初期化 | ✅ | |
| 0-2 | Tailwind CSS 4設定 | ✅ | |
| 0-3 | Firebase Admin SDK設定 | ✅ | adminDb/adminAuth |
| 0-4 | Gemini API接続テスト | ✅ | |
| 0-5 | GitHubリポジトリ作成 | ✅ | |
| 0-6 | Vercel連携 | ✅ | |
| 0-7 | .env.example作成 | ✅ | |
| 0-8 | Notion風デザインシステム | ✅ | カラー: #d4ff47 |

---

## Phase 1: マーケティングサイト ✅完了

| # | タスク | 状態 | ファイル |
|---|-------|------|---------|
| 1-1 | Header/Footerコンポーネント | ✅ | src/components/ |
| 1-2 | ランディングページ (/) | ✅ | src/app/page.tsx |
| 1-3 | 商品一覧ページ (/products) | ✅ | src/app/products/page.tsx |
| 1-4 | 商品詳細ページ (/products/[id]) | ✅ | src/app/products/[id]/page.tsx |
| 1-5 | ログインページUI (/login) | ✅ | src/app/login/page.tsx |
| 1-6 | ダッシュボードUI (/dashboard) | ✅ | src/app/dashboard/page.tsx |
| 1-7 | 注文ページUI (/order) | ✅ | src/app/order/page.tsx |

---

## Phase 2: App1 - SNS投稿AIツール ✅完了

### 基本機能 (2026-03 完了)

| # | タスク | 状態 | ファイル |
|---|-------|------|---------|
| 2-1 | 投稿生成画面 | ✅ | /app/sns-post/page.tsx |
| 2-2 | Gemini API連携 | ✅ | /api/generate-posts/route.ts |
| 2-3 | X/LinkedIn/Instagram生成 | ✅ | |
| 2-4 | Firestore履歴保存 | ✅ | sns_posts コレクション |
| 2-5 | 履歴一覧画面 | ✅ | /app/sns-post/history/page.tsx |
| 2-6 | 設定画面 | ✅ | /app/sns-post/settings/page.tsx |
| 2-7 | サイドバーナビゲーション | ✅ | layout.tsx |

### 機能強化 (2026-03-08 完了)

| # | タスク | 状態 | ファイル |
|---|-------|------|---------|
| 2-8 | 履歴検索API | ✅ | /api/posts/search/route.ts |
| 2-9 | トピック検索・トーンフィルター | ✅ | history/page.tsx |
| 2-10 | お気に入り機能 | ✅ | /api/posts/[id]/favorite/route.ts |
| 2-11 | テンプレート保存/読込 | ✅ | /api/posts/[id]/template/route.ts |
| 2-12 | Favoritesページ | ✅ | /app/sns-post/favorites/page.tsx |
| 2-13 | Templatesページ | ✅ | /app/sns-post/templates/page.tsx |
| 2-14 | 投稿編集機能 | ✅ | /api/posts/[id]/edit/route.ts |
| 2-15 | AI再生成（改善/短縮） | ✅ | /api/posts/[id]/regenerate/route.ts |
| 2-16 | PostDetailModal統合 | ✅ | components/sns-post/PostDetailModal.tsx |
| 2-17 | FavoriteButton | ✅ | components/sns-post/FavoriteButton.tsx |
| 2-18 | TemplateSelector | ✅ | components/sns-post/TemplateSelector.tsx |
| 2-19 | PostEditor | ✅ | components/sns-post/PostEditor.tsx |
| 2-20 | RegenerateButton | ✅ | components/sns-post/RegenerateButton.tsx |

**価格設定**: 月額¥580 / 買い切り¥5,800

---

## Phase 3: 認証・決済基盤 ✅完了

### 3.1 Firebase Authentication

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 3-1 | Firebase Client SDK導入 | ✅ | `npm install firebase` |
| 3-2 | Firebase設定ファイル作成 | ✅ | src/lib/firebase.ts |
| 3-3 | Googleログイン実装 | ✅ | signInWithPopup(GoogleAuthProvider) |
| 3-4 | メール/パスワード認証 | ✅ | createUserWithEmailAndPassword |
| 3-5 | セッション管理 | ✅ | onAuthStateChanged |
| 3-6 | AuthContext作成 | ✅ | src/contexts/AuthContext.tsx |
| 3-7 | /login ページ接続 | ✅ | UIをAuth SDKに接続 |
| 3-8 | ログアウト機能 | ✅ | signOut() |
| 3-9 | 認証ミドルウェア更新 | ✅ | session cookie検証 |
| 3-10 | ユーザープロファイルFirestore保存 | ✅ | users/{uid} コレクション |

### 3.2 Stripe決済

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 3-11 | Stripe Checkout Session API | ✅ | /api/checkout/route.ts |
| 3-12 | 月額サブスク作成 | ✅ | mode: 'subscription' |
| 3-13 | 買い切り決済 | ✅ | mode: 'payment' |
| 3-14 | 商品詳細ページに決済ボタン | ✅ | /products/[id] 更新 |
| 3-15 | Webhook完全実装 | ✅ | checkout.session.completed |
| 3-16 | サブスク更新/キャンセル | ✅ | customer.subscription.* |
| 3-17 | Customer Portal連携 | ⏳ | 未実装 |
| 3-18 | ダッシュボードにサブスク表示 | ✅ | SubscriptionStatusコンポーネント |

### 3.3 ユーザー管理

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 3-19 | Firestoreスキーマ設計 | ✅ | users/orders/subscriptions |
| 3-20 | Security Rules設定 | ✅ | firestore.rules |
| 3-21 | プラン管理（FREE/STANDARD/PRO） | ✅ | useSubscription hook |
| 3-22 | 使用量制限（API呼び出し） | ⏳ | 未実装 |

---

## Phase 3.5: 動作確認・環境修正 🔧進行中

> Claude in Chrome を使って実際の動作確認を実施 (2026-03-09)

| # | タスク | 状態 | 備考 |
|---|-------|------|------|
| V-1 | Firebase Auth (Email/Password) コンソール有効化 | ✅ | Firebase Console で設定済 |
| V-2 | Firebase Auth (Google) コンソール有効化 | ✅ | Firebase Console で設定済 |
| V-3 | NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN 追加 | ✅ | .env.local に追加済 |
| V-4 | NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET 追加 | ✅ | .env.local に追加済 |
| V-5 | Firebase Admin SDK キー修正 | ✅ | GOOGLE_APPLICATION_CREDENTIALS に変更 |
| V-6 | ログインページ動作確認 | ✅ | UI・切り替え・認証エラー表示OK |
| V-7 | サインアップ → ダッシュボード遷移確認 | ✅ | test@example.com で動作確認 |
| V-8 | ダッシュボード表示確認 | ✅ | ユーザー名・プランFree表示OK |
| V-9 | SNS投稿アプリ画面確認 | ✅ | /app/sns-post 正常表示 |
| V-10 | AI投稿生成 (generate-posts API) 動作確認 | ✅ | curl + ブラウザ両方で動作確認 |
| V-11 | Firestoreへの保存確認 | ✅ | ドキュメントID取得・履歴2件表示確認 |
| V-12 | 履歴・お気に入り・テンプレート確認 | ✅ | 履歴一覧・☆お気に入り・モーダル確認 |
| V-13 | NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 追加 | ⏳ | Firebase Console から取得要 |
| V-14 | NEXT_PUBLIC_FIREBASE_APP_ID 追加 | ⏳ | Firebase Console から取得要 |
| V-15 | NEXT_PUBLIC_PRICE_APP1_MONTHLY 追加 | ⏳ | Stripe Dashboard から取得要 |
| V-16 | NEXT_PUBLIC_PRICE_APP1_ONETIME 追加 | ⏳ | Stripe Dashboard から取得要 |

---

## Phase 4: App2 - 収支ダッシュボード ⏳未着手

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 4-1 | /app/finance ページ作成 | ✅ | layout.tsx + page.tsx |
| 4-2 | 収支入力フォーム | ✅ | /app/finance/add/page.tsx |
| 4-3 | Firestore収支コレクション | ✅ | /api/finance/route.ts (GET/POST/DELETE) |
| 4-4 | 月次グラフ（Recharts） | ✅ | BarChart 収入/支出/純利益 |
| 4-5 | AI売上予測 | ✅ | /api/finance/report/route.ts |
| 4-6 | AI節税アドバイス | ✅ | Geminiで同時生成 |
| 4-7 | CSV書き出し | ✅ | BOM付きUTF-8、設定ページから |
| 4-8 | カテゴリ管理 | ✅ | プリセット + カスタム入力対応 |

**価格設定**: 月額¥680 / 買い切り¥6,800

---

## Phase 5: App3 - ライフログツール ⏳未着手

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 5-1 | /app/lifelog ページ作成 | ✅ | layout.tsx + page.tsx |
| 5-2 | 日次ログ入力フォーム | ✅ | /app/lifelog/add |
| 5-3 | 感情・作業タグ | ✅ | 気分スコア絵文字・複数タグ選択 |
| 5-4 | AI週次レポート生成 | ✅ | /api/lifelog/report + Gemini |
| 5-5 | 目標設定・達成率グラフ | ✅ | 目標達成チェック + サマリーカード |
| 5-6 | カレンダービュー | ✅ | /app/lifelog/calendar |
| 5-7 | 通知設定 | ⏳ | 未実装（将来対応） |

**価格設定**: 月額¥480 / 買い切り¥4,800

---

## Phase 4.5: App4 - 不満レーダー 🔧進行中

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 4.5-1 | 基盤・型定義・embeddings.ts | ✅ | src/lib/embeddings.ts, src/types/firestore.ts |
| 4.5-2 | 投稿API・AI共感・エンベディング | ✅ | /api/fuman-radar/posts/route.ts |
| 4.5-3 | 「わかる」共感機能 | ✅ | /api/fuman-radar/posts/[id]/empathy/route.ts |
| 4.5-4 | 探索・カテゴリ・トレンドAPI | ✅ | /api/fuman-radar/categories, trends |
| 4.5-5 | UMAP計算・キャッシュAPI | ✅ | /api/fuman-radar/umap/route.ts |
| 4.5-6 | AI対話分析API（RAG） | ✅ | /api/fuman-radar/chat/route.ts |
| 4.5-7 | 個人レポートAPI | ✅ | /api/fuman-radar/my-report/route.ts |
| 4.5-8 | インポートAPI | ✅ | /api/fuman-radar/import/route.ts |
| 4.5-9 | UIコンポーネント群 | 🔧 | src/components/fuman-radar/ (作成中) |
| 4.5-10 | アプリページ群 | 🔧 | src/app/app/fuman-radar/ (作成中) |
| 4.5-11 | 商品カタログ・ダッシュボード更新 | ✅ | products, dashboard, recommend API |
| 4.5-12 | Firestore rules・indexes更新 | ✅ | firestore.rules, firestore.indexes.json |
| 4.5-13 | シードデータ投入 | ⏳ | 500件 |
| 4.5-14 | Stripe Price ID設定（¥500/月） | ⏳ | NEXT_PUBLIC_PRICE_APP4_MONTHLY |
| 4.5-15 | テスト・Vercelデプロイ | ⏳ | |

**価格**: 投稿者 無料 / 分析者 月額¥500

---

## Phase 6: カスタム開発フロー ⏳未着手

### 6.1 Geminiヒアリングチャット

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 6-1 | /order ページAPI接続 | ✅ | Gemini Chat API統合 |
| 6-2 | システムプロンプト実装 | ✅ | 5段階ヒアリングフロー |
| 6-3 | 段階的質問フロー | ✅ | 目的→機能→ターゲット→デザイン→予算 |
| 6-4 | チャット履歴保存 | ✅ | chat_sessions コレクション |
| 6-5 | Markdown仕様書生成 | ✅ | 【仕様書完成】で自動生成 |
| 6-6 | Firestore保存 | ✅ | projects/{id} |
| 6-7 | 見積もり自動計算 | ✅ | Geminiが規模から自動算出 |

### 6.2 Claude Code連携（将来）

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 6-8 | Claude Code API設計 | ⏳ | |
| 6-9 | 並列エージェント（FE/BE/Infra） | ⏳ | |
| 6-10 | 自動コード生成 | ⏳ | |
| 6-11 | オーナーレビューフロー | ⏳ | |

---

## Phase 7: 管理・運用機能 ⏳未着手

### 7.1 管理画面 (/admin)

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 7-1 | 注文一覧画面 | ✅ | /admin/orders |
| 7-2 | ステータス更新 | ✅ | pending→paid→delivered インライン更新 |
| 7-3 | 納品物アップロード | ⏳ | 未実装（将来対応） |
| 7-4 | ユーザー管理画面 | ✅ | /admin/users |
| 7-5 | 売上レポート | ✅ | /admin/revenue |

### 7.2 フィードバックシステム

| # | タスク | 状態 | 詳細 |
|---|-------|------|------|
| 7-6 | /feedback/[id] ページ | ✅ | ホバーエフェクト付き星評価 |
| 7-7 | 星評価＋テキストレビュー | ✅ | 1〜5星 + テキスト入力 |
| 7-8 | Firestore保存 | ✅ | feedbacks コレクション |
| 7-9 | 商品ページに表示 | ⏳ | 未実装（将来対応） |

---

## 技術負債・改善項目

| # | 項目 | 優先度 | 状態 |
|---|------|--------|------|
| T-1 | Basic Auth → Firebase Auth移行 | 高 | ✅ 完了 |
| T-2 | Settings localStorage → Firestore | 中 | ⏳ |
| T-3 | Dashboard モックデータ → 実データ | 高 | 🔧 部分完了（plan表示のみ） |
| T-4 | Firestoreインデックス作成 | 中 | ✅ firestore.indexes.json作成済 |
| T-5 | エラーハンドリング強化 | 中 | ⏳ |
| T-6 | レスポンシブ対応確認 | 低 | ⏳ |
| T-7 | パフォーマンス最適化 | 低 | ⏳ |

---

## 環境変数チェックリスト

| 変数名 | 取得元 | 状態 | 備考 |
|--------|--------|------|------|
| GOOGLE_APPLICATION_CREDENTIALS | Firebase Console | ✅ | JSONファイルパス (新方式) |
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase Console | ✅ | |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase Console | ✅ | 追加済 |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase Console | ✅ | |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Firebase Console | ✅ | 追加済 |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Firebase Console | ⏳ | 要追加 |
| NEXT_PUBLIC_FIREBASE_APP_ID | Firebase Console | ⏳ | 要追加 |
| GEMINI_API_KEY | Google AI Studio | ✅ | |
| ANTHROPIC_API_KEY | Anthropic Console | ✅ | |
| STRIPE_SECRET_KEY | Stripe Dashboard | ✅ | |
| STRIPE_WEBHOOK_SECRET | Stripe Dashboard | ✅ | |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe Dashboard | ✅ | |
| NEXT_PUBLIC_PRICE_APP1_MONTHLY | Stripe Dashboard | ⏳ | 要追加 |
| NEXT_PUBLIC_PRICE_APP1_ONETIME | Stripe Dashboard | ⏳ | 要追加 |
| ADMIN_USER | 自分で設定 | ✅ | Basic Auth |
| ADMIN_PASSWORD | 自分で設定 | ✅ | Basic Auth |

---

## 次のアクション

### 🔴 今すぐ対応（動作確認完了に必要）

1. **サーバー再起動 → generate-posts API テスト**
   - 新しい Firebase Admin SDK キー (GOOGLE_APPLICATION_CREDENTIALS) で再テスト
   - Chromeでログイン後、SNS投稿生成を実行

2. **Firebase Console から不足の env vars 取得・追加**
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - プロジェクト設定 → 全般 → ウェブアプリ から取得

3. **Stripe Dashboard から Price ID 取得・追加**
   - `NEXT_PUBLIC_PRICE_APP1_MONTHLY` (月額¥580のPrice ID)
   - `NEXT_PUBLIC_PRICE_APP1_ONETIME` (買い切り¥5,800のPrice ID)

### 🟡 動作確認完了後

4. **Phase 4: App2 収支ダッシュボード 開発開始**

---

最終更新: 2026-03-09
