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

const client = StoryClient.newClient(config);

// Register an IP asset with an NFT
const registerIPAsset = async (tokenId: string, nftContract: Address) => {
    const response = await client.ipAsset.register({
    nftContract: nftContract,
    tokenId: tokenId, // your NFT token ID
    txOptions: { waitForTransaction: true }
    });

    console.log("IP ID: ", response.ipId);

    const license = await client.license.attachLicenseTerms({
        licenseTermsId: "1",
        ipId: response.ipId!,
        txOptions: { waitForTransaction: true }
    })

    return {...response, license};
}

const registerIPDerivative = async (tokenId: string, parentTokenId: string, nftContract: Address) => {
    const parentIp = await registerIPAsset(parentTokenId, nftContract);
    const childIp = await registerIPAsset(tokenId, nftContract);
    console.log("Parent IP ID: ", parentIp);
    console.log("Child IP ID: ", childIp);
    const response = await client.ipAsset.registerDerivative({
        childIpId: childIp.ipId!,
        parentIpIds: [ parentIp.ipId! ],
        licenseTermsIds: ["1"],
    });
    
    return response;
}

export { registerIPAsset, registerIPDerivative };
