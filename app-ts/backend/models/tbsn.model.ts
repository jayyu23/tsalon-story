import mongoose, { Schema, Document, Model } from 'mongoose';

const offset = 75000;

interface ICounter extends Document {
    _id: string;
    seq: number;
}

const counterSchema: Schema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const counterModel: Model<ICounter> = mongoose.model<ICounter>('counter', counterSchema);

const autoIncrementTBSN = function (modelName: string, doc: any, next: (err?: any) => void) {
    counterModel.findByIdAndUpdate(
        modelName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }).then(counter => {
            doc.tbsn = counter.seq + offset;
            next();
        })
        .catch(error => next(error));;
};

export default autoIncrementTBSN;