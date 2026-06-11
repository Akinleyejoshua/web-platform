'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface DailyStat {
    date: string;
    views: number;
    sectionViews?: Record<string, number>;
    clicks?: Record<string, number>;
}

interface AnalyticsData {
    totalViews: number;
    totalVisitors: number;
    allTimeViews: number;
    allTimeVisitors: number;
    sectionViews: Record<string, number>;
    clicks: Record<string, number>;
    dailyStats: DailyStat[];
}

interface UseAnalyticsReturn {
    analytics: AnalyticsData | null;
    isLoading: boolean;
    error: string | null;
    trackView: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/analytics');
            setAnalytics(response.data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch analytics'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const trackView = useCallback(async () => {
        try {
            let isUniqueVisitor = false;
            const visitorKey = 'portfolio_has_visited';
            if (typeof window !== 'undefined' && !localStorage.getItem(visitorKey)) {
                localStorage.setItem(visitorKey, 'true');
                isUniqueVisitor = true;
            }

            await axios.post('/api/analytics/track', {
                type: 'pageView',
                target: 'home',
                isUniqueVisitor,
            });
        } catch (err) {
            console.error('Failed to track view:', err);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        analytics,
        isLoading,
        error,
        trackView,
        refetch: fetchAnalytics,
    };
}
