import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Navbar from "../components/Navbar";
import Nologin from "../components/Nologin";

const UserHome: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isUserConnected, setIsUserConnected] = useState(isConnected);

  useEffect(() => {
    setIsUserConnected(isConnected);
  }, [isConnected]);

  return (
    <div>
      {isUserConnected && address ? (
        <div>
            <Navbar />
          <h1>Address: {address}</h1>
        </div>
      ) : (
        <Nologin />
      )}
    </div>
  );
};

export default UserHome;