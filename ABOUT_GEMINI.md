


AI（システムや自律型エージェント）が情報をパースし、条件分岐やRAGのコンテキストとして利用しやすいよう、構造化されたMarkdown形式で比較データを出力します。

2026年2月〜3月にかけてGoogleから発表された「Gemini 3.1」ファミリーの主要3モデルに関する公式データ に基づいています。

---

# 📊 Gemini 3.1 シリーズ 全3モデル比較データ (2026年3月時点)

## 1. モデル概要マトリクス (Overview Matrix)

| 比較キー (Key) | Gemini 3.1 Pro | Gemini 3.1 Flash-Lite | Gemini 3.1 Flash Image |
| :--- | :--- | :--- | :--- |
| **役割 (Role)** | 高度な推論・複雑なタスク解決 | 超高速・低コスト・大量処理 | 画像生成・編集特化 |
| **APIモデル名** | `gemini-3.1-pro-preview` | `gemini-3.1-flash-lite-preview` | `gemini-3.1-flash-image-preview` |
| **コンテキスト長** | 1,048,576 トークン (1M) | 1,048,576 トークン (1M) | 1M トークン (マルチモーダル) |
| **最大出力** | 65,536 トークン (64K) | 65,536 トークン (64K) | 画像 (約4K相当) + テキスト(64K) |
| **Thinking機能** | 対応 (Thinking Levels: Medium等) | 対応 (Minimal〜Highまで調整可) | 非対応 (推論コア内蔵の生成特化) |
| **コスト(1M token)** | プレミアム価格 (要課金) | 入力:$0.25 / 出力:$1.50 | - (要課金) |

---

## 2. 各モデルの詳細仕様 (Detailed Specifications)

### A. Gemini 3.1 Pro
- **アーキテクチャ**: Gemini 3シリーズの中で最も高度な推論（Reasoning）能力を持つフラッグシップモデル。
- **特化領域 (Use Cases)**:
  - 複雑な論理パズルの解決 (ARC-AGI-2ベンチマークで77.1%を記録)。
  - 高度なソフトウェアエンジニアリング (SWE) と自律的なコーディング。
  - カスタムツールやBashを使用するマルチステップのエージェントワークフロー。
- **特記事項**: ツール使用に特化した専用エンドポイント（`gemini-3.1-pro-preview-customtools`）が存在する。

### B. Gemini 3.1 Flash-Lite
- **アーキテクチャ**: スピードとコスト効率を極限まで高めた、低遅延・高スループットモデル。
- **特化領域 (Use Cases)**:
  - 旧モデル(2.5 Flash)比で初期応答時間（TTFT）が2.5倍高速、出力速度が45%向上。
  - 大規模なリアルタイム翻訳、コンテンツモデレーション。
  - 構造化JSONの高速出力、軽量なデータ抽出タスク。
- **特記事項**: コストが非常に安価であり、リクエストの複雑さを判定して上位モデルへ流す「ルーティング用分類器」としても機能する。

### C. Gemini 3.1 Flash Image (開発コードネーム: Nano Banana 2)
- **アーキテクチャ**: Gemini 3.1 Flashの基盤を利用して構築された、高速な画像生成・編集特化の生成メディアモデル。
- **特化領域 (Use Cases)**:
  - ネイティブな文脈理解に基づくプロダクションレベルの画像生成。
  - 対話型の画像編集、スタイル適用。
  - 開発者向けの大量画像処理ワークフロー。

---

## 3. エージェント向けルーティング条件 (Routing Logic for AI)

AIエージェントがタスク内容に応じて自律的にモデルを選択するためのJSON擬似コード（ルールセット）です。

```json
{
  "routing_rules":[
    {
      "condition": "task_type == 'image_generation' OR task_type == 'image_editing'",
      "action": "USE_MODEL: gemini-3.1-flash-image-preview",
      "reason": "画像アセットの生成や視覚的な対話編集に特化しているため"
    },
    {
      "condition": "task_type == 'complex_reasoning' OR requires_tool_use == true OR task_type == 'agentic_coding'",
      "action": "USE_MODEL: gemini-3.1-pro-preview",
      "reason": "高度な論理推論、複数ツールの連続使用、コードの自律実行に最も適しているため"
    },
    {
      "condition": "latency_requirement == 'real-time' OR cost_constraint == 'strict' OR task_type == 'simple_extraction'",
      "action": "USE_MODEL: gemini-3.1-flash-lite-preview",
      "reason": "最速のTTFT（Time To First Token）を持ち、トークン単価が最小であるため"
    }
  ]
}
```