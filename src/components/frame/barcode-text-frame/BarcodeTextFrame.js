import { Grid, Typography } from "@mui/material";
import Frame from "../Frame";
import BarcodeTextLinesTable from "./BarcodeTextLinesTable";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { Button } from "@mui/material";

const BarcodeTextFrame = ({
  barcodeTextLines,
  setBarcodeTextLines,
  setHoveredBarcodeId,
}) => {
  const newLineRef = useRef(null);
  const [defaultType, setDefaultType] = useState("Code128");
  const [barcodeTypes, setBarcodeTypes] = useState(["QR", "Code128"]);

  const handleMouseEnter = (id) => {
    setHoveredBarcodeId(id);
    console.log("hoveredBarcodeId", id);
  };

  const handleMouseLeave = () => {
    setHoveredBarcodeId(null);
    console.log("hoveredBarcodeId", null);
  };

  const addNewLine = () => {
    const newLine = { id: Date.now(), text: "", type: defaultType };
    setBarcodeTextLines([...barcodeTextLines, newLine]);
  };

  useEffect(() => {
    if (barcodeTextLines.length === 0) {
      addNewLine();
    }
  }, []);

  useEffect(() => {
    if (newLineRef.current) {
      newLineRef.current.focus();
    }
  }, [barcodeTextLines]);

  return (
    <Grid item xs={6} sx={{ height: "50%", width: "100%", padding: "1rem" }}>
      <Frame
        sx={{
          height: "100%",
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          padding: "0 1rem",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
          Barcodes text
        </Typography>
        <BarcodeTextLinesTable
          barcodeTextLines={barcodeTextLines}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleTextChange={(id, newText) =>
            setBarcodeTextLines(
              barcodeTextLines.map((line) =>
                line.id === id ? { ...line, text: newText } : line
              )
            )
          }
          deleteLine={(id) =>
            setBarcodeTextLines(
              barcodeTextLines.filter((line) => line.id !== id)
            )
          }
          changeType={(id, newType) =>
            setBarcodeTextLines(
              barcodeTextLines.map((line) =>
                line.id === id ? { ...line, type: newType } : line
              )
            )
          }
          handleKeyDown={(event, id) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addNewLine();
            }
          }}
          newLineRef={newLineRef}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            marginTop: "1rem",
          }}
        >
          <Button variant="outlined" onClick={addNewLine}>
            Add new line
          </Button>
          <Select
            value={defaultType}
            onChange={(e) => setDefaultType(e.target.value)}
            size="small"
            sx={{ height: "fit-content" }}
          >
            {barcodeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Frame>
    </Grid>
  );
};

export default BarcodeTextFrame;
