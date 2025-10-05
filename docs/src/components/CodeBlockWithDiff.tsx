import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";

/**
 * 差分行の種類を表す型。
 * - `"added"`: 追加された行（+）
 * - `"removed"`: 削除された行（-）
 * - `"context"`: 変更されていない文脈行
 */
export type DiffLineType = "added" | "removed" | "context";

/**
 * 差分1行を表すデータ型。
 */
export interface DiffLine {
  /**
   * 行の種類。
   * - 追加/削除/文脈 のいずれか
   */
  type: DiffLineType;

  /**
   * 行の本文（先頭の + / - を除いたコード本体）
   */
  text: string;
}

/**
 * コンポーネントのProps型。
 */
export interface DiffCodeBlockProps {
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
}

/**
 * Diff風に表示するコードブロック。
 *
 * - 行頭の `+` / `-` を見た目だけで表示し、コピー時には含めない。
 * - Prismによる構文ハイライトを適用する。
 * - 追加行は緑背景、削除行は赤背景で表示。
 * - added / context のみ行番号を表示し、removed は非表示。
 * - 行番号の開始位置は props で指定可能。
 *
 * @example
 * ```tsx
 * <DiffCodeBlock
 *   code={`- return "Hello, " + name;
 * + var safe = (name == null ? "World" : name);
 * + return "Hello, " + safe + "!";`}
 *   language="java"
 *   startLineNumber={42}
 * />
 * ```
 */
export const CodeBlockWithDiff: React.FC<DiffCodeBlockProps> = ({
  code,
  language = "java",
  startLineNumber = 1, // 行番号の開始位置（デフォルトは1）
}) => {
  // Docusaurusのカラーモード（light/dark）を取得
  const { colorMode } = useColorMode();

  // カラーモードに応じてテーマを切り替える
  const theme = colorMode === "dark" ? themes.dracula : themes.github;

  // 改行コードを正規化して行ごとに分割
  const lines = code.replace(/\r\n/g, "\n").split("\n");

  // 各行を差分として解析（+/-を除去して型付きの配列に変換）
  const parsed: DiffLine[] = lines.map((line) => {
    if (line.startsWith("+")) return { type: "added", text: line.slice(1) };
    if (line.startsWith("-")) return { type: "removed", text: line.slice(1) };
    return { type: "context", text: line };
  });

  // Prismに渡す純粋なコード（+/-除去済み）
  const pureCode = parsed.map((l) => l.text).join("\n");

  // 現在の行番号カウンタ（added/context のみ増加）
  let currentLineNumber = startLineNumber;

  // TODO: 前後のコードブロックの表示、かつ折りたたみ可能な別コンポーネントの実装。文字サイズも変えられるといいかも
  return (
    <Highlight code={pureCode} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "1em",
            overflowX: "auto",
            backgroundColor: theme.plain.backgroundColor,
            color: theme.plain.color,
          }}
        >
          {tokens.map((line, i) => {
            const { type } = parsed[i];

            // removed / context のみ行番号を表示する
            const showLineNumber = type === "removed" || type === "context";

            // 表示する行番号を決定（removed行では空白のまま）
            const lineNumber = showLineNumber ? currentLineNumber++ : "";

            return (
              <div
                key={i}
                {...getLineProps({ line })}
                style={{
                  display: "flex",
                  background:
                    type === "added"
                      ? "rgba(0,255,0,0.08)" // 追加行: 薄い緑
                      : type === "removed"
                      ? "rgba(255,0,0,0.08)" // 削除行: 薄い赤
                      : undefined,
                }}
              >
                {/* 差分記号 (+/-/空白) を見た目だけで表示。コピー対象には含めない */}
                <span
                  style={{
                    width: "1em",
                    userSelect: "none",
                    color:
                      type === "added"
                        ? "green"
                        : type === "removed"
                        ? "red"
                        : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {type === "added" ? "+" : type === "removed" ? "-" : " "}
                </span>

                {/* 行番号（removed / context のみ表示） */}
                <span
                  style={{
                    width: "3em",
                    textAlign: "right",
                    paddingRight: "0.5em",
                    userSelect: "none",
                    opacity: showLineNumber ? 0.5 : 0, // removed行は透明化
                    color:
                      colorMode === "dark"
                        ? "rgba(255,255,255,0.5)" // ダークモード: 明るい半透明
                        : "rgba(0,0,0,0.5)", // ライトモード: 暗い半透明
                  }}
                  aria-hidden="true"
                >
                  {lineNumber}
                </span>

                {/* Prismでハイライトされたコードトークン群 */}
                <span style={{ flex: 1 }}>
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
  );
};
