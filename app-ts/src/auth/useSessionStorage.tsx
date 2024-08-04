import { useState, useEffect } from 'react';

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

  return { session, setSession, clearSession, isLoggedIn, getAuthData };
}

export { useSessionStorage, useAuth };