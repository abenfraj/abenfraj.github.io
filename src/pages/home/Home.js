import React, { useEffect, useState } from "react";
import { Container, Grid, Button } from "@mui/material";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase-config"; // Make sure auth is exported from firebase-config
import BarcodeDisplayFrame from "../../components/frame/barcode-display-frame/BarcodeDisplayFrame";
import BarcodeTextFrame from "../../components/frame/barcode-text-frame/BarcodeTextFrame";
import BarcodeTextAreaMode from "../../components/frame/barcode-text-area-mode/BarcodeTextAreaMode";
import HistoryFrame from "../../components/frame/history-frame/HistoryFrame";
import StashFrame from "../../components/frame/stash-frame/StashFrame";

const Home = () => {
  const [barcodeTextLines, setBarcodeTextLines] = useState([]);
  const [hoveredBarcodeId, setHoveredBarcodeId] = useState(null);
  const [textAreaMode, setTextAreaMode] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const modeDoc = doc(db, "userSettings", user.uid);
        const docSnap = await getDoc(modeDoc);
        if (docSnap.exists()) {
          setTextAreaMode(docSnap.data().textAreaMode);
        } else {
          setTextAreaMode(false);
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  const handleModeChange = async () => {
    const newMode = !textAreaMode;
    setTextAreaMode(newMode);

    const user = auth.currentUser;
    if (user) {
      const modeDoc = doc(db, "userSettings", user.uid);
      await setDoc(modeDoc, { textAreaMode: newMode }, { merge: true });
    }
  };

  return (
    <Container maxWidth="false" sx={{ height: "100%", width: "100%" }}>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BarcodeDisplayFrame
          barcodeTextLines={barcodeTextLines}
          hoveredBarcodeId={hoveredBarcodeId}
        />
        <Grid item xs={12} lg={4} sx={{ height: "100%" }}>
          <Grid
            container
            direction="column"
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {textAreaMode ? (
              <BarcodeTextAreaMode
                barcodeTextLines={barcodeTextLines}
                setBarcodeTextLines={setBarcodeTextLines}
                setHoveredBarcodeId={setHoveredBarcodeId}
              />
            ) : (
              <BarcodeTextFrame
                barcodeTextLines={barcodeTextLines}
                setBarcodeTextLines={setBarcodeTextLines}
                setHoveredBarcodeId={setHoveredBarcodeId}
              />
            )}
            <Button onClick={handleModeChange}>
              Switch to {textAreaMode ? "Individual Line" : "Text Area"} Mode
            </Button>

            <Grid
              container
              direction="row"
              sx={{
                height: "40%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StashFrame />
              <HistoryFrame />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
