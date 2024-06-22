// src/components/BurstModePopup.js
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Barcode from "../barcode/Barcode";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "50rem",
    minHeight: "50rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const StyledCountdown = styled(Typography)(({ theme }) => ({
  fontSize: "4rem",
  fontWeight: "bold",
  color: theme?.palette?.primary?.main || "#1a90ff",
  marginBottom: theme?.spacing(2) || "16px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
}));

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  width: "100%",
  backgroundColor:
    theme?.palette?.grey?.[theme.palette.mode === "light" ? 200 : 700] ||
    "#e0e0e0",
  "& .MuiLinearProgress-bar": {
    borderRadius: 10,
    background: "linear-gradient(to right, #1a90ff, #308fe8)",
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
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setCurrentBarcode(0);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [open]);

  useEffect(() => {
    if (currentBarcode >= 0 && open) {
      const barcodeInterval = setInterval(() => {
        setCurrentBarcode((prev) => {
          if (prev >= barcodeTextLines.length - 1) {
            clearInterval(barcodeInterval);
            setTimeout(onClose, interval);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
      return () => clearInterval(barcodeInterval);
    }
  }, [currentBarcode, open, barcodeTextLines.length, interval, onClose]);

  const progress = ((currentBarcode + 1) / barcodeTextLines.length) * 100;

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
          width: "90%",
        }}
      >
        {countdown > 0 ? (
          <>
            <StyledCountdown>{countdown}</StyledCountdown>
            <Typography variant="h6" className="barcode-count">
              Number of barcodes: {barcodeTextLines.length}
            </Typography>
          </>
        ) : (
          currentBarcode >= 0 &&
          barcodeTextLines[currentBarcode] && (
            <>
              <Barcode
                title={barcodeTextLines[currentBarcode].title}
                text={
                  barcodeTextLines[currentBarcode].prefix +
                  barcodeTextLines[currentBarcode].text
                }
                type={barcodeTextLines[currentBarcode].type}
                onTitleChange={() => {}}
                style={{
                  width: `${barcodeSize * 1.5}%`,
                  height:
                    barcodeTextLines[currentBarcode].type === "QR"
                      ? "auto"
                      : `${barcodeSize * 1.5}%`,
                }}
                showInput={false}
              />
              <Box sx={{ width: "100%", mt: 4 }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                >{`Progress: ${currentBarcode + 1} / ${
                  barcodeTextLines.length
                }`}</Typography>
                <StyledProgress variant="determinate" value={progress} />
              </Box>
            </>
          )
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default BurstModePopup;
