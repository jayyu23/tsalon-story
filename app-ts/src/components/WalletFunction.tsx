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
  const { setSession, clearSession, isLoggedIn } = useAuth();

  React.useEffect(() => {
    clearSession();
  }, [ disconnect ]);


  const login = async (address: string) => {
    console.log("Login called");
    // assume connect called. this can be a wallet switch. Requests the nonce ONLY.
    if (isLoggedIn) {
      clearSession();
    }

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
      clearSession();
      console.log("Login failed:", error);
      throw error;
    }
  }

  React.useEffect(() => {
    console.log(isConnected, address, chain);
    if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
      console.log("Connected to Sepolia Chain");
      login(address).catch((error) => {
        console.log("Login failed:", error);
        disconnect();
        clearSession();
      });
    } else {
      console.log("Disconnected from Sepolia Chain");
      disconnect();
      clearSession();
    }
  }, [isConnected, address, chain]);

  return (
    <div className="connectDetails">
      <ConnectButton />
    </div>
  );
};

export default WalletFunction;








//   React.useEffect(() => {
//     console.log(auth.isLoggedIn());
// }, [auth.isLoggedIn]);

  // React.useEffect(() => {
  //   console.log(isConnected, auth.isLoggedIn());
  //   if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
  //     // Detect wallet change
  //     if (address !== auth.getWalletAddress()) {
  //       // const response = await axios.post(endpoints.getNonceAPI(), { address });
  //       axios.post(endpoints.getNonceAPI(), { address })
  //       .then(response => {
  //           const nonce = response.data.nonce;
  //           const signedMessage = signMessageAsync({ message: nonce }, {
  //             onSuccess: (data: string) => {
  //               console.log("Signed message: ", data);





  //             },
  //             onError: (error: Error) => {
  //               if (error.name === "TypeError") {
  //                 console.log("hi")
  //                 console.log(error);
  //               } else {
  //                 console.error("Error signing message: ", error);
  //                 disconnect();
  //                 auth.logout();
  //               }
  //             }
  //           });
            
  //       });


        
  //       console.log("Should call login", address, auth.getWalletAddress(), chain?.id);
  //       // signMessage({message: "Login to Sepolia"});
  //       // auth.login(address, signMessage).catch((error) => {
  //       //   console.log("Login failed:", error);
  //       //   disconnect();
  //       // });
  //     }
  //   } else {
  //     console.log("Disconnected from Sepolia Chain");
  //     disconnect();
  //     auth.logout();
  //   }
  // }, [ isConnected ]);

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