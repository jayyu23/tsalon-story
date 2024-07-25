import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import auth from "../auth/authhandler";
import Nologin from "../components/Nologin";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [isUserConnected, setIsUserConnected] = useState(isConnected);

  useEffect(() => {
    //auth.protectRoute();
    setIsUserConnected(isConnected);
  }, [isConnected]);

  return (
    <div>
      {isUserConnected && address ? children : <Nologin />}
    </div>
  );
};

export default AuthWrapper;