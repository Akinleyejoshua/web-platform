import React from 'react';
import styles from './container.module.css';

type ContainerSize = 'default' | 'fluid' | 'narrow';

interface ContainerProps {
    size?: ContainerSize;
    children: React.ReactNode;
    className?: string;
}

export function Container({ size = 'default', children, className = '' }: ContainerProps) {
    const sizeClass = size !== 'default' ? styles[size] : '';
    return (
        <div className={`${styles.container} ${sizeClass} ${className}`.trim()}>
            {children}
        </div>
    );
}
