import tsalonmessageModel from "../models/tsalonmessage.model";

const reviewMessage: string = "Congratulations! Your draft has successfully been submitted for review. When enough peer Salonites have voted for your work, your writing will be published publicly as a TBook.";

const publishMessage = (tbsn: string) => {
    return `Congratulations! Your TBook ${tbsn} has been published. You can now view it in the TBookstore by clicking 'Explore'.`;
}

const welcomeMessage: string = "Welcome to TSalon! TSalon is a pioneering Web3 Publishing House dedicated to creating a co-creation community of writers and readers. TSalon is built on the Ethereum blockchain using Story Protocol to mint stories as NFTs";

import { Request, Response, NextFunction } from "express";

const sendMessage = (req: Request, res: Response, next: NextFunction): void => {
    const toName = req.body.toName;
    const fromName = req.body.fromName;
    const title = req.body.title;
    const body = req.body.body;
    const date = req.body.date || new Date();
    logMessage(toName, fromName, title, body, date).then((result) => {
        if (result) {
            res.status(200).json({ success: true, message: result });
        } else {
            res.status(400).json({ success: false });
        }
    });
};

const logMessage = async (toName: string, fromName: string, title: string, body: string, date: Date) => {
    console.log("Log message");
    try {
        const newMessage = await tsalonmessageModel.create({ toName, fromName, title, body, date });
        return newMessage;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getMessages = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.username;
    tsalonmessageModel.find({ toName: user })
        .sort({ date: -1 })
        .exec()
        .then((acc) => {
            res.status(200).json({ success: true, messages: acc });
        })
        .catch((rej) => {
            res.status(400).json({ success: false, error: rej });
        });
};

export default { sendMessage, logMessage, getMessages, publishMessage, reviewMessage, welcomeMessage };