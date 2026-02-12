import React from "react";
import { Box, Link } from "@mui/material";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";

interface ChapterLinkProps {
  category: string;
  topicId: string;
}

export const ChapterLink: React.FC<ChapterLinkProps> = ({
  category,
  topicId,
}) => {
  const chapterUrl = `/docs/${category}/${topicId}`;

  return (
    <Box mb={2}>
      <Link
        href={chapterUrl}
        underline="hover"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.875rem",
          color: "text.secondary",
        }}
      >
        <MenuBookOutlined sx={{ fontSize: "1rem" }} />
        この章の教材を見る
      </Link>
    </Box>
  );
};
