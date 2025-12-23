import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowRight, FiYoutube } from 'react-icons/fi';
import styles from './footer.module.css';

interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`${styles.footer} ${className}`.trim()}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Section */}
                    <div className={styles.brand}>
                        <a href="#home" className={styles.logo}>
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
                            >
                                <FiGithub size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/joshua-a-9895b61ab/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn"
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
                            >
                                <FiTwitter size={18} />
                            </a>
                            <a
                                href="mailto:akinleyejoshua.dev@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Email"
                            >
                                <FiMail size={18} />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCQ51Ney9amBf0T5C69OmBog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Youtube"
                            >
                                <FiYoutube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Navigation</h3>
                        <div className={styles.links}>
                            <a href="#home" className={styles.link}>Home</a>
                            <a href="#about" className={styles.link}>About</a>
                            <a href="#experience" className={styles.link}>Experience</a>
                            <a href="#projects" className={styles.link}>Projects</a>
                            <a href="#contact" className={styles.link}>Contact</a>
                        </div>
                    </div>

                    {/* Services */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Services</h3>
                        <div className={styles.links}>
                            <a href="#projects" className={styles.link}>Web Development</a>
                            <a href="#projects" className={styles.link}>Machine Learning</a>
                            <a href="#projects" className={styles.link}>AI Solutions</a>
                            <a href="#projects" className={styles.link}>Consulting</a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className={styles.linkSection}>
                        <h3 className={styles.linkTitle}>Resources</h3>
                        <div className={styles.links}>
                            <a href="https://github.com/Akinleyejoshua" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
                            <a href="https://ultraspaceeng.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.link}>Parent Company(Business)</a>
                            <a href="https://akinleyejoshua-old.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.link}>Prev. Portfolio v3</a>
                            <a href="https://akinleyejoshua.netlify.app" target="_blank" rel="noopener noreferrer" className={styles.link}>Prev. Portfolio v2</a>
                            <a href="https://akinleyejoshua-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className={styles.link}>Prev. Portfolio v1</a>
                            <a href="https://j-resume.netlify.app/" target="_blank" rel="noopener noreferrer" className={styles.link}>Prev. Ml Projects</a>
                            <a href="https://matching.turing.com/developer-resume-preview/94fcd098ef28063a611a36b6c211b83394302204b3221e" target="_blank" rel="noopener noreferrer" className={styles.link}>Turing Profile</a>
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
