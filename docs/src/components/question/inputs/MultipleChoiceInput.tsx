import React from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from "@mui/material";
import { Choice } from "@site/src/types/question";

interface MultipleChoiceInputProps {
  choices: Choice[];
  multipleSelect: boolean;
  value: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  choices,
  multipleSelect,
  value,
  onChange,
  disabled = false,
}) => {
  if (multipleSelect) {
    return (
      <FormControl component="fieldset" disabled={disabled}>
        <FormGroup>
          {choices.map((choice) => (
            <FormControlLabel
              key={choice.id}
              control={
                <Checkbox
                  checked={value.includes(choice.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...value, choice.id]);
                    } else {
                      onChange(value.filter((id) => id !== choice.id));
                    }
                  }}
                />
              }
              label={`${choice.id}. ${choice.text}`}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  }

  return (
    <FormControl component="fieldset" disabled={disabled}>
      <RadioGroup
        value={value[0] || ""}
        onChange={(e) => onChange([e.target.value])}
      >
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id}
            control={<Radio />}
            label={`${choice.id}. ${choice.text}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
