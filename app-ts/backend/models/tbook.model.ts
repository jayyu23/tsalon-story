import mongoose, { Schema, Document } from 'mongoose';
import tsalonvoteModel from './tsalonvote.model';
import autoIncrementTBSN from './tbsn.model';

interface ITBookDraft extends Document {
    tbsn: number;
    author: string;
    title?: string;
    blurb?: string;
    content?: string;
    createDate: Date;
    lastSaveDate: Date;
    coverImage?: string;
    stage: string;
    pubMode?: string;
    reviewDate?: Date;
    lastReviewDate?: Date;
    numVotes: number;
    numViews: number;
    voters: typeof tsalonvoteModel[];
}

const TBookDraftSchema: Schema = new Schema({
    tbsn: {
        type: Number,
        unique: true,
        // required: [true, "TBook Serial Number (TBSN) is required"],
    },
    author: { type: String, required: [true, "Author is required"] },
    title: { type: String },
    blurb: { type: String },
    content: { type: String },
    createDate: { type: Date, default: new Date() },
    lastSaveDate: { type: Date, default: new Date() },
    coverImage: { type: String },
    stage: { type: String, default: "draft" }, // draft, review, publish
    pubMode: { type: String }, // green, blue
    reviewDate: { type: Date },
    lastReviewDate: { type: Date },
    numVotes: { type: Number, default: 0 },
    numViews: { type: Number, default: 0 },
    voters: { type: [tsalonvoteModel.schema] },
});

TBookDraftSchema.pre<ITBookDraft>("save", function (next) {
    if (!this.isNew) {
        next();
        return;
    }
    console.log('pre save');
    autoIncrementTBSN("TBookPub", this, next);
});

export default mongoose.model<ITBookDraft>("TBookDraft", TBookDraftSchema);