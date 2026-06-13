import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import CoverLetter from '@/app/lib/models/coverLetter';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');

        if (domain) {
            const coverLetter = await CoverLetter.findOne({ domain }).lean();
            return NextResponse.json(coverLetter, { status: 200 });
        }

        const coverLetters = await CoverLetter.find().sort({ domain: 1 }).lean();
        return NextResponse.json(coverLetters, { status: 200 });
    } catch (error) {
        console.error('CoverLetter GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cover letter' },
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

        const existing = await CoverLetter.findOne({ domain: data.domain });
        if (existing) {
            return NextResponse.json(
                { error: 'A cover letter for this domain already exists. Use PUT to update.' },
                { status: 409 }
            );
        }

        const coverLetter = await CoverLetter.create(data);
        return NextResponse.json(coverLetter, { status: 201 });
    } catch (error) {
        console.error('CoverLetter POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create cover letter' },
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

        let coverLetter;

        if (_id) {
            coverLetter = await CoverLetter.findByIdAndUpdate(_id, updateData, { new: true });
        } else if (domain) {
            coverLetter = await CoverLetter.findOneAndUpdate(
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

        if (!coverLetter) {
            return NextResponse.json(
                { error: 'Cover letter not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(coverLetter, { status: 200 });
    } catch (error) {
        console.error('CoverLetter PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update cover letter' },
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
                { error: 'Cover letter ID is required' },
                { status: 400 }
            );
        }

        const coverLetter = await CoverLetter.findByIdAndDelete(id);

        if (!coverLetter) {
            return NextResponse.json(
                { error: 'Cover letter not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Cover letter deleted' }, { status: 200 });
    } catch (error) {
        console.error('CoverLetter DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete cover letter' },
            { status: 500 }
        );
    }
}
