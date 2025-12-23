'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/app/store/admin-store';

export function useAdmin() {
    const router = useRouter();
    const { isAuthenticated, isLoading, error, login, logout, clearError } = useAdminStore();

    const handleLogin = useCallback(async (email: string, password: string) => {
        const success = await login(email, password);
        if (success) {
            router.push('/admin');
        }
        return success;
    }, [login, router]);

    const handleLogout = useCallback(async () => {
        await logout();
        router.push('/admin/auth');
    }, [logout, router]);

    return {
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        logout: handleLogout,
        clearError,
    };
}
