'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IProductProject, ProductCategory } from '@/app/lib/models/productProject';
import { useSettingsStore } from '@/app/store/settings-store';

interface UseProductProjectsReturn {
    products: IProductProject[];
    isLoading: boolean;
    error: string | null;
    activeCategory: ProductCategory | 'all';
    setActiveCategory: (category: ProductCategory | 'all') => void;
    page: number;
    setPage: (page: number) => void;
    total: number;
    limit: number;
    refetch: () => Promise<void>;
}

export function useProductProjects(options?: { admin?: boolean }): UseProductProjectsReturn {
    const isAdmin = options?.admin || false;
    const [products, setProducts] = useState<IProductProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const { settings, fetchSettings } = useSettingsStore();
    const limit = isAdmin ? 0 : (settings?.projectsLimit || 4);

    useEffect(() => {
        if (!isAdmin) {
            fetchSettings();
        }
    }, [fetchSettings, isAdmin]);

    // Reset page to 1 when category changes
    useEffect(() => {
        setPage(1);
    }, [activeCategory]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (activeCategory !== 'all') params.category = activeCategory;
            if (isAdmin) params.admin = 'true';
            else {
                params.page = page;
                params.limit = limit;
            }

            const response = await axios.get('/api/product-projects', { params });
            if (!isAdmin && limit > 0) {
                setProducts(response.data.data || []);
                setTotal(response.data.total || 0);
            } else {
                setProducts(response.data || []);
                setTotal(response.data.length || 0);
            }
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch products'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [activeCategory, page, limit, isAdmin]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        page,
        setPage,
        total,
        limit,
        refetch: fetchProducts,
    };
}
