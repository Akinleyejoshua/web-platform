'use client';

import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowRight, FiYoutube } from 'react-icons/fi';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './footer.module.css';

interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
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
                        <div className={styles.socials}>
                            <a
                                href="https://github.com/Akinleyejoshua"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="GitHub"
                                onClick={() => handleSocialClick('github')}
                            >
                                <FiGithub size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/joshua-a-9895b61ab/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn"
                                onClick={() => handleSocialClick('linkedin')}
                            >
                                <FiLinkedin size={18} />
                            </a>
                            <a
                                href="https://x.com/Joshuaakinleye4
                                "
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Twitter"
                                onClick={() => handleSocialClick('twitter')}
                            >
                                <FiTwitter size={18} />
                            </a>
                            <a
                                href="mailto:akinleyejoshua.dev@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Email"
                                onClick={() => handleSocialClick('email')}
                            >
                                <FiMail size={18} />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCQ51Ney9amBf0T5C69OmBog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Youtube"
                                onClick={() => handleSocialClick('youtube')}
                            >
                                <FiYoutube size={18} />
                            </a>
                        </div>
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
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('resume')}>Resume</a>
                            <a href="/cover.pdf" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => handleResourceClick('cover_letter')}>Cover Letter</a>
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
