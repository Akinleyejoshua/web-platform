'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiHome,
    FiImage,
    FiUser,
    FiBriefcase,
    FiFolder,
    FiMail,
    FiLogOut,
    FiBarChart2
} from 'react-icons/fi';
import axios from 'axios';
import styles from './layout.module.css';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiBarChart2 },
    { href: '/admin/hero', label: 'Hero Section', icon: FiImage },
    { href: '/admin/about', label: 'About', icon: FiUser },
    { href: '/admin/experience', label: 'Experience', icon: FiBriefcase },
    { href: '/admin/projects', label: 'Projects', icon: FiFolder },
    { href: '/admin/contact', label: 'Contact', icon: FiMail },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Show auth page without sidebar layout
    if (pathname === '/admin/auth') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        try {
            await axios.delete('/api/auth');
        } catch (error) {
            console.error('Logout error:', error);
        }
        router.push('/admin/auth');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <Link href="/" className={styles.logo}>
                    <FiHome size={20} />
                    Port<span className={styles.logoAccent}>folio</span>
                </Link>

                <nav className={styles.nav}>
                    <div className={styles.navSection}>
                        <span className={styles.navLabel}>Management</span>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className={styles.logout}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
