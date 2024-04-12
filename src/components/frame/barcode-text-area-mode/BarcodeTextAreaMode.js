import React, { useEffect, useState } from "react";
import { TextareaAutosize, MenuItem, Select, Grid } from "@mui/material";
import Frame from "../Frame";
import { auth } from "../../../firebase/firebase-config";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "../../../firebase/firebaseService";

const BarcodeTextAreaMode = ({
  barcodeTextLines,
  setBarcodeTextLines,
  setHoveredBarcodeId,
}) => {
  const [defaultType, setDefaultType] = useState("QR");
  const [barcodeTypes] = useState(["QR", "Code128"]);

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
        setDefaultType("QR"); // Optional: Reset to default or handle logged out state
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

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
      id: index + Date.now(), // Ensure unique ID for react key purposes
      text: text,
      type: defaultType, // Use the selected default type for all lines
    }));
    setBarcodeTextLines(newBarcodeTextLines);
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
        </div>
        <TextareaAutosize
          minRows={50}
          className="textarea-scrollbar"
          style={{
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
          }}
          value={barcodeTextLines.map((barcode) => barcode.text).join("\n")}
          onChange={handleTextareaChange}
        />
      </Frame>
    </Grid>
  );
};

export default BarcodeTextAreaMode;
