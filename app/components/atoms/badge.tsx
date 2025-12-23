import React from 'react';
import styles from './badge.module.css';

type BadgeVariant = 'default' | 'outline' | 'muted';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`.trim()}>
            {children}
        </span>
    );
}
