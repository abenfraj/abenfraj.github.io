import { Grid, Typography } from "@mui/material";
import Frame from "../Frame";
import BarcodeTextLinesTable from "./BarcodeTextLinesTable";
import { useRef, useEffect, useState } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "../../../firebase/firebaseService";
import { auth } from "../../../firebase/firebase-config";

const BarcodeTextFrame = ({
  barcodeTextLines,
  setBarcodeTextLines,
  setHoveredBarcodeId,
}) => {
  const newLineRef = useRef(null);
  const [defaultType, setDefaultType] = useState("QR");
  const [barcodeTypes, setBarcodeTypes] = useState(["QR", "Code128"]);

  const handleMouseEnter = (id) => {
    setHoveredBarcodeId(id);
  };

  const handleMouseLeave = () => {
    setHoveredBarcodeId(null);
  };

  const addNewLine = () => {
    const newLine = { id: Date.now(), text: "", type: defaultType, prefix: "" };
    setBarcodeTextLines((prevLines) => [...prevLines, newLine]);
  };

  const handlePrefixChange = (id, newPrefix) => {
    setBarcodeTextLines((prevLines) =>
      prevLines.map((line) =>
        line.id === id ? { ...line, prefix: newPrefix } : line
      )
    );
  };

  const handleTextChange = (id, newText) => {
    setBarcodeTextLines((prevLines) =>
      prevLines.map((line) =>
        line.id === id ? { ...line, text: newText } : line
      )
    );
  };

  useEffect(() => {
    if (barcodeTextLines.length === 0) {
      setBarcodeTextLines([{ id: Date.now(), text: "", type: defaultType, prefix: "" }]);
    }
  }, []); // Run only once on component mount

  useEffect(() => {
    if (newLineRef.current) {
      newLineRef.current.focus();
    }
  }, [barcodeTextLines.length]);

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
          handleTextChange={handleTextChange}
          deleteLine={(id) =>
            setBarcodeTextLines((prevLines) =>
              prevLines.filter((line) => line.id !== id)
            )
          }
          changeType={(id, newType) =>
            setBarcodeTextLines((prevLines) =>
              prevLines.map((line) =>
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
          handlePrefixChange={handlePrefixChange}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Button variant="outlined" onClick={addNewLine}>
            Add new line
          </Button>
          <Select
            value={defaultType}
            onChange={handleDefaultTypeChange}
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
