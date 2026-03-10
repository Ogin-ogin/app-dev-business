# 不満レーダー (fuman-radar) 実装プラン

## Context

HoshiAppの既製品アプリ第4弾として「不満レーダー」を開発・追加する。
民衆の不満・愚痴を匿名投稿→AI分析→可視化する**2面マーケットプレイス型**サービス。

**問題**: 開発者やビジネスオーナーは市場のリアルなニーズ（不満）データを必要としているが、
SNSからの収集はコスト高・法的リスクが高い。一方、一般ユーザーは匿名で愚痴を吐ける場所を求めている。

**解決策**: 無料の愚痴投稿プラットフォーム（投稿者向け）と、その不満データのAI分析ツール（分析者向け ¥500/月）を組み合わせる。

---

## ターゲットユーザー

| ターゲット | 利用 | 料金 | メリット |
|-----------|------|------|---------|
| **一般ユーザー（投稿者）** | 愚痴を匿名投稿 | **無料** | AI共感コメント、「わかる」共感ボタン、個人分析レポート |
| **開発者・事業者（分析者）** | 不満データを分析 | **¥500/月** | UMAP可視化、AI対話分析、トレンド時系列、カテゴリ探索 |

### 公開範囲ルール
- 投稿は**完全匿名**（ユーザー名なし、個人特定不可）
- 無料ユーザー同士は互いの愚痴を閲覧・共感可能
- 有料ユーザー（分析者）は**集計・分析データのみ**アクセス可能（個別の生テキストは閲覧不可）
- プライバシー保護を最優先

---

## 技術アーキテクチャ

### データソース: ハイブリッド
1. **ユーザー生成コンテンツ（メイン）**: アプリ内で匿名投稿（愚痴専用SNS機能）
2. **シードデータ**: 運営が公開情報源から500-1000件を初期投入
3. **将来**: RSS集約、X/Twitter API（収益が十分になった場合）

### AI・機械学習パイプライン
- **エンベディング**: `gemini-embedding-001`（768次元）— テキスト→ベクトル変換
- **UMAP**: `umap-js`（サーバーサイド）— 768D→2D次元削減、結果キャッシュ
- **分類・感情分析**: `gemini-3.1-flash-lite-preview` — 自動カテゴリ分類＋感情スコア
- **AI共感コメント**: `gemini-3.1-flash-lite-preview` — 投稿に対する共感返答
- **AI対話分析**: `gemini-3.1-flash-lite-preview` + RAG — 分析者向けチャット
- **可視化**: Recharts（既存）— ScatterChart, BarChart, LineChart

### ベクトルストレージ
- Firestoreにbase64エンコードで保存（768dim × 4bytes = 3KB/件）
- 5000件でも~15MBで十分管理可能
- 類似検索はブルートフォースcosine similarity（<50ms）
- 50,000件超えたらFirestore Vector Search or 専用DBに移行

---

## ファイル構成

### アプリUI
```
src/app/app/fuman-radar/
  layout.tsx              -- サイドバーナビ（finance/layout.tsxパターン）
  page.tsx                -- メインダッシュボード（投稿者向け: タイムライン＋投稿フォーム）
  explore/page.tsx        -- 不満データ探索（フィルター付き一覧、無料ユーザー向け）
  chat/page.tsx           -- AI対話分析（分析者向け、有料）
  map/page.tsx            -- UMAP散布図可視化（分析者向け、有料）
  trends/page.tsx         -- トレンド時系列グラフ（分析者向け、有料）
  import/page.tsx         -- データインポート（管理者/分析者向け）
  my-posts/page.tsx       -- 自分の投稿管理（投稿者向け）
  my-report/page.tsx      -- 個人分析レポート（投稿者向け）
  settings/page.tsx       -- 設定
```

### APIルート
```
src/app/api/fuman-radar/
  posts/route.ts          -- GET: 投稿一覧, POST: 新規投稿
  posts/[id]/route.ts     -- GET: 投稿詳細, DELETE: 自分の投稿削除
  posts/[id]/empathy/route.ts  -- POST: 「わかる」共感ボタン
  embed/route.ts          -- POST: バッチエンベディング処理
  umap/route.ts           -- GET: UMAPキャッシュ取得, POST: 再計算
  chat/route.ts           -- POST: RAG対話分析
  trends/route.ts         -- GET: トレンドデータ
  categories/route.ts     -- GET: カテゴリ一覧＋件数
  my-report/route.ts      -- GET: 個人分析レポート生成
  import/route.ts         -- POST: CSV/テキストインポート
```

### コンポーネント
```
src/components/fuman-radar/
  PostForm.tsx            -- 愚痴投稿フォーム（テキスト＋カテゴリ選択）
  PostCard.tsx            -- 投稿カード（テキスト、カテゴリ、共感数、AI返答）
  PostTimeline.tsx        -- タイムライン表示
  EmpathyButton.tsx       -- 「わかる」共感ボタン
  AiEmpathyBubble.tsx     -- AI共感コメント吹き出し
  UmapScatterPlot.tsx     -- UMAP散布図（Recharts ScatterChart）
  CategoryFilter.tsx      -- カテゴリフィルター
  SentimentBadge.tsx      -- 感情インジケーター
  TrendChart.tsx          -- 時系列トレンドグラフ
  ChatInterface.tsx       -- AI対話UI
  PersonalReport.tsx      -- 個人不満分析レポート
  ImportForm.tsx          -- データインポートフォーム
  PaidFeatureGate.tsx     -- 有料機能ゲート（未課金時に案内表示）
```

---

## Firestoreデータモデル

### `fuman_posts` コレクション
```typescript
interface FumanPost {
  id: string;
  uid: string;                     // 投稿者（内部管理用、表示しない）
  text: string;                    // 不満テキスト（最大500文字）
  textHash: string;                // SHA-256（重複排除）
  category: string;                // 自動分類: economy|politics|healthcare|education|work|housing|transport|food|service|tech|other
  sentiment: number;               // -1.0〜1.0
  keywords: string[];              // 抽出キーワード
  embedding: string;               // base64 Float32Array (768dim)
  aiEmpathy: string;               // AI共感コメント
  empathyCount: number;            // 「わかる」の数
  source: 'user' | 'seed' | 'import';
  createdAt: FirestoreTimestamp;
}
```

### `fuman_empathies` コレクション
```typescript
interface FumanEmpathy {
  postId: string;
  uid: string;
  createdAt: FirestoreTimestamp;
}
```

### `fuman_umap_cache` コレクション
```typescript
interface FumanUmapCache {
  id: string;                      // 'latest'
  coordinates: string;             // JSON [{id, x, y, category, sentiment}]
  count: number;
  computedAt: FirestoreTimestamp;
}
```

### `fuman_trends` コレクション
```typescript
interface FumanTrend {
  id: string;                      // 日付キー '2026-03-10'
  categoryCounts: Record<string, number>;
  sentimentAvg: Record<string, number>;
  topKeywords: { word: string; count: number }[];
  totalPosts: number;
  computedAt: FirestoreTimestamp;
}
```

---

## 投稿→分析パイプライン

```
[ユーザー投稿] → POST /api/fuman-radar/posts
  ├→ テキスト保存（Firestore）
  ├→ gemini-3.1-flash-lite: カテゴリ分類 + 感情分析 + キーワード抽出
  ├→ gemini-3.1-flash-lite: AI共感コメント生成
  └→ gemini-embedding-001: ベクトル化 → Firestoreに保存

[50件追加ごと] → UMAP再計算 → キャッシュ更新
[日次バッチ] → トレンドスナップショット計算
```

---

## 既存ファイル変更

### 商品カタログ追加（3ファイル）
- `src/app/products/page.tsx` — products配列に追加（id: "fuman-radar", ¥500/月）
- `src/app/products/[id]/page.tsx` — PRODUCTS mapで全商品対応
- `src/app/api/recommend/route.ts` — PRODUCTS配列に追加

### ダッシュボード
- `src/app/dashboard/page.tsx` — 不満レーダーカードを追加

### 型定義
- `src/types/firestore.ts` — FumanPost, FumanEmpathy等のインターフェース追加

### 共通ユーティリティ（新規）
- `src/lib/embeddings.ts` — Gemini embedding呼び出し、cosine similarity関数

### Firestore設定
- `firestore.rules` — fuman_posts等のセキュリティルール追加
- `firestore.indexes.json` — 必要なインデックス追加

---

## 新規依存パッケージ
- `umap-js` ^1.4.0 — UMAP次元削減（Node.js互換）✅ インストール済

---

## 環境変数（追加が必要）
- `NEXT_PUBLIC_PRICE_APP4_MONTHLY` — Stripe Price ID for ¥500/月

---

## カテゴリ一覧（11種）
| ID | 日本語 |
|----|--------|
| economy | 経済・お金 |
| politics | 政治 |
| healthcare | 医療・健康 |
| education | 教育 |
| work | 仕事・職場 |
| housing | 住まい |
| transport | 交通 |
| food | 食事・飲食 |
| service | サービス・接客 |
| tech | テクノロジー |
| other | その他 |

---

## 実装フェーズ

### Step 1: 基盤 + 投稿機能（投稿者向けMVP）✅ 実装済
- ファイル構成作成、TypeScript型定義
- `src/lib/embeddings.ts` ユーティリティ
- 投稿API: `posts/route.ts` + 自動分類 + AI共感 + エンベディング
- 投稿UI: `PostForm.tsx`, `PostCard.tsx`, `PostTimeline.tsx`, `page.tsx`
- 「わかる」共感機能: `empathy/route.ts`, `EmpathyButton.tsx`

### Step 2: 探索 + 個人レポート ✅ 実装済
- `explore/page.tsx` — カテゴリ・キーワードフィルター付き一覧
- `my-posts/page.tsx` — 自分の投稿管理
- `my-report/page.tsx` + `my-report/route.ts` — 個人不満分析レポート

### Step 3: 分析者向け機能（有料）✅ 実装済
- UMAP: `embed/route.ts`, `umap/route.ts`, `UmapScatterPlot.tsx`, `map/page.tsx`
- AI対話: `chat/route.ts`, `ChatInterface.tsx`, `chat/page.tsx`（RAGパターン）
- トレンド: `trends/route.ts`, `TrendChart.tsx`, `trends/page.tsx`
- `PaidFeatureGate.tsx` — 有料機能ゲート

### Step 4: プラットフォーム統合 ✅ 実装済
- 商品カタログ3ファイル更新
- ダッシュボード更新
- layout.tsxサイドバー完成

### Step 5: シードデータ + 仕上げ ⏳ 未着手
- シードデータ500件作成＋インポート
- Stripe Price ID設定（¥500/月）
- `NEXT_PUBLIC_PRICE_APP4_MONTHLY` を .env.local に追加
- テスト + Vercelデプロイ

---

最終更新: 2026-03-10
