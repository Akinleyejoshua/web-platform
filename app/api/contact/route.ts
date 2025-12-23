import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Contact from '@/app/lib/models/contact';

export async function GET() {
    try {
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
