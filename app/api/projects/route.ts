import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Project from '@/app/lib/models/project';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const query = category && category !== 'all' ? { category } : {};
        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Projects GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();
        const project = await Project.create(data);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Projects POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
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
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndUpdate(_id, updateData, { new: true });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error('Projects PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
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
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
    } catch (error) {
        console.error('Projects DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
