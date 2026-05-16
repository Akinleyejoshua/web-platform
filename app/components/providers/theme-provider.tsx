'use client';

import { useEffect } from 'react';
import { useTheme } from '@/app/hooks/use-theme';
import { useSettingsStore } from '@/app/store/settings-store';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = useTheme();
    const fetchSettings = useSettingsStore((s) => s.fetchSettings);

    useEffect(() => {
        // Theme initialization is handled by the useTheme hook
    }, [theme]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return <>{children}</>;
}
