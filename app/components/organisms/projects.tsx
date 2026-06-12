'use client';

import React from 'react';
import { Section } from '@/app/components/layout/section';
import { ProjectCard } from '@/app/components/molecules/project-card';
import { CategoryTabs } from './category-tabs';
import { Loader } from '@/app/components/atoms/loader';
import { Carousel } from './carousel';
import { useProjects } from '@/app/hooks/use-projects';
import styles from './projects.module.css';

export function Projects() {
    const { projects, isLoading, error, activeCategory, setActiveCategory, page, setPage, total, limit, refetch } = useProjects();

    const totalPages = Math.ceil(total / limit);

    return (
        <Section
            id="projects"
            title="Projects"
            subtitle="Explore my latest work across various domains"
            className={styles.projects}
            alternate
        >
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {isLoading ? (
                <div className={styles.loaderWrapper}>
                    <Loader variant="section" />
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <p className={styles.errorText}>Something went wrong loading projects.</p>
                    <button className={styles.retryBtn} onClick={() => refetch()}>
                        Try Again
                    </button>
                </div>
            ) : projects.length === 0 ? (
                <p className={styles.empty}>No projects in this category yet.</p>
            ) : (
                <>
                    <Carousel key={page}>
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id as any}
                                title={project.title}
                                description={project.description}
                                mediaType={project.mediaType}
                                mediaUrl={project.mediaUrl}
                                assets={project.assets}
                                technologies={project.technologies}
                                githubUrl={project.githubUrl}
                                liveUrl={project.liveUrl}
                                blogUrl={project.blogUrl}
                            />
                        ))}
                    </Carousel>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
                            {Array.from({ length: totalPages }, (_, idx) => {
                                const pageNum = idx + 1;
                                const isActive = page === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
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
