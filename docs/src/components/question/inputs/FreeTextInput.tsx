import React from "react";
import { TextField } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

interface FreeTextInputProps {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
}

export const FreeTextInput: React.FC<FreeTextInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { colorMode } = useColorMode();

  return (
    <TextField
      multiline
      rows={6}
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="あなたの解答を記述してください..."
      sx={{
        backgroundColor: colorMode === "dark" ? "#1e1e1e" : "#ffffff",
        mt: 2,
      }}
    />
  );
};
