# コードレイアウト

## ルートディレクトリ
- `README.md` - プロジェクトの説明、セットアップ手順、ライセンス情報
- `.gitignore` - Git除外ファイルの設定

## docs/ ディレクトリ（Docusaurusサイト）
- `docs/docusaurus.config.ts` - Docusaurusの設定ファイル
- `docs/sidebars.ts` - サイドバーナビゲーションの定義
- `docs/package.json` - Node.jsプロジェクトの依存関係とスクリプト
- `docs/tsconfig.json` - TypeScriptコンパイラ設定
- `docs/jest.config.cjs` - Jestテストフレームワーク設定
- `docs/jest.setup.js` - Jestセットアップファイル

### docs/docs/（マークダウンコンテンツ）
- `docs/docs/index.mdx` - トップページ
- `docs/docs/roadmap.md` - 学習ロードマップ
- `docs/docs/java/` - Java関連の教材（基礎、OOP、標準ライブラリ）
- `docs/docs/spring/` - Spring Frameworkの教材（MVC、DI、セキュリティ、MyBatis等）
- `docs/docs/db/` - データベース関連の教材（SQL、正規化等）
- `docs/docs/frontend/` - フロントエンド技術の教材（HTML/CSS/JavaScript、Bootstrap）
- `docs/docs/git/` - Git操作の教材
- `docs/docs/hands-on/webapp/` - Webアプリケーション開発のハンズオン教材
- `docs/docs/others/` - トラブルシューティング、リファレンス

### docs/src/（カスタムコンポーネント）
- `docs/src/structure.ts` - プロジェクト構造定義
- `docs/src/components/QuestionRenderer.tsx` - 問題レンダリングコンポーネント
- `docs/src/components/CodeBlockWithDiff.tsx` - 差分表示付きコードブロック
- `docs/src/components/OneCompilerCodeBlock.tsx` - OneCompilerコードブロック
- `docs/src/components/dashboard/Dashboard.tsx` - 進捗ダッシュボード
- `docs/src/components/dashboard/ProgressBarWithLabel.tsx` - プログレスバー
- `docs/src/components/dashboard/ProgressLineChart.tsx` - 進捗チャート
- `docs/src/components/theme/MuiDarkThemeProvider.tsx` - Material-UIテーマプロバイダー
- `docs/src/components/lib/date.ts` - 日付ユーティリティ
- `docs/src/components/lib/calcProgressRate.ts` - 進捗率計算ユーティリティ
- `docs/src/hooks/useStoredProgress.ts` - 進捗データ保存用フック

### docs/src/questions/（演習問題）
- `docs/src/questions/java/basics/if/` - Java基礎（条件分岐）の演習問題
- `docs/src/questions/spring/` - Spring関連の演習問題（MVC、ルーティング、バリデーション、DI、セキュリティ等）

### docs/static/（静的ファイル）
- `docs/static/img/` - 画像ファイル（アイコン、ロゴ、ソーシャルカード等）

### docs/src/css/（スタイル）
- `docs/src/css/custom.css` - カスタムCSS
- `docs/src/css/DiffCodeBlock.module.css` - 差分コードブロック用CSS
