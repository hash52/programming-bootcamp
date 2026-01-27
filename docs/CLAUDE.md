# Docusaurus教材サイト - サブプロジェクト指示

このディレクトリはDocusaurusベースの教材サイトである。

## 共通ナレッジベース

教材作成時は、以下のドキュメントを参照すること：

- `@knowledge/syllabi/schedule.md` - カリキュラムスケジュール
- `@knowledge/syllabi/java-design.md` - Java教材設計書
- `@knowledge/guides/dashboard-spec.md` - ダッシュボード仕様

## このディレクトリの構成

```
docs/
├── docs/           # 教材コンテンツ（Markdown/MDX）
├── src/            # Reactコンポーネント、カスタム機能
│   ├── components/ # 再利用可能なコンポーネント
│   ├── questions/  # 演習問題
│   └── structure.ts # 達成目標のマスタデータ
├── static/         # 静的ファイル（画像等）
└── docusaurus.config.ts
```

## 開発コマンド

```bash
cd docs
npm install
npm run start   # 開発サーバー起動
npm run build   # 本番ビルド
```

## 教材作成時の注意

- 詳細な教材作成ルールは、ルートの `.claude/CLAUDE.md` を参照
- `structure.ts` への達成目標追加を忘れないこと
- MDXファイルの構文ルール（import文、admonitions等）に従うこと
