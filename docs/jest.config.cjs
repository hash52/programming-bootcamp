/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // テスト対象ディレクトリ
  roots: ["<rootDir>/src"],

  // tsx, ts 対応
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  // jest-dom 等のセットアップ
  setupFilesAfterEnv: ["@testing-library/jest-dom"],

  // エイリアス解決（@site/src/... → src/...）
  moduleNameMapper: {
    "^@site/(.*)$": "<rootDir>/src/$1", //FIXME: おそらく効いていない。@site/src/...のimportは相対パスに変更して対応中
  },

  // テストファイルのみ対象
  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],

  // jsdomを使う場合に有効（React 19 対応）
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
