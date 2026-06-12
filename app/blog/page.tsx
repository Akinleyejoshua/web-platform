'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Header, Footer, Loader } from '@/app/components';
import { FiSearch, FiCalendar, FiClock, FiChevronRight, FiTag, FiEye } from 'react-icons/fi';
import { usePageViewTracker } from '@/app/hooks/useAnalyticsTracker';
import styles from './blog.module.css';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    createdAt: string;
    content: string;
    views?: number;
}

export default function BlogIndexPage() {
    usePageViewTracker('blog');
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('/api/blog');
                setBlogs(response.data);
            } catch (error) {
                console.error('Failed to load blog posts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Get all unique tags from blogs
    const allTags = Array.from(
        new Set(blogs.flatMap(blog => blog.tags || []))
    );

    // Filtered blogs
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = 
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;

        return matchesSearch && matchesTag;
    });

    const getReadingTime = (htmlContent: string) => {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200); // 200 WPM
        return `${time} min read`;
    };

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            
            <main className={styles.mainContent}>
                {/* Hero Header */}
                <div className={styles.heroSection}>
                    <div className={styles.container}>
                        <span className={styles.badge}>Technical Writing</span>
                        <h1 className={styles.heroTitle}>Engineering Blog & Write-ups</h1>
                        <p className={styles.heroSub}>
                            Deep dives into software architecture, full-stack technologies, system design, and product engineering.
                        </p>
                    </div>
                </div>

                <div className={styles.container}>
                    {/* Controls */}
                    <div className={styles.controlsRow}>
                        {/* Search Bar */}
                        <div className={styles.searchWrapper}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search articles or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Tag Pills */}
                        <div className={styles.tagsContainer}>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`${styles.tagPill} ${!selectedTag ? styles.tagPillActive : ''}`}
                            >
                                All Posts
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    className={`${styles.tagPill} ${tag === selectedTag ? styles.tagPillActive : ''}`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Post Grid */}
                    {filteredBlogs.length === 0 ? (
                        <div className={styles.noResults}>
                            <h3>No articles found</h3>
                            <p>Try adjusting your search terms or filter tags.</p>
                        </div>
                    ) : (
                        <div className={styles.blogGrid}>
                            {filteredBlogs.map(blog => (
                                <article key={blog._id} className={styles.blogCard}>
                                    <div className={styles.cardHeader}>
                                        {blog.coverImage ? (
                                            <img 
                                                src={blog.coverImage} 
                                                alt={blog.title} 
                                                className={styles.coverImage} 
                                            />
                                        ) : (
                                            <div className={styles.coverFallback}>
                                                <span>{blog.title.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                        <div className={styles.cardBody}>
                                            <div className={styles.metaRow}>
                                                <span className={styles.metaItem}>
                                                    <FiCalendar size={13} />
                                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className={styles.metaItem}>
                                                    <FiClock size={13} />
                                                    {getReadingTime(blog.content)}
                                                </span>
                                                <span className={styles.metaItem}>
                                                    <FiEye size={13} />
                                                    {blog.views || 0} views
                                                </span>
                                            </div>

                                        <h3 className={styles.cardTitle}>
                                            <Link href={`/blog/${blog.slug}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>

                                        <p className={styles.cardExcerpt}>{blog.excerpt}</p>

                                        <div className={styles.tagsRow}>
                                            {blog.tags.map(tag => (
                                                <span key={tag} className={styles.cardTag}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <Link href={`/blog/${blog.slug}`} className={styles.readMoreLink}>
                                                Read Full Article
                                                <FiChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
