import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useAuth } from '../auth/useSessionStorage';



import axios from "axios";
import endpoints from "../auth/endpoints";
const SEPOLIA_CHAIN_ID = 11155111;

const WalletFunction: React.FC = () => {
  const { isConnected, address, chain, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { setSession, clearSession, session, isLoggedIn } = useAuth();

  const login = async (address: string) => {
    console.log("Login called");
    // assume connect called. this can be a wallet switch. Requests the nonce ONLY.

    try {
      // Send request to server endpoint to get nonce. Write SessionStorage
      const response = await axios.post(endpoints.getNonceAPI(), { address });
      const nonce = response.data.nonce;
      console.log("Nonce: ", nonce);

      const signMessageVariables = { message: nonce };
      const signedMessage = await signMessageAsync(signMessageVariables, {
        onSuccess: (data: string) => {
          console.log("Signed message: ", data);
        },
        onError: (error: Error) => {
          console.error("Error signing message: ", error);
          throw error;
        },
      });
      await axios.post(endpoints.getSignInAPI(), { address, signature: signedMessage }).then(
          (acc) => {
              console.log("Authhandler Login successful");
              const sessionData = { address: address, token: acc.data.token };
              setSession(sessionData); // JWT Session Token
          },
          (rej) => {
              throw rej;
          }
      );

    } catch (error) {
      // clearSession();
      console.log("Login failed:", error);
      throw error;
    }
  }


  React.useEffect(() => {
    console.log(isConnected, address, chain);

    if (isConnecting) {
      console.log("is connecting...")
      return;
    }

    if (session) {
      if (!isConnected && !isConnecting) {
        console.log("Session exists but not connected");
        disconnect();
        clearSession();
      }
      console.log("Session exists");
      return;
    }

    if (isConnected && address) {
      console.log("Connected to Sepolia Chain");
      login(address).catch((error) => {
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