import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import About from '@/app/lib/models/about';
import { getCachedSection } from '@/app/lib/cache';

export async function GET(request: NextRequest) {
    try {
        // Check for cached data (non-admin requests only)
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        if (!isAdmin) {
            const cached = await getCachedSection('about');
            if (cached) {
                return NextResponse.json(cached, { status: 200 });
            }
        }

        await connectDB();
        let about = await About.findOne();

        if (!about) {
            about = await About.create({});
        }

        return NextResponse.json(about, { status: 200 });
    } catch (error) {
        console.error('About GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch about data' },
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

        let about:any = await About.findOne();

        if (!about) {
            about = await About.create(data);
        } else {
            about = await About.findByIdAndUpdate(about._id, data, { new: true });
        }

        return NextResponse.json(about, { status: 200 });
    } catch (error) {
        console.error('About PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update about data' },
            { status: 500 }
        );
    }
}
