import React, { useState, useEffect} from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useAuth } from '../auth/useAuth';

// import axios from "axios";
// import endpoints from "../auth/endpoints";
const SEPOLIA_CHAIN_ID = 11155111;

const WalletFunction: React.FC = () => {
  const { isConnected, address, chain, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { setSession, clearSession, session, login } = useAuth();

  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setMilliseconds(Date.now() - startTime);
    }, 1); // Update every millisecond

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  

  useEffect(() => {
    console.log(isConnected, address, chain);
    // 1 sec delay for resource load
    if (isConnecting || milliseconds < 1000) {
      console.log("is connecting...")
      return;
    }

    if (session) {
      if (!isConnected && !isConnecting || session.address !== address) {
        console.log("Session exists but not connected");
        disconnect();
        clearSession();
      }
      console.log("Session exists");
      return;
    }

    if (isConnected && address) {
      console.log("Connected to Sepolia Chain");
      login(address, signMessageAsync).catch((error) => {
        console.log("Login failed:", error);
        disconnect();
        clearSession();
      });
    } else {
      disconnect();
      clearSession();
    }
  }, [isConnecting, isConnected, address, chain]);

  return (
    <div className="connectDetails">
      <ConnectButton />
    </div>
  );
};

export default WalletFunction;