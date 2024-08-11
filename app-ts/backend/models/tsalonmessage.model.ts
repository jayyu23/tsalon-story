import mongoose, { Document, Schema } from "mongoose";

interface ITSalonMessage extends Document {
    toName: string;
    fromName: string;
    title?: string;
    body?: string;
    date: Date;
    unread?: boolean;
}

const TSalonMessageSchema: Schema = new Schema({
    toName: {
        type: String,
        required: "To Username is required",
    },
    fromName: {
        type: String,
        required: "From Username is required"
    },
    title: {
        type: String,
        default: "Untitled Message"
    },
    body: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        required: "Message date required"
    },
    unread: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model<ITSalonMessage>("TSalonMessage", TSalonMessageSchema);