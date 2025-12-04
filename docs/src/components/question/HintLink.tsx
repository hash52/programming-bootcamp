import React from "react";
import { Box, Link, Typography } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

interface HintLinkProps {
  category: string;
  topicId: string;
}

export const HintLink: React.FC<HintLinkProps> = ({ category, topicId }) => {
  const chapterUrl = `/docs/${category}/${topicId}`;

  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <LightbulbIcon color="warning" fontSize="small" />
      <Typography variant="body2">
        ヒント:{" "}
        <Link href={chapterUrl} underline="hover">
          この章を復習する
        </Link>
      </Typography>
    </Box>
  );
};
