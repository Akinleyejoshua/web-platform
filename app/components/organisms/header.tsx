'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiTrendingUp, FiMenu, FiX, FiHome, FiUser, FiBriefcase, FiCode, FiMail, FiFileText, FiChevronRight, FiBookOpen } from 'react-icons/fi';
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
    { href: '/blog', label: 'Blog', icon: FiBookOpen },
    { href: '#contact', label: 'Contact', icon: FiMail },
    { href: '/resume', label: 'Resume', icon: FiFileText, target: '_blank', rel: 'noopener noreferrer' },
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

    // Lock body scroll when sidebar is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

    // Track nav link clicks
    const handleNavClick = (label: string) => {
        trackClick(`nav_${label.toLowerCase()}`, true);
    };

    // Track invest button click
    const handleInvestClick = () => {
        trackClick('header_invest_button', true);
    };

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.inner}>
                    <a href="#home" className={styles.logo} onClick={() => trackClick('header_logo', true)}>
                        Joshua<span className={styles.logoAccent}>.Dev</span>
                    </a>

                    <nav className={styles.nav}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                onClick={() => handleNavClick(link.label)}
                                target={link.target}
                                rel={link.rel}
                            >
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
                            aria-expanded={isMobileMenuOpen}
                        >
                            <FiMenu size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ---- Backdrop overlay ---- */}
            <div
                className={`${styles.overlay} ${isMobileMenuOpen ? styles.visible : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            {/* ---- Mobile sidebar ---- */}
            <aside
                className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
                aria-label="Mobile navigation"
                role="dialog"
                aria-modal="true"
            >
                {/* Sidebar header */}
                <div className={styles.sidebarHeader}>
                    <span className={styles.sidebarTitle}>
                        Joshua<span className={styles.sidebarTitleAccent}>.Dev</span>
                    </span>
                    <button
                        className={styles.closeBtn}
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Sidebar navigation */}
                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={styles.mobileNavItem}
                            onClick={(e) => {
                                if (link.href.startsWith('#')) {
                                    e.preventDefault();
                                    const element = document.querySelector(link.href);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                                handleNavClick(link.label);
                                closeMobileMenu();
                            }}
                            target={link.target}
                            rel={link.rel}
                        >
                            <span className={styles.mobileNavIcon}>
                                <link.icon size={18} />
                            </span>
                            <span className={styles.mobileNavLabel}>{link.label}</span>
                            <FiChevronRight size={16} className={styles.mobileNavArrow} />
                        </a>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className={styles.mobileActions}>
                    <div className={styles.mobileActionsRow}>
                        <div className={styles.mobileInvestBtn}>
                            <Button variant="primary" size="md" href={investUrl} onClick={handleInvestClick}>
                                <FiTrendingUp size={16} />
                                Invest
                            </Button>
                        </div>
                        <div className={styles.mobileThemeToggle}>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Available status */}
                <div className={styles.sidebarStatus}>
                    <span className={styles.statusDot} />
                    Available for opportunities
                </div>
            </aside>
        </>
    );
}
