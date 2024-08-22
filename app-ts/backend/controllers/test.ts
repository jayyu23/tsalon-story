import { http } from 'viem';
import { Account, privateKeyToAccount, Address } from 'viem/accounts';
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

// Register an IP asset with an NFT
const registerIPAsset = async () => {
    const account: Account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

    const config: StoryConfig = {
    transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
    account: account, // the account object from above
    chainId: "sepolia",
    };

    const client = StoryClient.newClient(config);

    const response = await client.ipAsset.register({
    nftContract: '0x9d79c1feacfc8db2b0d850931262fe2849b30921', // your NFT contract address
    tokenId: "750070000", // your NFT token ID
    txOptions: { waitForTransaction: true }
    });

    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`);
    return response;
}

export { registerIPAsset };
