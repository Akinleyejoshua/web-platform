'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ISkill } from '@/app/lib/models/skill';

interface UseSkillsReturn {
    skills: ISkill[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useSkills(initialData?: ISkill[]): UseSkillsReturn {
    const [skills, setSkills] = useState<ISkill[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    const fetchSkills = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/skills');
            setSkills(response.data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch skills'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialData) {
            setSkills(initialData);
            setIsLoading(false);
            return;
        }
        fetchSkills();
    }, [fetchSkills, initialData]);

    return {
        skills,
        isLoading,
        error,
        refetch: fetchSkills,
    };
}
