import React, { useEffect, useState } from "react";
import {
  TextareaAutosize,
  MenuItem,
  Select,
  Grid,
  TextField,
  styled,
} from "@mui/material";
import Frame from "../Frame";
import { auth } from "../../../firebase/firebase-config";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "../../../firebase/firebaseService";
import { Transition } from "react-transition-group";

const CustomTextareaAutosize = styled(TextareaAutosize)({
  width: "80%",
  boxSizing: "border-box",
  padding: "8px",
  marginBottom: "1rem",
  resize: "none",
  fontFamily: "Roboto, sans-serif",
  fontSize: "0.875rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  lineHeight: "1.5",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#1976d2",
    borderRadius: "8px",
    border: "2px solid transparent",
    backgroundClip: "padding-box",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#145ca8",
  },
});

const duration = 300;

const defaultStyle = {
  transition: `height ${duration}ms ease-in-out`,
  height: "50%",
};

const transitionStyles = {
  entering: { height: "80%" },
  entered: { height: "80%" },
  exiting: { height: "35%" },
  exited: { height: "35%" },
};

const BarcodeTextAreaMode = ({
  barcodeTextLines,
  setBarcodeTextLines,
  setHoveredBarcodeId,
  isCollapsed,
}) => {
  const [defaultType, setDefaultType] = useState("QR");
  const [barcodeTypes] = useState(["QR", "Code128"]);
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserPreferences(
          user.uid,
          (defaultType) => {
            if (defaultType) {
              setDefaultType(defaultType);
            }
          },
          "defaultType"
        );
      } else {
        setDefaultType("QR");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const newBarcodeTextLines = barcodeTextLines.map((line) => ({
      ...line,
      prefix: "",
    }));
    setBarcodeTextLines(newBarcodeTextLines);
  }, [defaultType]);

  const handleDefaultTypeChange = async (event) => {
    const newType = event.target.value;
    setDefaultType(newType);
    const user = auth.currentUser;
    if (user) {
      await saveUserPreferences(user.uid, { defaultType: newType });
    }
  };

  const handleTextareaChange = (event) => {
    const lines = event.target.value.split("\n");
    const newBarcodeTextLines = lines.map((text, index) => ({
      id: index + Date.now(),
      text: text,
      prefix: prefix,
      type: defaultType,
    }));
    setBarcodeTextLines(newBarcodeTextLines);
  };

  const handlePrefixChange = (event) => {
    const newPrefix = event.target.value;
    setPrefix(newPrefix);
    const newBarcodeTextLines = barcodeTextLines.map((line) => ({
      ...line,
      prefix: newPrefix,
    }));
    setBarcodeTextLines(newBarcodeTextLines);
  };

  const handleCursorMove = (event) => {
    const cursorPosition = event.target.selectionStart;
    const lines = event.target.value.slice(0, cursorPosition).split("\n");
    const lineIndex = lines.length - 1;
    const currentLineId = barcodeTextLines[lineIndex]?.id;
    setHoveredBarcodeId(currentLineId);
  };

  return (
    <Transition in={isCollapsed} timeout={duration}>
      {(state) => (
        <Grid
          item
          xs={6}
          sx={{
            ...defaultStyle,
            ...transitionStyles[state],
            width: "100%",
            padding: "1rem",
          }}
        >
          <Frame
            sx={{
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
              <Select
                value={defaultType}
                onChange={handleDefaultTypeChange}
                size="small"
                displayEmpty
                sx={{ marginRight: "1rem" }}
              >
                {barcodeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Prefix"
                value={prefix}
                onChange={handlePrefixChange}
                size="small"
                sx={{ width: "60%" }}
              />
            </div>
            <CustomTextareaAutosize
              minRows={50}
              value={barcodeTextLines.map((barcode) => barcode.text).join("\n")}
              onChange={handleTextareaChange}
              onClick={handleCursorMove}
              onKeyUp={handleCursorMove}
              spellCheck={false}
            />
          </Frame>
        </Grid>
      )}
    </Transition>
  );
};

export default BarcodeTextAreaMode;
