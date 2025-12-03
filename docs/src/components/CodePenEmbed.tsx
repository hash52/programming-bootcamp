// src/components/CodePenEmbed.tsx
import { useColorMode } from "@docusaurus/theme-common";
import React from "react";

/**
 * CodePen 埋め込みコンポーネント（iframe版）
 *
 * MDX や React ページ内で、CodePen のコンテンツをiframeで埋め込み表示できる。
 * 様々なオプションでカスタマイズ可能。
 *
 * @example
 * // 最小限の指定
 * <CodePenEmbed slugHash="ByKOEqx" />
 *
 * @example
 * // カスタマイズ例
 * <CodePenEmbed
 *   slugHash="ByKOEqx"
 *   defaultTab="css"
 *   showResult={false}
 *   editable={false}
 * />
 */
type CodePenEmbedProps = {
  /** CodePenのID（必須） */
  slugHash: string;
  /** CodePenのユーザー名（デフォルト: "hash52"） */
  user?: string;
  /** Penのタイトル（デフォルト: "Untitled"） */
  title?: string;
  /** デフォルトで開くタブ（デフォルト: "html"） */
  defaultTab?: "html" | "css" | "js";
  /** Resultタブを表示するか（デフォルト: true） */
  showResult?: boolean;
  /** コード編集可能か（デフォルト: true） */
  editable?: boolean;
  /** テーマ（デフォルト: Docusaurusのカラーモード） */
  theme?: "light" | "dark";
  /** iframe の高さ（デフォルト: "300"） */
  height?: string | number;
  /** iframe の幅（デフォルト: "100%"） */
  width?: string | number;
  /** iframe の style 属性 */
  style?: React.CSSProperties;
  /** HTMLソースコード（検索対象とするため不可視で描画） */
  htmlCode?: string;
  /** CSSソースコード（検索対象とするため不可視で描画） */
  cssCode?: string;
  /** JavaScriptソースコード（検索対象とするため不可視で描画） */
  jsCode?: string;
};

export const CodePenEmbed: React.FC<CodePenEmbedProps> = ({
  slugHash,
  user = "hash52",
  title = "Untitled",
  defaultTab = "html",
  showResult = true,
  editable = true,
  theme,
  height = "300",
  width = "100%",
  style,
  htmlCode,
  cssCode,
  jsCode,
}) => {
  const { colorMode } = useColorMode();

  // URL構築
  const defaultTabValue = showResult ? `${defaultTab},result` : defaultTab;
  const themeId = theme ?? colorMode;

  const params = new URLSearchParams();
  params.set("default-tab", defaultTabValue);
  params.set("theme-id", themeId);
  if (editable) {
    params.set("editable", "true");
  }

  const src = `https://codepen.io/${user}/embed/${slugHash}?${params.toString()}`;

  return (
    <>
      {/* ソースコードを検索対象とするため、HTMLに不可視で描画する */}
      {htmlCode && <span style={{ display: "none" }}>{htmlCode}</span>}
      {cssCode && <span style={{ display: "none" }}>{cssCode}</span>}
      {jsCode && <span style={{ display: "none" }}>{jsCode}</span>}

      <iframe
        key={themeId}
        height={height}
        style={{ width, ...style }}
        scrolling="no"
        title={title}
        src={src}
        frameBorder="no"
        loading="lazy"
        allowTransparency={true}
      >
        See the Pen <a href={`https://codepen.io/${user}/pen/${slugHash}`}>{title}</a> by{" "}
        {user} (<a href={`https://codepen.io/${user}`}>@{user}</a>) on{" "}
        <a href="https://codepen.io">CodePen</a>.
      </iframe>
    </>
  );
};
