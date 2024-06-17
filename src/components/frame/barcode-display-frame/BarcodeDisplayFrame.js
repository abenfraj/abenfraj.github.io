import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCodeSVG from "qrcode.react";
import { Grid, Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";import Frame from "../Frame";
import { Container } from "@mui/material";
import "./BarcodeDisplayFrame.css";

const Barcode = ({ title, text, type, onTitleChange, style }) => {
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
    ...style,
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
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Enter title"
        style={{
          width: "80%",
          padding: "5px",
          marginBottom: "10px",
          fontSize: "1rem",
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
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

const BurstModePopup = ({ open, onClose, barcodeTextLines }) => {
  const [countdown, setCountdown] = useState(3);
  const [currentBarcode, setCurrentBarcode] = useState(-1);

  useEffect(() => {
    if (open) {
      setCountdown(3);
      setCurrentBarcode(-1);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setCurrentBarcode(0);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open]);

  useEffect(() => {
    if (currentBarcode >= 0 && open) {
      const interval = setInterval(() => {
        setCurrentBarcode((prev) => {
          if (prev === barcodeTextLines.length - 1) {
            clearInterval(interval);
            setTimeout(onClose, 300); // Close the popup after a brief delay to show the last barcode
          }
          return prev + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentBarcode, open, barcodeTextLines.length, onClose]);

  return (
    <Dialog open={open} onClose={onClose} disableBackdropClick>
      <DialogTitle>
        Burst Mode
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {countdown > 0 ? (
          <>
            <div className="countdown">{countdown}</div>
            <div className="barcode-count">Number of barcodes: {barcodeTextLines.length}</div>
          </>
        ) : (
          barcodeTextLines[currentBarcode] && (
            <Barcode
              title={barcodeTextLines[currentBarcode].title}
              text={barcodeTextLines[currentBarcode].prefix + barcodeTextLines[currentBarcode].text}
              type={barcodeTextLines[currentBarcode].type}
              onTitleChange={() => {}}
              style={{ width: '200%', height: '200%' }} // Make barcodes larger
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

const BarcodeDisplayFrame = ({
  barcodeTextLines,
  setBarcodeTextLines,
  hoveredBarcodeId,
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
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setBurstModeOpen(true)}
        style={{ marginBottom: "10px" }}
      >
        Burst Mode
      </Button>
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
              />
            </Container>
          </Grid>
        ))}
      </Grid>
      <BurstModePopup
        open={burstModeOpen}
        onClose={() => setBurstModeOpen(false)}
        barcodeTextLines={barcodeTextLines}
      />
    </Frame>
  );
};

export default BarcodeDisplayFrame;