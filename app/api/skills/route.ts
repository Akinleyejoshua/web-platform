import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import Skill from '@/app/lib/models/skill';

export async function GET() {
    try {
        await connectDB();
        const skills = await Skill.find().sort({ order: 1, name: 1 }).lean();
        return NextResponse.json(skills, { status: 200 });
    } catch (error) {
        console.error('Skill GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const guard = denyIfReadOnly(request);
    if (guard) return guard;
    try {
        await connectDB();
        const data = await request.json();
        const skill = await Skill.create(data);
        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error('Skill POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create skill' },
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
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json(
                { error: 'Skill ID is required' },
                { status: 400 }
            );
        }

        const skill = await Skill.findByIdAndUpdate(_id, updateData, { new: true });

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(skill, { status: 200 });
    } catch (error) {
        console.error('Skill PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update skill' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const guard = denyIfReadOnly(request);
    if (guard) return guard;
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Skill ID is required' },
                { status: 400 }
            );
        }

        const skill = await Skill.findByIdAndDelete(id);

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Skill deleted' }, { status: 200 });
    } catch (error) {
        console.error('Skill DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
}
