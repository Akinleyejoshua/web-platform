'use client';

import React from 'react';
import { FiEye, FiTrendingUp } from 'react-icons/fi';
import { useAnalytics } from '@/app/hooks/use-analytics';
import styles from './page.module.css';

export default function AdminDashboardPage() {
    const { analytics, isLoading } = useAnalytics();

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    const totalViews = analytics?.totalViews || 0;
    const dailyStats = analytics?.dailyStats || [];

    // Get last 7 days for chart
    const last7Days = dailyStats.slice(0, 7).reverse();
    const maxViews = Math.max(...last7Days.map((d) => d.views), 1);

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiEye size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Total Views (30 days)</h3>
                        <p>{totalViews.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FiTrendingUp size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Today&apos;s Views</h3>
                        <p>{(dailyStats[0]?.views || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className={styles.chart}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.chartTitle}>Views (Last 7 Days)</h2>
                </div>

                <div className={styles.bars}>
                    {last7Days.map((day) => (
                        <div key={day.date} className={styles.barWrapper}>
                            <div
                                className={styles.bar}
                                style={{ height: `${(day.views / maxViews) * 100}%` }}
                            />
                            <span className={styles.barLabel}>
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
