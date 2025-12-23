import React from 'react';
import styles from './timeline-item.module.css';

interface TimelineItemProps {
    role: string;
    company: string;
    startDate: string;
    endDate: string | null;
    isCurrent?: boolean;
    description: string[];
    className?: string;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function TimelineItem({
    role,
    company,
    startDate,
    endDate,
    isCurrent = false,
    description,
    className = '',
}: TimelineItemProps) {
    const formattedStart = formatDate(startDate);
    const formattedEnd = endDate ? formatDate(endDate) : 'Present';

    return (
        <div className={`${styles.item} ${isCurrent ? styles.current : ''} ${className}`.trim()}>
            <div className={styles.marker}>
                <span className={styles.dot} />
                <span className={styles.line} />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.role}>{role}</h3>
                    <p className={styles.company}>
                        {company}
                        {isCurrent && <span className={styles.currentBadge}>Current</span>}
                    </p>
                    <p className={styles.date}>
                        {formattedStart} — {formattedEnd}
                    </p>
                </div>

                {description.length > 0 && (
                    <ul className={styles.descriptions}>
                        {description.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
