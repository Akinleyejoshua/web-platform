import React from 'react';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { Container } from '@/app/components/layout/container';
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
    // Split headline for gradient effect on first two words
    const words = headline.split(' ');
    const gradientWords = words.slice(0, 2).join(' ');
    const restWords = words.slice(2).join(' ');

    return (
        <section id="home" className={styles.hero}>
            {/* Animated Background */}
            <div className={styles.background}>
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />
                <div className={styles.gradientOrb3} />
                <div className={styles.gridPattern} />
            </div>

            <Container>
                <div className={styles.content}>
                    {/* Text Content */}
                    <div className={styles.textContent}>
                        <div className={styles.badge}>
                            <span className={styles.badgeDot} />
                            Available for opportunities
                        </div>

                        <h1 className={styles.headline}>
                            <span className={styles.headlineGradient}>{gradientWords}</span>
                            {restWords && <br />}
                            {restWords}
                        </h1>

                        <p className={styles.subtext}>{subtext}</p>

                        <div className={styles.ctas}>
                            <a href={primaryCtaLink} className={styles.primaryCta}>
                                {primaryCtaText}
                                <FiArrowRight size={18} />
                            </a>
                            <a href={secondaryCtaLink} className={styles.secondaryCta}>
                                <FiDownload size={18} />
                                {secondaryCtaText}
                            </a>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>5+</span>
                                <span className={styles.statLabel}>Years Experience</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>50+</span>
                                <span className={styles.statLabel}>Projects Completed</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>30+</span>
                                <span className={styles.statLabel}>Happy Clients</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className={styles.visualContent}>
                        <div className={styles.imageFrame}>
                            <div className={styles.imageOuter}>
                                <div className={styles.imageInner}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={heroImage}
                                        alt="Hero"
                                        className={styles.heroImage}
                                    />
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
                                <span>🚀 Latest Project</span>
                                <strong>AI & Automations</strong>
                            </div>
                            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
                                <span>⚡ Tech Stack</span>
                                <strong>Nextjs, Node.js, TypeScript, MySQL, MongoDB.</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
