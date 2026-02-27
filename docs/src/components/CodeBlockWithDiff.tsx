import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";

/**
 * 差分行の種類を表す型。
 * - `"added"`: 追加された行（+）
 * - `"removed"`: 削除された行（-）
 * - `"context"`: 変更されていない文脈行
 */
type DiffLineType = "added" | "removed" | "context";

/**
 * 差分1行を表すデータ型。
 */
interface DiffLine {
  type: DiffLineType;
  text: string;
}

/**
 * コンポーネントのProps型。
 */
interface DiffCodeBlockProps {
  /**
   * 差分を含むコード文字列。
   * 行頭の `+` や `-` が差分行として解釈される。
   *
   * FIXME: テンプレートリテラル内で `${}` を使うとDocusaurusのMDXパーサーが誤動作するため、`$` を `\$` のようにエスケープする必要がある。
   */
  code: string;

  /**
   * ハイライトする言語名（Prismの言語キー）。
   * デフォルトは `"java"`。
   */
  language?: string;

  /**
   * 行番号の開始位置。
   * 例: 42 を指定すると、42行目からカウントされる。
   * 省略時は1から開始する。
   */
  startLineNumber?: number;

  /**
   * 行番号を表示するかどうか。
   * false の場合、行番号を非表示にする。
   * デフォルトは true。
   */
  showLineNumbers?: boolean;

  /**
   * ファイル名タイトルバーに表示するタイトル。
   * 省略時はタイトルバーを表示しない。
   * 例: "src/main/java/com/example/ecsample/controller/HomeController.java"
   */
  title?: string;
}

/**
 * Diff風に表示するコードブロック。
 *
 * - 行頭の `+` / `-` を見た目だけで表示し、コピー時には含めない。
 * - Prismによる構文ハイライトを適用する。
 * - 追加行は薄緑背景 + 左ボーダー + 緑の`+`、削除行は薄赤背景 + 左ボーダー + 赤の`-`で表示。
 * - added / context のみ行番号を表示し、removed は空白表示。
 * - `title` prop 指定時はタイトルバーを表示する（TeachingCodeBlockと統一デザイン）。
 * - コピー時は `+`行と`context`行のみコピーされ、`-`行は除外される。
 */
export const CodeBlockWithDiff: React.FC<DiffCodeBlockProps> = ({
  code,
  language = "java",
  startLineNumber = 1,
  showLineNumbers = true,
  title,
}) => {
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? themes.dracula : themes.github;

  const isDark = colorMode === "dark";

  // 改行コードを正規化して行ごとに分割
  const rawLines = code.replace(/\r\n/g, "\n").split("\n");

  // 先頭・末尾の空行を除去（テンプレートリテラルの余白を吸収）
  const trimmedLines = rawLines
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "")
    .split("\n");

  // 各行を差分として解析
  const parsed: DiffLine[] = trimmedLines.map((line) => {
    if (line.startsWith("+")) return { type: "added", text: line.slice(1) };
    if (line.startsWith("-")) return { type: "removed", text: line.slice(1) };
    return { type: "context", text: line };
  });

  // Prismに渡す純粋なコード（+/-除去済み）
  const pureCode = parsed.map((l) => l.text).join("\n");

  // コピー用コード（added + context のみ）
  const copyCode = parsed
    .filter((l) => l.type !== "removed")
    .map((l) => l.text)
    .join("\n");

  // 行番号カウンタ（added/context のみ増加）
  let currentLineNumber = startLineNumber;

  // スタイル定義
  const styles = {
    wrapper: {
      marginBottom: "1em",
      borderRadius: "6px",
      overflow: "hidden",
      border: isDark ? "1px solid #444" : "1px solid #d0d7de",
    } as React.CSSProperties,

    titleBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 12px",
      backgroundColor: isDark ? "#2d2d2d" : "#f6f8fa",
      borderBottom: isDark ? "1px solid #444" : "1px solid #d0d7de",
      fontSize: "0.82em",
      fontFamily: "monospace",
    } as React.CSSProperties,

    titleLeft: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: isDark ? "#cdd9e5" : "#57606a",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    } as React.CSSProperties,

    legend: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0,
      fontSize: "0.9em",
    } as React.CSSProperties,

    legendAdded: {
      color: isDark ? "#56d364" : "#1a7f37",
      fontWeight: "bold" as const,
    } as React.CSSProperties,

    legendRemoved: {
      color: isDark ? "#ff7b72" : "#cf222e",
      fontWeight: "bold" as const,
    } as React.CSSProperties,

    pre: {
      ...theme.plain,
      padding: "0",
      margin: "0",
      overflowX: "auto" as const,
      backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
      fontSize: "0.9em",
      lineHeight: "1.5",
    } as React.CSSProperties,

    lineAdded: {
      display: "grid",
      gridTemplateColumns: "15px 40px 1fr",
      backgroundColor: isDark ? "rgba(46,160,67,0.15)" : "rgba(46,160,67,0.08)",
      borderLeft: isDark ? "3px solid #56d364" : "3px solid #2da44e",
    } as React.CSSProperties,

    lineRemoved: {
      display: "grid",
      gridTemplateColumns: "15px 40px 1fr",
      backgroundColor: isDark ? "rgba(248,81,73,0.15)" : "rgba(255,129,130,0.1)",
      borderLeft: isDark ? "3px solid #ff7b72" : "3px solid #cf222e",
    } as React.CSSProperties,

    lineContext: {
      display: "grid",
      gridTemplateColumns: "15px 40px 1fr",
      borderLeft: "3px solid transparent",
    } as React.CSSProperties,

    markerAdded: {
      color: isDark ? "#56d364" : "#1a7f37",
      fontWeight: "bold" as const,
      userSelect: "none" as const,
      paddingLeft: "3px",
      fontSize: "0.95em",
    } as React.CSSProperties,

    markerRemoved: {
      color: isDark ? "#ff7b72" : "#cf222e",
      fontWeight: "bold" as const,
      userSelect: "none" as const,
      paddingLeft: "3px",
      fontSize: "0.95em",
    } as React.CSSProperties,

    markerContext: {
      color: "transparent",
      userSelect: "none" as const,
      paddingLeft: "3px",
    } as React.CSSProperties,

    lineNumber: {
      textAlign: "right" as const,
      paddingRight: "8px",
      userSelect: "none" as const,
      color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
      fontSize: "0.85em",
    } as React.CSSProperties,

    codeContent: {
      paddingRight: "12px",
      paddingLeft: "4px",
      whiteSpace: "pre" as const,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.wrapper}>
      {/* タイトルバー */}
      <div style={styles.titleBar}>
        <span style={styles.titleLeft}>
          <span>📄</span>
          <span>{title || ""}</span>
        </span>
        <span style={styles.legend}>
          <span style={styles.legendAdded}>+ 追加</span>
          <span style={styles.legendRemoved}>- 削除</span>
        </span>
      </div>

      <Highlight code={pureCode} language={language} theme={theme}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={styles.pre}>
            {tokens.map((line, i) => {
              const { type } = parsed[i];

              // 行番号の計算（added/context のみ増加、removed は空白）
              const lineNum =
                type === "removed" ? "" : String(currentLineNumber++);

              const lineStyle =
                type === "added"
                  ? styles.lineAdded
                  : type === "removed"
                  ? styles.lineRemoved
                  : styles.lineContext;

              const markerStyle =
                type === "added"
                  ? styles.markerAdded
                  : type === "removed"
                  ? styles.markerRemoved
                  : styles.markerContext;

              const marker =
                type === "added" ? "+" : type === "removed" ? "-" : " ";

              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  style={lineStyle}
                >
                  {/* マーカー列（+/-/空白）*/}
                  <span style={markerStyle} aria-hidden="true">
                    {marker}
                  </span>

                  {/* 行番号列 */}
                  {showLineNumbers && (
                    <span style={styles.lineNumber} aria-hidden="true">
                      {lineNum}
                    </span>
                  )}

                  {/* コード列（Prismトークン） */}
                  <span style={styles.codeContent}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
