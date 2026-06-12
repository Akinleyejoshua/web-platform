'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import styles from './asset-preview-lightbox.module.css';

export interface IAsset {
    type: 'image' | 'video' | 'youtube' | 'loom' | 'external';
    url: string;
}

interface AssetPreviewLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    assets: IAsset[];
    initialIndex?: number;
    title: string;
}

export function AssetPreviewLightbox({
    isOpen,
    onClose,
    assets,
    initialIndex = 0,
    title,
}: AssetPreviewLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, assets]);

    if (!isOpen || assets.length === 0 || !mounted) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % assets.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
    };

    const currentAsset = assets[currentIndex];

    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    const getLoomEmbedUrl = (url: string) => {
        const loomIdMatch = url.match(/(?:loom\.com\/share\/|loom\.com\/embed\/)([^&\s?]+)/);
        return loomIdMatch ? `https://www.loom.com/embed/${loomIdMatch[1]}?autoplay=1` : url;
    };

    const renderAssetContent = (asset: IAsset) => {
        switch (asset.type) {
            case 'youtube':
                return (
                    <div className={styles.videoWrapper}>
                        <iframe
                            src={getYouTubeEmbedUrl(asset.url)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${title} - YouTube Video`}
                            className={styles.iframe}
                        />
                    </div>
                );
            case 'loom':
                return (
                    <div className={styles.videoWrapper}>
                        <iframe
                            src={getLoomEmbedUrl(asset.url)}
                            allow="fullscreen"
                            allowFullScreen
                            title={`${title} - Loom Video`}
                            className={styles.iframe}
                        />
                    </div>
                );
            case 'video':
            case 'external':
                if (asset.url.endsWith('.mp4') || asset.url.endsWith('.webm') || asset.url.endsWith('.ogg') || asset.type === 'video') {
                    return (
                        <video
                            src={asset.url}
                            controls
                            autoPlay
                            className={styles.mediaElement}
                        />
                    );
                }
                return (
                    <div className={styles.videoWrapper}>
                        <iframe
                            src={asset.url}
                            allowFullScreen
                            title={`${title} - External Video`}
                            className={styles.iframe}
                        />
                    </div>
                );
            case 'image':
            default:
                return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={asset.url}
                        alt={`${title} - Slide ${currentIndex + 1}`}
                        className={styles.mediaElement}
                    />
                );
        }
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close lightbox">
                <FiX size={24} />
            </button>

            {/* Navigation Buttons */}
            {assets.length > 1 && (
                <>
                    <button
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft size={36} />
                    </button>
                    <button
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        aria-label="Next slide"
                    >
                        <FiChevronRight size={36} />
                    </button>
                </>
            )}

            {/* Main Stage */}
            <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
                <div className={styles.mediaContainer}>
                    {renderAssetContent(currentAsset)}
                </div>
                
                {/* Title & Info Overlay */}
                <div className={styles.infoBar}>
                    <h3 className={styles.title}>{title}</h3>
                    {assets.length > 1 && (
                        <span className={styles.counter}>
                            {currentIndex + 1} of {assets.length}
                        </span>
                    )}
                </div>
            </div>

            {/* Thumbnails Row */}
            {assets.length > 1 && (
                <div className={styles.thumbnailsContainer} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.thumbnailsList}>
                        {assets.map((asset, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                {asset.type === 'image' ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={asset.url} alt="" className={styles.thumbImg} />
                                ) : (
                                    <div className={styles.thumbVideoPlaceholder}>
                                        <FiPlay size={16} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}

