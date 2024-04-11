import React from "react";
import { GoogleLogin } from "react-google-login";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log(googleClientId);

function Login() {
  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    // Process the successful login here, e.g., access token, user details
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    // Handle login failure
  };

  return (
    <GoogleLogin
      clientId={googleClientId}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
}

export default Login;
