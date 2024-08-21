import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import endpoints from './endpoints';

function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      console.log("Setting session storage: ", storedValue);
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

interface SessionType {
  token: string;
  address: string;
}

function useAuth() {
  const [session, setSession] = useSessionStorage<SessionType | null>('session', null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = Boolean(session);
    console.log("Session: ", loggedIn);
    setIsLoggedIn(loggedIn);
  }, [session]);

  const clearSession = () => {
    setSession(null);
  };

  const getAuthData = () => {
    const token = session?.token;
    const address = session?.address;
    
      let body = {
        walletAddress: address,
        username: address,
      };
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      return { body, config };
    }


  const login = async (address: string, signMessageAsync: any) => {
    console.log("Login called");
    // assume connect called. this can be a wallet switch. Requests the nonce ONLY.
    // const { signMessageAsync } = useSignMessage();
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

  return { session, setSession, clearSession, isLoggedIn, getAuthData, login };
}

export { useSessionStorage, useAuth };