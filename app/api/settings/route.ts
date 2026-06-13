import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import Settings from '@/app/lib/models/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const guard = denyIfReadOnly(request);
    if (guard) return guard;
    try {
        await connectDB();
        const data = await request.json();

        let settings: any = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(data);
        } else {
            settings = await Settings.findByIdAndUpdate(settings._id, data, {
                new: true,
            });
        }

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Settings PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
