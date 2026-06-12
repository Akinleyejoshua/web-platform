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
            {/* Left Side: Meta Info (Date & Company) */}
            <div className={styles.metaSide}>
                <div className={styles.dateBlock}>
                    <span className={styles.dateText}>
                        {formattedStart} — {formattedEnd}
                    </span>
                    {isCurrent && <span className={styles.currentBadge}>Current</span>}
                </div>
                <div className={styles.companyName}>{company}</div>
            </div>

            {/* Middle: Elegant Divider Dot & Line */}
            <div className={styles.dividerSide}>
                <div className={styles.dot} />
                <div className={styles.line} />
            </div>

            {/* Right Side: Details & Achievements */}
            <div className={styles.detailsSide}>
                <h3 className={styles.roleTitle}>{role}</h3>
                {description.length > 0 && (
                    <ul className={styles.descriptions}>
                        {description.map((item, index) => (
                            <li key={index} className={styles.descItem}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
