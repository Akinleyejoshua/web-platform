'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Header, Footer } from '@/app/components';
import { FiArrowLeft, FiCalendar, FiClock, FiTag, FiEye, FiShare2 } from 'react-icons/fi';
import { usePageViewTracker } from '@/app/hooks/useAnalyticsTracker';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import styles from '../blog.module.css';
import { siteUrl } from '@/app/lib/site.config';

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

interface BlogPostClientProps {
    blog: BlogPost;
    slug: string;
}

export default function BlogPostClient({ blog: initialBlog, slug }: BlogPostClientProps) {
    const [blog, setBlog] = useState<BlogPost>(initialBlog);
    const [shareText, setShareText] = useState('Share');
    const [isLoading, setIsLoading] = useState(false);

    usePageViewTracker(`blog_detail_${slug}`);

    // Increment view if not already viewed
    useEffect(() => {
        let hasViewed = false;
        if (typeof window !== 'undefined') {
            try {
                const viewed: string[] = JSON.parse(localStorage.getItem('viewed_blogs') || '[]');
                hasViewed = viewed.includes(slug);
            } catch (e) {
                console.error('Error reading localStorage:', e);
            }
        }

        if (!hasViewed) {
            // Increment view via API (without noinc)
            setIsLoading(true);
            fetch(`${window.location.origin}/api/blog?slug=${slug}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to increment view');
                    return res.json();
                })
                .then((data: BlogPost) => {
                    setBlog(prev => ({ ...prev, views: data.views }));
                    // Mark as viewed in localStorage
                    try {
                        const viewed: string[] = JSON.parse(localStorage.getItem('viewed_blogs') || '[]');
                        localStorage.setItem('viewed_blogs', JSON.stringify([...viewed, slug]));
                    } catch (e) {
                        console.error('Error writing localStorage:', e);
                    }
                })
                .catch(err => console.error('Failed to update view count:', err))
                .finally(() => setIsLoading(false));
        }
    }, [slug]);

    // Syntax highlighting
    useEffect(() => {
        if (blog) {
            hljs.highlightAll();
        }
    }, [blog]);

    const getReadingTime = (htmlContent: string) => {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const time = Math.ceil(words / 200);
        return `${time} min read`;
    };

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const title = blog?.title || 'Check out this technical article!';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setShareText('Copied!');
                setTimeout(() => setShareText('Share'), 2000);
            } catch (err) {
                console.error('Failed to copy share link:', err);
            }
        }
    };

    if (isLoading && blog.views === 0) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <main className={styles.mainContent}>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p>Updating view count...</p>
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
                    <Link href="/blog" className={styles.backLink}>
                        <FiArrowLeft /> Back to Articles
                    </Link>
                    <header className={styles.articleHeader}>
                        <span className={styles.badge}>Technical Article</span>
                        <h1 className={styles.articleTitle}>{blog.title}</h1>
                        <div className={styles.articleMeta} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
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
                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '16px',
                                    padding: '6px 14px',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-accent)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.color = 'var(--color-accent)';
                                }}
                            >
                                <FiShare2 size={13} />
                                {shareText}
                            </button>
                        </div>
                    </header>
                    {blog.coverImage && (
                        <div className={styles.articleCoverContainer}>
                            <img src={absoluteUrl(blog.coverImage)} alt={blog.title} className={styles.articleCover} />
                        </div>
                    )}
                    <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: blog.content }} />
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

function absoluteUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${siteUrl}${url}`;
}
