import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPostAsset {
    type: 'image' | 'video' | 'youtube' | 'loom' | 'external';
    url: string;
}

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    assets?: IBlogPostAsset[];
    tags: string[];
    isVisible: boolean;
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

const BlogPostSchema = new Schema<IBlogPost>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        coverImage: { type: String, default: '' },
        assets: { type: [AssetSchema], default: [] },
        tags: { type: [String], default: [] },
        isVisible: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Optimize query for listing visible blogs sorted by creation date
BlogPostSchema.index({ isVisible: 1, createdAt: -1 });

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.BlogPost;
}

const BlogPost: Model<IBlogPost> =
    mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
