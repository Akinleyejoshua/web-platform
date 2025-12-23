import React from 'react';
import styles from './icon-wrapper.module.css';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconWrapperProps {
    size?: IconSize;
    children: React.ReactNode;
    className?: string;
}

export function IconWrapper({ size = 'md', children, className = '' }: IconWrapperProps) {
    return (
        <span className={`${styles.icon} ${styles[size]} ${className}`.trim()}>
            {children}
        </span>
    );
}
