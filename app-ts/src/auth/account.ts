// Handles Account Authentication with Wagmi
import { useAccount, useDisconnect } from "wagmi";

// Util functions to check for account and disconnect
export function Account() {
  const account = useAccount();
  const disconnect = useDisconnect();

  return { account, disconnect };
}