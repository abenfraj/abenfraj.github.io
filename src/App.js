import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/home";
import Navbar from "./components/navbar/Navbar";
import { Container } from "@mui/material";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container maxWidth={false} sx={{ marginTop: "10rem", height: "100rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
