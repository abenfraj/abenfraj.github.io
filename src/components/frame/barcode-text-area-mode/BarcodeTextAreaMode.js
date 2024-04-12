import React, { useState } from "react";
import { TextareaAutosize, MenuItem, Select, Grid } from "@mui/material";
import Frame from "../Frame";

const BarcodeTextAreaMode = ({
  barcodeTextLines,
  setBarcodeTextLines,
  setHoveredBarcodeId,
}) => {
  const [defaultType, setDefaultType] = useState("Code128");
  const [barcodeTypes] = useState(["QR", "Code128"]);

  const handleTextareaChange = (event) => {
    const lines = event.target.value.split("\n");
    const newBarcodeTextLines = lines.map((text, index) => ({
      id: index + Date.now(), // Ensure unique ID for react key purposes
      text: text,
      type: defaultType, // Use the selected default type for all lines
    }));
    setBarcodeTextLines(newBarcodeTextLines);
  };

  const handleDefaultTypeChange = (event) => {
    const newType = event.target.value;
    setDefaultType(newType);
    const updatedLines = barcodeTextLines.map((line) => ({
      ...line,
      type: newType,
    }));
    setBarcodeTextLines(updatedLines);
  };

  const updateHoveredBarcodeId = (textarea) => {
    const charIndex = textarea.selectionStart;
    const textUpToPointer = textarea.value.substr(0, charIndex);
    const lineNumber = textUpToPointer.split("\n").length - 1;

    if (barcodeTextLines[lineNumber]) {
      setHoveredBarcodeId(barcodeTextLines[lineNumber].id);
    } else {
      setHoveredBarcodeId(null);
    }
  };

  const handleCursorActivity = (event) => {
    updateHoveredBarcodeId(event.target);
  };

  const textareaValue = barcodeTextLines
    .map((barcode) => barcode.text)
    .join("\n");

  return (
    <Grid item xs={6} sx={{ height: "50%", width: "100%", padding: "1rem" }}>
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
        <div style={{ marginBottom: "1rem" }}>
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
        </div>
        <TextareaAutosize
          minRows={10}
          style={{
            width: "80%",
            boxSizing: "border-box",
            padding: "8px",
            resize: "none",
            fontFamily: "Roboto, sans-serif",
            fontSize: "0.875rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            lineHeight: "1.5",
          }}
          value={textareaValue}
          onChange={handleTextareaChange}
          onMouseMove={handleCursorActivity}
          onClick={handleCursorActivity}
          onKeyUp={handleCursorActivity}
        />
      </Frame>
    </Grid>
  );
};

export default BarcodeTextAreaMode;
