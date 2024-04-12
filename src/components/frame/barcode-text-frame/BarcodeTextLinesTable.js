import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const BarcodeTextLinesTable = ({
  barcodeTextLines,
  handleTextChange,
  deleteLine,
  changeType,
  handleKeyDown,
  newLineRef,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <div>
      {barcodeTextLines.map((textArea, index) => (
        <div
          key={textArea.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            gap: "8px",
          }}
          onMouseEnter={() => handleMouseEnter(textArea.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TextareaAutosize
            style={{
              width: "70%", // Adjust based on your layout
              resize: "none",
              padding: "10px", // Add some padding for text area
              border: "2px solid #1976d2", // Use MUI primary color for border
              borderRadius: "4px", // Match MUI border radius
              fontFamily: "Roboto, sans-serif", // Ensure font consistency
              fontSize: "0.875rem", // Match MUI typography
            }}
            value={textArea.text}
            onKeyDown={(e) => handleKeyDown(e, textArea.id)}
            onChange={(e) => handleTextChange(textArea.id, e.target.value)}
            ref={index === barcodeTextLines.length - 1 ? newLineRef : null}
          />
          <select
            value={textArea.type}
            onChange={(e) => changeType(textArea.id, e.target.value)}
            style={{
              padding: "9px 10px",
              border: "2px solid #1976d2", // Match the input border
              borderRadius: "4px", // Consistent with MUI
              fontFamily: "Roboto, sans-serif", // Ensure font consistency
              background: "#fff", // Add a white background
              cursor: "pointer", // Cursor pointer to indicate it's selectable
            }}
          >
            <option value="QR">QR Code</option>
            <option value="Code128">Code 128</option>
          </select>
          <IconButton
            onClick={() => deleteLine(textArea.id)}
            aria-label="delete"
            style={{
              color: "#1976d2", // Use MUI primary color
              margin: "0", // Reset margin to align button properly
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default BarcodeTextLinesTable;
