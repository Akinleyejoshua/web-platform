'use client';

import React from 'react';
import styles from './loader.module.css';
import { useTheme } from '@/app/hooks/use-theme';

interface LoaderProps {
    variant?: 'fullscreen' | 'section' | 'inline';
    text?: string;
    className?: string;
}

export function Loader({ variant = 'fullscreen', text, className = '' }: LoaderProps) {
    const { isDark } = useTheme();

    // Construct class names based on variant
    const containerClasses = [
        styles.loader,
        variant === 'fullscreen' ? styles.fixed : '',
        variant === 'section' ? styles.section : '',
        variant === 'inline' ? styles.inline : '',
        isDark ? styles.dark : '', // Apply dark class for theme awareness
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} data-testid="loader">
            <div className={styles.ldCenter}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
            {text && <p>{text}</p>}
        </div>
    );
}
