import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            resolvedTheme: 'light',

            setTheme: (theme: Theme) => {
                set({ theme });
                const resolved = theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                set({ resolvedTheme: resolved });
                document.documentElement.setAttribute('data-theme', resolved);
            },

            toggleTheme: () => {
                const { resolvedTheme } = get();
                const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },

            initTheme: () => {
                const { theme, setTheme } = get();

                // Set initial theme
                setTheme(theme);

                // Listen for system preference changes
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = () => {
                    if (get().theme === 'system') {
                        const resolved = mediaQuery.matches ? 'dark' : 'light';
                        set({ resolvedTheme: resolved });
                        document.documentElement.setAttribute('data-theme', resolved);
                    }
                };

                mediaQuery.addEventListener('change', handleChange);
            },
        }),
        {
            name: 'theme-storage',
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);
