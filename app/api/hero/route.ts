import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Hero from '@/app/lib/models/hero';

export async function GET() {
    try {
        await connectDB();
        let hero = await Hero.findOne();

        if (!hero) {
            hero = await Hero.create({});
        }

        return NextResponse.json(hero, { status: 200 });
    } catch (error) {
        console.error('Hero GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hero data' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();

        let hero = await Hero.findOne();

        if (!hero) {
            hero = await Hero.create(data);
        } else {
            hero = await Hero.findByIdAndUpdate(hero._id, data, { new: true });
        }

        return NextResponse.json(hero, { status: 200 });
    } catch (error) {
        console.error('Hero PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update hero data' },
            { status: 500 }
        );
    }
}
