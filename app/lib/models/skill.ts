import mongoose, { Schema, Document, Model } from 'mongoose';

export type SkillCategory =
    | 'frontend'
    | 'backend'
    | 'database'
    | 'devops'
    | 'mobile'
    | 'design'
    | 'tools'
    | 'ai-ml'
    | 'other';

export interface ISkill extends Document {
    name: string;
    category: SkillCategory;
    /** Simple Icons identifier (e.g. "react", "typescript", "mongodb"). */
    iconName: string;
    /** Optional brand color override (hex). */
    color?: string;
    /** Self-rated proficiency 0-100. */
    proficiency: number;
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
    {
        name: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: [
                'frontend',
                'backend',
                'database',
                'devops',
                'mobile',
                'design',
                'tools',
                'ai-ml',
                'other',
            ],
            default: 'other',
            required: true,
        },
        iconName: { type: String, required: true, trim: true, lowercase: true },
        color: { type: String, default: '' },
        proficiency: { type: Number, default: 80, min: 0, max: 100 },
        order: { type: Number, default: 0 },
        isVisible: { type: Boolean, default: true },
    },
    { timestamps: true }
);

SkillSchema.index({ order: 1 });
SkillSchema.index({ category: 1, order: 1 });

const Skill: Model<ISkill> =
    mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
