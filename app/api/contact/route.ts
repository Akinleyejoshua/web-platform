import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Contact from '@/app/lib/models/contact';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import { getCachedSection } from '@/app/lib/cache';

export async function GET(request: NextRequest) {
    try {
        // Check for cached data (non-admin requests only)
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        if (!isAdmin) {
            const cached = await getCachedSection('contact');
            if (cached) {
                return NextResponse.json(cached, { status: 200 });
            }
        }

        await connectDB();
        let contact = await Contact.findOne();

        if (!contact) {
            contact = await Contact.create({});
        }

        return NextResponse.json(contact, { status: 200 });
    } catch (error) {
        console.error('Contact GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contact data' },
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

        let contact:any = await Contact.findOne();

        if (!contact) {
            contact = await Contact.create(data);
        } else {
            contact = await Contact.findByIdAndUpdate(contact._id, data, { new: true });
        }

        return NextResponse.json(contact, { status: 200 });
    } catch (error) {
        console.error('Contact PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update contact data' },
            { status: 500 }
        );
    }
}
