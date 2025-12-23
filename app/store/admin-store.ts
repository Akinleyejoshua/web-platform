import { create } from 'zustand';
import axios from 'axios';

interface AdminState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => void;
    clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/auth', { email, password });
            if (response.data.success) {
                set({ isAuthenticated: true, isLoading: false });
                return true;
            }
            return false;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error || 'Login failed'
                : 'An unexpected error occurred';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await axios.delete('/api/auth');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            set({ isAuthenticated: false });
        }
    },

    checkAuth: () => {
        // Auth state is managed via HTTP-only cookie
        // This is checked server-side in middleware
    },

    clearError: () => set({ error: null }),
}));
