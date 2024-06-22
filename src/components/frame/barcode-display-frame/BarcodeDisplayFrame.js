// src/components/frame/barcode-display-frame/BarcodeDisplayFrame.js
import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Frame from "../Frame";
import { Container } from "@mui/material";
import "./BarcodeDisplayFrame.css";
import Barcode from "../../barcode/Barcode";
import BurstModePopup from "../../popup/BurstModePopup";

const BarcodeDisplayFrame = ({
  barcodeTextLines,
  setBarcodeTextLines,
  hoveredBarcodeId,
  textAreaMode,
  showTitleInput,
  burstModeInterval,
  barcodeSize,
  onShowTitleInputChange,
  onBurstModeIntervalChange,
  onBarcodeSizeChange,
}) => {
  const barcodeRefs = useRef({});
  const [burstModeOpen, setBurstModeOpen] = useState(false);

  useEffect(() => {
    if (hoveredBarcodeId && barcodeRefs.current[hoveredBarcodeId]) {
      barcodeRefs.current[hoveredBarcodeId].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [hoveredBarcodeId]);

  const handleTitleChange = (id, newTitle) => {
    setBarcodeTextLines((prevLines) =>
      prevLines.map((line) =>
        line.id === id ? { ...line, title: newTitle } : line
      )
    );
  };

  return (
    <Frame
      sx={{
        height: "100%",
        width: "60%",
        marginRight: "1rem",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div className="fixed-header">
        <div
          className="header-controls"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showTitleInput}
                onChange={onShowTitleInputChange}
              />
            }
            label="Show Notes"
            style={{ marginRight: "20px" }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Set the size of the barcodes as a percentage of their original size.">
              <TextField
                label="Barcode Size (%)"
                type="number"
                value={barcodeSize}
                onChange={(e) => onBarcodeSizeChange(Number(e.target.value))}
                style={{ marginRight: "10px" }}
              />
            </Tooltip>
            <Tooltip title="Set the interval time in milliseconds between displaying each barcode in burst mode.">
              <TextField
                label="Burst mode interval (ms)"
                type="number"
                value={burstModeInterval}
                onChange={(e) =>
                  onBurstModeIntervalChange(Number(e.target.value))
                }
                style={{ marginRight: "10px" }}
              />
            </Tooltip>
            <Tooltip title="Start burst mode to display each barcode at the specified interval.">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setBurstModeOpen(true)}
              >
                Burst Mode
              </Button>
            </Tooltip>
          </div>
        </div>
        <Divider style={{ width: "100%", marginTop: "10px" }} />
      </div>
      <Grid
        container
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          justifyContent: "center",
        }}
      >
        {barcodeTextLines.map((barcode) => (
          <Grid
            key={barcode.id}
            item
            xs={5}
            ref={(node) => {
              barcodeRefs.current[barcode.id] = node;
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            <Container
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border:
                  barcode.id === hoveredBarcodeId
                    ? "3px solid #1976d2"
                    : "3px solid transparent",
                boxShadow:
                  barcode.id === hoveredBarcodeId
                    ? "0px 0px 8px rgba(25, 118, 210, 0.5)"
                    : "none",
                borderRadius: "8px",
                transition:
                  "border 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease",
                padding: "20px",
              }}
            >
              <Barcode
                title={barcode.title}
                text={barcode.prefix + barcode.text}
                type={barcode.type}
                onTitleChange={(newTitle) =>
                  handleTitleChange(barcode.id, newTitle)
                }
                showInput={showTitleInput}
                style={{
                  width: `${barcodeSize}%`,
                  height: barcode.type === "QR" ? "auto" : `${barcodeSize}%`,
                }}
              />
            </Container>
          </Grid>
        ))}
      </Grid>
      <BurstModePopup
        open={burstModeOpen}
        onClose={() => setBurstModeOpen(false)}
        barcodeTextLines={barcodeTextLines}
        interval={burstModeInterval}
        barcodeSize={barcodeSize}
      />
    </Frame>
  );
};

export default BarcodeDisplayFrame;
