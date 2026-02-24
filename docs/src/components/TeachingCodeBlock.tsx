import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "../css/TeachingCodeBlock.module.css";

/**
 * 授業・自習向けのコードブロックコンポーネント。
 *
 * - Prismによるシンタックスハイライト
 * - Light/Darkモード自動切替（DocusaurusのuseColorMode使用）
 * - 行番号表示（デフォルトON）
 * - 行ハイライト（highlightLinesで指定した行を黄背景で強調）
 * - VS Code風タイトルバー（titleが指定された場合のみ表示）
 *
 * @example
 * ```tsx
 * <TeachingCodeBlock
 *   code={`@Controller
 * public class SampleController {
 *     @GetMapping("/welcome")
 *     public String welcome() {
 *         return "greet";
 *     }
 * }`}
 *   title="SampleController.java"
 *   highlightLines={[3]}
 * />
 * ```
 */
export interface TeachingCodeBlockProps {
  /**
   * 表示するコード文字列。
   *
   * FIXME: テンプレートリテラル内で `${}` を使うとDocusaurusのMDXパーサーが誤動作するため、
   * `$` を `\$` のようにエスケープする必要がある。
   */
  code: string;

  /**
   * シンタックスハイライトの言語名（Prismの言語キー）。
   * デフォルトは `"java"`。
   */
  language?: string;

  /**
   * ヘッダーに表示するファイル名。
   * 指定した場合のみタイトルバーを表示する。
   * 例: `"SampleController.java"`
   */
  title?: string;

  /**
   * ハイライトする行番号の配列（1-indexed）。
   * 例: `[3, 5]` を指定すると3行目と5行目が黄背景でハイライトされる。
   */
  highlightLines?: number[];

  /**
   * 行番号を表示するかどうか。デフォルトは `true`。
   */
  showLineNumbers?: boolean;

  /**
   * 行番号の開始値。デフォルトは `1`。
   * 例: `10` を指定すると10行目から番号が始まる。
   */
  startLineNumber?: number;
}

export const TeachingCodeBlock: React.FC<TeachingCodeBlockProps> = ({
  code,
  language = "java",
  title,
  highlightLines = [],
  showLineNumbers = true,
  startLineNumber = 1,
}) => {
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? themes.dracula : themes.github;

  // highlightLinesをSetに変換して高速検索できるようにする
  const highlightSet = new Set(highlightLines);

  // 改行コードを正規化
  const normalizedCode = code.replace(/\r\n/g, "\n");

  return (
    <div className={styles.wrapper}>
      {/* タイトルバー（titleが指定された場合のみ表示） */}
      {title && (
        <div className={styles.titleBar}>
          <span className={styles.titleFileName}>{title}</span>
          <span className={styles.titleLang}>{language}</span>
        </div>
      )}

      <div className={styles.codeContainer}>
        <Highlight code={normalizedCode} language={language} theme={theme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} ${styles.pre}`}
              style={{
                ...style,
                backgroundColor: theme.plain.backgroundColor,
                color: theme.plain.color,
              }}
            >
              {tokens.map((line, i) => {
                const lineNumber = startLineNumber + i;
                const isHighlighted = highlightSet.has(lineNumber);

                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className={`${styles.line} ${
                      isHighlighted ? styles.lineHighlighted : styles.lineNormal
                    }`}
                  >
                    {/* 行番号 */}
                    {showLineNumbers && (
                      <span
                        className={styles.lineNumber}
                        aria-hidden="true"
                      >
                        {lineNumber}
                      </span>
                    )}

                    {/* コードトークン */}
                    <span className={styles.codeContent}>
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
    </div>
  );
};
