import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar } from "@mui/material";
import Logo from "../../assets/logo.png";
import Typography from "@mui/material/Typography";
import Login from "../login/Login";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      sx={{
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.7)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: isScrolled ? "64px" : "auto",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              width: isScrolled ? "6rem" : "9rem",
              height: isScrolled ? "6rem" : "9rem",
              ml: isScrolled ? 0 : 7,
              transition: "all 0.3s ease-in-out",
            }}
          />
          {!isScrolled && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  ml: 2,
                  fontWeight: "bold",
                  fontFamily: "'Roboto', sans-serif", // or "'Montserrat', sans-serif"
                }}
              >
                <span style={{ color: "#3689B8" }}>DATA</span>
                <span style={{ color: "black" }}>SHAPER</span>
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Login></Login>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
