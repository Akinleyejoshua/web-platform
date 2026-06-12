import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectCategory = 'web' | 'ml' | 'web3' | 'data-science' | 'others';
export type MediaType = 'image' | 'video';

export interface IAsset {
    type: 'image' | 'video' | 'youtube' | 'loom' | 'external';
    url: string;
}

export interface IProject extends Document {
    title: string;
    description: string;
    category: ProjectCategory;
    mediaType: MediaType;
    mediaUrl: string;
    assets?: IAsset[];
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    isVisible: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema = new Schema({
    type: {
        type: String,
        enum: ['image', 'video', 'youtube', 'loom', 'external'],
        default: 'image',
    },
    url: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ['web', 'ml', 'web3', 'data-science', 'others'],
            required: true,
            default: 'web',
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        mediaUrl: { type: String, default: '' },
        assets: { type: [AssetSchema], default: [] },
        technologies: { type: [String], default: [] },
        githubUrl: { type: String, default: '' },
        liveUrl: { type: String, default: '' },
        featured: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProjectSchema.index({ isVisible: 1, category: 1, order: 1, createdAt: -1 });

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

