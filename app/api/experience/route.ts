import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Experience from '@/app/lib/models/experience';

export async function GET() {
    try {
        await connectDB();
        const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
        return NextResponse.json(experiences, { status: 200 });
    } catch (error) {
        console.error('Experience GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();
        const experience = await Experience.create(data);
        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error('Experience POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create experience' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json(
                { error: 'Experience ID is required' },
                { status: 400 }
            );
        }

        const experience = await Experience.findByIdAndUpdate(_id, updateData, { new: true });

        if (!experience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(experience, { status: 200 });
    } catch (error) {
        console.error('Experience PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update experience' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Experience ID is required' },
                { status: 400 }
            );
        }

        const experience = await Experience.findByIdAndDelete(id);

        if (!experience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Experience deleted' }, { status: 200 });
    } catch (error) {
        console.error('Experience DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete experience' },
            { status: 500 }
        );
    }
}
