'use client';

import React, { useState } from 'react';
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
    FiBarChart2,
    FiSettings,
    FiLayout,
    FiExternalLink,
    FiMenu,
    FiX,
    FiChevronRight
} from 'react-icons/fi';
import axios from 'axios';
import styles from './layout.module.css';

const navGroups = [
    {
        label: 'Overview',
        items: [
            { href: '/admin', label: 'Dashboard', icon: FiBarChart2 },
        ]
    },
    {
        label: 'Content',
        items: [
            { href: '/admin/hero', label: 'Hero Section', icon: FiImage },
            { href: '/admin/about', label: 'About', icon: FiUser },
            { href: '/admin/experience', label: 'Experience', icon: FiBriefcase },
            { href: '/admin/projects', label: 'Projects', icon: FiFolder },
            { href: '/admin/contact', label: 'Contact', icon: FiMail },
        ]
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Get current page title for breadcrumb
    const getCurrentPageTitle = () => {
        for (const group of navGroups) {
            const item = group.items.find(i => i.href === pathname);
            if (item) return item.label;
        }
        return 'Dashboard';
    };

    return (
        <div className={styles.layout}>
            {/* Mobile Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.open : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        Port<span className={styles.logoAccent}>folio</span>
                    </Link>
                    <span className={styles.adminBadge}>Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navGroups.map((group) => (
                        <div key={group.label} className={styles.navGroup}>
                            <div className={styles.navGroupLabel}>
                                {group.label}
                            </div>
                            <div className={styles.navItems}>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <span className={styles.navIcon}>
                                                <Icon size={18} />
                                            </span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Section */}
                <div className={styles.userSection}>
                    <div className={styles.userCard}>
                        <div className={styles.userAvatar}>JA</div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>Joshua Akinleye</div>
                            <div className={styles.userRole}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <FiLogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Top Bar */}
                <div className={styles.topBar}>
                    <div className={styles.breadcrumb}>
                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FiMenu size={20} />
                        </button>
                        <span>Admin</span>
                        <FiChevronRight className={styles.breadcrumbSeparator} size={14} />
                        <span className={styles.breadcrumbCurrent}>{getCurrentPageTitle()}</span>
                    </div>

                    <div className={styles.topBarActions}>
                        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.viewSiteBtn}>
                            <FiExternalLink size={14} />
                            View Site
                        </a>
                    </div>
                </div>

                {/* Page Content */}
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
