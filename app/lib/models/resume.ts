import mongoose, { Schema, Document, Model } from 'mongoose';

export type ResumeDomain = 'web' | 'data-science' | 'ml' | 'web3' | 'others';

export interface IResume extends Document {
    domain: ResumeDomain;
    summary: string;
    skills: string[];
    highlights: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
    {
        domain: {
            type: String,
            enum: ['web', 'data-science', 'ml', 'web3', 'others'],
            required: true,
            unique: true,
            index: true,
        },
        summary: {
            type: String,
            default: '',
        },
        skills: {
            type: [String],
            default: [],
        },
        highlights: {
            type: [String],
            default: [],
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

const Resume: Model<IResume> =
    (mongoose.models.Resume as Model<IResume>) ||
    mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
