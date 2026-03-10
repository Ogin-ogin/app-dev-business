# プロジェクト進捗 (Progress)

## 現在のステータス
- **Phase 0 (準備・設計)**: 完了
  - Next.js (Version 15, App Router, Tailwind CSS 4) プロジェクトの初期化完了。
  - プロジェクトルートへの展開完了。
  - `.env.example` の作成完了（各種APIキー等入力用）。
  - Tailwindのグローバルカラー、フォント設定（Notion風デザイン）適用完了。

- **Phase 1 (サイト構築)**: 完了
  - `Header`, `Footer` 共通コンポーネント作成。
  - トップページ (LP) 実装完了。
  - 認証ページ (`/login`) プレースホルダー実装完了。
  - 商品一覧画面 (`/products`)、商品詳細画面 (`/products/[id]`) 実装完了。
  - ユーザーダッシュボード画面 (`/dashboard`) 実装完了。

- **Phase 2 (App1開発)**: フロントエンドUI完了
  - `SNS投稿AI量産ツール` のメイン画面 (`/app/sns-post`) 構築。
  - 履歴画面 (`/history`)、設定画面 (`/settings`) 構築。
  - サイドバーナビゲーション実装。

## 次のステップ (Next Actions)
- 次は「App2」などの追加機能や、決済機能（現在は審査中）を通じた本格運用のテストに進みます。
- Vercel上での動作確認をお願いします（環境変数の設定が必要）。

## App1ステータス (Gemini API 連携)
- **完了**: `/api/generate-posts` を作成し、Gemini 2.5 FlashでX/LinkedIn/Instagram向け投稿を生成。
- **完了**: 生成履歴を `firebase-admin` を使ってFirestore (`sns_posts`コレクション) に保存。
- **完了**: フロントエンド (`/app/sns-post`) からの本番API呼び出し処理を実装。

## App1 機能強化 (2026-03-08 完了)
- **Phase 1**: 履歴検索機能 - トピック検索とトーンフィルター実装
- **Phase 2**: お気に入り & テンプレート機能
  - お気に入り登録/管理機能
  - テンプレート保存/読み込み機能
  - Favorites/Templatesページ追加
  - ナビゲーションに新メニュー追加
- **Phase 3**: 再編集 & 再生成機能
  - 投稿内容の編集機能（文字数カウンター付き）
  - AI再生成機能（改善/短縮アクション）
  - 統合PostDetailModalコンポーネント

## セキュリティ・Stripe対応ステータス
- **Basic認証**: `middleware.ts`を作成・導入済（`/dashboard`、`/admin`保護用。本番の`.env`でID/PASS設定が必要）。
- **セキュリティヘッダー**: `next.config.ts`にて推奨ヘッダー（X-Content-Type-Options等）追加済。
- **Stripe設定**: `stripe` SDKインストールおよびWebhookエンドポイント用雛形 (`/api/webhooks/stripe`) 作成済。

## ユーザー依頼事項ステータス
- `FIREBASE_ADMIN_SDK_KEY` を `.env.local` に自動入力しました。
- 次のAPIキー取得方法をご案内中で、設定をお待ちしています。
  - Firebase: `NEXT_PUBLIC_FIREBASE_API_KEY`
  - Cloudflare: `CLOUDFLARE_R2_ACCESS_KEY`
  - Google Sheets: `GOOGLE_SHEETS_SERVICE_ACCOUNT`
- **GitHubへのプッシュ完了**: `https://github.com/Ogin-ogin/app-dev-business.git` に初期コードをプッシュしました。Vercel側からこのリポジトリをインポートしてデプロイをお願いいたします。
