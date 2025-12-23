'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface DailyStat {
    date: string;
    views: number;
}

interface AnalyticsData {
    totalViews: number;
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
            await axios.post('/api/analytics');
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
