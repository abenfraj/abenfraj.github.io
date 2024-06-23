import React from "react";
import { Grid, Typography } from "@mui/material";
import Frame from "../Frame";

const HistoryFrame = () => {
  return (
    <Grid item xs={6} sx={{ height: "250px", padding: "1rem" }}>
      <Frame sx={{ height: "100%", padding: "0 1rem" }}>
        <Typography variant="h6">History</Typography>
      </Frame>
    </Grid>
  );
};

export default HistoryFrame;
