import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteUrl } from '@/app/lib/site.config';
import styles from '../blog.module.css';
import BlogPostClient from './BlogPostClient';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    views: number;
    createdAt: string;
}

function calculateReadingTime(htmlContent: string): string {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const res = await fetch(`${siteUrl}/api/blog?slug=${slug}&noinc=true`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) {
        return {
            title: 'Blog Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }
    const blog: BlogPost = await res.json();
    const readingTime = calculateReadingTime(blog.content);
    const coverImageUrl = blog.coverImage ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${siteUrl}${blog.coverImage}`) : undefined;

    return {
        title: blog.title,
        description: `${blog.excerpt} • ${readingTime} • ${blog.views} views`,
        openGraph: {
            title: blog.title,
            description: `${blog.excerpt} • ${readingTime} • ${blog.views} views`,
            url: `${siteUrl}/blog/${slug}`,
            type: 'article',
            publishedTime: blog.createdAt,
            images: coverImageUrl ? [{
                url: coverImageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
            }] : undefined,
            // optional: tags: blog.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: `${blog.excerpt} • ${readingTime} • ${blog.views} views`,
            images: coverImageUrl ? [coverImageUrl] : undefined,
        },
    };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetch(`${siteUrl}/api/blog?slug=${slug}&noinc=true`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) {
        notFound();
    }
    const blog: BlogPost = await res.json();
    return <BlogPostClient blog={blog} slug={slug} />;
}
