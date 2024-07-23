import { Request, Response, NextFunction } from 'express';
import tsalonuserModel from '../models/tsalonuser.model';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import crypto from 'crypto';
// import config from '../../config/config';
// import blockchainController from './blockchain.controller';
import tbookModel from '../models/tbook.model';
// import tsalonmessageController from './tsalonmessage.controller';

interface AuthRequest extends Request {
    auth?: {
        address: string;
    };
}

// In-memory store for nonces. In production, use a database.
const nonceStore: { [address: string]: string } = {};

const config = {
    jwtSecret: 'jwt',
}

const requireSignin = expressjwt({
    secret: config.jwtSecret,
    requestProperty: "auth",
    algorithms: ["HS256"],
  });

const getNonce = (req: Request, res: Response) => {
    console.log('getNonce');
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    // Generate a random nonce
    const nonce = crypto.randomBytes(32).toString('hex');

    // Store the nonce with the address
    nonceStore[address] = nonce;

    res.json({ nonce });
};

const signin = (req: Request, res: Response, next: NextFunction) => {
   
    const walletAddress = req.body.walletAddress.toLowerCase();
    console.log('signin ', walletAddress);
    if (walletAddress) {
        tsalonuserModel
            .find({ walletAddress })
            .exec()
            .then(
                (acc) => {
                    const results = acc;
                    if (results.length === 0) {
                        return res.status(200).json({ walletAddress, registered: false });
                    } else {
                        const token = jwt.sign(
                            { address: walletAddress },
                            config.jwtSecret
                        );
                        res.cookie('t', token, { expires: new Date(Date.now() + 9999) });

                        return res.status(200).json({
                            token,
                            walletAddress,
                            registered: true,
                            user: results[0],
                        });
                    }
                },
                (rej) => res.status(400).json({ error: rej })
            );
    } else {
        return res.status(400).json({ error: 'Empty wallet address in request' });
    }
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, walletAddress } = req.body;
    if (username) {
        tsalonuserModel
            .find({ username: { $regex: username, $options: 'i' } })
            .exec()
            .then(
                (acc) => {
                    const results = acc;
                    if (results.length === 0) {
                        tsalonuserModel
                            .create({
                                username,
                                walletAddress,
                                greenTokens: 1,
                            })
                            .then(
                                (acc) => {
                                    const token = jwt.sign(
                                        { address: walletAddress },
                                        config.jwtSecret
                                    );
                                    res.cookie('t', token, { expires: new Date(Date.now() + 9999 ) });
                                    // tsalonmessageController.logMessage(username, 'TSalon', `Welcome to TSalon, ${username}!`, tsalonmessageController.welcomeMessage, new Date()).then(
                                        // () => {
                                            return res.status(200).json({
                                                token,
                                                walletAddress,
                                                success: true,
                                                user: username,
                                            });
                                        // },
                                        // () => { }
                                    // );
                                },
                                (rej) => res.status(400).json({ error: rej })
                            );
                    } else {
                        return res.status(200).json({ username, success: false });
                    }
                },
                (rej) => res.status(400).json({ error: rej })
            );
    } else {
        return res.status(400).json({ error: 'Empty username in the request' });
    }
};

const hasAuthorization = (req: AuthRequest, res: Response, next: NextFunction) => {
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

// const getCollection = (req: Request, res: Response) => {
//     const walletAddress = req.walletAddress;
//     blockchainController.getUserCollection(walletAddress).then(
//         (acc) => {
//             const chainData = acc;
//             const tbooks = chainData.map((t) => t.tbsn);
//             tbookModel.find({ tbsn: { $in: tbooks }, stage: 'publish' })
//                 .sort({ tbsn: -1 })
//                 .exec()
//                 .then(
//                     (acc) => res.status(200).json({ success: true, tbooks: acc, chainData, username: req.username }),
//                     (rej) => res.status(400).json({ success: false, error: rej })
//                 );
//         },
//         (rej) => res.status(400).json({ success: false, error: rej })
//     );
// };

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
    createUser,
    signin,
    getNonce,
    requireSignin,
    hasAuthorization,
    passedAuthentication,
    // getAddressFromUsername,
    // getCollection,
    // userIsHolder,
    getGreenTokens,
};