import React, { useState } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import LocalStorageExportDialog from "./LocalStorageExportDialog";

export default function LocalStorageExportButton() {
  const { colorMode } = useColorMode();
  const [open, setOpen] = useState(false);

  const color = colorMode === "dark" ? "#fff" : "#1c1e21";
  const label = "学習データをJSONでダウンロード";

  return (
    <>
      <Tooltip title={label}>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label={label}
          size="small"
          sx={{ color, mx: 0.5 }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <LocalStorageExportDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
