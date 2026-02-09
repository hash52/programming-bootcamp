# Git教材 第1〜3章（git/basics）

## 作成日
2026-02-08

## ファイル一覧
| 章 | ファイル | タイトル |
|----|---------|---------|
| 第1章 | `docs/docs/git/basics/01_version_control.mdx` | バージョン管理とGit |
| 第2章 | `docs/docs/git/basics/02_git_basics.mdx` | Gitの基本操作 |
| 第3章 | `docs/docs/git/basics/03_github_remote.mdx` | GitHubとリモート操作 |

## カテゴリ構成
- `docs/docs/git/_category_.json` - Git全体（position: 6）
- `docs/docs/git/basics/_category_.json` - 基礎（position: 1）

## structure.ts
- カテゴリ: `"git/basics"`, `"git/teamwork"` に分割
- ラベル: `"Git - 基礎"`, `"Git - チーム開発"`
- Topic定義: 第1〜3章分を追加済み
  - `01_version_control` (5問: KNOW×4, WRITE×1)
  - `02_git_basics` (8問: WRITE×8)
  - `03_github_remote` (8問: KNOW×1, WRITE×6, READ×1)

## 教材の特徴
- import文なし（OneCompilerCodeBlock不使用）
- Mermaid図: 各章2〜3個（gitGraph, graph LR, sequenceDiagram）
- Admonitions: 各章5個
- FAQ: 第1章5問、第2章5問、第3章6問
- 実践課題: 第2章4問、第3章3問
- "である調"統一

## 旧ファイルの削除
- `docs/docs/git/introduction.md` を削除済み（第1章に置き換え）
