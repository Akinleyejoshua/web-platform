'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/app/hooks/use-theme';
import styles from './theme-toggle.module.css';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`${styles.toggle} ${className}`.trim()}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <FiSun /> : <FiMoon />}
        </button>
    );
}
