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

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = activeCategory !== 'all' ? { category: activeCategory } : {};
            const response = await axios.get('/api/projects', { params });
            setProjects(response.data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch projects'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        fetchProjects();
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
