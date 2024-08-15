import { createWalletClient, http, parseEther, publicActions } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { encodeFunctionData } from 'viem/utils';
import { abi as TBookFactoryABI, bytecode as TBookFactoryBytecode } from '../artifacts/contracts/TBookFactory.sol/TBookFactory.json';
import 'dotenv/config';

// Set up the account from the private key
const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

async function main() {
  // Create a wallet client for Sepolia
  const walletClient = createWalletClient({
    chain: sepolia,
    account,
    transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
  }).extend(publicActions);

  console.log('Deploying contracts with the account:', account.address);

  // Deploy the contract
  const hash = await walletClient.deployContract({
    account,
    abi: TBookFactoryABI, // Contract ABI
    bytecode: `0x${TBookFactoryBytecode.slice(2)}`, // Contract bytecode
    args: [account.address], // Constructor arguments
  });

  // Wait for the transaction to be mined
  const receipt = await walletClient.waitForTransactionReceipt({ hash });

  console.log('TBookFactory deployed to:', receipt.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });