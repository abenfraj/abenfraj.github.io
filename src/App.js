import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import { Container } from "@mui/material";
import { Footer } from "./components/footer/Footer";
import { useEffect } from "react";
import { gapi } from "gapi-script";

const App = () => {
  useEffect(() => {
    const start = async () => {
      if (!gapi.auth2.getAuthInstance()) {
        await gapi.auth2.init({
          clientId:
            "858469242167-teb4fpuh4ck3kqjcqkrgm6gva9u9n0us.apps.googleusercontent.com",
          scope: "profile email",
        });
      }
    };

    gapi.load("client:auth2", start);
  }, []);

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
