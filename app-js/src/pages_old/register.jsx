import axios from "axios";
import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import { useLocation, useNavigate } from "react-router-dom";
import endpoints from "../auth/endpoints";
import auth from "../auth/authhandler";

function RegisterPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  let loginAddress = location.state ? location.state.loginAddress : null;
  useEffect(() => {
    if (loginAddress == null) {
      navigate("/error");
    }
  });

  const checkValid = () => {
    // Client validation
    let usernameEntered = document.getElementById("username").value;
    let lengthCheck =
      usernameEntered.length >= 3 && usernameEntered.length <= 30;
    let valueCheck = usernameEntered.match(/^[a-z\d]+([ ]{1}[a-z0-9]+)*$/i);
    let usernameErrorMessage = document.getElementById("usernameError");

    if (lengthCheck && valueCheck) {
      // Passed client validation
      // now query the database
      axios
        .post(endpoints.getCreateUserAPI(), {
          username: usernameEntered,
          walletAddress: loginAddress,
        })
        .then(
          (acc) => {
            let data = acc.data;
            if (data.success) {
              // Redirect to user homepage
              sessionStorage.setItem("t", data.token);
              sessionStorage.setItem("username", data.user);
              sessionStorage.setItem("address", data.walletAddress);
              auth.isLoggedIn = true;
              // alert("Successfully logged in user: " + user.username);
              navigate("/dashboard", {
                state: { username: data.username, walletAddress: loginAddress },
              });
            } else {
              usernameErrorMessage.hidden = false;
              usernameErrorMessage.innerText =
                "Username exists. Please select a different username.";
            }
          },
          (rej) => {
            usernameErrorMessage.hidden = false;
            usernameErrorMessage.innerText =
              "Server Error. Please try again later.";
          }
        );
    } else {
      usernameErrorMessage.hidden = false;
      usernameErrorMessage.innerText = "Invalid Entry. Please retry.";
    }
  };

  return (
    <div>
      <NavBar />
      <div className="h1 text-center pt-5 mt-5">Register User</div>
      <div className="h4 text-center mt-3 font-weight-normal">
        Welcome to TSalon!
      </div>
      <div className="container px-5">
        <h4 className="font-weight-normal mt-5 mb-3">Pen Name</h4>
        <p className="text-muted mt-1 mb-1">Your Unique Identifier on TSalon</p>
        <div className="row">
          <input
            id="username"
            type="text"
            className="form-control w-50 ml-3 mr-4"
            style={{ maxWidth: "600px", height: 60 }}
          />
          <button
            className="btn btn-success w-25 mx-4"
            style={{ borderRadius: 25 }}
            onClick={checkValid}
          >
            Register
          </button>
        </div>
        <p className="text-muted mt-2 mb-0">
          Requirements: Length 3-30, Numbers, Letters, and Space Bar
        </p>
        <p id="usernameError" className="text-danger mt-0" hidden={true}></p>
      </div>
    </div>
  );
}

export default RegisterPage;
