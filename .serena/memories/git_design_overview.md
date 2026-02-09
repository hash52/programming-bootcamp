# Git教材設計書 概要

## ファイル
- `knowledge/syllabi/git-design.md` （2026-02-08作成）

## 全6章構成
| 章 | タイトル | Day | カテゴリ |
|----|---------|-----|----------|
| 第1章 | バージョン管理とGit | 7 | git/basics |
| 第2章 | Gitの基本操作 | 7 | git/basics |
| 第3章 | GitHubとリモート操作 | 7 | git/basics |
| 第4章 | 変更の取り消しとバージョンの復元 | 20 | git/teamwork |
| 第5章 | ブランチとマージ | 20 | git/teamwork |
| 第6章 | チーム開発ワークフロー | 20 | git/teamwork |

## カテゴリ
- `git/basics`: 第1-3章（Day 7）
- `git/teamwork`: 第4-6章（Day 20）

## MDXパス
- git/basics/version-control.mdx（第1章）
- git/basics/git-basics.mdx（第2章）
- git/basics/github-remote.mdx（第3章）
- git/teamwork/undo-restore.mdx（第4章）
- git/teamwork/branch-merge.mdx（第5章）
- git/teamwork/team-workflow.mdx（第6章）

## 設計方針
- ターミナル中心、IDE操作はコラムで補足
- git restore / git revert 中心（git resetはコラムで紹介のみ）
- GitHub接続: HTTPS + Personal Access Token
- DB設計書（db-design.md）のフォーマットに完全準拠
- structure.tsのALL_CATEGORIESにgit/basics, git/teamworkを追加予定

## structure.ts Topic変数名
- gitIntroTopic（第1章）
- gitBasicsTopic（第2章）
- gitRemoteTopic（第3章）
- gitUndoTopic（第4章）
- gitBranchTopic（第5章）
- gitTeamworkTopic（第6章）

## コラム
1. git reset（3モードの概要紹介のみ）
2. git stash（作業の一時退避）
3. git cherry-pick（特定コミットの取り込み）
4. git rebase（履歴整理、ブートキャンプでは不使用）
5. git tag（バージョン名付け）
6. IDEでのGit操作（IntelliJ IDEA等）
