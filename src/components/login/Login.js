import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { Button, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const googleClientId =
  "858469242167-teb4fpuh4ck3kqjcqkrgm6gva9u9n0us.apps.googleusercontent.com";
console.log(googleClientId);

function Login() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For controlling the dropdown menu

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

  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    setUser(res.profileObj);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  const onSignOut = () => {
    console.log("User logged out");
    setUser(null);
    handleClose(); // Close menu upon logging out
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu
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
                src={user.logoUrl || user.imageUrl}
                sx={{ width: 24, height: 24 }}
              />
            }
            style={loggedInButtonStyle}
            onClick={handleClick} // Opens the menu
          >
            {user.name}
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
        <GoogleLogin
          clientId={googleClientId}
          buttonText="Login with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
        />
      )}
    </div>
  );
}

export default Login;
