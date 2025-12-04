import React from "react";
import { TextField } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import { useBlankInput } from "@site/src/contexts/BlankInputContext";

interface BlankInputProps {
  id: string;
}

export const BlankInput: React.FC<BlankInputProps> = ({ id }) => {
  const { colorMode } = useColorMode();
  const { blanks, updateBlank, blankCorrectness } = useBlankInput();

  const value = blanks[id] || "";
  const isCorrect = blankCorrectness[id];

  const getBorderColor = () => {
    if (isCorrect === undefined) return undefined;
    return isCorrect ? "success.main" : "error.main";
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      value={value}
      onChange={(e) => updateBlank(id, e.target.value)}
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
