import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Analytics from '@/app/lib/models/analytics';

function getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { type, target, sessionId } = body;

        if (!type || !target) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const today = getTodayDate();

        let updateQuery: any = {};

        switch (type) {
            case 'pageView':
                updateQuery = {
                    $inc: { views: 1 }
                };
                break;

            case 'sectionView':
                updateQuery = {
                    $inc: { [`sectionViews.${target}`]: 1 }
                };
                break;

            case 'click':
                updateQuery = {
                    $inc: { [`clicks.${target}`]: 1 }
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid tracking type' },
                    { status: 400 }
                );
        }

        const analytics = await Analytics.findOneAndUpdate(
            { date: today },
            updateQuery,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Failed to track event' },
            { status: 500 }
        );
    }
}
