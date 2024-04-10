import React from "react";
import { TextareaAutosize } from "@mui/material";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import Frame from "../Frame";
import { Grid } from "@mui/material";

const BarcodeTextAreaMode = ({ barcodeTextLines, setBarcodeTextLines }) => {
  const [defaultType, setDefaultType] = useState("Code128");
  const [barcodeTypes] = useState(["QR", "Code128"]); // Future types can be added here

  const handleTextareaChange = (event) => {
    const lines = event.target.value.split("\n");
    const newBarcodeTextLines = lines.map((text, index) => ({
      id: index + Date.now(), // Ensure unique ID
      text: text,
      type: defaultType, // Use the selected default type for all lines
    }));
    setBarcodeTextLines(newBarcodeTextLines);
  };

  const textareaValue = barcodeTextLines
    .map((barcode) => barcode.text)
    .join("\n");

  const handleDefaultTypeChange = (event) => {
    const newType = event.target.value;
    setDefaultType(newType);
    const updatedLines = barcodeTextLines.map((line) => ({
      ...line,
      type: newType, // Update all lines to the new type
    }));
    setBarcodeTextLines(updatedLines);
  };

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
            boxSizing: "border-box", // Ensures padding does not affect overall width
            padding: "8px",
            resize: "none",
            fontFamily: "Roboto, sans-serif",
            fontSize: "0.875rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          value={textareaValue}
          onChange={handleTextareaChange}
        />
      </Frame>
    </Grid>
  );
};

export default BarcodeTextAreaMode;
