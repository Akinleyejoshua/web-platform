'use client';

import React from 'react';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { Container } from '@/app/components/layout/container';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './hero.module.css';

interface HeroProps {
    headline?: string;
    subtext?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    heroImage?: string;
}

export function Hero({
    headline = 'Building Digital Experiences',
    subtext = 'Full-stack developer passionate about creating innovative solutions that make a difference. Specializing in modern web technologies and cutting-edge AI applications.',
    primaryCtaText = 'View Projects',
    primaryCtaLink = '#projects',
    secondaryCtaText = 'Get In Touch',
    secondaryCtaLink = '#contact',
    heroImage = '/hero-image.jpg',
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
                <div className={styles.content}>
                    {/* Portrait */}
                    <div className={styles.portraitSection}>
                        <div className={styles.portraitWrapper}>
                            <div className={styles.portraitRing}>
                                <div className={styles.portraitInner}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={heroImage}
                                        alt="Portrait"
                                        className={styles.heroImage}
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
            </Container>
        </section>
    );
}
