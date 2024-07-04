import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import Web3 from "web3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import endpoints from "../auth/endpoints";

function LoginPage(props) {
  let navigate = useNavigate();
  const [loginAddress, setLoginAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const chainIdToName = new Map();

  chainIdToName.set("0x1", "Ethereum Mainnet");
  chainIdToName.set("0x539", "Ganache");
  chainIdToName.set("0x4", "Rinkeby Testnet");

  useEffect(() => {
    // upon init
    setLoginAddress(window.ethereum ? window.ethereum.selectedAddress : null);
    setChainId(window.ethereum ? window.ethereum.chainId : null);

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setLoginAddress(window.ethereum.selectedAddress);
      });

      window.ethereum.on("disconnect", () => {
        setLoginAddress(null);
      });

      window.ethereum.on("chainChanged", () => {
        setChainId(window.ethereum.chainId);
      });
    }
  });

  const loginETH = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then(
        (acc) => {
          window.web3 = new Web3(window.ethereum);
          return true;
        },
        (rej) => {
          alert("Login Error. " + rej.message);
          return false;
        }
      );
      setLoginAddress(window.ethereum ? window.ethereum.selectedAddress : null);
      setChainId(window.ethereum ? window.ethereum.chainId : null);
    } else {
      alert(
        "Login Error. Please set up MetaMask first as a Google Chrome extension"
      );
      return false;
    }
  };

  const checkUserExists = () => {
    axios
      .post(endpoints.getSignInAPI(), {
        walletAddress: loginAddress,
      })
      .then(
        (acc) => {
          let data = acc.data;
          if (!data.registered) {
            navigate("/register", { state: { loginAddress: loginAddress } });
          } else {
            let user = data.user;
            // Redirect to user homepage
            console.log(data);
            sessionStorage.setItem("t", data.token);
            sessionStorage.setItem("username", data.user.username);
            sessionStorage.setItem("address", data.walletAddress);

            alert("Successfully logged in user: " + user.username);
            navigate("/drafts", {
              state: { username: user.username, walletAddress: loginAddress },
            });
          }
        },
        (rej) => {
          alert(rej.mesage);
        }
      );
  };

  return (
    <div>
      <NavBar showImage={"true"} />
      <div>
        <div className="h1 text-center pt-3 mt-5">Login</div>
        <p className="text-center font-weight-light">
          Account: {loginAddress || "Not Connected"}
        </p>
        <p className="text-center font-weight-light">
          Chain: {chainIdToName.get(chainId) || chainId || "Not Connected"}
        </p>
        <div className="d-flex justify-content-center py-5 px-4">
          <button
            className="btn btn-primary py-4 mx-5 w-25 text-center"
            onClick={loginETH}
            style={{ borderRadius: 25 }}
          >
            Connect Using MetaMask
          </button>
          <button
            className={
              loginAddress == null
                ? "btn btn-danger "
                : "btn btn-success " + "py-4 px-5 w-25 text-center"
            }
            disabled={loginAddress == null}
            onClick={checkUserExists}
            style={{ borderRadius: 25 }}
          >
            Continue Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
