'use client';

import React, { useState } from 'react';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import { Badge } from '@/app/components/atoms/badge';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './project-card.module.css';

interface ProjectCardProps {
    title: string;
    description: string;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    className?: string;
}

export function ProjectCard({
    title,
    description,
    mediaType,
    mediaUrl,
    technologies,
    githubUrl,
    liveUrl,
    className = '',
}: ProjectCardProps) {
    const [imageError, setImageError] = useState(false);

    const getYouTubeEmbedUrl = (url: string) => {
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Track card click
    const handleCardClick = () => {
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_card_${sanitizedTitle}`, true);
    };

    // Track github link click
    const handleGithubClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_github_${sanitizedTitle}`, true);
    };

    // Track live demo link click
    const handleLiveDemoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_livedemo_${sanitizedTitle}`, true);
    };

    return (
        <article className={`${styles.card} ${className}`.trim()} onClick={handleCardClick}>
            <div className={styles.media}>
                {mediaType === 'video' ? (
                    <iframe
                        className={styles.video}
                        src={getYouTubeEmbedUrl(mediaUrl)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title}
                    />
                ) : imageError || !mediaUrl ? (
                    <div className={styles.imagePlaceholder}>
                        <FiCode className={styles.placeholderIcon} />
                        <span className={styles.placeholderText}>Project</span>
                    </div>
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={mediaUrl}
                        alt={title}
                        className={styles.image}
                        onError={handleImageError}
                    />
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                {technologies.length > 0 && (
                    <div className={styles.technologies}>
                        {technologies.map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>
                )}

                <div className={styles.links}>
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkButton}
                            onClick={handleGithubClick}
                        >
                            <FiGithub size={16} />
                            GitHub
                        </a>
                    )}
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkButton}
                            onClick={handleLiveDemoClick}
                        >
                            <FiExternalLink size={16} />
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

