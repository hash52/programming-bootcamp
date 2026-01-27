# ダッシュボード機能仕様書

このドキュメントは、プログラミングブートキャンプ教材システムの**学習ダッシュボード機能**の仕様を定義する。

---

## 📋 目次

1. [概要](#概要)
2. [システムアーキテクチャ](#システムアーキテクチャ)
3. [データモデル](#データモデル)
4. [コンポーネント構成](#コンポーネント構成)
5. [UI仕様](#ui仕様)
6. [進捗率計算ロジック](#進捗率計算ロジック)
7. [ローカルストレージ仕様](#ローカルストレージ仕様)
8. [色分けルール](#色分けルール)
9. [ファイル構成](#ファイル構成)

---

## 概要

### 目的
受講生が自身の学習達成度を可視化し、復習すべき項目を把握できるダッシュボードを提供する。

### 主要機能
- ✅ **進捗の可視化**: 全体・カテゴリ・トピック・質問単位で達成率を表示
- 📊 **グラフ表示**: 折れ線グラフで全体達成率の推移を表示
- ✔️ **チェック管理**: 各質問の達成状況をチェックボックスで管理
- 📅 **経過日数表示**: 最終チェック日からの経過日数を表示
- 💾 **永続化**: ブラウザのlocalStorageに進捗を保存

### 対象ユーザー
- プログラミング未経験者〜初学者
- 1〜3ヶ月のブートキャンプ受講生

---

## システムアーキテクチャ

### データフロー

```
structure.ts (マスタデータ)
    ↓
Dashboard.tsx (メインコンポーネント)
    ↓
useStoredProgress (カスタムフック)
    ↓
localStorage (進捗データ永続化)
```

### 技術スタック
- **UI**: React + MUI (Material-UI)
- **グラフ**: Chart.js (react-chartjs-2)
- **状態管理**: react-use (useLocalStorage)
- **データソース**: structure.ts (TypeScript)

---

## データモデル

### 1. マスタデータ (structure.ts)

#### Topic（トピック）
```typescript
interface Topic {
  id: string;           // トピックID（例: "01_java_basics"）
  label: string;        // トピック名（例: "Javaとプログラミングの基礎"）
  category: Category;   // 所属カテゴリ（例: "java/basics"）
  questions: Question[]; // 質問リスト
}
```

#### Question（質問）
```typescript
interface Question {
  id: string;                // 質問ID（例: "java/basics/01_java_basics#k1"）
  title: string;             // 質問タイトル（例: "プログラムの実行順序を説明できる"）
  type: QuestionType;        // KNOW / READ / WRITE
  difficulty: Difficulty;    // Easy / Medium / Hard
}
```

#### Category（カテゴリ）
```typescript
type Category =
  | "java/basics"    // Java基礎文法
  | "java/oop"       // Javaオブジェクト指向
  | "java/stdlib"    // Java標準ライブラリ
  | "spring"         // Spring Framework
  | "db"             // データベース
  | "frontend"       // フロントエンド
  | "git";           // Git
```

#### QuestionType（質問タイプ）
```typescript
type QuestionType =
  | "KNOW"   // 知識・理解（例: 「〜とは何かを説明できる」）
  | "READ"   // 読解（例: 「コードを読んで結果を予測できる」）
  | "WRITE"; // 実装（例: 「〜を実装できる」）
```

#### Difficulty（難易度）
```typescript
enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}
```

---

### 2. 進捗データ (localStorage)

#### QuestionProgress（質問ごとの進捗）
```typescript
interface QuestionProgress {
  lastCheckedAt: string; // 最終チェック日時（ISO 8601形式、例: "2025-10-15T10:30:00.000Z"）
}
```

#### ProgressRecord（全質問の進捗マップ）
```typescript
type ProgressRecord = Record<string, QuestionProgress>;

// 例:
{
  "java/basics/01_java_basics#k1": { lastCheckedAt: "2025-10-15T10:30:00.000Z" },
  "java/basics/01_java_basics#k2": { lastCheckedAt: "2025-10-14T09:20:00.000Z" },
  // ... （チェック済みの質問のみ登録される）
}
```

#### ProgressHistory（日別進捗履歴）
```typescript
type ProgressHistory = Record<string, number>;

// 例:
{
  "2025-10-01": 10,  // 2025年10月1日の全体達成率: 10%
  "2025-10-02": 15,  // 2025年10月2日の全体達成率: 15%
  "2025-10-03": 22,  // 2025年10月3日の全体達成率: 22%
  // ...
}
```

---

## コンポーネント構成

### メインコンポーネント

#### Dashboard.tsx
- **役割**: ダッシュボード全体の構成と表示
- **表示内容**:
  - 全体達成率の折れ線グラフ（ProgressLineChart）
  - カテゴリ別進捗一覧（CategoryProgressCard）
  - トピック別進捗一覧（TopicProgressAccordion）
  - 質問別チェックボックス（QuestionRowBox）

### サブコンポーネント

#### ProgressLineChart.tsx
- **役割**: 折れ線グラフで全体達成率の推移を表示
- **入力**: `history: ProgressHistory`
- **表示内容**:
  - 横軸: 日付
  - 縦軸: 全体達成率（0〜100%）
  - 初回チェック日の前日を0%として表示

#### ProgressBarWithLabel.tsx
- **役割**: 進捗率をプログレスバーと％表示で可視化
- **入力**: `value: number`（0〜100の数値）
- **表示内容**:
  - 進捗率に応じた色分けのプログレスバー
  - 中央に％表示

---

### カスタムフック

#### useStoredProgress
- **役割**: localStorageとの進捗データの読み書き
- **返り値**:
  ```typescript
  {
    progress: ProgressRecord;        // 全質問の進捗状態
    history: ProgressHistory;        // 日別進捗履歴
    updateProgress: (id: string, checked: boolean) => void; // 進捗更新関数
  }
  ```
- **動作**:
  - チェックON時: 現在日時を`lastCheckedAt`に登録、履歴を更新
  - チェックOFF時: 該当レコードを削除、履歴を更新

---

## UI仕様

### レイアウト構成

```
┌─────────────────────────────────────────────────────┐
│ 📊 全体達成率の推移（折れ線グラフ）                │
│   ●─────●─────●─────●─────●                        │
│                                                     │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ 📚 Java - 基本文法                      [████░░] 76%│
│   ▼ Javaとプログラミングの基礎          [███░░░] 60%│
│     ✅ プログラムの実行順序を説明できる   (3日前)   │
│     ✅ 読みやすいコードの書き方がわかる   (1日前)   │
│     ☐ 波括弧の役割を説明できる           (未チェック)│
│   ▼ 変数と型                            [██████] 100%│
│     ✅ 変数とは何かを説明できる           (1日前)   │
│     ✅ 型とは何かを説明できる             (1日前)   │
└─────────────────────────────────────────────────────┘
```

### 表示階層

1. **カテゴリレベル**（例: Java - 基本文法）
   - カテゴリ名
   - カテゴリ全体の達成率プログレスバー

2. **トピックレベル**（例: Javaとプログラミングの基礎）
   - トピック名（クリックで教材ページを別タブで開く）
   - トピック全体の達成率プログレスバー
   - Accordion（開閉可能）

3. **質問レベル**（例: プログラムの実行順序を説明できる）
   - チェックボックス（達成状態を切り替え）
   - 質問タイトル（クリックで演習問題ページを別タブで開く）
   - 経過日数（色付き）

---

### インタラクション

#### チェックボックス操作
- **クリック時**: チェック状態が切り替わる
- **チェックON**:
  - 現在日時が`lastCheckedAt`に記録される
  - 全体進捗率が再計算され、履歴に保存される
- **チェックOFF**:
  - `progress`から該当レコードが削除される
  - 全体進捗率が再計算され、履歴に保存される

#### リンク
- **トピック名クリック**: 教材ページを別タブで開く（URL: `{category}/{topicId}`）
- **質問タイトルクリック**: 演習問題ページを別タブで開く（URL: `{questionId}`、将来実装予定）

---

## 進捗率計算ロジック

### 全体達成率
```typescript
全体達成率 = チェック済み質問数 ÷ 全質問数
```

実装: `calcOverallProgressRate(progress: ProgressRecord): number`
- 入力: `progress`（進捗レコード）
- 出力: 0〜1の小数（例: 0.75 = 75%）

### カテゴリ達成率
```typescript
カテゴリ達成率 = カテゴリ内のチェック済み質問数 ÷ カテゴリ内の全質問数
```

実装: `calcCategoryProgressRate(category: string, progress: ProgressRecord): number`
- 入力: `category`（カテゴリ名）、`progress`（進捗レコード）
- 出力: 0〜1の小数

### トピック達成率
```typescript
トピック達成率 = トピック内のチェック済み質問数 ÷ トピック内の全質問数
```

実装: `calcTopicProgressRate(topicId: string, progress: ProgressRecord): number`
- 入力: `topicId`（トピックID）、`progress`（進捗レコード）
- 出力: 0〜1の小数

---

## ローカルストレージ仕様

### 保存キー

| キー               | 内容                     | データ型           |
|--------------------|--------------------------|-------------------|
| `questionProgress` | 質問ごとの進捗状態       | `ProgressRecord`  |
| `progressHistory`  | 日別進捗履歴             | `ProgressHistory` |

### データフォーマット

#### questionProgress
```json
{
  "java/basics/01_java_basics#k1": {
    "lastCheckedAt": "2025-10-15T10:30:00.000Z"
  },
  "java/basics/01_java_basics#k2": {
    "lastCheckedAt": "2025-10-14T09:20:00.000Z"
  }
}
```

#### progressHistory
```json
{
  "2025-10-01": 10,
  "2025-10-02": 15,
  "2025-10-03": 22
}
```

### 保存タイミング
- **チェックボックス操作時**: 即座に保存
- **ページ読み込み時**: localStorageから復元

---

## 色分けルール

### 進捗率による色分け（プログレスバー）

| 達成率      | 色         | 色コード    | 意味       |
|-------------|------------|-------------|------------|
| 100%        | 青         | `#1e88e5`   | 完了       |
| 80〜99%     | 緑         | `#43a047`   | もう少し   |
| 40〜79%     | オレンジ   | `#fb8c00`   | 途中       |
| 0〜39%      | 赤         | `#e53935`   | 要学習     |

実装: `getProgressColor(ratio: number): string`（ProgressBarWithLabel.tsx）

### 経過日数による色分け（質問の経過日数表示）

| 経過日数    | 色         | 色コード    | 意味       |
|-------------|------------|-------------|------------|
| 未チェック  | グレー     | `#999`      | 未実施     |
| 0〜2日      | 緑         | `#43a047`   | 最近       |
| 3〜6日      | オレンジ   | `#fb8c00`   | やや古い   |
| 7日以上     | 赤         | `#e53935`   | 要復習     |

実装: `getDateColor(dateString: string | null): string`（Dashboard.tsx）

### 経過日数の表示形式

| 経過日数 | 表示形式   |
|----------|------------|
| 0日      | 今日       |
| 1日      | 昨日       |
| 2日以上  | X日前      |
| 未チェック | 未チェック |

実装: `daysSince(dateString: string | null): string`（Dashboard.tsx）

---

## ファイル構成

```
docs/src/
├── structure.ts                           # マスタデータ（全トピック・質問定義）
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx                  # メインコンポーネント
│   │   ├── ProgressLineChart.tsx          # 折れ線グラフ
│   │   └── ProgressBarWithLabel.tsx       # プログレスバー
│   └── lib/
│       ├── calcProgressRate.ts            # 進捗率計算ロジック
│       ├── calcProgressRate.test.ts       # 進捗率計算テスト
│       ├── date.ts                        # 日付ユーティリティ
│       └── date.test.ts                   # 日付ユーティリティテスト
└── hooks/
    └── useStoredProgress.ts               # localStorage管理フック
```

---

## 実装の注意点

### 質問IDの生成ルール

質問IDは`{category}/{topicId}#{type}{番号}`の形式で自動生成される。

例:
- `java/basics/01_java_basics#k1` → Java基礎・第1章・KNOW型・1問目
- `java/basics/01_java_basics#w5` → Java基礎・第1章・WRITE型・5問目

生成ロジック: `withAutoIds()`関数（structure.ts）

### チェック状態の判定

質問がチェック済みかどうかは、`progress`オブジェクトに`questionId`のキーが存在するかで判定する。

```typescript
const isChecked = Boolean(progress[questionId]?.lastCheckedAt);
```

### 日付のタイムゾーン処理

- **保存**: UTC時刻（ISO 8601形式）で保存
- **表示**: ブラウザのロケールに基づいて表示
- **履歴キー**: ロケール基準の`YYYY-MM-DD`形式（例: `2025-10-15`）

実装: `getLocaleDateString()`関数（useStoredProgress.ts）

---

## 将来の拡張予定

### Phase 1（現在実装済み）
- ✅ 進捗の可視化
- ✅ チェック管理
- ✅ 経過日数表示
- ✅ 折れ線グラフ

### Phase 2（将来実装予定）
- ⏳ 質問タイプ別達成率グラフ（KNOW/READ/WRITE）
- ⏳ 難易度別達成率グラフ（Easy/Medium/Hard）
- ⏳ 演習問題ページの実装（現在は質問タイトルクリック時のリンク先が未実装）
- ⏳ 復習アラート機能（一定期間チェックがない質問を通知）
- ⏳ 学習時間の記録・可視化
- ⏳ モバイル最適化

---

## 参考情報

### 関連ドキュメント
- **プロジェクト固有指示**: `.claude/CLAUDE.md`
- **カリキュラムスケジュール**: `.claude/curriculum/schedule.md`
- **Java設計書**: `.claude/curriculum/01_java-design.md`

### 技術ドキュメント
- [React](https://react.dev/)
- [MUI (Material-UI)](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
- [react-use](https://github.com/streamich/react-use)

---

**最終更新日**: 2025-10-06
**バージョン**: 1.0.0
**作成者**: Claude Code
**管理**: `.claude/specs/dashboard.md`
