'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IProject, ProjectCategory } from '@/app/lib/models/project';

interface UseProjectsReturn {
    projects: IProject[];
    isLoading: boolean;
    error: string | null;
    activeCategory: ProjectCategory | 'all';
    setActiveCategory: (category: ProjectCategory | 'all') => void;
    refetch: () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const domain = params.get('domain');
            if (domain && ['web', 'ml', 'web3', 'data-science', 'others'].includes(domain)) {
                setActiveCategory(domain as ProjectCategory);
            }
        }
    }, []);

    const fetchProjects = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = activeCategory !== 'all' ? { category: activeCategory } : {};
            const response = await axios.get('/api/projects', { params, signal });
            setProjects(response.data);
            setIsLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) return;
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch projects'
                : 'An unexpected error occurred';
            setError(message);
            setIsLoading(false);
        }
    }, [activeCategory]);

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
        refetch: fetchProjects,
    };
}
