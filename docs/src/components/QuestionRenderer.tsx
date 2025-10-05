import React, { useEffect } from "react";

// require.contextで src/questions 以下の .mdx をすべてインポート対象にする
// 第1引数: ディレクトリパス
// 第2引数: サブディレクトリ探索するか → true に変更してネストされたフォルダを探索
// 第3引数: マッチするファイル拡張子
// @ts-expect-error: Webpackのrequire.contextをTypeScriptが認識しない
const context = require.context("../questions", true, /\.mdx$/); // ★ 第2引数を true に変更

/**
 * questionId から対応する MDX をレンダリング
 * mdx ファイルは src/questions/{category}/{topic}/{file}.mdx として配置すること
 *
 * 例:
 *  id = "java/basics/if#q1"
 *  → src/questions/java/basics/if/q1.mdx を参照
 */
export const QuestionRenderer: React.FC<{ id: string }> = ({ id }) => {
  // id = "java/basics/if#q1" のような形式を前提に扱う

  // ★ "#" より前をディレクトリ、後ろをファイル名として扱う
  const [dirPath, fileNamePart] = id.split("#");

  // 例: dirPath = "java/basics/if", fileNamePart = "q1"
  // 実際のファイルパスは src/questions/java/basics/if/q1.mdx
  const filePath = `./${dirPath}/${fileNamePart}.mdx`;

  // require.context のキーに存在するか確認して読み込み
  const Module = context.keys().includes(filePath)
    ? context(filePath).default
    : null;

  // ---------------------------
  // 🔽 初回アクセス時にも #q1 にスクロールさせる処理
  // ---------------------------
  useEffect(() => {
    // URL のフラグメントIDを取得して、該当する要素にスクロール
    const hash = window.location.hash.replace("#", "");
    if (hash === fileNamePart) {
      // MDX描画が完了した後にスクロール
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [fileNamePart]);

  if (!Module) {
    return (
      <p style={{ color: "red" }}>
        ❌ 問題ファイルが見つかりません: {id}
        <br />
        <small>期待されるパス: {filePath}</small>
      </p>
    );
  }

  /**
   * フラグメントID（#q1 など）でのスクロールを可能にするため、
   * 描画ルート要素に id 属性を付与する
   */
  return (
    <div id={fileNamePart}>
      <Module />
    </div>
  );
};
