'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

export function useProductProjects(options?: { admin?: boolean; initialData?: IProductProject[]; initialTotal?: number }): UseProductProjectsReturn {
    const isAdmin = options?.admin || false;
    const [products, setProducts] = useState<IProductProject[]>(options?.initialData || []);
    const [isLoading, setIsLoading] = useState(!options?.initialData);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(options?.initialTotal || 0);

    const isFirstRender = useRef(true);

    const { settings, fetchSettings } = useSettingsStore();
    const limit = isAdmin ? 0 : (settings?.projectsLimit || 4);

    useEffect(() => {
        if (!isAdmin) {
            fetchSettings();
        }
    }, [fetchSettings, isAdmin]);

    useEffect(() => {
        if (options?.initialData) {
            setProducts(options.initialData);
            setTotal(options.initialTotal || 0);
            setIsLoading(false);
        }
    }, [options?.initialData, options?.initialTotal]);

    // Reset page to 1 when category changes
    useEffect(() => {
        setPage(1);
    }, [activeCategory]);

    const fetchProducts = useCallback(async (signal?: AbortSignal) => {
        if (isFirstRender.current && options?.initialData) {
            isFirstRender.current = false;
            setIsLoading(false);
            return;
        }
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

            const response = await axios.get('/api/product-projects', { params, signal });
            if (!isAdmin && limit > 0) {
                setProducts(response.data.data || []);
                setTotal(response.data.total || 0);
            } else {
                setProducts(response.data || []);
                setTotal(response.data.length || 0);
            }
            setIsLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) return;
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch products'
                : 'An unexpected error occurred';
            setError(message);
            setIsLoading(false);
        }
    }, [activeCategory, page, limit, isAdmin, options?.initialData, options?.initialTotal]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts(controller.signal);
        return () => controller.abort();
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
