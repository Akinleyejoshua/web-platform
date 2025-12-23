import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import About from '@/app/lib/models/about';

export async function GET() {
    try {
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
    try {
        await connectDB();
        const data = await request.json();

        let about = await About.findOne();

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
