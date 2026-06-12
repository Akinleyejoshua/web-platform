import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import BlogPost from '@/app/lib/models/blogPost';

// GET: fetch all blog posts, or filter by isVisible/slug
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const admin = searchParams.get('admin');

        if (slug) {
            let blog;
            const noinc = searchParams.get('noinc');
            if (admin || noinc === 'true') {
                blog = await BlogPost.findOne({ slug }).lean();
            } else {
                blog = await BlogPost.findOneAndUpdate(
                    { slug, isVisible: true },
                    { $inc: { views: 1 } },
                    { new: true }
                ).lean();
            }
            if (!blog) {
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }
            return NextResponse.json(blog, { status: 200 });
        }

        const query: any = {};
        if (!admin) {
            query.isVisible = true;
        }

        const blogs = await BlogPost.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error('Blog GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// Helper function to generate unique slug
async function generateUniqueSlug(title: string): Promise<string> {
    let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    if (!baseSlug) baseSlug = 'post';

    let slug = baseSlug;
    let count = 1;
    while (await BlogPost.findOne({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }
    return slug;
}

// POST: create a new blog post
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();

        if (!data.title || !data.content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // Generate slug if not provided or empty
        if (!data.slug) {
            data.slug = await generateUniqueSlug(data.title);
        } else {
            // Sanitize custom slug
            data.slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            // Check uniqueness
            const existing = await BlogPost.findOne({ slug: data.slug });
            if (existing) {
                return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
            }
        }

        if (!data.excerpt) {
            // Auto generate excerpt from content
            const plainText = data.content.replace(/<[^>]*>/g, '');
            data.excerpt = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
        }

        const blog = await BlogPost.create(data);
        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('Blog POST error:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}

// PUT: update an existing blog post
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const data = await request.json();
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        // Sanitize slug if it was changed
        if (updateData.slug) {
            updateData.slug = updateData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const existing = await BlogPost.findOne({ slug: updateData.slug, _id: { $ne: _id } });
            if (existing) {
                return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
            }
        }

        const blog = await BlogPost.findByIdAndUpdate(_id, updateData, { new: true });
        if (!blog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error('Blog PUT error:', error);
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }
}

// DELETE: remove a blog post
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        const blog = await BlogPost.findByIdAndDelete(id);
        if (!blog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Blog DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}
