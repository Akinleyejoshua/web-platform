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
    const { products, isLoading, activeCategory, setActiveCategory } = useProductProjects();

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
                <Loader variant="section" />
            ) : products.length === 0 ? (
                <p className={styles.empty}>No products in this category yet.</p>
            ) : (
                <Carousel>
                    {products.map((product) => (
                        <ProjectCard
                            key={product._id as any}
                            title={product.title}
                            description={product.description}
                            mediaType={product.mediaType}
                            mediaUrl={product.mediaUrl}
                            technologies={product.technologies}
                            liveUrl={product.liveUrl}
                        />
                    ))}
                </Carousel>
            )}
        </Section>
    );
}
