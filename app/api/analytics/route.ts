import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Analytics from '@/app/lib/models/analytics';

function getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

export async function GET() {
    try {
        await connectDB();

        // Get last 30 days of analytics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const analytics = await Analytics.find({
            date: { $gte: startDate },
        }).sort({ date: -1 });

        // Calculate total views
        const totalViews = analytics.reduce((sum, entry) => sum + entry.views, 0);

        return NextResponse.json({
            totalViews,
            dailyStats: analytics,
        }, { status: 200 });
    } catch (error) {
        console.error('Analytics GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        await connectDB();
        const today = getTodayDate();

        // Increment today's view count
        const analytics = await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );

        return NextResponse.json(analytics, { status: 200 });
    } catch (error) {
        console.error('Analytics POST error:', error);
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        );
    }
}
