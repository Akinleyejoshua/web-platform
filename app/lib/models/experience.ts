import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperience extends Document {
    role: string;
    company: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
    {
        role: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        isCurrent: { type: Boolean, default: false },
        description: { type: [String], default: [] },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ExperienceSchema.index({ order: 1 });

const Experience: Model<IExperience> =
    mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
