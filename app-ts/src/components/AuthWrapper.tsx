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
    <div className="h-100 mx-0 px-0 w-100">
      { (isLoggedIn && (isConnected || isConnecting) ) ? children : <Nologin />}
    </div>
  );
};

export default AuthWrapper;