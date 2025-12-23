import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
    date: string;
    views: number;
    uniqueVisitors: number;
    sectionViews: Record<string, number>;
    clicks: Record<string, number>;
    createdAt: Date;
    updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
    {
        date: { type: String, required: true, unique: true },
        views: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        sectionViews: {
            type: Map,
            of: Number,
            default: {}
        },
        clicks: {
            type: Map,
            of: Number,
            default: {}
        },
    },
    { timestamps: true }
);

AnalyticsSchema.index({ date: -1 });

const Analytics: Model<IAnalytics> =
    mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
