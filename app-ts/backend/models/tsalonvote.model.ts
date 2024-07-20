import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITSalonVote extends Document {
    voter: string;
    address: string;
    comment?: string;
    tbsn: number;
    numVotes: number;
    date: Date;
}

const TSalonVoteSchema: Schema = new Schema({
    voter: {
        type: String,
    },
    // We use address as the unique identifier for the voter
    address: {
        type: String,
        required: [true, "Wallet required"],
    },
    comment: {
        type: String,
    },
    tbsn: {
        type: Number,
        required: [true, "TBSN required"],
    },
    numVotes: {
        type: Number,
        required: [true, "Number of Votes required"],
    },
    date: {
        type: Date,
        required: [true, "Date required"],
    }
});

const TSalonVoteModel: Model<ITSalonVote> = mongoose.model<ITSalonVote>('TSalonVote', TSalonVoteSchema);

export default TSalonVoteModel;