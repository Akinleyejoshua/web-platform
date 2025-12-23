import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
    email: string;
    phone: string;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        email: { type: String, required: true, default: 'hello@example.com' },
        phone: { type: String, default: '' },
    },
    { timestamps: true }
);

const Contact: Model<IContact> =
    mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
