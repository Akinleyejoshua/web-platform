import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import Hero from '@/app/lib/models/hero';
import { getCachedSection } from '@/app/lib/cache';

export async function GET(request: NextRequest) {
    try {
        // Check for cached data (non-admin requests only)
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        if (!isAdmin) {
            const cached = await getCachedSection('hero');
            if (cached) {
                return NextResponse.json(cached, { status: 200 });
            }
        }

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
    const guard = denyIfReadOnly(request);
    if (guard) return guard;
    try {
        await connectDB();
        const data = await request.json();

        let hero:any = await Hero.findOne();

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
