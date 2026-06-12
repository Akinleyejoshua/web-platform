'use client';

import React from 'react';
import { Section } from '@/app/components/layout/section';
import { ProjectCard } from '@/app/components/molecules/project-card';
import { Carousel } from './carousel';
import { Loader } from '@/app/components/atoms/loader';
import { useProductProjects } from '@/app/hooks/use-product-projects';
import styles from './projects.module.css';

const categoryLabels: Record<string, string> = {
    all: 'All Products',
    saas: 'SaaS',
    b2b: 'B2B',
    b2c: 'B2C',
    tool: 'Tools',
    other: 'Other',
};

export function ProductProjects() {
    const { products, isLoading, error, activeCategory, setActiveCategory, refetch } = useProductProjects();
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 4;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <Section
            id="product-projects"
            title="Enterprise Products"
            subtitle="Innovative product solutions powering businesses worldwide"
            className={styles.projects}
        >
            {/* Category Tabs */}
            <div className={styles.categoryTabs}>
                {Object.entries(categoryLabels).map(([key, label]) => (
                    <button
                        key={key}
                        className={`${styles.categoryTab} ${activeCategory === key ? styles.active : ''}`}
                        onClick={() => setActiveCategory(key as any)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className={styles.loaderWrapper}>
                    <Loader variant="section" />
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <p className={styles.errorText}>Something went wrong loading products.</p>
                    <button className={styles.retryBtn} onClick={() => refetch()}>
                        Try Again
                    </button>
                </div>
            ) : products.length === 0 ? (
                <p className={styles.empty}>No products in this category yet.</p>
            ) : (
                <>
                    <Carousel key={currentPage}>
                        {visibleProducts.map((product) => (
                            <ProjectCard
                                key={product._id as any}
                                title={product.title}
                                description={product.description}
                                mediaType={product.mediaType}
                                mediaUrl={product.mediaUrl}
                                assets={product.assets}
                                technologies={product.technologies}
                                liveUrl={product.liveUrl}
                                blogUrl={product.blogUrl}
                            />
                        ))}
                    </Carousel>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
                            {Array.from({ length: totalPages }, (_, idx) => {
                                const pageNum = idx + 1;
                                const isActive = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        style={{
                                            background: isActive ? 'linear-gradient(135deg, var(--color-accent), #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: isActive ? 'none' : '1px solid var(--color-border)',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </Section>
    );
}
