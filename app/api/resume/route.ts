import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import Resume from '@/app/lib/models/resume';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');

        if (domain) {
            const resume = await Resume.findOne({ domain }).lean();
            return NextResponse.json(resume, { status: 200 });
        }

        const resumes = await Resume.find().sort({ domain: 1 }).lean();
        return NextResponse.json(resumes, { status: 200 });
    } catch (error) {
        console.error('Resume GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
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

        if (!data.domain) {
            return NextResponse.json(
                { error: 'Domain is required' },
                { status: 400 }
            );
        }

        const existing = await Resume.findOne({ domain: data.domain });
        if (existing) {
            return NextResponse.json(
                { error: 'A resume for this domain already exists. Use PUT to update.' },
                { status: 409 }
            );
        }

        const resume = await Resume.create(data);
        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        console.error('Resume POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create resume' },
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
        const { _id, domain, ...updateData } = data;

        let resume;

        if (_id) {
            resume = await Resume.findByIdAndUpdate(_id, updateData, { new: true });
        } else if (domain) {
            resume = await Resume.findOneAndUpdate(
                { domain },
                { ...updateData, domain },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
        } else {
            return NextResponse.json(
                { error: 'Either _id or domain is required' },
                { status: 400 }
            );
        }

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(resume, { status: 200 });
    } catch (error) {
        console.error('Resume PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update resume' },
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
                { error: 'Resume ID is required' },
                { status: 400 }
            );
        }

        const resume = await Resume.findByIdAndDelete(id);

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Resume deleted' }, { status: 200 });
    } catch (error) {
        console.error('Resume DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
