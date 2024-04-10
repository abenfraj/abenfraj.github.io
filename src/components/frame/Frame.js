import React from "react";
import { Paper } from "@mui/material";

const Frame = ({ children, sx }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "10px",
        border: "3px solid #3689B8",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default Frame;
