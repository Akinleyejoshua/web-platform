import React from 'react';
import { SocialIcon } from '@/app/components/atoms/social-icon';
import styles from './social-link.module.css';

interface SocialLinkProps {
    platform: string;
    url: string;
    className?: string;
}

export function SocialLink({ platform, url, className = '' }: SocialLinkProps) {
    const href = platform.toLowerCase() === 'email' ? `mailto:${url}` : url;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} ${className}`.trim()}
            aria-label={`Visit ${platform}`}
            title={platform}
        >
            <SocialIcon platform={platform} size={20} />
        </a>
    );
}
