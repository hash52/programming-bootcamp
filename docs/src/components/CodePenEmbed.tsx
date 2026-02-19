// src/components/CodePenEmbed.tsx
import { useColorMode } from "@docusaurus/theme-common";
import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useOfflineMode } from "../contexts/OfflineModeContext";

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
  /** オフラインモードを個別に指定（グローバル設定を上書き） */
  offline?: boolean;
};

type TabInfo = {
  key: "html" | "css" | "js";
  label: string;
  code: string;
  language: string;
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
  offline,
}) => {
  const { colorMode } = useColorMode();
  const { isOffline: globalOffline } = useOfflineMode();

  const effectiveOffline = offline ?? globalOffline;

  const tabs: TabInfo[] = [];
  if (htmlCode) tabs.push({ key: "html", label: "HTML", code: htmlCode, language: "html" });
  if (cssCode) tabs.push({ key: "css", label: "CSS", code: cssCode, language: "css" });
  if (jsCode) tabs.push({ key: "js", label: "JS", code: jsCode, language: "javascript" });

  const initialTab = tabs.find((t) => t.key === defaultTab)?.key ?? tabs[0]?.key ?? "html";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  if (effectiveOffline && tabs.length > 0) {
    const highlightTheme = colorMode === "dark" ? themes.dracula : themes.github;
    const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0];

    const isDark = colorMode === "dark";
    const tabBg = isDark ? "#2d2d2d" : "#f0f0f0";
    const tabActiveBg = isDark ? "#1e1e1e" : "#ffffff";
    const tabColor = isDark ? "#e0e0e0" : "#333333";
    const tabActiveColor = isDark ? "#ffffff" : "#000000";
    const borderColor = isDark ? "#444444" : "#cccccc";

    return (
      <>
        {htmlCode && <span style={{ display: "none" }}>{htmlCode}</span>}
        {cssCode && <span style={{ display: "none" }}>{cssCode}</span>}
        {jsCode && <span style={{ display: "none" }}>{jsCode}</span>}

        <div
          style={{
            border: `1px solid ${borderColor}`,
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "1.5em",
          }}
        >
          {tabs.length > 1 && (
            <div
              style={{
                display: "flex",
                backgroundColor: tabBg,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "6px 16px",
                    border: "none",
                    borderBottom:
                      activeTab === tab.key
                        ? `2px solid ${isDark ? "#58a6ff" : "#0969da"}`
                        : "2px solid transparent",
                    backgroundColor:
                      activeTab === tab.key ? tabActiveBg : "transparent",
                    color: activeTab === tab.key ? tabActiveColor : tabColor,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    fontFamily: "inherit",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <Highlight
            code={currentTab.code}
            language={currentTab.language}
            theme={highlightTheme}
          >
            {({ className, style: hlStyle, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={className}
                style={{
                  ...hlStyle,
                  padding: "1em",
                  overflowY: "auto",
                  maxHeight: typeof height === "number" ? `${height}px` : height,
                  backgroundColor: highlightTheme.plain.backgroundColor,
                  color: highlightTheme.plain.color,
                  margin: 0,
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "3em",
                        textAlign: "right",
                        paddingRight: "1em",
                        userSelect: "none",
                        opacity: 0.5,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </>
    );
  }

  // オンライン時: 既存の iframe 表示
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
