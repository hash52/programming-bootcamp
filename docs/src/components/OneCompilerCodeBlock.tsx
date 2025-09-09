// src/components/OneCompilerCodeBlock.tsx
import React, { useMemo } from "react";

type Language = "java" | "mysql" | "html";

/**
 * OneCompiler 埋め込みエディタ
 *
 * MDX や React ページ内で、指定した言語・コード・オプションで
 * OneCompiler エディタを iframe として表示できる。
 *
 * 参考: https://onecompiler.com/apis/embed-editor
 *
 * @example
 * <OneCompilerCodeBlock
 *   hideLanguageSelection
 *   codeId="43w72hmhr"
 *   language="java"
 *   theme="dark"
 * />
 */
type OneCompilerCodeBlockProps = {
  /** 実行するプログラムの言語 */
  language: Language;
  /** 埋め込み先のコードID */
  codeId: string;
  /** 実行するコード。検索対象とするため不可視で描画する  */
  code: string;
  /** 利用可能言語を制限するか */
  availableLanguages?: boolean;
  /** 言語選択ボタンを非表示にするか */
  hideLanguageSelection?: boolean;
  /** "New" ボタンを非表示にするか */
  hideNew?: boolean;
  /** "Run" ボタンを非表示にするか */
  hideRun?: boolean;
  /** 新規ファイルオプションを非表示にするか */
  hideNewFileOption?: boolean;
  /** コピー/貼り付けを無効化するか */
  disableCopyPaste?: boolean;
  /** コード自動補完を無効化するか */
  disableAutoComplete?: boolean;
  /** 標準入力欄を非表示にするか */
  hideStdin?: boolean;
  /** 結果欄（STDIN含む）を非表示にするか */
  hideResult?: boolean;
  /** タイトル（Code ID）を非表示にするか */
  hideTitle?: boolean;
  /** エディタテーマ ("dark" | "light") */
  theme?: "dark" | "light";
  /** エディタのフォントサイズ (8-32, default:14) */
  fontSize?: number;
  /** 親ページからのイベントを受信するか */
  listenToEvents?: boolean;
  /** コード変更イベントを親ページに送信するか */
  codeChangeEvent?: boolean;
  /** エディタオプションアイコンを非表示にするか */
  hideEditorOptions?: boolean;
  /** iframe の高さ */
  height?: string | number;
  /** iframe の幅 */
  width?: string | number;
  /** iframe の id 属性 */
  id?: string;
  /** iframe の style 属性 */
  style?: React.CSSProperties;
};

export const OneCompilerCodeBlock: React.FC<OneCompilerCodeBlockProps> = ({
  language,
  codeId,
  code,
  availableLanguages,
  hideLanguageSelection = true,
  hideNew = true,
  hideRun,
  hideNewFileOption = true,
  disableCopyPaste,
  disableAutoComplete = true,
  hideStdin = true,
  hideResult,
  hideTitle = true,
  theme,
  fontSize = 14,
  listenToEvents,
  codeChangeEvent,
  hideEditorOptions = false,
  height = "450px",
  width = "100%",
  id,
  style,
}) => {
  const params = new URLSearchParams();

  // テーマのデフォルト値を言語によって切り替え
  const themeDefault = useMemo(() => {
    // 明示的に指定されていればそれを使う
    if (theme) return theme;
    // HTML は dark のコードハイライトが微妙なため、light をデフォルトにする
    if (language === "html") return "light";
    // その他は dark をデフォルトにする
    return "dark";
  }, [theme, language]);
  params.set("theme", themeDefault);

  if (availableLanguages !== undefined)
    params.set("availableLanguages", String(availableLanguages));
  if (hideLanguageSelection !== undefined)
    params.set("hideLanguageSelection", String(hideLanguageSelection));
  if (hideNew !== undefined) params.set("hideNew", String(hideNew));
  if (hideRun !== undefined) params.set("hideRun", String(hideRun));
  if (hideNewFileOption !== undefined)
    params.set("hideNewFileOption", String(hideNewFileOption));
  if (disableCopyPaste !== undefined)
    params.set("disableCopyPaste", String(disableCopyPaste));
  if (disableAutoComplete !== undefined)
    params.set("disableAutoComplete", String(disableAutoComplete));
  if (hideStdin !== undefined) params.set("hideStdin", String(hideStdin));
  if (hideResult !== undefined) params.set("hideResult", String(hideResult));
  if (hideTitle !== undefined) params.set("hideTitle", String(hideTitle));
  if (fontSize) params.set("fontSize", fontSize.toString());
  if (listenToEvents !== undefined)
    params.set("listenToEvents", String(listenToEvents));
  if (codeChangeEvent !== undefined)
    params.set("codeChangeEvent", String(codeChangeEvent));
  if (hideEditorOptions !== undefined)
    params.set("hideEditorOptions", String(hideEditorOptions));

  let src = `https://onecompiler.com/embed/${language}/${codeId}`;

  const queryString = params.toString();
  if (queryString) src += `?${queryString}`;

  return (
    <>
      {/* 実行コードを検索対象とするため、HTMLに不可視で描画する  */}
      <span style={{ display: "none" }}>{code}</span>
      <iframe id={id} src={src} width={width} height={height} style={style} />
    </>
  );
};
