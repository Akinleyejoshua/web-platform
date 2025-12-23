import React from 'react';
import {
    FiGithub,
    FiTwitter,
    FiLinkedin,
    FiInstagram,
    FiYoutube,
    FiMail,
    FiGlobe,
} from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';
import styles from './social-link.module.css';

interface SocialLinkProps {
    platform: string;
    url: string;
    className?: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    github: FiGithub,
    twitter: FiTwitter,
    linkedin: FiLinkedin,
    instagram: FiInstagram,
    youtube: FiYoutube,
    discord: FaDiscord,
    email: FiMail,
    website: FiGlobe,
};

export function SocialLink({ platform, url, className = '' }: SocialLinkProps) {
    const Icon = iconMap[platform.toLowerCase()] || FiGlobe;
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
            <Icon size={20} />
        </a>
    );
}
