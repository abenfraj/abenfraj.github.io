import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import JsBarcode from "jsbarcode";
import QRCodeSVG from "qrcode.react";
import { Grid } from "@mui/material";
import Frame from "../Frame";

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
      ) : text ? (
        <canvas ref={canvasRef} style={barcodeStyle} />
      ) : (
        <Typography>Please enter text for Code 128.</Typography>
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

const BarcodeDisplayFrame = ({ barcodeTextLines }) => {
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
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "3rem",
            }}
          >
            <Barcode text={barcode.text} type={barcode.type} />
          </Grid>
        ))}
      </Grid>
    </Frame>
  );
};

export default BarcodeDisplayFrame;
