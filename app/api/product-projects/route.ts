import { NextRequest, NextResponse } from 'next/server';
import { denyIfReadOnly } from '@/app/lib/read-only-guard';
import connectDB from '@/app/lib/db';
import ProductProject from '@/app/lib/models/productProject';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const admin = searchParams.get('admin');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '0');

        const query: any = {};
        if (category && category !== 'all') query.category = category;
        if (!admin) query.isVisible = { $ne: false }; 

        if (limit > 0) {
            const total = await ProductProject.countDocuments(query);
            const skip = (page - 1) * limit;
            const products = await ProductProject.find(query)
                .sort({ order: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return NextResponse.json({ data: products, total }, { status: 200 });
        }

        const products = await ProductProject.find(query).sort({ order: 1, createdAt: -1 }).lean();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('ProductProjects GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product projects' },
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
        const product = await ProductProject.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('ProductProjects POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create product project' },
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
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const product = await ProductProject.findByIdAndUpdate(_id, updateData, { new: true });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('ProductProjects PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update product project' },
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
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const product = await ProductProject.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        console.error('ProductProjects DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete product project' },
            { status: 500 }
        );
    }
}
