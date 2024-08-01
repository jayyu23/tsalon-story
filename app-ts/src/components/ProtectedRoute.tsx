import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/useSessionStorage";
import { useAccount } from "wagmi";
import Nologin from "./Nologin";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { isConnected, isConnecting } = useAccount();


  return (
    <div>
      { (isLoggedIn && (isConnected || isConnecting) ) ? children : <Nologin />}
    </div>
  );
};

export default AuthWrapper;