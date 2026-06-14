import mongoose, { Schema, Document } from 'mongoose';

/**
 * Cache entry for storing section data.
 * Used to avoid hitting the database on high-traffic public pages.
 */
export interface ICache extends Document {
    section: string;
    data: unknown;
    cachedAt: Date;
}

const CacheSchema = new Schema<ICache>(
    {
        section: {
            type: String,
            required: true,
            unique: true,
            enum: [
                'hero',
                'about',
                'contact',
                'skills',
                'experience',
                'projects',
                'product-projects',
                'blog',
                'settings',
                'resume',
                'cover-letter',
            ],
        },
        data: {
            type: Schema.Types.Mixed,
            required: true,
        },
        cachedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// TTL index to auto-expire cache after 30 days (optional)
// CacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Cache;
}

export default mongoose.models.Cache ||
    mongoose.model<ICache>('Cache', CacheSchema);
