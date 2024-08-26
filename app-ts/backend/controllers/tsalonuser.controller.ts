import { Request, Response, NextFunction } from 'express';
import tsalonuserModel from '../models/tsalonuser.model';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import crypto from 'crypto';
import { verifyMessage } from 'viem'

// import config from '../../config/config';
import blockchainController from './blockchain.controller';
import tbookModel from '../models/tbook.model';
import tsalonmessageController from './tsalonmessage.controller';

interface AuthRequest extends Request {
    auth?: {
        address: string;
    };
}

const config = {
    jwtSecret: crypto.randomBytes(32).toString('hex'),
}

const requireSignin = expressjwt({
    secret: config.jwtSecret,
    requestProperty: "auth",
    algorithms: ["HS256"],
  });

const getNonce = (req: Request, res: Response) => {
    const address = req.body.address;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    // Generate a random nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    const nonceMessage = `Welcome to TSalon! Sign to connect: ${nonce}`;

    // Store the nonce with the address. If no record, then create one.
    tsalonuserModel.find({ walletAddress: address }).exec().then(
        (acc) => {
            // Create new user record in DB
            if (acc.length === 0) {
                tsalonuserModel.create({ walletAddress: address, nonceMessage: nonceMessage, username: address }).then(
                    (acc) => {
                        tsalonmessageController.logMessage(address, "TSalon", 'Welcome to TSalon!', 
                            tsalonmessageController.welcomeMessage, new Date());
                        res.json({ nonce: nonceMessage });
                    },
                    (rej) => {
                        console.log(rej);
                        res.status(400).json({ error: rej });
                    }
                );
            } else {
                tsalonuserModel.findOneAndUpdate({ walletAddress: address }, { nonceMessage: nonceMessage }).exec().then(
                    (acc) => {
                        res.json({ nonce: nonceMessage });
                    },
                    (rej) => {
                        console.log(rej);
                        res.status(400).json({ error: rej });
                    }
                );
            }
        },
        (rej) => res.status(400).json({ error: rej })
    );
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
    // Verify the signature.
    const address = req.body.address;
    if (address === undefined) {
        return res.status(400).json({ error: 'Address is required' });
    }
    console.log(address);
    try {
        const results = await tsalonuserModel.findOne({ walletAddress: address }).exec();
        if (results) {
            const nonce = results.nonceMessage;
            const signature = req.body.signature;
            const verified = await verifyMessage({
                address: address,
                message: nonce,
                signature,
            });
            if (!verified) {
                return res.status(400).json({ error: 'Login error' });
            }
            const token = jwt.sign(
                { address: address },
                config.jwtSecret
            );
            res.cookie('t', token, { expires: new Date(Date.now() + 9999) });
            return res.status(200).json({
                token,
                address,
                registered: true,
                user: results,
            });
        } else {
            return res.status(400).json({ error: 'Address not found' });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const hasAuthorization = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('hasAuthorization', req.body.walletAddress, req.auth);
    const authorized =
        req.body.walletAddress &&
        req.auth &&
        req.body.walletAddress.toLowerCase() === req.auth.address.toLowerCase();
    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized',
        });
    }
    next();
};

const passedAuthentication = (req: Request, res: Response) => {
    return res.status(200).json({ success: true });
};

// const userIsHolder = (req: Request, res: Response) => {
//     const address = req.body.walletAddress;
//     blockchainController.isUserHolder(address).then(
//         (acc) => res.status(200).json({ success: true, salonite: acc }),
//         (rej) => res.status(400).json({ success: false, error: rej })
//     );
// };

const getCollection = async (req: any, res: any) => {
    try {
        const walletAddress = req.params.username;
        console.log('getCollection', walletAddress);
        const nfts = await blockchainController.getCollection(walletAddress);
        const collectionTBSN = nfts.collection.map((t: {tbsn: string, copyNumber: string}) => t.tbsn);
        const authorTBSN = nfts.authored; // Only a list of TBSNs
        const collection = await tbookModel.find({ tbsn: { $in: collectionTBSN }, stage: 'publish' }).exec();
        const authored = await tbookModel.find({ tbsn: { $in: authorTBSN }, stage: 'publish' }).exec();
        res.status(200).json({ success: true, tbooks: {
            collection,
            authored,
        }, nfts });
    } catch (error) {
        res.status(500).json({ success: false, error });   
    }

};

// const getAddressFromUsername = (req: Request, res: Response, next: NextFunction, username: string) => {
//     const usernameFiltered = username.replace(/_/g, ' ');
//     tsalonuserModel.findOne({ username: { $regex: usernameFiltered, $options: 'i' } })
//         .exec()
//         .then(
//             (acc) => {
//                 const walletAddress = acc.walletAddress;
//                 req.walletAddress = walletAddress;
//                 req.username = acc.username;
//                 next();
//             },
//             (rej) => res.status(400).json({ success: false, error: rej })
//         );
// };

const getGreenTokens = (req: Request, res: Response) => {
    const username = req.body.username;
    tsalonuserModel.findOne({ username })
        .select({ username: 1, greenTokens: 1 })
        .exec()
        .then(
            (acc) => {
                if (acc) {
                    return res.status(200).json({ success: true, greenTokens: acc.greenTokens, username: acc.username });
                } else {
                    return res.status(400).json({ success: false, error: 'acc is null' });
                }
            },
            (rej) => res.status(400).json({ success: false, error: rej })
        );
};

export default {
    signin,
    getNonce,
    requireSignin,
    hasAuthorization,
    passedAuthentication,
    // getAddressFromUsername,
    getCollection,
    // userIsHolder,
    getGreenTokens,
};