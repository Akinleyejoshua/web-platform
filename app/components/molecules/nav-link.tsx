'use client';

import React from 'react';
import styles from './nav-link.module.css';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    target?: string;
    rel?: string;
}

export function NavLink({ href, children, active = false, onClick, className = '', target, rel }: NavLinkProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        onClick?.();
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`${styles.link} ${active ? styles.active : ''} ${className}`.trim()}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
}
