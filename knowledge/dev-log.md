# 開発ログ

プロジェクトの機能追加・修正の履歴を記録する。

---

## 2026-02-15: CodePenEmbed オフラインモード実装

### 概要

CodePenEmbed コンポーネントに、OneCompilerCodeBlock と同様のオフラインモードを追加した。
オフラインモード時は CodePen の iframe 埋め込みの代わりに、HTML/CSS/JS のコードをタブ切り替え式で構文ハイライト表示する。

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `docs/src/components/CodePenEmbed.tsx` | オフラインモード対応の実装 |
| `docs/docs/frontend/html/01_html_basics.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/css/02_css_basics.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/css/03_css_layout.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/html/04_html_forms.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/html/05_form_validation.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/bootstrap/06_bootstrap_intro.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/bootstrap/07_bootstrap_grid.mdx` | テンプレートリテラルのインデント修正 |
| `docs/docs/frontend/responsive/08_responsive_design.mdx` | テンプレートリテラルのインデント修正 |

### CodePenEmbed.tsx の変更詳細

- **`offline?: boolean` prop を追加**: グローバル設定を個別に上書き可能にした
- **`useOfflineMode()` フック統合**: 既存の `OfflineModeContext` を活用し、Navbar のクラウドアイコンでオン/オフ切り替え可能にした
- **タブ式コード表示**: `htmlCode`、`cssCode`、`jsCode` のうち存在するもののみタブとして表示。タブが1つの場合はタブバー非表示
- **構文ハイライト**: `prism-react-renderer` の `Highlight` コンポーネントを使用。行番号も表示
- **ダーク/ライトモード対応**: `useColorMode()` に基づき、`themes.dracula`（ダーク）と `themes.github`（ライト）を切り替え
- **検索対応**: 既存の不可視 `<span>` によるサイト内検索対応をオフラインモードでも維持

### MDX テンプレートリテラルのインデント修正

#### 問題

オフラインモードでコード表示した際、インデントが消失していた。

#### 原因

MDX コンパイラが JSX props 内のテンプレートリテラルの先頭空白を、prop のインデントレベル分（2スペース）だけ自動的にストリップする仕様があった。
元のコードが2スペースインデントだったため、ストリップ後にインデントが0になっていた。

- **修正前（MDXソース）**: 2スペースインデント → ビルド後: 0スペース
- **修正後（MDXソース）**: 4スペースインデント → ビルド後: 2スペース

#### 対応

フロントエンド教材の全8ファイルを対象に、`htmlCode`/`cssCode`/`jsCode` テンプレートリテラル内の各行に2スペースを追加するスクリプトを実行。合計1398行を修正した。

#### 今後の注意点

CodePenEmbed に渡すテンプレートリテラル内のコードは、**4スペースインデント** で記述すること。
MDX コンパイラが2スペースをストリップするため、表示上は2スペースインデントになる。
（OneCompilerCodeBlock でも同じ制約が存在する）
