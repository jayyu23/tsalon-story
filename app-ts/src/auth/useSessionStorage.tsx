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

function useAuth() {
  const [session, setSession] = useSessionStorage<Object | null>('session', null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = Boolean(session);
    console.log("Session: ", loggedIn);
    setIsLoggedIn(loggedIn);
  }, [session]);

  useEffect(() => {
    console.log("isLoggedIn: ", isLoggedIn);
  }, [isLoggedIn]);

  const clearSession = () => {
    setSession(null);
  };

  return { session, setSession, clearSession, isLoggedIn };
}

export { useSessionStorage, useAuth };