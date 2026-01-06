'use client';

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiMenu, FiX, FiHome, FiUser, FiBriefcase, FiCode, FiMail, FiFileText } from 'react-icons/fi';
import { NavLink } from '@/app/components/molecules/nav-link';
import { Button } from '@/app/components/atoms/button';
import { ThemeToggle } from '@/app/components/atoms/theme-toggle';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './header.module.css';

const navLinks = [
    { href: '#home', label: 'Home', icon: FiHome },
    { href: '#about', label: 'About', icon: FiUser },
    { href: '#experience', label: 'Experience', icon: FiBriefcase },
    { href: '#projects', label: 'Projects', icon: FiCode },
    { href: '#contact', label: 'Contact', icon: FiMail },
    { href: '/resume.pdf', label: 'Resume', icon: FiFileText },
];

interface HeaderProps {
    investUrl?: string;
}

export function Header({ investUrl = '/invest' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Track nav link clicks
    const handleNavClick = (label: string) => {
        trackClick(`nav_${label.toLowerCase()}`, true);
    };

    // Track invest button click
    const handleInvestClick = () => {
        trackClick('header_invest_button', true);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <a href="#home" className={styles.logo} onClick={() => trackClick('header_logo', true)}>
                    Joshua<span className={styles.logoAccent}>.Dev</span>
                </a>

                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <NavLink key={link.href} href={link.href} onClick={() => handleNavClick(link.label)}>
                            <link.icon size={14} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <Button variant="primary" size="sm" href={investUrl} className={styles.donateBtn} onClick={handleInvestClick}>
                        <FiTrendingUp size={16} />
                        Invest
                    </Button>
                    <ThemeToggle />
                    <button
                        className={styles.menuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <NavLink key={link.href} href={link.href} onClick={() => { handleNavClick(link.label); closeMobileMenu(); }}>
                            <link.icon size={14} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.mobileActions}>
                    <Button variant="primary" size="sm" href={investUrl} className={styles.donateBtn} onClick={handleInvestClick}>
                        <FiTrendingUp size={16} />
                        Invest
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

