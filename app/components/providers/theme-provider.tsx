'use client';

import { useEffect } from 'react';
import { useTheme } from '@/app/hooks/use-theme';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = useTheme();

    useEffect(() => {
        // Theme initialization is handled by the useTheme hook
    }, [theme]);

    return <>{children}</>;
}
