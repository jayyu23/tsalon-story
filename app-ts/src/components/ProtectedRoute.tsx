import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/useSessionStorage";
import Nologin from "./Nologin";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      { isLoggedIn ? children : <Nologin />}
    </div>
  );
};

export default AuthWrapper;