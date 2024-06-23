import React, { useEffect, useState } from "react";
import { Container, Grid, Button, Collapse, IconButton } from "@mui/material";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase/firebase-config";
import BarcodeDisplayFrame from "../../components/frame/barcode-display-frame/BarcodeDisplayFrame";
import BarcodeTextFrame from "../../components/frame/barcode-text-frame/BarcodeTextFrame";
import BarcodeTextAreaMode from "../../components/frame/barcode-text-area-mode/BarcodeTextAreaMode";
import HistoryFrame from "../../components/frame/history-frame/HistoryFrame";
import StashFrame from "../../components/frame/stash-frame/StashFrame";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Home = ({ tabId }) => {
  const [barcodeTextLines, setBarcodeTextLines] = useState([]);
  const [hoveredBarcodeId, setHoveredBarcodeId] = useState(null);
  const [textAreaMode, setTextAreaMode] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(true);
  const [burstModeInterval, setBurstModeInterval] = useState(300);
  const [barcodeSize, setBarcodeSize] = useState(30);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const savedState = sessionStorage.getItem(`homeState-${tabId}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      setBarcodeTextLines(state.barcodeTextLines);
      setTextAreaMode(state.textAreaMode);
      setShowTitleInput(state.showTitleInput);
      setBurstModeInterval(state.burstModeInterval);
      setBarcodeSize(state.barcodeSize);
    } else {
      setBarcodeTextLines([]);
      setTextAreaMode(false);
      setShowTitleInput(true);
      setBurstModeInterval(300);
      setBarcodeSize(30);
    }
  }, [tabId]);

  useEffect(() => {
    const state = {
      barcodeTextLines,
      textAreaMode,
      showTitleInput,
      burstModeInterval,
      barcodeSize,
    };
    sessionStorage.setItem(`homeState-${tabId}`, JSON.stringify(state));
  }, [
    barcodeTextLines,
    textAreaMode,
    showTitleInput,
    burstModeInterval,
    barcodeSize,
    tabId,
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const modeDoc = doc(db, "userSettings", user.uid);
        const docSnap = await getDoc(modeDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTextAreaMode(data.textAreaMode);
          setShowTitleInput(data.showTitleInput ?? true);
          setBurstModeInterval(data.burstModeInterval ?? 300);
          setBarcodeSize(data.barcodeSize ?? 30);
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
    setForceRender((prev) => !prev);

    const user = auth.currentUser;
    if (user) {
      const modeDoc = doc(db, "userSettings", user.uid);
      await setDoc(modeDoc, { textAreaMode: newMode }, { merge: true });
    }
  };

  const handleShowTitleInputChange = async () => {
    const newShowTitleInput = !showTitleInput;
    setShowTitleInput(newShowTitleInput);

    const user = auth.currentUser;
    if (user) {
      const modeDoc = doc(db, "userSettings", user.uid);
      await setDoc(
        modeDoc,
        { showTitleInput: newShowTitleInput },
        { merge: true }
      );
    }
  };

  const handleBurstModeIntervalChange = async (newInterval) => {
    setBurstModeInterval(newInterval);

    const user = auth.currentUser;
    if (user) {
      const modeDoc = doc(db, "userSettings", user.uid);
      await setDoc(
        modeDoc,
        { burstModeInterval: newInterval },
        { merge: true }
      );
    }
  };

  const handleBarcodeSizeChange = async (newSize) => {
    setBarcodeSize(newSize);

    const user = auth.currentUser;
    if (user) {
      const modeDoc = doc(db, "userSettings", user.uid);
      await setDoc(modeDoc, { barcodeSize: newSize }, { merge: true });
    }
  };

  const addNewLine = () => {
    const newLine = {
      id: Date.now(),
      title: "New Barcode",
      text: "",
      type: "QR",
      prefix: "",
    };
    setBarcodeTextLines((prevLines) => [...prevLines, newLine]);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
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
          key={forceRender}
          barcodeTextLines={barcodeTextLines}
          setBarcodeTextLines={setBarcodeTextLines}
          hoveredBarcodeId={hoveredBarcodeId}
          textAreaMode={textAreaMode}
          showTitleInput={showTitleInput}
          burstModeInterval={burstModeInterval}
          barcodeSize={barcodeSize}
          onShowTitleInputChange={handleShowTitleInputChange}
          onBurstModeIntervalChange={handleBurstModeIntervalChange}
          onBarcodeSizeChange={handleBarcodeSizeChange}
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
                isCollapsed={isCollapsed}
              />
            ) : (
              <BarcodeTextFrame
                barcodeTextLines={barcodeTextLines}
                setBarcodeTextLines={setBarcodeTextLines}
                setHoveredBarcodeId={setHoveredBarcodeId}
                isCollapsed={isCollapsed}
              />
            )}
            <Button onClick={handleModeChange}>
              Switch to {textAreaMode ? "Individual Line" : "Text Area"} Mode
            </Button>
            <IconButton onClick={toggleCollapse}>
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            <Collapse in={!isCollapsed} sx={{ width: "100%" }}>
              <Grid
                container
                direction="row"
                sx={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StashFrame />
                <HistoryFrame />
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
