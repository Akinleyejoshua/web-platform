'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Header, Footer, Loader } from '@/app/components';
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiEye } from 'react-icons/fi';
import { usePageViewTracker } from '@/app/hooks/useAnalyticsTracker';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import styles from '../blog.module.css';

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

interface BlogPostDetailProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostDetailPage({ params }: BlogPostDetailProps) {
    const { slug } = use(params);
    usePageViewTracker(`blog_detail_${slug}`);
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                let hasViewed = false;
                let viewedBlogs: string[] = [];

                if (typeof window !== 'undefined') {
                    try {
                        viewedBlogs = JSON.parse(localStorage.getItem('viewed_blogs') || '[]');
                        hasViewed = viewedBlogs.includes(slug);
                    } catch (e) {
                        console.error('Error reading localStorage:', e);
                    }
                }

                const url = `/api/blog?slug=${slug}${hasViewed ? '&noinc=true' : ''}`;
                const response = await axios.get(url);
                setBlog(response.data);

                if (typeof window !== 'undefined' && !hasViewed && response.data) {
                    try {
                        viewedBlogs.push(slug);
                        localStorage.setItem('viewed_blogs', JSON.stringify(viewedBlogs));
                    } catch (e) {
                        console.error('Error writing localStorage:', e);
                    }
                }
            } catch (err: any) {
                console.error('Failed to load article:', err);
                setError(err.response?.data?.error || 'Article not found');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    useEffect(() => {
        if (blog) {
            hljs.highlightAll();
        }
    }, [blog]);

    const getReadingTime = (htmlContent: string) => {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200);
        return `${time} min read`;
    };

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    if (error || !blog) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <main className={styles.mainContent}>
                    <div className={styles.articleWrapper} style={{ textAlign: 'center' }}>
                        <Link href="/blog" className={styles.backLink}>
                            <FiArrowLeft /> Back to Blog
                        </Link>
                        <h2 style={{ marginTop: '2rem' }}>Error Loading Article</h2>
                        <p>{error || 'The requested technical write-up does not exist.'}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            
            <main className={styles.mainContent}>
                <article className={styles.articleWrapper}>
                    {/* Back to list */}
                    <Link href="/blog" className={styles.backLink}>
                        <FiArrowLeft /> Back to Articles
                    </Link>

                    {/* Article Header */}
                    <header className={styles.articleHeader}>
                        <span className={styles.badge}>Technical Article</span>
                        <h1 className={styles.articleTitle}>{blog.title}</h1>
                        <div className={styles.articleMeta}>
                            <span className={styles.metaItem}>
                                <FiCalendar size={14} />
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className={styles.metaItem}>
                                <FiClock size={14} />
                                {getReadingTime(blog.content)}
                            </span>
                            <span className={styles.metaItem}>
                                <FiEye size={14} />
                                {blog.views || 0} views
                            </span>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <div className={styles.articleCoverContainer}>
                            <img 
                                src={blog.coverImage} 
                                alt={blog.title} 
                                className={styles.articleCover} 
                            />
                        </div>
                    )}

                    {/* Rich HTML Content */}
                    <div 
                        className={styles.articleContent}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className={styles.articleTags}>
                            {blog.tags.map(tag => (
                                <span key={tag} className={styles.cardTag} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
}
