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
    const { projects, isLoading, error, activeCategory, setActiveCategory, refetch } = useProjects();

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
                <Carousel>
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
                        />
                    ))}
                </Carousel>
            )}
        </Section>
    );
}
