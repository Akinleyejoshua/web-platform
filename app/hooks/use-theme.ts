'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/app/store/theme-store';

export function useTheme() {
    const { theme, resolvedTheme, setTheme, toggleTheme, initTheme } = useThemeStore();

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
    };
}
