import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import auth from '../auth/authhandler';

const SEPOLIA_CHAIN_ID = 11155111;

const WalletFunction: React.FC = () => {
  const { isConnected, address, chain, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();

  React.useEffect(() => {

    auth.logout();

  }, [ disconnect ]);

  React.useEffect(() => {
    console.log(isConnected, auth.isLoggedIn());
    if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
      // Detect wallet change
      if (address !== auth.getWalletAddress()) {
        console.log("Should call login", address, auth.getWalletAddress(), chain?.id);
        auth.login(address, signMessage).catch((error) => {
          console.log("Login failed:", error);
          disconnect();
        });
      }
    } else {
      console.log("Disconnected from Sepolia Chain");
      disconnect();
      auth.logout();
    }
  }, [ isConnected ]);

  // React.useEffect(() => {
  //   auth.logout();
  // }, [ disconnect ]);





  // React.useEffect(() => {
  //   console.log(auth.accountAddress, address);
  //   if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
  //     console.log("Connected to Sepolia Chain");
  //     if (auth.accountAddress !== address) {
  //       auth.login(address, signMessageAsync)
  //         .then(() => {
  //           console.log("Login successful");
  //         })
  //         .catch((error) => {
  //           console.log("Login failed:", error);
  //           disconnect();
  //           auth.logout();
  //         });
  //     }
  //   } else {
  //     console.log("Disconnected from Sepolia Chain");
  //     disconnect();
  //     auth.logout();
  //   }
  // }, [isConnected, address, chain]);

  return (
    <div className="connectDetails">
      <ConnectButton />
    </div>
  );
};

export default WalletFunction;