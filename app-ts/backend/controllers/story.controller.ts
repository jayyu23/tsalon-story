import { http } from 'viem';
import { Account, privateKeyToAccount, Address } from 'viem/accounts';
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
require('dotenv').config({ path: __dirname + '/../../../.env' });

const account: Account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

const config: StoryConfig = {
transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
account: account,
chainId: "sepolia",
};


// Register an IP asset with an NFT
const registerIPAsset = async (tokenId: string, nftContract: Address) => {

    const client = StoryClient.newClient(config);

    const response = await client.ipAsset.register({
    nftContract: nftContract,
    tokenId: tokenId, // your NFT token ID
    txOptions: { waitForTransaction: true }
    });

    return response;
}

export { registerIPAsset };
