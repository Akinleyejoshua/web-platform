import React from 'react';
import styles from './timeline-item.module.css';

interface TimelineItemProps {
    role?: string;
    company?: string;
    startDate?: string;
    endDate?: string | null;
    isCurrent?: boolean;
    description?: string[];
    className?: string;
    isLoading?: boolean;
}

function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function TimelineItem({
    role = '',
    company = '',
    startDate = '',
    endDate = null,
    isCurrent = false,
    description = [],
    className = '',
    isLoading = false,
}: TimelineItemProps) {
    if (isLoading) {
        return (
            <div className={`${styles.item} ${className}`.trim()} style={{ pointerEvents: 'none' }}>
                {/* Left Side: Meta Info Skeleton */}
                <div className={styles.metaSide}>
                    <div className="skeleton" style={{ width: '120px', height: '1rem', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ width: '80px', height: '1.25rem' }} />
                </div>

                {/* Middle: Divider dot & Line */}
                <div className={styles.dividerSide}>
                    <div className={`${styles.dot} skeleton`} style={{ background: 'var(--color-border)' }} />
                    <div className={styles.line} />
                </div>

                {/* Right Side: Details Skeleton */}
                <div className={styles.detailsSide}>
                    <div className="skeleton" style={{ width: '150px', height: '1.5rem', marginBottom: '12px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="skeleton" style={{ width: '100%', height: '1rem' }} />
                        <div className="skeleton" style={{ width: '90%', height: '1rem' }} />
                    </div>
                </div>
            </div>
        );
    }

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
