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
    FiArrowUpRight,
    FiMousePointer,
    FiLayout
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
    const sectionViews = analytics?.sectionViews || {};
    const clicks = analytics?.clicks || {};

    const todayViews = dailyStats[0]?.views || 0;
    const yesterdayViews = dailyStats[1]?.views || 0;
    const viewsChange = yesterdayViews > 0
        ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
        : 0;

    // Calculate totals
    const totalSectionViews = Object.values(sectionViews).reduce((a, b) => a + b, 0);
    const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);

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
                        <div className={styles.statLabel}>Total Page Views</div>
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
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <FiLayout size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Section Views</div>
                        <div className={styles.statValue}>{totalSectionViews.toLocaleString()}</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <FiMousePointer size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Total Clicks</div>
                        <div className={styles.statValue}>{totalClicks.toLocaleString()}</div>
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

            {/* Section Views & Clicks Details */}
            <div className={styles.chartSection}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Section Views Breakdown</h2>
                    </div>
                    <div className={styles.detailsList}>
                        {Object.keys(sectionViews).length === 0 ? (
                            <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '1rem' }}>
                                No section views recorded yet
                            </p>
                        ) : (
                            Object.entries(sectionViews)
                                .sort(([, a], [, b]) => b - a)
                                .map(([section, count]) => (
                                    <div key={section} className={styles.detailItem}>
                                        <span className={styles.detailLabel}>{section}</span>
                                        <span className={styles.detailValue}>{count.toLocaleString()}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Click Tracking</h2>
                    </div>
                    <div className={styles.detailsList}>
                        {Object.keys(clicks).length === 0 ? (
                            <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '1rem' }}>
                                No clicks recorded yet
                            </p>
                        ) : (
                            Object.entries(clicks)
                                .sort(([, a], [, b]) => b - a)
                                .map(([target, count]) => (
                                    <div key={target} className={styles.detailItem}>
                                        <span className={styles.detailLabel}>{target}</span>
                                        <span className={styles.detailValue}>{count.toLocaleString()}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
