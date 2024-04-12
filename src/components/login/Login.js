import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { Button, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import firebase from "firebase/app";
import { auth } from "../../firebase-config";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const googleClientId =
  "858469242167-teb4fpuh4ck3kqjcqkrgm6gva9u9n0us.apps.googleusercontent.com";

function Login() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log("Authenticated user:", user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const loggedInButtonStyle = {
    textTransform: "none",
    color: "#000",
    backgroundColor: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    padding: "10px 20px",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      boxShadow: "0 5px 7px rgba(0, 0, 0, 0.15)",
    },
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Login Success: currentUser:", result.user);
        setUser(result.user);
      })
      .catch((error) => {
        console.log("Login failed:", error);
      });
  };

  const onSignOut = () => {
    signOut(auth).then(() => {
      console.log("User logged out");
      setUser(null);
      handleClose();
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {user ? (
        <>
          <Button
            variant="contained"
            endIcon={<ArrowDropDownIcon />}
            startIcon={
              <Avatar
                src={user.photoURL || "default_user_image_url"}
                sx={{ width: 24, height: 24 }}
              />
            }
            style={loggedInButtonStyle}
            onClick={handleClick} // Opens the menu
          >
            {user.displayName || user.email}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={onSignOut}>
              <Typography variant="body2" color="inherit">
                Disconnect
              </Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button onClick={signInWithGoogle} style={loggedInButtonStyle}>
          Login with Google
        </Button>
      )}
    </div>
  );
}

export default Login;
