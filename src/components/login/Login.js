import React from "react";
import { GoogleLogin } from "react-google-login";

const googleClientId =
  "858469242167-teb4fpuh4ck3kqjcqkrgm6gva9u9n0us.apps.googleusercontent.com";
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
