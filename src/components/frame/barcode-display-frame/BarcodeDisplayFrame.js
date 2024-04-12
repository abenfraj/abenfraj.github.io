import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import QRCodeSVG from "qrcode.react";
import { Grid } from "@mui/material";
import Frame from "../Frame";
import { Container } from "@mui/material";

const Barcode = ({ text, type }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (type === "Code128" && text) {
      JsBarcode(canvasRef.current, text, {
        format: "CODE128",
        displayValue: false,
        width: 2,
        height: 120,
      });
    }
  }, [text, type]);

  const barcodeStyle = {
    maxWidth: "100%",
    height: "auto",
    overflow: "hidden",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {type === "QR" ? (
        <QRCodeSVG value={text || " "} style={barcodeStyle} />
      ) : (
        <canvas ref={canvasRef} style={barcodeStyle} />
      )}
      <span
        style={{
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          marginTop: "1rem",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const BarcodeDisplayFrame = ({ barcodeTextLines, hoveredBarcodeId }) => {
  const barcodeRefs = useRef({});

  useEffect(() => {
    if (hoveredBarcodeId && barcodeRefs.current[hoveredBarcodeId]) {
      barcodeRefs.current[hoveredBarcodeId].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [hoveredBarcodeId]);

  return (
    <Frame
      sx={{
        height: "100%",
        width: "60%",
        marginRight: "1rem",
        overflow: "auto",
      }}
    >
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
              padding: "1rem", // Outer padding around the container
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
                padding: "20px", // Padding inside the container to separate content from the border
              }}
            >
              <Barcode text={barcode.text} type={barcode.type} />
            </Container>
          </Grid>
        ))}
      </Grid>
    </Frame>
  );
};

export default BarcodeDisplayFrame;
