import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { decodeShareData } from "@site/src/lib/dojoShare";

interface DojoImportPanelProps {
  onImport: (questionIds: string[]) => void;
}

export const DojoImportPanel: React.FC<DojoImportPanelProps> = ({
  onImport,
}) => {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setError("テキストを入力してください");
      return;
    }

    const result = decodeShareData(trimmed);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    setError(null);
    onImport(result.questionIds);
  };

  return (
    <Accordion sx={{ mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <FileUploadIcon fontSize="small" color="action" />
          <Typography fontWeight={500}>
            共有された問題セットを読み込む
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" mb={1}>
          共有されたJSON文字列を貼り付けてください。
        </Typography>
        <TextField
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          placeholder='{"v":1,"ids":[0,1,2,15,20]}'
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setError(null);
          }}
          sx={{ mb: 1 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!inputText.trim()}
        >
          読み込む
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};
