import { create } from 'zustand';
import axios from 'axios';

export interface SiteSettings {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    accentColor: string;
    projectsLimit: number;
}

interface SettingsState {
    settings: SiteSettings;
    isLoaded: boolean;
    isLoading: boolean;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
    applySettings: (settings: SiteSettings) => void;
    resetToDefaults: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 16,
    fontWeight: 400,
    accentColor: '#3b6ef0',
    projectsLimit: 4,
};

// Map font family names to their CSS variable name on <body>
const FONT_VAR_MAP: Record<string, string> = {
    'Poppins': '--font-poppins',
    'Bricolage Grotesque': '--font-bricolage',
    'Raleway': '--font-raleway',
};

/**
 * Convert hex to RGB string for rgba() usage
 */
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '59, 110, 240';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Generate a lighter hover variant of a color
 */
function lightenColor(hex: string, amount: number = 20): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = Math.min(255, parseInt(result[1], 16) + amount);
    const g = Math.min(255, parseInt(result[2], 16) + amount);
    const b = Math.min(255, parseInt(result[3], 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoaded: false,
    isLoading: false,

    applySettings: (settings: SiteSettings) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;
        const fontVarName = FONT_VAR_MAP[settings.fontFamily] || FONT_VAR_MAP['Bricolage Grotesque'];

        // Resolve the actual font family string from the body's CSS variable
        // (Next.js font classes set --font-poppins etc. on <body>)
        const resolvedFont = getComputedStyle(document.body).getPropertyValue(fontVarName).trim();

        // Typography
        root.style.setProperty('--font-active', resolvedFont || settings.fontFamily + ', sans-serif');
        root.style.setProperty('--font-size-base', `${settings.fontSize}px`);
        root.style.setProperty('--font-weight-base', `${settings.fontWeight}`);

        // Accent colors
        const rgb = hexToRgb(settings.accentColor);
        root.style.setProperty('--color-accent', settings.accentColor);
        root.style.setProperty('--color-accent-rgb', rgb);
        root.style.setProperty('--color-accent-hover', lightenColor(settings.accentColor, 25));
        root.style.setProperty('--color-accent-light', `rgba(${rgb}, 0.12)`);
    },

    fetchSettings: async () => {
        if (get().isLoaded || get().isLoading) return;
        set({ isLoading: true });

        try {
            const response = await axios.get('/api/settings');
            const fetched: SiteSettings = {
                fontFamily: response.data.fontFamily || DEFAULT_SETTINGS.fontFamily,
                fontSize: response.data.fontSize || DEFAULT_SETTINGS.fontSize,
                fontWeight: response.data.fontWeight || DEFAULT_SETTINGS.fontWeight,
                accentColor: response.data.accentColor || DEFAULT_SETTINGS.accentColor,
                projectsLimit: response.data.projectsLimit !== undefined ? response.data.projectsLimit : DEFAULT_SETTINGS.projectsLimit,
            };
            set({ settings: fetched, isLoaded: true, isLoading: false });
            get().applySettings(fetched);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            set({ isLoaded: true, isLoading: false });
            // Apply defaults even on error
            get().applySettings(DEFAULT_SETTINGS);
        }
    },

    updateSettings: async (partial: Partial<SiteSettings>) => {
        const current = get().settings;
        const merged = { ...current, ...partial };

        // Optimistically update UI
        set({ settings: merged });
        get().applySettings(merged);

        try {
            await axios.put('/api/settings', merged);
        } catch (error) {
            console.error('Failed to save settings:', error);
            // Revert on error
            set({ settings: current });
            get().applySettings(current);
            throw error;
        }
    },

    resetToDefaults: async () => {
        set({ settings: DEFAULT_SETTINGS });
        get().applySettings(DEFAULT_SETTINGS);

        try {
            await axios.put('/api/settings', DEFAULT_SETTINGS);
        } catch (error) {
            console.error('Failed to reset settings:', error);
            throw error;
        }
    },
}));
