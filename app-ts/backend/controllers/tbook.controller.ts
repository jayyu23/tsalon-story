import express, { Request, Response, NextFunction } from 'express';
import tbookModel from '../models/tbook.model';
import tsalonmessageController from './tsalonmessage.controller';
import tsalonuserModel from '../models/tsalonuser.model';
import blockchainController from './blockchain.controller';

// Define custom interfaces for the request object
interface IRequestWithDraft extends Request {
    draft?: any;
    drafts?: any[];
}

const create = (req: Request, res: Response, next: NextFunction) => {
    console.log('Create - TEST ONLY');
    const fields = req.body;
    fields.author = 'test';
    fields.stage = 'publish';
    const draft = new tbookModel(fields);
    draft.save().then(
        (acc) => res.status(200).json({ message: 'Draft success', draft: acc }),
        (rej) => res.status(400).json({ error: rej.message })
    );
}

const update = (req: Request, res: Response, next: NextFunction) => {
    console.log('update');
    const fields = req.body;
    console.log(fields);

    if (fields.tbsn === 0) {
        // Create
        console.log("create");
        const draft = new tbookModel(fields);
        draft.save().then(
            (acc) => {
                console.log(acc);
                res.status(200).json({ message: 'Draft success', draft: acc })},
            (rej) => res.status(400).json({ error: rej.message })
        );
    } else {
        // Save and Update - check if author is correct
        tbookModel
            .findOneAndUpdate(
                { tbsn: fields.tbsn },
                {
                    $set: {
                        title: fields.title,
                        blurb: fields.blurb,
                        content: fields.content,
                        lastSaveDate: new Date(),
                        coverImage: fields.coverImage,
                        pubMode: fields.pubMode,
                    },
                },
                { new: true } // to return the modified document
            )
            .exec()
            .then(
                (acc) => res.status(200).json({ message: 'Update success', draft: acc }),
                (rej) => res.status(400).json({ error: rej.message })
            );
    }
};

const list = (req: IRequestWithDraft, res: Response, next: NextFunction) => {
    const drafts = req.drafts || [];
    const stage1 = drafts.filter(d => d.stage === 'draft');
    const stage2 = drafts.filter(d => d.stage === 'review');
    return res.status(200).json({ status: 'success', stage1, stage2 });
};

const publicList = (req: Request, res: Response, next: NextFunction) => {
    tbookModel
        .find({ stage: 'publish' })
        .sort({ tbsn: -1 })
        .exec()
        .then(
            (acc) => res.status(200).json(acc),
            (rej) => res.status(400).json({ error: rej.message })
        );
};

const getFromTBSN = (req: IRequestWithDraft, res: Response, next: NextFunction, tbsn: number) => {
    tbookModel
        .findOne({ tbsn })
        .exec()
        .then(
            (acc) => {
                req.draft = acc;
                next();
            },
            (rej) => res.status(400).json({ error: rej.message })
        );
};

const getFromUsername = (req: IRequestWithDraft, res: Response, next: NextFunction, username: string) => {
    const usernameFiltered = username.replace(/_/g, ' ');
    tbookModel
        .find({
            author: { $regex: usernameFiltered, $options: 'i' },
        })
        .sort({ lastSaveDate: -1 })
        .exec()
        .then(
            (acc) => {
                req.drafts = acc;
                next();
            },
            (rej) => res.status(400).json({ error: rej.message })
        );
};

const read = (req: IRequestWithDraft, res: Response) => {
    const publication = req.draft;
    if (publication) {
        return res.status(200).json(publication);
    } else {
        return res.status(400).json({ error: 'Invalid TBSN' });
    }
};

const publicRead = (req: IRequestWithDraft, res: Response) => {
    const publication = req.draft;
    if (publication && publication.stage === 'publish') {
        return res.status(200).json(publication);
    } else {
        return res.status(400).json({ error: 'Invalid TBSN' });
    }
};

const deleteDraft = (req: IRequestWithDraft, res: Response) => {
    const draft = req.draft;
    if (draft) {
        tbookModel.deleteOne({ tbsn: draft.tbsn }).then(
            (acc) => res.status(200).json({ status: 'success', data: acc }),
            (rej) => res.status(400).json({ status: 'reject', message: rej.message })
        );
    } else {
        return res.status(404).json({ status: 'reject', message: 'No draft found' });
    }
};

// TODO: Implement this function
const submitForReview = async (req: Request, res: Response) => {
    try {
        const fields = req.body;
        const tbsn = fields.tbsn;
        const pubMode = fields.pubMode;

        if (!tbsn) {
            return res.status(400).json({ success: false, message: 'No TBSN found' });
        }

        if (pubMode === 'green') {
            const acc = await tbookModel.findOneAndUpdate({ tbsn }, { $set: { stage: 'publish', reviewDate: new Date() } });
            if (acc) {
                // tsalonuserModel.findOneAndUpdate({ username: acc.author }, { $inc: { greenTokens: -1 } }).exec();
                // Publish onto the Blockchain
                const publishResponse = await blockchainController.publishTBook(req, res);
                tsalonmessageController.logMessage(
                    acc.author,
                    'TSalon',
                    `Draft #${acc.tbsn} – "${acc.title}" Self-Published`,
                    `Congratulations! Your writing "${acc.title}" has been as TBook #${tbsn}.
                     As the author, you will receive a free mint of the NFT. Users can view this TBook publicly on the TBookstore \n\n
                     Transaction hash: ${publishResponse.tx}`,
                    new Date()
                );
                return res.status(200).json({ success: true, publishResponse });
            } else {
                return res.status(400).json({ success: false, message: 'Update failed' });
            }
        } else {
            // Then set the stage for review
            const acc = await tbookModel.findOneAndUpdate(
                { tbsn },
                {
                    $set: {
                        stage: 'review',
                        reviewDate: new Date(),
                    },
                }
            );
            if (acc) {
                // tsalonmessageController.logMessage(
                //     acc.author,
                //     'TSalon',
                //     `Draft #${acc.tbsn} – "${acc.title}" Submitted for Review`,
                //     tsalonmessageController.reviewMessage,
                //     new Date()
                // );
                return res.status(200).json({ success: true });
            } else {
                return res.status(400).json({ success: false, message: 'Update failed' });
            }
        }
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

export default {
    update,
    create,
    list,
    read,
    getFromUsername,
    getFromTBSN,
    deleteDraft,
    submitForReview,
    publicList,
    publicRead,
};