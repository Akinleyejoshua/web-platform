'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Container } from './container';
import styles from './section.module.css';

interface SectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    alternate?: boolean;
    animated?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function Section({
    id,
    title,
    subtitle,
    alternate = false,
    animated = true,
    children,
    className = '',
}: SectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(!animated);

    useEffect(() => {
        if (!animated) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [animated]);

    return (
        <section
            ref={sectionRef}
            id={id}
            className={`
        ${styles.section}
        ${alternate ? styles.alternate : ''}
        ${animated ? styles.animated : ''}
        ${isVisible ? styles.visible : ''}
        ${className}
      `.trim()}
        >
            <Container>
                {(title || subtitle) && (
                    <div className={styles.header}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                        <span className={styles.accent} />
                    </div>
                )}
                {children}
            </Container>
        </section>
    );
}
