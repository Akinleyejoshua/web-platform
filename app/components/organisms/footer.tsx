'use client';

import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { SocialLink } from '@/app/components/molecules/social-link';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './footer.module.css';

interface SocialLinkData {
    platform: string;
    url: string;
}

interface FooterProps {
    className?: string;
    socialLinks?: SocialLinkData[];
}

export function Footer({ className = '', socialLinks = [] }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const handleSocialClick = (platform: string) => {
        trackClick(`footer_social_${platform}`, true);
    };

    const handleNavClick = (section: string) => {
        trackClick(`footer_nav_${section.toLowerCase().replace(/\s+/g, '_')}`, true);
    };

    const handleResourceClick = (resource: string) => {
        trackClick(`footer_resource_${resource.toLowerCase().replace(/\s+/g, '_')}`, true);
    };

    return (
        <footer className={`${styles.footer} ${className}`.trim()}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Section */}
                    <div className={styles.brand}>
                        <a href="#home" className={styles.logo} onClick={() => trackClick('footer_logo', true)}>
                            Joshua<span className={styles.logoAccent}>.Dev</span>
                        </a>
                        <p className={styles.brandDescription}>
                            Building innovative digital solutions across web development,
                            machine learning, and cutting-edge technologies.
                        </p>
                        {socialLinks.length > 0 && (
                            <div className={styles.socials}>
                                {socialLinks.map((link) => (
                                    <div key={link.platform} onClick={() => handleSocialClick(link.platform)}>
                                        <SocialLink
                                            platform={link.platform}
                                            url={link.url}
                                            className={styles.socialLink}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Navigation</h3>
                        <div className={styles.links}>
                            <a href="#home" className={styles.link} onClick={() => handleNavClick('home')}>Home</a>
                            <a href="#about" className={styles.link} onClick={() => handleNavClick('about')}>About</a>
                            <a href="#experience" className={styles.link} onClick={() => handleNavClick('experience')}>Experience</a>
                            <a href="#projects" className={styles.link} onClick={() => handleNavClick('projects')}>Projects</a>
                            <a href="#contact" className={styles.link} onClick={() => handleNavClick('contact')}>Contact</a>
                        </div>
                    </div>

                    {/* Services */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Services</h3>
                        <div className={styles.links}>
                            <a href="#projects" className={styles.link} onClick={() => handleNavClick('web_development')}>Web Development</a>
                            <a href="#projects" className={styles.link} onClick={() => handleNavClick('machine_learning')}>Machine Learning</a>
                            <a href="#projects" className={styles.link} onClick={() => handleNavClick('ai_solutions')}>AI Solutions</a>
                            <a href="#projects" className={styles.link} onClick={() => handleNavClick('consulting')}>Consulting</a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Resources</h3>
                        <div className={styles.links}>
                            <a href="https://github.com/Akinleyejoshua" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('github')}>GitHub</a>
                            <a href="https://ultraspacetech.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('parent_company')}>Building</a>
                            <a href="https://akinleyejoshua-old.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('portfolio_v3')}>Prev. Portfolio v3</a>
                            <a href="https://akinleyejoshua.netlify.app" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('portfolio_v2')}>Prev. Portfolio v2</a>
                            <a href="https://akinleyejoshua-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('portfolio_v1')}>Prev. Portfolio v1</a>
                            <a href="https://j-resume.netlify.app/" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('ml_projects')}>Prev. Ml Projects</a>
                            <a href="https://matching.turing.com/developer-resume-preview/94fcd098ef28063a611a36b6c211b83394302204b3221e" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('turing_profile')}>Turing Profile</a>
                            <a href="/resume" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('resume')}>Resume</a>
                            <a href="/cover-letter" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('cover_letter')}>Cover Letter</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {currentYear} Joshua Akinleye.  All rights reserved.
                    </p>
                    {/* <div className={styles.bottomLinks}>
                        <a href="#" className={styles.bottomLink}>Privacy Policy</a>
                        <a href="#" className={styles.bottomLink}>Terms of Service</a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
