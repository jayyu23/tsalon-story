import { createWalletClient, http, formatEther, publicActions, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { abi as TBookFactoryABI } from '../../../artifacts/contracts/TBookFactory.sol/TBookFactory.json';
import { NextFunction } from 'express';
import { get } from 'lodash';

require('dotenv').config({ path: __dirname + '/../../../.env' });
// console.log('Init - Loading environment variables from %s.', __dirname + '../../../.env');

// Change this to be auto-updated
const ETH_USD_API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum"

const contractAddress = '0x9d79c1feacfc8db2b0d850931262fe2849b30921';
const walletClient = createWalletClient({
  chain: sepolia,
  account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
  transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
}).extend(publicActions);

const tBookFactory = getContract({
  address: contractAddress,
  abi: TBookFactoryABI,
  client: { public: walletClient, wallet: walletClient },
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

const getTBookNFT = async (req: any, res: any) => {
  try {
    const tbsn = BigInt(req.params.tbsn);
    const tBook: any = await tBookFactory.read.tbooks([tbsn]);
    console.log(tBook);
    res.status(200).json(toTBookJSON(tBook));
  } catch (error) {
    res.status(500).json({ error });
  }
}

const getTBSNCopy = (id: bigint) => {
  return { tbsn: (id / BigInt(10000)).toString(), copyNumber: (id % BigInt(10000)).toString() };
}

const getCollection = async (address: string) => {
  console.log("Getting collection for address", address);
  const tBooks: any = await tBookFactory.read.getOwnedTBooks([address]);
  console.log(tBooks);
  const authoredTBooks: any = await tBookFactory.read.getAuthoredTBooks([address]);
  console.log(authoredTBooks);
  // Convert BigInt array to string array
  return {
    address: address,
    collection: tBooks.map((tBook: bigint) => getTBSNCopy(tBook)),
    authored: authoredTBooks.map((tBook: bigint) => tBook.toString()),
  };
}

// TODO: getAuthoredTBooks


// TODO: getAllTBooks
type PublishFields = { tbsn: number, address: string, copies: number };

const publishTBookNFT = async (fields: PublishFields) => {
  try {
    const tx = await tBookFactory.write.createTBook([BigInt(fields.tbsn), BigInt(fields.copies), fields.address], {
      client: { wallet: walletClient },
    });
    console.log({ message: 'TBook published', tx: tx });
    return tx;
  } catch (error) {
    throw error;
  }
}

const publishTBook = async (req: any, res: any) => {
  try {
    const fields: PublishFields = { tbsn: req.body.tbsn, address: req.body.walletAddress, copies: req.body.copies };
    const tx = await publishTBookNFT(fields);
    return tx;
  } catch (error) {
    throw error;
  }
}

const getPrice = async (req: any, res: any) => {
  try {
    const tbsn = BigInt(req.params.tbsn);
    const priceWei: any = await tBookFactory.read.getCurrentPrice([tbsn]);
    const priceETH = formatEther(priceWei);
    const rate = await fetch(ETH_USD_API).then((response) => response.json());
    const priceUSD = Number(priceETH) * Number(rate[0].current_price);
    res.status(200).json({ priceETH: priceETH, priceUSD: priceUSD.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// TODO: Sync database TBooks with Blockchain TBooks


export default { getTBookNFT, getCollection, publishTBook, getPrice };