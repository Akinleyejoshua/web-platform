'use client';

import React from 'react';
import { Section } from '@/app/components/layout/section';
import { TimelineItem } from '@/app/components/molecules/timeline-item';
import { Loader } from '@/app/components/atoms/loader';
import { useExperience } from '@/app/hooks/use-experience';
import styles from './experience.module.css';

export function Experience() {
    const { experiences, isLoading, error } = useExperience();

    return (
        <Section
            id="experience"
            title="Experience"
            subtitle="My professional journey and career milestones"
        >
            {isLoading ? (
                <Loader variant="section" />
            ) : error ? (
                <p className={styles.empty}>Unable to load experiences</p>
            ) : experiences.length === 0 ? (
                <p className={styles.empty}>No experiences to display yet.</p>
            ) : (
                <div className={styles.timeline}>
                    {experiences.map((exp) => (
                        <TimelineItem
                            key={exp._id as any}
                            role={exp.role}
                            company={exp.company}
                            startDate={exp.startDate.toString()}
                            endDate={exp.endDate?.toString() || null}
                            isCurrent={exp.isCurrent}
                            description={exp.description}
                        />
                    ))}
                </div>
            )}
        </Section>
    );
}
