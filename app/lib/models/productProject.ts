import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProductCategory = 'saas' | 'b2b' | 'b2c' | 'tool' | 'other';

export interface IAsset {
    type: 'image' | 'video' | 'youtube' | 'loom' | 'external';
    url: string;
}

export interface IProductProject extends Document {
    title: string;
    description: string;
    category: ProductCategory;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    assets?: IAsset[];
    technologies: string[];
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

const ProductProjectSchema = new Schema<IProductProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ['saas', 'b2b', 'b2c', 'tool', 'other'],
            required: true,
            default: 'saas',
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        mediaUrl: { type: String, default: '' },
        assets: { type: [AssetSchema], default: [] },
        technologies: { type: [String], default: [] },
        liveUrl: { type: String, default: '' },
        featured: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProductProjectSchema.index({ isVisible: 1, category: 1, order: 1, createdAt: -1 });

const ProductProject: Model<IProductProject> =
    mongoose.models.ProductProject || mongoose.model<IProductProject>('ProductProject', ProductProjectSchema);

export default ProductProject;

