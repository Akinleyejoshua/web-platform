'use client';

import React from 'react';
import Image from 'next/image';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { Container } from '@/app/components/layout/container';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import { optimizeImageUrl } from '@/app/lib/image-utils';
import styles from './hero.module.css';

interface HeroProps {
    headline?: string;
    subtext?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    heroImage?: string;
    isLoading?: boolean;
}

export function Hero({
    headline = 'Building Digital Experiences',
    subtext = 'Full-stack developer passionate about creating innovative solutions that make a difference. Specializing in modern web technologies and cutting-edge AI applications.',
    primaryCtaText = 'View Projects',
    primaryCtaLink = '#projects',
    secondaryCtaText = 'Get In Touch',
    secondaryCtaLink = '#contact',
    heroImage = './public/profile_pic.jpeg',
    isLoading = false,
}: HeroProps) {
    const handlePrimaryClick = () => {
        trackClick('hero_primary_cta', true);
    };

    const handleSecondaryClick = () => {
        trackClick('hero_secondary_cta', true);
    };

    return (
        <section id="home" className={styles.hero}>
            {/* Subtle ambient glow */}
            <div className={styles.background}>
                <div className={styles.ambientGlow} />
                <div className={styles.noiseOverlay} />
            </div>

            <Container>
                {isLoading ? (
                    <div className={styles.content}>
                        {/* Portrait Skeleton */}
                        <div className={styles.portraitSection}>
                            <div className={styles.portraitWrapper}>
                                <div className={styles.portraitRing}>
                                    <div className={`${styles.portraitInner} skeleton skeleton-circle`} />
                                </div>
                            </div>
                        </div>

                        {/* Headline Skeleton */}
                        <div className="skeleton" style={{ width: '70%', height: '3.5rem', marginBottom: '1.5rem' }} />

                        {/* Subtext Skeleton */}
                        <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div className="skeleton" style={{ width: '90%', height: '1.25rem' }} />
                            <div className="skeleton" style={{ width: '80%', height: '1.25rem' }} />
                            <div className="skeleton" style={{ width: '60%', height: '1.25rem' }} />
                        </div>

                        {/* CTAs Skeleton */}
                        <div className={styles.ctas}>
                            <div className="skeleton" style={{ width: '150px', height: '48px', borderRadius: '30px' }} />
                            <div className="skeleton" style={{ width: '150px', height: '48px', borderRadius: '30px' }} />
                        </div>

                        {/* Stats Skeleton */}
                        <div className={styles.stats} style={{ opacity: 0.5 }}>
                            <div className="skeleton" style={{ width: '60px', height: '40px' }} />
                            <span className={styles.statDivider} />
                            <div className="skeleton" style={{ width: '60px', height: '40px' }} />
                            <span className={styles.statDivider} />
                            <div className="skeleton" style={{ width: '60px', height: '40px' }} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        {/* Portrait */}
                        <div className={styles.portraitSection}>
                            <div className={styles.portraitWrapper}>
                                <div className={styles.portraitRing}>
                                    <div className={styles.portraitInner}>
                                        <img
                                            src={optimizeImageUrl(heroImage, 640)}
                                            alt="Portrait"
                                            className={styles.heroImage}
                                            width={110}
                                            height={110}

                                        />
                                    </div>
                                </div>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusDot} />
                                    Open to work
                                </div>
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className={styles.headline}>
                            {headline}
                        </h1>

                        {/* Subtext */}
                        <div className={styles.subtext} dangerouslySetInnerHTML={{ __html: subtext }} />

                        {/* CTAs */}
                        <div className={styles.ctas}>
                            <a
                                href={primaryCtaLink}
                                className={styles.primaryCta}
                                onClick={handlePrimaryClick}
                            >
                                {primaryCtaText}
                                <FiArrowRight size={16} />
                            </a>
                            <a
                                href={secondaryCtaLink}
                                className={styles.secondaryCta}
                                onClick={handleSecondaryClick}
                            >
                                <FiDownload size={16} />
                                {secondaryCtaText}
                            </a>
                        </div>

                        {/* Stats */}
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>5+</span>
                                <span className={styles.statLabel}>Years</span>
                            </div>
                            <span className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>50+</span>
                                <span className={styles.statLabel}>Projects</span>
                            </div>
                            <span className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>30+</span>
                                <span className={styles.statLabel}>Clients</span>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </section>
    );
}
