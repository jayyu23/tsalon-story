import mongoose, { Schema, Document } from 'mongoose';

interface ITSalonUser extends Document {
    username: string;
    walletAddress: string;
    member: boolean;
    tbooksPublished: number[];
    tbooksCollected: number[];
    tbooksDrafted: number[];
    dailyVotes: number;
    votesUsed: number;
    lastVoted?: Date;
    greenTokens: number;
    nonceMessage: string; // Nonce. Refreshes every new login
}

const TSalonUserSchema: Schema = new Schema({

    // We use walletAddress as the unique identifier for the user
    walletAddress: {
        type: String,
        unique: true,
        required: [true, "Wallet address is required"],
    },
    username: {
        type: String,
        unique: true,
    },
    member: {
        type: Boolean,
        default: false,
    },
    tbooksPublished: {
        type: [Number],
        default: [],
    },
    tbooksCollected: {
        type: [Number],
        default: [],
    },
    tbooksDrafted: {
        type: [Number],
        default: [],
    },
    dailyVotes: {
        type: Number,
        default: 10,
    },
    votesUsed: {
        type: Number,
        default: 0,
    },
    lastVoted: {
        type: Date,
    },
    greenTokens: {
        type: Number,
        default: 0,
    },
    nonceMessage: {
        type: String,
    },
});

export default mongoose.model<ITSalonUser>('TSalonUser', TSalonUserSchema);