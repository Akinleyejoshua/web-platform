'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IProject, ProjectCategory } from '@/app/lib/models/project';
import { useSettingsStore } from '@/app/store/settings-store';

interface UseProjectsReturn {
    projects: IProject[];
    isLoading: boolean;
    error: string | null;
    activeCategory: ProjectCategory | 'all';
    setActiveCategory: (category: ProjectCategory | 'all') => void;
    page: number;
    setPage: (page: number) => void;
    total: number;
    limit: number;
    refetch: () => Promise<void>;
}

export function useProjects(options?: { admin?: boolean }): UseProjectsReturn {
    const isAdmin = options?.admin || false;
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const { settings, fetchSettings } = useSettingsStore();
    const limit = isAdmin ? 0 : (settings?.projectsLimit || 4);

    useEffect(() => {
        if (!isAdmin) {
            fetchSettings();
        }
    }, [fetchSettings, isAdmin]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const domain = params.get('domain');
            if (domain && ['web', 'ml', 'web3', 'data-science', 'others'].includes(domain)) {
                setActiveCategory(domain as ProjectCategory);
            }
        }
    }, []);

    // Reset page to 1 when category changes
    useEffect(() => {
        setPage(1);
    }, [activeCategory]);

    const fetchProjects = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (activeCategory !== 'all') params.category = activeCategory;
            if (isAdmin) params.admin = 'true';
            else {
                params.page = page;
                params.limit = limit;
            }

            const response = await axios.get('/api/projects', { params, signal });
            if (!isAdmin && limit > 0) {
                setProjects(response.data.data || []);
                setTotal(response.data.total || 0);
            } else {
                setProjects(response.data || []);
                setTotal(response.data.length || 0);
            }
            setIsLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) return;
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch projects'
                : 'An unexpected error occurred';
            setError(message);
            setIsLoading(false);
        }
    }, [activeCategory, page, limit, isAdmin]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProjects(controller.signal);
        return () => controller.abort();
    }, [fetchProjects]);

    return {
        projects,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        page,
        setPage,
        total,
        limit,
        refetch: fetchProjects,
    };
}
