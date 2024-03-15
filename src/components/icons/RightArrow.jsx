import React from "react";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";
import { IconButton, useTheme } from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';

const RightArrow = ({ onClick,leftArrow }) => {
  const theme = useTheme();
  return (
    <IconButton
      aria-label="rightArrow"
      color={theme.palette.primary.main}
      sx={{ border: `solid 2.5px ${theme.palette.primary.main}`,color: theme.palette.primary.main}}
      onClick={onClick}
    >
      {leftArrow ? (
        <ForwardIcon sx={{ fontSize: 20,transform: "rotate(180deg)" }} />
      ) : (
        <ForwardIcon sx={{ fontSize: 20 }} />
      )}
    </IconButton>
  );
};

export default RightArrow;
