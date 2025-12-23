import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectCategory = 'web' | 'ml' | 'web3' | 'others';
export type MediaType = 'image' | 'video';

export interface IProject extends Document {
    title: string;
    description: string;
    category: ProjectCategory;
    mediaType: MediaType;
    mediaUrl: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ['web', 'ml', 'web3', 'others'],
            required: true,
            default: 'web',
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        mediaUrl: { type: String, default: '' },
        technologies: { type: [String], default: [] },
        githubUrl: { type: String, default: '' },
        liveUrl: { type: String, default: '' },
        featured: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProjectSchema.index({ category: 1, order: 1 });

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
