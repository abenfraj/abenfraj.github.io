import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";

const generateId = (() => {
  let count = 0;
  return () => count++;
})();

const Barcode = ({ text, type }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (type === "Code128" && text) {
      JsBarcode(canvasRef.current, text, { format: "CODE128" });
    }
  }, [text, type]);

  switch (type) {
    case "QR":
      return <QRCodeSVG value={text || " "} />;
    case "Code128":
      return text ? (
        <canvas ref={canvasRef}></canvas>
      ) : (
        <p>Please enter text for the barcode.</p>
      );
    // case for DataMatrix goes here...
    default:
      return null;
  }
};

const Home = () => {
  const [textAreas, setTextAreas] = useState([
    { id: generateId(), text: "", type: "QR" },
  ]);
  const textAreaRefs = useRef([]);
  const barcodeRefs = useRef([]);

  const addNewLine = () => {
    setTextAreas((prevTextAreas) => [
      ...prevTextAreas,
      { id: generateId(), text: "", type: "QR" },
    ]);
  };

  const handleTextChange = (id, newText) => {
    setTextAreas((prevTextAreas) =>
      prevTextAreas.map((textArea) =>
        textArea.id === id ? { ...textArea, text: newText } : textArea
      )
    );
  };

  const deleteLine = (id) => {
    setTextAreas((prevTextAreas) =>
      prevTextAreas.filter((textArea) => textArea.id !== id)
    );
  };

  const changeType = (id, newType) => {
    setTextAreas((prevTextAreas) =>
      prevTextAreas.map((textArea) =>
        textArea.id === id ? { ...textArea, type: newType } : textArea
      )
    );
  };

  const handleKeyDown = (event, id) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const index = textAreas.findIndex((textArea) => textArea.id === id);
      if (index === textAreas.length - 1) {
        addNewLine();
      }
    }
  };

  useEffect(() => {
    textAreas.forEach((textArea, index) => {
      if (textArea.type === "Code128" && barcodeRefs.current[index]) {
        JsBarcode(barcodeRefs.current[index], textArea.text, {
          format: "CODE128",
        });
      }
    });
  });

  useEffect(() => {
    if (textAreaRefs.current[textAreas.length - 1]) {
      textAreaRefs.current[textAreas.length - 1].focus();
    }
  }, [textAreas.length]);

  return (
    <div>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid className="shape-grid" item xs={8} container spacing={2}>
          {textAreas.map((textArea, index) => (
            <Grid item xs={4} key={textArea.id}>
              <Barcode text={textArea.text} type={textArea.type} />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={4}>
          {textAreas.map((textArea, index) => (
            <div
              key={textArea.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <TextareaAutosize
                minRows={1}
                style={{ width: "100%", resize: "none" }}
                value={textArea.text}
                onKeyDown={(e) => handleKeyDown(e, textArea.id)}
                onChange={(e) => handleTextChange(textArea.id, e.target.value)}
                ref={(el) => (textAreaRefs.current[index] = el)}
              />
              <select
                value={textArea.type}
                onChange={(e) => changeType(textArea.id, e.target.value)}
              >
                <option value="QR">QR Code</option>
                <option value="Code128">Code 128</option>
              </select>
              <IconButton
                onClick={() => deleteLine(textArea.id)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button onClick={addNewLine}>Add new line</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
