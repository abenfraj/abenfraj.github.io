import React from "react";
import { Container, Grid } from "@mui/material";
import BarcodeDisplayFrame from "../../components/frame/barcode-display-frame/BarcodeDisplayFrame";
import BarcodeTextFrame from "../../components/frame/barcode-text-frame/BarcodeTextFrame";
import StashFrame from "../../components/frame/stash-frame/StashFrame";
import HistoryFrame from "../../components/frame/history-frame/HistoryFrame";
import BarcodeTextAreaMode from "../../components/frame/barcode-text-area-mode/BarcodeTextAreaMode";
import { useState } from "react";
import { Button } from "@mui/material";

const Home = () => {
  // Lifted state
  const [barcodeTextLines, setBarcodeTextLines] = useState([]);
  const [textAreaMode, setTextAreaMode] = useState(false);

  return (
    <Container maxWidth="false" sx={{ height: "100%", width: "100%" }}>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BarcodeDisplayFrame barcodeTextLines={barcodeTextLines} />

        <Grid item xs={12} lg={4} sx={{ height: "100%" }}>
          <Grid
            container
            direction="column"
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {textAreaMode ? (
              <BarcodeTextAreaMode
                barcodeTextLines={barcodeTextLines}
                setBarcodeTextLines={setBarcodeTextLines}
              />
            ) : (
              <BarcodeTextFrame
                barcodeTextLines={barcodeTextLines}
                setBarcodeTextLines={setBarcodeTextLines}
              />
            )}
            <Button onClick={() => setTextAreaMode(!textAreaMode)}>
              Switch to {textAreaMode ? "Individual Line" : "Text Area"} Mode
            </Button>

            <Grid
              container
              direction="row"
              sx={{
                height: "40%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StashFrame />
              <HistoryFrame />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
