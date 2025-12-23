import React from 'react';
import { Container } from '@/app/components/layout/container';
import styles from './footer.module.css';

interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`${styles.footer} ${className}`.trim()}>
            <Container>
                <div className={styles.inner}>
                    <a href="#home" className={styles.logo}>
                        Port<span className={styles.logoAccent}>folio</span>
                    </a>

                    <nav className={styles.links}>
                        <a href="#about" className={styles.link}>About</a>
                        <a href="#experience" className={styles.link}>Experience</a>
                        <a href="#projects" className={styles.link}>Projects</a>
                        <a href="#contact" className={styles.link}>Contact</a>
                    </nav>

                    <p className={styles.copyright}>
                        © {currentYear} Portfolio. Made with <span className={styles.heart}>♥</span> All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
