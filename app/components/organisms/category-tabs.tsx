import React from 'react';
import { ProjectCategory } from '@/app/lib/models/project';
import styles from './category-tabs.module.css';

type TabCategory = ProjectCategory | 'all';

interface CategoryTabsProps {
    activeCategory: TabCategory;
    onCategoryChange: (category: TabCategory) => void;
}

const categories: { value: TabCategory; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'web', label: 'Web' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'web3', label: 'Web3' },
    { value: 'others', label: 'Others' },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
    return (
        <div className={styles.tabs}>
            {categories.map((cat) => (
                <button
                    key={cat.value}
                    className={`${styles.tab} ${activeCategory === cat.value ? styles.active : ''}`}
                    onClick={() => onCategoryChange(cat.value)}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
