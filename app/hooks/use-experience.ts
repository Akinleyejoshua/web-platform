'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IExperience } from '@/app/lib/models/experience';

interface UseExperienceReturn {
    experiences: IExperience[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useExperience(initialData?: IExperience[]): UseExperienceReturn {
    const [experiences, setExperiences] = useState<IExperience[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    const fetchExperiences = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/experience');
            setExperiences(response.data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch experiences'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialData) {
            setExperiences(initialData);
            setIsLoading(false);
            return;
        }
        fetchExperiences();
    }, [fetchExperiences, initialData]);

    return {
        experiences,
        isLoading,
        error,
        refetch: fetchExperiences,
    };
}
