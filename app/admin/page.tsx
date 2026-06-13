'use client';

import React, { useState } from 'react';
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
import { Loader } from '@/app/components/atoms/loader';

const quickActions = [
    { href: '/admin/hero', label: 'Edit Hero Section', icon: FiImage },
    { href: '/admin/about', label: 'Update About', icon: FiUser },
    { href: '/admin/projects', label: 'Manage Projects', icon: FiFolder },
    { href: '/admin/experience', label: 'Edit Experience', icon: FiBriefcase },
    { href: '/admin/contact', label: 'Update Contact', icon: FiMail },
];

export default function AdminDashboardPage() {
    const { analytics, isLoading, refetch } = useAnalytics();

    // Time range state: '1d' | '7d' | '30d' | '1y'
    const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '1y'>('7d');

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    const totalViews = analytics?.totalViews || 0;
    const totalVisitors = analytics?.totalVisitors || 0;
    const allTimeViews = analytics?.allTimeViews || 0;
    const allTimeVisitors = analytics?.allTimeVisitors || 0;
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

    // Determine chart data based on timeRange
    const getChartData = () => {
        const maxPossible = Math.max(...dailyStats.map(d => d.views), 1);

        const aggregateByWeek = (data: typeof dailyStats) => {
            const weeks: { week: string; views: number; date: string }[] = [];
            data.forEach((day, idx) => {
                const weekNum = Math.floor(idx / 7);
                if (!weeks[weekNum]) {
                    weeks[weekNum] = { week: `Week ${weekNum + 1}`, views: 0, date: day.date };
                }
                weeks[weekNum].views += day.views;
            });
            return weeks.reverse();
        };

        const aggregateByMonth = (data: typeof dailyStats) => {
            const months: Map<string, { views: number; date: string }> = new Map();
            data.forEach((day) => {
                const date = new Date(day.date);
                const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                const existing = months.get(monthKey) || { views: 0, date: day.date };
                months.set(monthKey, { views: existing.views + day.views, date: day.date });
            });
            return Array.from(months.entries()).map(([label, data]) => ({ week: label, views: data.views, date: data.date })).reverse();
        };

        switch (timeRange) {
            case '1d':
                return { data: dailyStats.slice(0, 1), maxViews: maxPossible, label: 'Today' };
            case '7d':
                return { data: dailyStats.slice(0, 7).reverse(), maxViews: Math.max(...dailyStats.slice(0, 7).map(d => d.views), 1), label: 'Last 7 days' };
            case '30d':
                const weeklyData = aggregateByWeek(dailyStats.slice(0, 30));
                return { data: weeklyData, maxViews: Math.max(...weeklyData.map(d => d.views), 1), label: 'Last 4 weeks (1 month)' };
            case '1y':
                const monthlyData = aggregateByMonth(dailyStats.slice(0, 365));
                return { data: monthlyData, maxViews: Math.max(...monthlyData.map(d => d.views), 1), label: 'Last 12 months (1 year)' };
            default:
                return { data: dailyStats.slice(0, 7).reverse(), maxViews: Math.max(...dailyStats.slice(0, 7).map(d => d.views), 1), label: 'Last 7 days' };
        }
    };

    const { data: chartData, maxViews, chartLabel } = getChartData();

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
                        <div className={styles.statValue}>{allTimeViews.toLocaleString()}</div>
                        <div className={styles.statCardPeriodInfo}>
                            {totalViews.toLocaleString()} in last 30 days
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                        <FiUser size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Total Unique Visitors</div>
                        <div className={styles.statValue}>{allTimeVisitors.toLocaleString()}</div>
                        <div className={styles.statCardPeriodInfo}>
                            {totalVisitors.toLocaleString()} in last 30 days
                        </div>
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
                    <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                        <FiLayout size={22} />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statLabel}>Section Views</div>
                        <div className={styles.statValue}>{totalSectionViews.toLocaleString()}</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconYellow}`}>
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
                        <div className={styles.chartTitleGroup}>
                            <h2 className={styles.chartTitle}>Views Overview</h2>
                            <div className={styles.timeRangeSelector}>
                                <button
                                    className={`${styles.timeRangeBtn} ${timeRange === '1d' ? styles.timeRangeBtnActive : ''}`}
                                    onClick={() => setTimeRange('1d')}
                                    title="Last 24 hours"
                                >
                                    1d
                                </button>
                                <button
                                    className={`${styles.timeRangeBtn} ${timeRange === '7d' ? styles.timeRangeBtnActive : ''}`}
                                    onClick={() => setTimeRange('7d')}
                                    title="Last 7 days"
                                >
                                    7d
                                </button>
                                <button
                                    className={`${styles.timeRangeBtn} ${timeRange === '30d' ? styles.timeRangeBtnActive : ''}`}
                                    onClick={() => setTimeRange('30d')}
                                    title="Last 30 days"
                                >
                                    1mon
                                </button>
                                <button
                                    className={`${styles.timeRangeBtn} ${timeRange === '1y' ? styles.timeRangeBtnActive : ''}`}
                                    onClick={() => setTimeRange('1y')}
                                    title="Last 365 days"
                                >
                                    1y
                                </button>
                            </div>
                        </div>
                        <span className={styles.chartPeriod}>{chartLabel}</span>
                    </div>

                    <div className={styles.bars}>
                        {chartData.map((item) => (
                            <div key={item.date} className={styles.barWrapper}>
                                <div className={styles.barContainer}>
                                    <div
                                        className={styles.bar}
                                        style={{ height: `${Math.max((item.views / maxViews) * 100, 5)}%` }}
                                    />
                                    <span className={styles.barCount}>
                                        {item.views.toLocaleString()}
                                    </span>
                                </div>
                                <span className={styles.barLabel}>
                                    {'week' in item ? item.week : new Date(item.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
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
                            <p className={styles.noDataText}>
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
                            <p className={styles.noDataText}>
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
