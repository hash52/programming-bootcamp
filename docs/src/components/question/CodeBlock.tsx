import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
}

/**
 * BlankInput等を含むコードブロック風の表示用コンポーネント
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = "java" }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      sx={{
        fontFamily: "monospace",
        backgroundColor: colorMode === "dark" ? "#1e1e1e" : "#f5f5f5",
        color: colorMode === "dark" ? "#d4d4d4" : "#333333",
        padding: "16px",
        borderRadius: "4px",
        fontSize: "14px",
        border: colorMode === "dark" ? "1px solid #3e3e3e" : "1px solid #e0e0e0",
        lineHeight: "1.6",
        position: "relative",
        "&::before": {
          content: `"${language}"`,
          position: "absolute",
          top: "4px",
          right: "8px",
          fontSize: "11px",
          color: colorMode === "dark" ? "#858585" : "#999999",
          textTransform: "uppercase",
        },
      }}
    >
      {children}
    </Box>
  );
};
