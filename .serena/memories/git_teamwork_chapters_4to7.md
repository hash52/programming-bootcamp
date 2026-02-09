# Git教材 第4〜7章（再構成版）

## 作成日
2026-02-09

## 再構成の概要
- 旧構成: git/basics(3章) + git/teamwork(未作成3章)
- 新構成: git/basics(4章, ラベル「入門」) + git/teamwork(3章, ラベル「チーム開発」)
- 第4章をgit/basicsに移動、旧第6章をPR章とIssue章に分割

## ファイル一覧
| 章 | ファイル | タイトル | カテゴリ |
|----|---------|---------|---------|
| 第4章 | `docs/docs/git/basics/04_undo_restore.mdx` | 変更の取り消しとバージョンの復元 | git/basics |
| 第5章 | `docs/docs/git/teamwork/05_branch_merge.mdx` | ブランチとマージ | git/teamwork |
| 第6章 | `docs/docs/git/teamwork/06_pull_request.mdx` | プルリクエストとコードレビュー | git/teamwork |
| 第7章 | `docs/docs/git/teamwork/07_issue_team_practice.mdx` | Issueとチーム開発実践 | git/teamwork |

## カテゴリ変更
- git/basics ラベル: "基礎" → "入門"
- git/teamwork ラベル: "チーム開発" (変更なし)
- structure.ts のラベルも "Git - 基礎" → "Git - 入門" に変更

## 既存ファイルの修正
- `01_version_control.mdx` 行231: 「第6章「チーム開発ワークフロー」」→「第6章・第7章」
- `03_github_remote.mdx` 行233: 「第6章で詳しく学ぶ」→「第5章で詳しく学ぶ」
- `03_github_remote.mdx` 次のステップ: Day 20再開 → 次の章で学ぶ

## structure.ts Topic定義
- `04_undo_restore` (6問: KNOW×1, WRITE×5) - git/basics
- `05_branch_merge` (7問: KNOW×2, WRITE×5) - git/teamwork
- `06_pull_request` (6問: KNOW×1, WRITE×5) - git/teamwork
- `07_issue_team_practice` (6問: KNOW×2, WRITE×4) - git/teamwork

## 教材の特徴
- import文なし（OneCompilerCodeBlock不使用）
- Mermaid図: 各章2〜4個（graph TD, gitGraph, sequenceDiagram等）
- Admonitions: 各章4〜5個
- FAQ: 各章5問
- 実践課題: 第4章4問、第5章4問、第6章3問、第7章4問（ペアワーク形式）
- "である調"統一
- コラム: 第4章にgit resetコラム
