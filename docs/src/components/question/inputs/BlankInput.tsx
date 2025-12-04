import React from "react";
import { TextField } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

interface BlankInputProps {
  id: string;
  value?: string;
  onChange?: (id: string, value: string) => void;
  isCorrect?: boolean;
  disabled?: boolean;
}

export const BlankInput: React.FC<BlankInputProps> = ({
  id,
  value = "",
  onChange,
  isCorrect,
  disabled = false,
}) => {
  const { colorMode } = useColorMode();

  const getBorderColor = () => {
    if (isCorrect === undefined) return undefined;
    return isCorrect ? "success.main" : "error.main";
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      value={value}
      onChange={(e) => onChange?.(id, e.target.value)}
      disabled={disabled}
      sx={{
        width: "150px",
        display: "inline-flex",
        verticalAlign: "middle",
        mx: 0.5,
        backgroundColor: colorMode === "dark" ? "#1e1e1e" : "#ffffff",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: getBorderColor(),
          },
        },
      }}
    />
  );
};
