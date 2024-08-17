import { createWalletClient, http, parseEther, publicActions, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { abi as TBookFactoryABI } from '../../../artifacts/contracts/TBookFactory.sol/TBookFactory.json';
import { NextFunction } from 'express';

require('dotenv').config({ path: __dirname + '/../../../.env' });
console.log('Init - Loading environment variables from %s.', __dirname + '../../../.env');

// Change this to be auto-updated
const contractAddress = '0x9d79c1feacfc8db2b0d850931262fe2849b30921';
const walletClient = createWalletClient({
    chain: sepolia,
    account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
    transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
  }).extend(publicActions);

const tBookFactory = getContract({
    address: contractAddress,
    abi: TBookFactoryABI,
    client: {public: walletClient, wallet: walletClient},
});

type TBook = [bigint, `0x${string}`, bigint, bigint];

const toTBookJSON = (tBook: TBook) => {
    return {
        tbsn: tBook[0].toString(),
        author: tBook[1],
        total_copies: tBook[2].toString(),
        current_copies: tBook[3].toString(),
      };
}

const getTBookNFT = (req: any, res: any, next: NextFunction) => {
  const tbsn = BigInt(req.params.tbsn);
  tBookFactory.read.tbooks([tbsn])
    .then((tBook: any) => {
      console.log(tBook);
      res.status(200).json(toTBookJSON(tBook));
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}

const getOwnedTBooks = (req: any, res: any, next: NextFunction) => {
    const address = req.params.address;
    tBookFactory.read.getOwnedTBooks([address])
        .then((tBooks: any) => {
        // convert this into a list of JSON objects
        console.log(tBooks);
        const tBooksJSON = tBooks.map(toTBookJSON);
        res.status(200).json({address: address, collection: tBooksJSON});
        })
        .catch((error) => {
        res.status(500).json({ message: error.message });
        });
}

export default { getTBookNFT, getOwnedTBooks };