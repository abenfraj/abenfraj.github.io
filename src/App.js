import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import { Container } from "@mui/material";
import { Footer } from "./components/footer/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container
        maxWidth="false"
        sx={{ paddingTop: "9rem", height: "90vh", width: "100%", margin: 0 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
