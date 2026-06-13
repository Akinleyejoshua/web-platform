'use client';

import React from 'react';
import { Section } from '@/app/components/layout/section';
import { Loader } from '@/app/components/atoms/loader';
import { IconWrapper } from '@/app/components/atoms/icon-wrapper';
import { useSkills } from '@/app/hooks/use-skills';
import { getTechIcon, getTechBrandColor } from '@/app/lib/tech-icons';
import styles from './skills.module.css';

type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'design' | 'tools' | 'ai-ml' | 'other';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Databases',
    devops: 'DevOps & Cloud',
    mobile: 'Mobile',
    design: 'Design & Creative',
    tools: 'Tools & Others',
    'ai-ml': 'AI / Machine Learning',
    other: 'Other',
};

const CATEGORY_ORDER: SkillCategory[] = [
    'frontend',
    'backend',
    'devops',
    'database',
    'mobile',
    'design',
    'tools',
    'ai-ml',
    'other',
];

export function Skills() {
    const { skills, isLoading, error, refetch } = useSkills();

    // Group visible skills by category, sorted by order
    const groupedSkills = skills
        .filter((s) => s.isVisible)
        .sort((a, b) => a.order - b.order)
        .reduce((acc, skill) => {
            const cat = skill.category as SkillCategory;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {} as Record<SkillCategory, typeof skills>);

    const hasSkills = Object.keys(groupedSkills).length > 0;

    return (
        <Section
            id="skills"
            title="Skills & Technologies"
            subtitle="Technologies and tools I work with"
            className={styles.skills}
            alternate
        >
            {isLoading ? (
                <div className={styles.loaderWrapper}>
                    <Loader variant="section" />
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <p className={styles.errorText}>Something went wrong loading skills.</p>
                    <button className={styles.retryBtn} onClick={() => refetch()}>
                        Try Again
                    </button>
                </div>
            ) : !hasSkills ? (
                <p className={styles.empty}>No skills to display yet.</p>
            ) : (
                <div className={styles.container}>
                    {CATEGORY_ORDER.map((category) => {
                        const catSkills = groupedSkills[category];
                        if (!catSkills || catSkills.length === 0) return null;

                        return (
                            <div key={category} className={styles.categoryGroup}>
                                <h3 className={styles.categoryTitle}>
                                    {CATEGORY_LABELS[category]}
                                </h3>
                                <div className={styles.skillGrid}>
                                    {catSkills.map((skill) => {
                                        const IconComponent = getTechIcon(skill.iconName);
                                        // Use custom color if set, otherwise use brand color from mapping
                                        const brandColor = skill.color || getTechBrandColor(skill.iconName);
                                        return (
                                            <div
                                                key={skill._id as any}
                                                className={styles.skillCard}
                                                title={skill.name}
                                                data-has-color={brandColor ? 'true' : 'false'}
                                                style={
                                                    brandColor
                                                        ? {
                                                            '--skill-color': brandColor,
                                                            '--skill-color-tint': `${brandColor}15`,
                                                            '--skill-color-light': `${brandColor}10`,
                                                        } as React.CSSProperties
                                                        : undefined
                                                }
                                            >
                                                <div className={styles.iconWrapper}>
                                                    <IconWrapper size="lg">
                                                        <IconComponent size={24} color={brandColor || 'currentColor'} />
                                                    </IconWrapper>
                                                </div>
                                                <div className={styles.skillInfo}>
                                                    <span className={styles.skillName}>{skill.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Section>
    );
}
