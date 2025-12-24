'use client';

import React from 'react';
import { Section } from '@/app/components/layout/section';
import { ProjectCard } from '@/app/components/molecules/project-card';
import { CategoryTabs } from './category-tabs';
import { Carousel } from './carousel';
import { useProjects } from '@/app/hooks/use-projects';
import styles from './projects.module.css';

export function Projects() {
    const { projects, isLoading, activeCategory, setActiveCategory } = useProjects();

    return (
        <Section
            id="projects"
            title="Enterprise Projects"
            subtitle="Explore my latest work across various domains"
            className={styles.projects}
            alternate
        >
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
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
