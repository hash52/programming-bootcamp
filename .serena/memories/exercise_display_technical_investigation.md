# 演習問題表示機能の詳細設計 — 技術的実装状況調査報告書

作成日：2025-12-04

---

## 1. Docusaurus設定とバージョン

### Docusaurusのバージョン
- **バージョン**: Docusaurus 3.8.0
- **プリセット**: @docusaurus/preset-classic 3.8.0
- **配置**: docs/ディレクトリ直下

### 設定ファイル: docusaurus.config.ts

#### 主要設定
```typescript
- title: "Programming Bootcamp"
- url: "https://hash52.github.io"
- baseUrl: "/programming-bootcamp/"
- organizationName: "hash52"
- projectName: "programming-bootcamp"
```

#### プラグイン
- `@easyops-cn/docusaurus-search-local` v0.52.1: ローカル検索機能を提供
  - 日本語対応（language: ["ja"]）
  - 索引化対象: ドキュメント

#### テーマ
- Mermaid図表サポート有効
- Prism: Java言語対応

#### MDXプリセット
```typescript
docs: {
  sidebarPath: "./sidebars.ts",
  routeBasePath: "/",
  editUrl: "https://github.com/hash52/programming-bootcamp/tree/main/",
}
```

---

## 2. UIライブラリとスタイリング

### 依存ライブラリ（package.json）

#### Material-UI (MUI) v7.3.4
```typescript
"@mui/material": "^7.3.4"
"@emotion/react": "^11.14.0"
"@emotion/styled": "^11.14.1"
```

**既存の使用状況:**
- Dialog / Modal: 直接使用例なし（ただし、MUIに完全に対応）
- Drawer: 未使用
- Accordion: Dashboard.tsxで多用（折り畳みUI）
- LinearProgress: プログレスバー表示（ProgressBarWithLabel.tsx）
- TextField, Checkbox, etc: 基本的なフォーム要素が利用可能

#### その他のUI/UXライブラリ
- `mdi-material-ui` v7.9.4: Material Design Icons
- `react-chartjs-2` v5.3.0: グラフ表示（Dashboard.tsxで使用）
- `clsx` v2.0.0: 条件付きクラス名の結合

### スタイリング方針
- **emotion styled-components** パターンで主にスタイリング
- **useColorMode()** で Docusaurus のライト/ダーク対応
- MUI の Theme システムを活用（MuiDarkThemeProvider.tsx）

### 既存のテーマプロバイダー: MuiDarkThemeProvider.tsx

```typescript
// src/theme/Root.tsx の例
const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

export const MuiDarkThemeProvider = ({ children }) => {
  const { colorMode } = useColorMode();
  const muiTheme = useMemo(
    () => (colorMode === "dark" ? darkTheme : lightTheme),
    [colorMode]
  );
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};
```

---

## 3. 既存のインタラクティブコンポーネント実装パターン

### 3.1 OneCompilerCodeBlock.tsx（コード実行エディタ）

**役割**: OneCompiler APIで言語別エディタを埋め込み

**技術スタック**:
- React Functional Component
- useColorMode() で Docusaurus カラーモード対応
- URLSearchParams で API オプション管理
- iframe での外部サービス統合

**主要な実装パターン**:
```typescript
// 1. カラーモード自動取得
const { colorMode } = useColorMode();

// 2. URLパラメータ構築
const params = new URLSearchParams();
params.set("theme", theme ?? colorMode);
// ... 他の設定

// 3. iframe 埋め込み
const src = `https://onecompiler.com/embed/${language}/${codeId}?${params}`;
return (
  <>
    <span style={{ display: "none" }}>{code}</span>
    <iframe src={src} width={width} height={height} />
  </>
);
```

**重要な特徴**:
- コードを検索対象とするため不可視で描画（span要素）
- 外部APIへの依存（ネットワーク環境に左右される）

### 3.2 CodePenEmbed.tsx（Web Pen 埋め込み）

**役割**: CodePen の HTML/CSS/JavaScript デモを iframe で表示

**実装パターン**: OneCompiler と同様（iframe ベース）

**カスタマイズ可能なprops**:
- slugHash（必須）
- defaultTab: "html" | "css" | "js"
- showResult: boolean
- editable: boolean
- theme: "light" | "dark"
- htmlCode/cssCode/jsCode: 検索対象コード

### 3.3 CodeBlockWithDiff.tsx（差分表示コードブロック）

**役割**: 追加/削除/変更をハイライトしたコード表示

**技術スタック**:
- Prism React Renderer （構文ハイライト）
- useColorMode() で light/dark テーマ自動切り替え
- styled-components ではなく inline style

**実装の工夫**:
```typescript
// 差分行の色分け
- added: rgba(0,255,0,0.08) // 薄い緑
- removed: rgba(255,0,0,0.08) // 薄い赤

// 行番号は added/context のみ表示
// removed 行は透明化（スペースのみ）
```

### 3.4 QuestionRenderer.tsx（演習問題動的読み込み）

**役割**: structure.ts の Question ID に基づいて、対応する `.mdx` ファイルを動的に読み込み表示

**重要な実装パターン**:
```typescript
// require.context で .mdx ファイル群を事前に bundle
const context = require.context("../questions", true, /\.mdx$/);

// ID形式: "java/basics/if#q1"
// ファイルパス: "./java/basics/if/q1.mdx"
const [dirPath, fileNamePart] = id.split("#");
const Module = context(`./${dirPath}/${fileNamePart}.mdx`).default;

// フラグメント ID でスクロール
useEffect(() => {
  const el = document.getElementById(fileNamePart);
  el?.scrollIntoView({ behavior: "instant" });
}, [fileNamePart]);
```

**重要な特徴**:
- Webpack の `require.context` で動的モジュール読み込み
- URL のハッシュ（フラグメント ID）を活用したスクロール機能

### 3.5 Dashboard.tsx（学習進捗管理UI）

**役割**: 全体進捗率・カテゴリ別進捗・トピック別進捗を表示、チェック機能

**MUI コンポーネント利用**:
- Accordion / AccordionSummary / AccordionDetails: トピック展開
- Checkbox: 達成チェック
- Stack: レイアウト
- Paper: カード背景
- Box/Typography: 基本要素
- styled() で emotion styled-components で拡張

**状態管理**:
- useStoredProgress() カスタムフック
- localStorage に進捗情報を永続保存
- ProgressLineChart で日別進捗グラフ表示（react-chartjs-2）

---

## 4. ルーティングとURL管理

### 4.1 Docusaurus ルーティング

**基本設定** (docusaurus.config.ts):
```typescript
docs: {
  routeBasePath: "/",  // ドキュメントがルートパス
}
```

**実際のURL構造**:
- `/java/basics/variables_and_types/` → `docs/docs/java/basics/variables_and_types.mdx`
- `/` → Dashboard 等の独自ページ

### 4.2 フラグメント ID の活用

**現在の仕様** (QuestionRenderer.tsx):
```typescript
// URL: /java/basics/if?#q1
// フラグメントでスクロール: #q1

// 実装例
window.location.hash // → "#q1"
document.getElementById("q1")?.scrollIntoView()
```

### 4.3 クエリパラメータの扱い

**Docusaurus では `useLocation()` を使用可能**:
```typescript
import { useLocation } from "@docusaurus/router";
const location = useLocation();
// location.pathname, location.search, location.hash にアクセス可能
```

---

## 5. React と TypeScript 設定

### 5.1 React バージョン
- **React**: 19.0.0
- **React DOM**: 19.0.0

### 5.2 TypeScript 設定 (tsconfig.json)

```typescript
{
  "extends": "@docusaurus/tsconfig",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

**特性**:
- Docusaurus 公式の tsconfig を拡張
- baseUrl が設定されているため、`@site/src/...` で相対パスのエイリアス利用可能

### 5.3 コンポーネントのディレクトリ構造

```
docs/src/
├── components/
│   ├── QuestionRenderer.tsx
│   ├── OneCompilerCodeBlock.tsx
│   ├── CodePenEmbed.tsx
│   ├── CodeBlockWithDiff.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── ProgressBarWithLabel.tsx
│   │   └── ProgressLineChart.tsx
│   ├── theme/
│   │   └── MuiDarkThemeProvider.tsx
│   └── lib/
│       ├── calcProgressRate.ts
│       └── date.ts
├── hooks/
│   └── useStoredProgress.ts
├── questions/           # 演習問題 MDX ファイル群
│   ├── java/
│   ├── spring/
│   └── ...
├── structure.ts         # 達成目標マスタデータ
└── css/
    └── custom.css
```

### 5.4 ビルドとモジュール解析

**テスト設定** (jest.config.cjs):
```typescript
"test": "jest --config jest.config.cjs"
```

**既存テスト対象**:
- `hooks/useStoredProgress.test.ts`
- `components/lib/date.test.ts`
- `components/lib/calcProgressRate.test.ts`

---

## 6. ローカルストレージと状態管理

### 6.1 useStoredProgress() カスタムフック

**特徴**:
- react-use の `useLocalStorage` を使用
- 2つのキーで管理:
  - `questionProgress`: 設問ごとの達成状況（Question ID → lastCheckedAt）
  - `progressHistory`: 日別進捗履歴（YYYY-MM-DD → 進捗率%）

**実装例**:
```typescript
const [progress, setProgress] = useLocalStorage<ProgressRecord>(
  "questionProgress",
  {}
);
const [history, setHistory] = useLocalStorage<ProgressHistory>(
  "progressHistory",
  {}
);

// 更新時に自動的に全体進捗率も再計算
const updateProgress = (id: string, checked: boolean) => {
  // ... 実装
  const ratio = Math.round(calcOverallProgressRate(updated) * 100);
  updateProgressHistory(ratio);
};
```

### 6.2 データフロー

```
[ユーザー操作]
    ↓
[Dashboard チェックボックス変更]
    ↓
[updateProgress() 呼び出し]
    ↓
[ProgressRecord 更新]
    ↓
[進捗率を再計算して history に反映]
    ↓
[localStorage に永続保存]
    ↓
[コンポーネント再レンダリング]
```

---

## 7. 現在の演習問題実装状況

### 演習問題ファイル数
- **現在**: 10 ファイル
- **配置場所**: `docs/src/questions/{category}/{topic}/{filename}.mdx`
- **ファイル名規則**: `k1.mdx`, `k2.mdx`... (KNOW), `r1.mdx`... (READ), `w1.mdx`... (WRITE)

### 既存の演習問題例

#### Spring MVC 例（spring/02_mvc_intro/k1.mdx）
- 問題をテーブル形式で提示
- 回答と解説をセット
- KNOW / READ / WRITE の混合構成

#### Java 条件分岐（java/basics/if/q1.mdx）
- OneCompilerCodeBlock で実行可能なコードを含む
- シンプルな構成

---

## 8. 技術的な実装上の考慮事項

### 8.1 iframe ベースのコンポーネント
- **メリット**: 外部サービス（OneCompiler, CodePen）の自動更新に対応
- **デメリット**: ネットワーク遅延、CORS の可能性、読み込み失敗時の対応

### 8.2 Docusaurus の制約
- MDX パーサーの quirks: `**` 前後にスペース必須、テーブル内での `|` エスケープ
- require.context は Webpack の機能（本番環境で bundle 時に解析）
- useColorMode() は React Context 経由でのみ利用可能

### 8.3 MUI コンポーネント

**既に利用可能で検証済み**:
- Accordion (Dashboard で使用)
- LinearProgress (ProgressBarWithLabel で使用)
- Checkbox (Dashboard で使用)
- Paper, Box, Stack, Typography

**未利用だが利用可能**:
- Dialog / Modal: ダイアログUI
- Drawer: スライドイン UI
- Tab / Tabs: タブUI
- Card / CardContent: カード UI
- Button: ボタン

### 8.4 ライト/ダーク対応

**方式**: useColorMode() で Docusaurus のカラーモードを取得
- OneCompiler, CodePen: theme パラメータで対応
- Prism: themes.light / themes.dracula で対応
- MUI: ThemeProvider で対応

---

## 9. 推奨される技術選択（演習問題表示機能向け）

### UI コンポーネント
- **ダイアログ**: MUI Dialog + Docusaurus Router で実装
- **フォーム**: MUI TextField + Validation（バリデーション）
- **レイアウト**: MUI Stack/Box + CSS Grid

### 状態管理
- **既存フレームワーク継続**: localStorage + React hooks
- **追加検討**: React Context で演習問題固有の状態管理

### ルーティング
- **ページ遷移**: Docusaurus Router（useLocation）を利用
- **フラグメント ID**: URL のハッシュ部で問題スクロール

### スタイリング
- **方針**: emotion styled-components（既存ルール継続）
- **ダーク対応**: useColorMode() で条件分岐

---

## 10. 今後の実装に向けた注意点

1. **Module Federation の可能性**: 大規模な演習問題コンポーネント分割を想定する場合、webpack の Module Federation を検討

2. **パフォーマンス**: require.context で bundle size が増加する可能性（Code Splitting の検討）

3. **テスト戦略**: 既存の Jest 設定を活用、QuestionRenderer や Dashboard のユニットテストを追加

4. **アクセシビリティ**: MUI コンポーネントは ARIA ラベル対応済みだが、カスタム UI は WCAG 2.1 Level AA 対応を検討

5. **多言語対応**: 現在は日本語のみ（Docusaurus i18n 設定は将来用）

---

