'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IProductProject, ProductCategory } from '@/app/lib/models/productProject';

interface UseProductProjectsReturn {
    products: IProductProject[];
    isLoading: boolean;
    error: string | null;
    activeCategory: ProductCategory | 'all';
    setActiveCategory: (category: ProductCategory | 'all') => void;
    refetch: () => Promise<void>;
}

export function useProductProjects(): UseProductProjectsReturn {
    const [products, setProducts] = useState<IProductProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
            const response = await axios.get(`/api/product-projects${params}`);
            setProducts(response.data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to fetch products'
                : 'An unexpected error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        refetch: fetchProducts,
    };
}
