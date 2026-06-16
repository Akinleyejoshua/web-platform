'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiGithub, FiExternalLink, FiCode, FiMaximize2, FiChevronLeft, FiChevronRight, FiPlay, FiBookOpen } from 'react-icons/fi';
import { Badge } from '@/app/components/atoms/badge';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import { AssetPreviewLightbox } from './asset-preview-lightbox';
import { optimizeImageUrl } from '@/app/lib/image-utils';
import styles from './project-card.module.css';

export interface IAsset {
    type: 'image' | 'video' | 'youtube' | 'loom' | 'external';
    url: string;
}

interface ProjectCardProps {
    title: string;
    description: string;
    mediaType?: 'image' | 'video';
    mediaUrl?: string;
    assets?: IAsset[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    blogUrl?: string;
    className?: string;
}

export function ProjectCard({
    title,
    description,
    mediaType = 'image',
    mediaUrl = '',
    assets = [],
    technologies,
    githubUrl,
    liveUrl,
    blogUrl,
    className = '',
}: ProjectCardProps) {
    const [imageError, setImageError] = useState<Record<number, boolean>>({});
    const [activeAssetIndex, setActiveAssetIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isYouTubeUrl = (url: string) => {
        return url && (url.includes('youtube.com') || url.includes('youtu.be'));
    };

    const isLoomUrl = (url: string) => {
        return url && url.includes('loom.com');
    };

    // Combine original image/media and slide assets, filtering out duplicate urls
    const projectAssets: IAsset[] = React.useMemo(() => {
        const list: IAsset[] = [];
        if (mediaUrl) {
            let type: IAsset['type'] = (mediaType || 'image') as any;
            if (isYouTubeUrl(mediaUrl)) {
                type = 'youtube';
            } else if (isLoomUrl(mediaUrl)) {
                type = 'loom';
            }
            list.push({ type, url: mediaUrl });
        }
        if (assets && assets.length > 0) {
            const filtered = assets.filter(a => a.url !== mediaUrl).map(a => {
                let type = a.type;
                if (isYouTubeUrl(a.url)) {
                    type = 'youtube';
                } else if (isLoomUrl(a.url)) {
                    type = 'loom';
                }
                return { ...a, type };
            });
            list.push(...filtered);
        }
        return list;
    }, [assets, mediaType, mediaUrl]);

    const [isHovered, setIsHovered] = useState(false);

    // Auto-slide functionality (pauses when hovered or lightbox is open)
    useEffect(() => {
        if (projectAssets.length <= 1 || isHovered || isLightboxOpen) return;

        const interval = setInterval(() => {
            setActiveAssetIndex((prev) => (prev + 1) % projectAssets.length);
        }, 3200); // Auto-slide transition every 3.2 seconds

        return () => clearInterval(interval);
    }, [projectAssets, isHovered, isLightboxOpen]);

    const getYouTubeEmbedUrl = (url: string) => {
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    };

    const getLoomEmbedUrl = (url: string) => {
        const loomIdMatch = url.match(/(?:loom\.com\/share\/|loom\.com\/embed\/)([^&\s?]+)/);
        return loomIdMatch ? `https://www.loom.com/embed/${loomIdMatch[1]}` : url;
    };

    const handleImageError = (index: number) => {
        setImageError((prev) => ({ ...prev, [index]: true }));
    };

    const handleCardClick = () => {
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_card_${sanitizedTitle}`, true);
        setIsLightboxOpen(true);
    };

    const handleGithubClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_github_${sanitizedTitle}`, true);
    };

    const handleLiveDemoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        trackClick(`project_livedemo_${sanitizedTitle}`, true);
    };

    const handleNextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveAssetIndex((prev) => (prev + 1) % projectAssets.length);
    };

    const handlePrevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveAssetIndex((prev) => (prev - 1 + projectAssets.length) % projectAssets.length);
    };

    const getYouTubeVideoId = (url: string) => {
        if (!url) return null;
        if (url.includes('youtu.be/')) {
            const parts = url.split('youtu.be/');
            if (parts[1]) return parts[1].split(/[?#]/)[0];
        }
        if (url.includes('v=')) {
            const parts = url.split('v=');
            if (parts[1]) return parts[1].split(/[&?#]/)[0];
        }
        const embedMatch = url.match(/(?:embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        if (embedMatch) return embedMatch[1];
        return null;
    };

    const renderAssetSingle = (asset: IAsset, index: number) => {
        if (!asset || !asset.url) {
            return (
                <div className={styles.imagePlaceholder}>
                    <FiCode className={styles.placeholderIcon} />
                    <span className={styles.placeholderText}>Project Asset</span>
                </div>
            );
        }

        switch (asset.type) {
            case 'youtube': {
                const videoId = getYouTubeVideoId(asset.url);
                const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
                return (
                    <div className={styles.playableThumbnailWrapper}>
                        {thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={thumbnailUrl}
                                alt={`${title} YouTube Thumbnail`}
                                className={styles.image}
                                onError={() => handleImageError(index)}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <FiPlay className={styles.placeholderIcon} />
                                <span className={styles.placeholderText}>YouTube Video</span>
                            </div>
                        )}
                        <div className={styles.playButtonCenter}>
                            <FiPlay className={styles.playIcon} />
                        </div>
                    </div>
                );
            }
            case 'loom':
                return (
                    <div className={styles.playableThumbnailWrapper}>
                        <div className={styles.imagePlaceholder}>
                            <FiPlay className={styles.placeholderIcon} style={{ transform: 'scale(1.2)' }} />
                            <span className={styles.placeholderText}>Play Loom Video</span>
                        </div>
                        <div className={styles.playButtonCenter}>
                            <FiPlay className={styles.playIcon} />
                        </div>
                    </div>
                );
            case 'video':
                return (
                    <div className={styles.playableThumbnailWrapper}>
                        <video
                            className={styles.image}
                            src={asset.url}
                            muted
                            loop
                            autoPlay
                            playsInline
                        />
                        <div className={styles.playButtonCenter}>
                            <FiPlay className={styles.playIcon} />
                        </div>
                    </div>
                );
            case 'image':
            default:
                if (imageError[index]) {
                    return (
                        <div className={styles.imagePlaceholder}>
                            <FiCode className={styles.placeholderIcon} />
                            <span className={styles.placeholderText}>Project Asset</span>
                        </div>
                    );
                }
                return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={optimizeImageUrl(asset.url, 640)}
                        alt={`${title} - Asset ${index + 1}`}
                        className={styles.image}
                        onError={() => handleImageError(index)}
                        loading="lazy"
                    />
                );
        }
    };

    return (
        <>
            <article 
                className={`${styles.card} ${className}`.trim()} 
                onClick={handleCardClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Media Section */}
                <div className={styles.media}>
                    {projectAssets.length === 0 ? (
                        <div className={styles.imagePlaceholder}>
                            <FiCode className={styles.placeholderIcon} />
                            <span className={styles.placeholderText}>Project</span>
                        </div>
                    ) : (
                        <div 
                            className={styles.slidesContainer}
                            style={{ 
                                display: 'flex',
                                width: `${projectAssets.length * 100}%`,
                                transform: `translateX(-${(activeAssetIndex * 100) / projectAssets.length}%)`,
                                transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                                height: '100%'
                            }}
                        >
                            {projectAssets.map((asset, index) => (
                                <div key={index} style={{ width: `${100 / projectAssets.length}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
                                    {renderAssetSingle(asset, index)}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick View Maximize Overlay */}
                    <div className={styles.maximizeOverlay}>
                        <FiMaximize2 className={styles.maximizeIcon} />
                        <span>Quick View</span>
                    </div>

                    {/* Mini Slider Navigation */}
                    {projectAssets.length > 1 && (
                        <>
                            <button className={`${styles.slideArrow} ${styles.arrowLeft}`} onClick={handlePrevSlide} aria-label="Previous slide">
                                <FiChevronLeft size={16} />
                            </button>
                            <button className={`${styles.slideArrow} ${styles.arrowRight}`} onClick={handleNextSlide} aria-label="Next slide">
                                <FiChevronRight size={16} />
                            </button>

                            {/* Dot Indicators */}
                            <div className={styles.dotsContainer}>
                                {projectAssets.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`${styles.dot} ${idx === activeAssetIndex ? styles.dotActive : ''}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content Section */}
                <div className={styles.content}>
                    {technologies && technologies.length > 0 && (
                        <span className={styles.categoryTag}>{technologies[0]}</span>
                    )}
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>

                    {technologies && technologies.length > 0 && (
                        <div className={styles.technologies}>
                            {technologies.map((tech) => (
                                <Badge key={tech} variant="outline">{tech}</Badge>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.links}>
                        {blogUrl && (
                            <a
                                href={blogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.blogLink}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    trackClick(`project_blog_${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`, true);
                                }}
                            >
                                <span>Write-up</span>
                                <FiBookOpen className={styles.linkIcon} />
                            </a>
                        )}
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                                onClick={handleGithubClick}
                            >
                                <span>Code</span>
                                <FiGithub className={styles.linkIcon} />
                            </a>
                        )}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                                onClick={handleLiveDemoClick}
                            >
                                <span>Live</span>
                                <FiExternalLink className={styles.linkIcon} />
                            </a>
                        )}
                    </div>
                </div>
            </article>

            {/* Detailed Preview Lightbox */}
            <AssetPreviewLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                assets={projectAssets}
                initialIndex={activeAssetIndex}
                title={title}
            />
        </>
    );
}
