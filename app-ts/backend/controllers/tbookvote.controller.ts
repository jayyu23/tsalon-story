import { Request, Response } from 'express';
import tbookModel from '../models/tbook.model';
import tsalonvoteModel from '../models/tsalonvote.model';
import tsalonuserModel from '../models/tsalonuser.model';
// import blockchainController from '../controllers/blockchain.controller';
import { map } from 'lodash';
// import tsalonmessageController from './tsalonmessage.controller';

const voteThreshold = 10;

const getReview = (req: Request, res: Response) => {
    const username = req.body.username;

    tsalonuserModel.findOne({ username }).exec().then((user) => {
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const today = new Date();
        const lastVotedDate = user.lastVoted;
        let currentVotes = user.dailyVotes - user.votesUsed;

        if (lastVotedDate && today >= lastVotedDate && today.toLocaleDateString() !== lastVotedDate.toLocaleDateString()) {
            currentVotes = user.dailyVotes;
            tsalonuserModel.findOneAndUpdate({ username }, { votesUsed: 0, lastVoted: today }).exec();
        }

        tbookModel
            .find({ stage: 'review' })
            .sort({ lastReviewDate: 1 })
            .exec()
            .then(
                (drafts) => {
                    let reviewDraft = null;
                    for (const draft of drafts) {
                        const voters = map(draft.voters, 'voter');
                        if (draft.author !== username && !voters.includes(username)) {
                            reviewDraft = draft;
                            break;
                        }
                    }

                    if (reviewDraft == null) {
                        res.status(200).json({ success: true, reviewDraft: null, currentVotes });
                    } else {
                        tbookModel
                            .updateOne(
                                { tbsn: reviewDraft.tbsn },
                                {
                                    $set: {
                                        lastReviewDate: new Date(),
                                    },
                                }
                            )
                            .then(
                                () => {
                                    res.status(200).json({ success: true, reviewDraft, currentVotes, voteThreshold });
                                },
                                () => {
                                    res.status(400).json({ success: false });
                                }
                            );
                    }
                },
                () => {
                    res.status(400).json({ success: false });
                }
            );
    });
};

// const submitVote = (req: Request, res: Response) => {
//     const { votes, username, walletAddress: address, tbsn, comments: comment } = req.body;
//     const voteDate = new Date();

//     tsalonvoteModel.create({ voter: username, address, tbsn, numVotes: votes, date: voteDate, comment }).then((newVote) => {
//         tsalonuserModel.findOneAndUpdate(
//             { username },
//             { lastVoted: new Date(), $inc: { votesUsed: votes } },
//             { returnDocument: 'after' }
//         ).exec();

//         tbookModel.findOneAndUpdate(
//             { tbsn },
//             { $push: { voters: newVote }, $inc: { numVotes: votes, numViews: 1 } },
//             { returnDocument: 'after' }
//         ).then((updatedDraft) => {
//             if (!updatedDraft) {
//                 return res.status(404).json({ success: false, message: 'Draft not found' });
//             }

//             tsalonmessageController.logMessage(updatedDraft.author, username, `#${tbsn} Peer Review`, `Comments: ${comment} | Votes earned: ${votes}`, new Date());

//             passThreshold(tbsn).then((pass) => {
//                 if (pass) {
//                     tsalonmessageController.logMessage(updatedDraft.author, 'TSalon', `#${tbsn} Published!`, `Congratulations! Your writing "${updatedDraft.title}" has passed peer review and been published as TBook #${tbsn}. 
//                          As the author, you will receive a free mint of the NFT. Users can view this TBook publicly at tsalon.io/view/${tbsn}`, new Date());

//                     tbookModel.findOneAndUpdate({ tbsn }, { stage: 'publish' }).exec().then(() => {
//                         blockchainController.publish(tbsn);
//                     });

//                     res.status(200).json({ success: true, published: true, draft: updatedDraft, vote: newVote });
//                 } else {
//                     res.status(200).json({ success: true, published: false, draft: updatedDraft, vote: newVote });
//                 }
//             });
//         }).catch((rej) => {
//             res.status(400).json({ success: false, error: rej.message });
//         });
//     }).catch((rej) => {
//         res.status(400).json({ success: false, error: rej.message });
//     });
// };

const passThreshold = async (tbsn: number): Promise<boolean> => {
    const result = await tbookModel.findOne({ tbsn }).exec();
    return result !== null && result.numVotes >= voteThreshold;
};

export default {
    getReview,
    passThreshold, 
    // submitVote
};