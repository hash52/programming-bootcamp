// src/theme/Root.tsx
import React, { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

//FIXME: src/theme/Root.tsxで自動で全てのページに適用したいが、Providerの外でuseColorModeを呼べない
/** MUIコンポーネントをdocusaurusのダークテーマに適用する */
const MuiDarkThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Docusaurusのライト／ダーク状態を取得
  const { colorMode } = useColorMode();

  // MUIテーマを生成
  const muiTheme = useMemo(
    () => (colorMode === "dark" ? darkTheme : lightTheme),
    [colorMode]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      {/* MUIのリセットCSS */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiDarkThemeProvider;
