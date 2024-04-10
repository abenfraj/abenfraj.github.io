import React from "react";
import { Grid, Typography } from "@mui/material";
import Frame from "../Frame";

const StashFrame = () => {
  return (
    <Grid item xs={6} sx={{ height: "100%", padding: "1rem" }}>
      <Frame sx={{ height: "100%", padding: "0 1rem" }}>
        <Typography variant="h6">Stash</Typography>
      </Frame>
    </Grid>
  );
};

export default StashFrame;
