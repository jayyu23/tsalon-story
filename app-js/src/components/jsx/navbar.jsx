import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import endpoints from "../../auth/endpoints";
import { useNavigate } from "react-router-dom";
import auth from "../../auth/authhandler";

// NavBar also handles Login
function NavBar(props) {
  const navigate = useNavigate();
  const [loginAddress, setLoginAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const chainIdToName = new Map();

  const programChain = "0x4";

  chainIdToName.set("0x1", "Ethereum Mainnet");
  chainIdToName.set("0x539", "Ganache");
  chainIdToName.set("0x4", "Rinkeby Testnet");
  const logoUrl = "/assets/logo_circle.png";

  useEffect(() => {
    // upon init
    // check sessionStorage
    if (sessionStorage.getItem("t")) {
      setIsLoggedIn(true);
    }

    setLoginAddress(window.ethereum ? window.ethereum.selectedAddress : null);
    setChainId(window.ethereum ? window.ethereum.chainId : null);

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setLoginAddress(window.ethereum.selectedAddress);
        if (isLoggedIn) {
          logout();
        }
      });

      window.ethereum.on("disconnect", () => {
        setLoginAddress(null);
        document.getElementById("statusIcon").className =
          "fa-solid fa-circle mx-2 text-danger";
        if (isLoggedIn) {
          logout();
          // alert("Chain Changed detected. Please login again");
        }
      });

      window.ethereum.on("chainChanged", () => {
        setChainId(window.ethereum.chainId);
        if (isLoggedIn && window.ethereum.chainId != programChain) {
          logout();
          // alert("Chain Changed detected. Please login again");
        } else {
        }
      });
    }
  });

  useEffect(() => {
    if (sessionStorage.t) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [sessionStorage]);

  const getShortAddress = (address) => {
    if (address == null) {
      return "Not Connected";
    }
    return (
      address.substring(0, 5) + "..." + address.substring(address.length - 4)
    );
  };

  const copyLoginAddress = () => {
    if (loginAddress) {
      navigator.clipboard.writeText(loginAddress);
      alert("Copied address to clipboard");
    }
  };

  const logout = () => {
    // Log out from server
    sessionStorage.clear();
    setIsLoggedIn(false);
    auth.isLoggedIn = false;
    navigate("/");
  };

  const connectAccount = () => {
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
      document.getElementById("statusIcon").className =
        "fa-solid fa-circle mx-2 text-warning";
    } else {
      alert(
        "Login Error. Please set up MetaMask first as a Google Chrome extension"
      );
      return false;
    }
  };

  const login = () => {
    const loginProcess = () => {
      axios
        .post(endpoints.getSignInAPI(), {
          walletAddress: loginAddress,
        })
        .then(
          (acc) => {
            let data = acc.data;
            if (!data.registered) {
              navigate("/register", {
                state: { loginAddress: loginAddress },
              });
            } else {
              let user = data.user;
              // Redirect to user homepage
              sessionStorage.setItem("t", data.token);
              sessionStorage.setItem("username", data.user.username);
              sessionStorage.setItem("address", data.walletAddress);
              setIsLoggedIn(true);
              auth.isLoggedIn = true;
              // alert("Successfully logged in user: " + user.username);
              // navigate("/drafts", {
              //   state: { username: user.username, walletAddress: loginAddress },
              // });
            }
          },
          (rej) => {
            console.log(rej);
            alert(rej.message);
          }
        );
    };

    if (chainId != programChain) {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: programChain }],
        })
        .then(
          (acc) => {
            loginProcess();
          },
          (rej) => {
            alert(
              `Needs to be on ${chainIdToName.get(
                programChain
              )}, ChainID: ${programChain}. Current chain ${
                chainIdToName.get(chainId) || chainId
              } not supported`
            );
            return;
          }
        );
    } else {
      loginProcess();
    }
  };

  const notLoggedInData = (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle px-lg-3 py-3 py-lg-4"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i id="statusIcon" className="fa-solid fa-circle mx-2 text-danger"></i>
        Log In
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        <a className="dropdown-item" href="#">
          <i className="fa-solid fa-address-card mx-2"></i>
          {getShortAddress(loginAddress) || "Not Connected"}
        </a>
        <a className="dropdown-item" href="#">
          <i className="fa-solid fa-share-nodes mx-2"></i>
          {chainIdToName.get(chainId) || chainId || "Not Connected"}
        </a>
        <div className="dropdown-divider"></div>
        <div container="row justify-content-center">
          <a
            className="btn btn-sm btn-primary justify-content-center mx-2"
            href="#"
            onClick={connectAccount}
            style={{ borderRadius: 25 }}
          >
            <i
              className="iconify"
              data-icon="logos:metamask-icon"
              style={{ fontSize: 20, paddingRight: 5 }}
            ></i>
            Launch
          </a>
          <a
            className={
              loginAddress == null
                ? "btn btn-sm px-2 disabled"
                : "btn btn-sm px-2"
            }
          >
            <i
              className="fa-solid fa-circle-arrow-right text-success mr-2"
              style={{ fontSize: 25 }}
              onClick={login}
            ></i>
          </a>
        </div>
      </div>
    </li>
  );

  const loggedInData = (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle px-lg-3 py-3 py-lg-4"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fa-solid fa-circle mx-2 text-success"></i>
        {auth.getUsername()}
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        <a
          className="dropdown-item"
          href={"/profile/" + auth.getUsernameLink()}
          // target="_blank"
        >
          <i className="fa-solid fa-user mx-2"></i>
          View Public Profile
        </a>
        <div className="dropdown-item" href="#">
          <i className="fa-solid fa-address-card mx-2"></i>
          {getShortAddress(loginAddress) || "Not Connected"}
        </div>
        <div className="dropdown-item" href="#">
          <i className="fa-solid fa-share-nodes mx-2"></i>
          {chainIdToName.get(chainId) || chainId || "Not Connected"}
        </div>
        <div className="dropdown-divider"></div>
        <div container="row justify-content-center">
          <a
            className="btn btn-sm btn-secondary justify-content-center mx-2"
            href="#"
            onClick={copyLoginAddress}
          >
            <i className="fa-solid fa-copy mr-2"></i>
            Copy
          </a>
          <a className="btn btn-sm btn-danger mr-2" href="#" onClick={logout}>
            <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
            Logout
          </a>
        </div>
      </div>
    </li>
  );

  const loggedInHome = (
    <li className="nav-item">
      <a href="/dashboard" className="nav-link px-lg-3 py-3 py-lg-4">
        <i className="fas fa-house" style={{ fontSize: 16 }}></i>
      </a>
    </li>
  );

  return (
    <div className="mb-5 w-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="mainNav">
        <div className="container px-4 px-lg">
          <img
            className="navbar-brand m-x-2 d-inline-block align-top"
            src={logoUrl}
            width="45px"
          ></img>
          <a className="navbar-brand" href="/">
            TSalon
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link px-lg-3 py-3 py-lg-4"
                  target="_blank"
                  href="https://trapezoidal-nephew-39b.notion.site/Guides-92598b3816bc4742b20710be69e99a1a"
                >
                  User Guides
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-lg-3 py-3 py-lg-4"
                  target="_blank"
                  href="https://trapezoidal-nephew-39b.notion.site/TSalon-Whitepaper-9d27f5c901bc4dcaa53bace710421fce"
                >
                  Whitepaper
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-lg-3 py-3 py-lg-4"
                  target="_blank"
                  href="https://discord.gg/jABTq5RPNC"
                >
                  Join Discord
                </a>
              </li>
              {isLoggedIn ? loggedInData : notLoggedInData}
              {isLoggedIn ? loggedInHome : ""}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
