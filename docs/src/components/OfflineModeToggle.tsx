import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useOfflineMode } from "../contexts/OfflineModeContext";

export default function OfflineModeToggle() {
  const { isOffline, toggleOffline } = useOfflineMode();
  const { colorMode } = useColorMode();

  const color = colorMode === "dark" ? "#fff" : "#1c1e21";
  const label = isOffline
    ? "オンラインモードに切り替え"
    : "オフラインモードに切り替え";

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleOffline}
        aria-label={label}
        size="small"
        sx={{ color, mx: 0.5 }}
      >
        {isOffline ? (
          <CloudOffIcon fontSize="small" />
        ) : (
          <CloudQueueIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
