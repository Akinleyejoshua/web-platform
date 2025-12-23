import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import ProductProject from '@/app/lib/models/productProject';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const query = category && category !== 'all' ? { category } : {};
        const products = await ProductProject.find(query).sort({ order: 1, createdAt: -1 });

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
