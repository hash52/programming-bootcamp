# Copilot → Claude Code 引き継ぎ

現在の作業状況を引き継ぎファイルとして保存し、Claude Codeに作業を引き継ぐ。

## 手順

1. 現在の作業から以下を整理:
   - 元のタスク内容
   - 完了した作業（チェックリスト形式）
   - 未完了の作業（チェックリスト形式）
   - 変更したファイル
   - 次にやるべきこと
   - 注意点

2. `.handoff/handoff-{YYYYMMDD-HHMMSS}.md` に以下のフォーマットで保存:

```markdown
# Agent Handoff

## メタ情報
- **引き継ぎ元**: GitHub Copilot Agent
- **日時**: YYYY-MM-DD HH:MM:SS
- **引き継ぎ先**: Claude Code

## 元のタスク
[ユーザーからの元の依頼内容]

## 完了した作業
- [x] 作業1
- [x] 作業2

## 未完了の作業
- [ ] 残りの作業1
- [ ] 残りの作業2

## 現在の状態
[変更したファイル、現在のコード状態]

## 次にやるべきこと
[引き継ぎ先に期待する具体的な作業]

## 関連ファイル
- path/to/file1
- path/to/file2

## 備考・注意点
[引き継ぎ先に知っておいてほしいこと]
```

3. 変更をコミット:
```bash
git add .handoff/
git commit -m "chore: handoff to Claude Code"
```

4. 引き継ぎ完了メッセージを表示:
```
✅ 引き継ぎファイルを作成しました: .handoff/handoff-{timestamp}.md
💡 Claude Codeで作業を続ける場合は、このファイルを参照してください。
```
