import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import auth from "../auth/authhandler";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [loginAddress, setLoginAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const chainIdToName: Map<string, string> = new Map([
    ["0x1", "Ethereum Mainnet"],
    ["0x539", "Ganache"],
    ["0x4", "Rinkeby Testnet"],
    ["0x41a", "Sepolia Testnet"] // Adding Sepolia testnet
  ]);
  const programChain = "0x41a"; // Chain ID for Sepolia in hexadecimal
  const logoUrl = "/assets/logo_circle.png";

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const accounts = await provider.send("eth_requestAccounts", []);
          const network = await provider.getNetwork();
          setLoginAddress(accounts[0]);
          setChainId(`0x${network.chainId.toString(16)}`);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setLoginAddress(accounts.length === 0 ? null : accounts[0]);
          if (isLoggedIn) {
            logout();
          }
        });

        window.ethereum.on("chainChanged", (chainId: string) => {
          setChainId(chainId);
          if (isLoggedIn && chainId !== programChain) {
            logout();
          }
        });

        window.ethereum.on("disconnect", () => {
          setLoginAddress(null);
          setIsLoggedIn(false);
        });
      }
    };

    initEthereum();
  }, [isLoggedIn]);

  const getShortAddress = (address: string | null) => {
    return address ? `${address.substring(0, 5)}...${address.substring(address.length - 4)}` : "Not Connected";
  };

  const logout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    // auth.isLoggedIn = false;
    navigate("/");
  };

  const connectAccount = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setLoginAddress(address);
        setChainId(`0x${network.chainId.toString(16)}`);
      } catch (error) {
        console.error("Login Error: ", error);
        return false;
      }
    } else {
      alert("Please install MetaMask!");
      return false;
    }
  };

//   const login = async () => {
//     const loginProcess = async () => {
//       try {
//         const response = await axios.post(auth.getSignInAPI(), { walletAddress: loginAddress });
//         let data = response.data;
//         if (!data.registered) {
//           navigate("/register", { state: { loginAddress } });
//         } else {
//           sessionStorage.setItem("t", data.token);
//           sessionStorage.setItem("username", data.user.username);
//           sessionStorage.setItem("address", data.walletAddress);
//           setIsLoggedIn(true);
//           auth.isLoggedIn = true;
//         }
//       } catch (error) {
//         console.error("Login Error: ", error);
//         alert("Login Error: " + error.message);
//       }
//     };

//     if (chainId !== programChain) {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         await provider.send("wallet_switchEthereumChain", [{ chainId: programChain }]);
//         await loginProcess();
//       } catch (error) {
//         alert(`Switch to ${chainIdToName.get(programChain)} (${programChain}). Current chain not supported.`);
//       }
//     } else {
//       await loginProcess();
//     }
//   };

//   const loggedInUI = isLoggedIn ? (
//     // JSX for logged in state
//   ) : (
//     // JSX for not logged in state
//   );

  return (
    <div>
      {/* Existing navbar JSX updated with TypeScript compatibility */}
      {loggedInUI}
    </div>
  );
};

export default NavBar;