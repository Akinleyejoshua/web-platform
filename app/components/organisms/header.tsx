'use client';

import React, { useState, useEffect } from 'react';
import { FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { NavLink } from '@/app/components/molecules/nav-link';
import { Button } from '@/app/components/atoms/button';
import { ThemeToggle } from '@/app/components/atoms/theme-toggle';
import styles from './header.module.css';

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

interface HeaderProps {
    donateUrl?: string;
}

export function Header({ donateUrl = '#' }: HeaderProps) {
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

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <a href="#home" className={styles.logo}>
                    Joshua<span className={styles.logoAccent}>.Dev</span>
                </a>

                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <NavLink key={link.href} href={link.href}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <Button variant="primary" size="sm" href={donateUrl} className={styles.donateBtn}>
                        <FiHeart size={16} />
                        Donate
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
                        <NavLink key={link.href} href={link.href} onClick={closeMobileMenu}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.mobileActions}>
                    <Button variant="primary" size="sm" href={donateUrl} className={styles.donateBtn}>
                        <FiHeart size={16} />
                        Donate
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
