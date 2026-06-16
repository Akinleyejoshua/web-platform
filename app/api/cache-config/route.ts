import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Settings from '@/app/lib/models/settings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const settings = await Settings.findOne().lean();
        const enableCache = settings ? !!settings.enableCache : false;

        return NextResponse.json({ enableCache }, { status: 200 });
    } catch (error) {
        console.error('Cache config GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cache config' },
            { status: 500 }
        );
    }
}
