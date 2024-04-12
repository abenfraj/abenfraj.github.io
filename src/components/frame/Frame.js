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
        "&::-webkit-scrollbar": {
          width: "8px", // Scrollbar width
          backgroundColor: "rgba(0,0,0,0.1)", // Scrollbar track color
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#1976d2", // Scrollbar handle color
          borderRadius: "8px", // Rounded corners for the scrollbar handle
          border: "2px solid transparent", // Optional: add border around the scrollbar handle
          backgroundClip: "padding-box",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#145ca8", // Scrollbar handle color on hover
        },
      }}
    >
      {children}
    </Paper>
  );
};

export default Frame;
