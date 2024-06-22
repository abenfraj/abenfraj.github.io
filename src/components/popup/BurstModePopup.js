// src/components/BurstModePopup.js
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Barcode from "./../barcode/Barcode";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "50rem",
    minHeight: "50rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const BurstModePopup = ({
  open,
  onClose,
  barcodeTextLines,
  interval,
  barcodeSize,
}) => {
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
      const intervalId = setInterval(() => {
        setCurrentBarcode((prev) => {
          if (prev >= barcodeTextLines.length - 1) {
            clearInterval(intervalId);
            setTimeout(onClose, interval);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [currentBarcode, open, barcodeTextLines.length, interval, onClose]);

  return (
    <StyledDialog open={open} onClose={onClose} disableBackdropClick>
      <DialogTitle>
        Burst Mode
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {countdown > 0 ? (
          <>
            <div className="countdown">{countdown}</div>
            <div className="barcode-count">
              Number of barcodes: {barcodeTextLines.length}
            </div>
          </>
        ) : (
          currentBarcode >= 0 &&
          barcodeTextLines[currentBarcode] && (
            <Barcode
              title={barcodeTextLines[currentBarcode].title}
              text={
                barcodeTextLines[currentBarcode].prefix +
                barcodeTextLines[currentBarcode].text
              }
              type={barcodeTextLines[currentBarcode].type}
              onTitleChange={() => {}}
              style={{
                width: `${barcodeSize * 3}%`,
                height:
                  barcodeTextLines[currentBarcode].type === "QR"
                    ? "auto"
                    : `${barcodeSize * 3}%`,
              }}
              showInput={false}
            />
          )
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default BurstModePopup;
