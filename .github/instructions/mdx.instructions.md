---
applyTo: "**/*.mdx"
---
# MDXファイル編集ガイド

MDXファイルを編集する前に、以下のドキュメントを参照すること:

- `knowledge/guides/mdx-syntax.md` - MDX構文ルール
- `knowledge/guides/writing-style.md` - 文体・表記ルール

---

## クイックリファレンス

### import文

```typescript
import { OneCompilerCodeBlock } from "@site/src/components/OneCompilerCodeBlock";
import { CodePenEmbed } from "@site/src/components/CodePenEmbed";
```

必ずファイル先頭に配置。

### 改行

改行したい箇所の末尾に **半角スペース2つ** を入れる。

```markdown
1行目の文章。  
2行目の文章。
```

### 強調記号

`**` の前後に **半角スペース** を入れる。

```markdown
これは **重要** である。
```

### 表内の特殊文字

`|` や `&&` などはバッククォートで囲む。

```markdown
| 演算子 | 意味 |
|--------|------|
| `||` | OR |
| `&&` | AND |
```

### 比較演算子

`<` や `>` はバッククォートで囲むか、エスケープする。

```markdown
比較演算子（`<`, `>`, `<=`, `>=`）
```

---

## 詳細ルール

詳細は `knowledge/guides/mdx-syntax.md` を参照。
