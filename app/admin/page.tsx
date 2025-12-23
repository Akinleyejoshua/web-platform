'use client';

import React from 'react';
import Link from 'next/link';
import {
    FiEye,
    FiTrendingUp,
    FiFolder,
    FiBriefcase,
    FiImage,
    FiUser,
    FiMail,
    FiRefreshCw,
    FiArrowUpRight
} from 'react-icons/fi';
import { useAnalytics } from '@/app/hooks/use-analytics';
import styles from './page.module.css';

const quickActions = [
    { href: '/admin/hero', label: 'Edit Hero Section', icon: FiImage },
    { href: '/admin/about', label: 'Update About', icon: FiUser },
    { href: '/admin/projects', label: 'Manage Projects', icon: FiFolder },
    { href: '/admin/experience', label: 'Edit Experience', icon: FiBriefcase },
    { href: '/admin/contact', label: 'Update Contact', icon: FiMail },
];

export default function AdminDashboardPage() {
    const { analytics, isLoading, refetch } = useAnalytics();

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    const totalViews = analytics?.totalViews || 0;
    const dailyStats = analytics?.dailyStats || [];
    const todayViews = dailyStats[0]?.views || 0;
    const yesterdayViews = dailyStats[1]?.views || 0;
    const viewsChange = yesterdayViews > 0
        ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
        : 0;

    // Get last 7 days for chart
    const last7Days = dailyStats.slice(0, 7).reverse();
    const maxViews = Math.max(...last7Days.map((d) => d.views), 1);

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here&apos;s an overview of your portfolio performance.</p>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={() => refetch?.()} className={styles.refreshBtn}>
                        <FiRefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiEye size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Total Views (30 days)</div>
                        <div className={styles.statValue}>{totalViews.toLocaleString()}</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiTrendingUp size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Today&apos;s Views</div>
                        <div className={styles.statValue}>{todayViews.toLocaleString()}</div>
                        {viewsChange !== 0 && (
                            <div className={`${styles.statChange} ${viewsChange > 0 ? styles.statChangeUp : styles.statChangeDown}`}>
                                <FiArrowUpRight size={12} style={{ transform: viewsChange < 0 ? 'rotate(180deg)' : 'none' }} />
                                {Math.abs(viewsChange)}% from yesterday
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiFolder size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Projects</div>
                        <div className={styles.statValue}>11</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiBriefcase size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Experiences</div>
                        <div className={styles.statValue}>4</div>
                    </div>
                </div>
            </div>

            {/* Chart & Quick Actions */}
            <div className={styles.chartSection}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Views Overview</h2>
                        <span className={styles.chartPeriod}>Last 7 days</span>
                    </div>

                    <div className={styles.bars}>
                        {last7Days.map((day) => (
                            <div key={day.date} className={styles.barWrapper}>
                                <div
                                    className={styles.bar}
                                    style={{ height: `${Math.max((day.views / maxViews) * 100, 5)}%` }}
                                />
                                <span className={styles.barLabel}>
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
                    <div className={styles.quickActions}>
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.href} href={action.href} className={styles.quickAction}>
                                    <span className={styles.quickActionIcon}>
                                        <Icon size={16} />
                                    </span>
                                    {action.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
