import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
    date: string;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
    {
        date: { type: String, required: true, unique: true },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

AnalyticsSchema.index({ date: -1 });

const Analytics: Model<IAnalytics> =
    mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
