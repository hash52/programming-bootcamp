import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";

interface AchievementCheckboxProps {
  questionId: string;
}

export const AchievementCheckbox: React.FC<AchievementCheckboxProps> = ({
  questionId,
}) => {
  const { progress, updateProgress } = useStoredProgress();
  const isChecked = !!progress[questionId];

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            // updateProgress は既にトグル機能を持っている（checked: boolean を第2引数で受け取る）
            updateProgress(questionId, e.target.checked);
          }}
        />
      }
      label={
        <Typography variant="body2">
          {isChecked ? "✅ 達成済み" : "この問題を達成済みにする"}
        </Typography>
      }
    />
  );
};
