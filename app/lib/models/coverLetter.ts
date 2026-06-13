import mongoose, { Schema, Document, Model } from 'mongoose';

export type CoverLetterDomain = 'web' | 'data-science' | 'ml' | 'web3' | 'others';

export interface ICoverLetter extends Document {
    domain: CoverLetterDomain;
    recipientName: string;
    recipientTitle: string;
    company: string;
    companyAddress: string;
    greeting: string;
    intro: string;
    body: string;
    closing: string;
    signature: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
    {
        domain: {
            type: String,
            enum: ['web', 'data-science', 'ml', 'web3', 'others'],
            required: true,
            unique: true,
            index: true,
        },
        recipientName: {
            type: String,
            default: 'Hiring Manager',
        },
        recipientTitle: {
            type: String,
            default: '',
        },
        company: {
            type: String,
            default: '',
        },
        companyAddress: {
            type: String,
            default: '',
        },
        greeting: {
            type: String,
            default: 'Dear Hiring Manager,',
        },
        intro: {
            type: String,
            default: '',
        },
        body: {
            type: String,
            default: '',
        },
        closing: {
            type: String,
            default: 'Sincerely,',
        },
        signature: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const CoverLetter: Model<ICoverLetter> =
    (mongoose.models.CoverLetter as Model<ICoverLetter>) ||
    mongoose.model<ICoverLetter>('CoverLetter', CoverLetterSchema);

export default CoverLetter;
