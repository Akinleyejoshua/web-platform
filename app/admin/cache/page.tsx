'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    FiDatabase,
    FiRefreshCw,
    FiTrash2,
    FiZap,
    FiCheck,
    FiAlertCircle,
    FiInfo,
    FiImage,
    FiUser,
    FiMail,
    FiBriefcase,
    FiFolder,
    FiAward,
    FiPackage,
    FiBookOpen,
    FiSettings,
    FiDownload,
    FiFileText,
    FiSave,
} from 'react-icons/fi';
import styles from './cache.module.css';

interface SectionInfo {
    value: string;
    label: string;
    isCached: boolean;
    cachedAt: string | null;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
    hero: <FiImage size={18} />,
    about: <FiUser size={18} />,
    contact: <FiMail size={18} />,
    skills: <FiAward size={18} />,
    experience: <FiBriefcase size={18} />,
    projects: <FiFolder size={18} />,
    'product-projects': <FiPackage size={18} />,
    blog: <FiBookOpen size={18} />,
    settings: <FiSettings size={18} />,
    resume: <FiDownload size={18} />,
    'cover-letter': <FiFileText size={18} />,
};

export default function CacheManagerPage() {
    const [sections, setSections] = useState<SectionInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cachingSections, setCachingSections] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const fetchCacheStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/cache');
            if (!res.ok) throw new Error('Failed to fetch cache status');
            const data = await res.json();
            setSections(data.sections || []);
        } catch (err) {
            showToast('Failed to load cache status', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCacheStatus();
    }, [fetchCacheStatus]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const cacheSection = async (section: string) => {
        setCachingSections((prev) => new Set(prev).add(section));
        try {
            const res = await fetch('/api/cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections: [section] }),
            });
            if (!res.ok) throw new Error('Cache failed');
            showToast(`${sections.find((s) => s.value === section)?.label} cached successfully`);
            await fetchCacheStatus();
        } catch {
            showToast(`Failed to cache ${section}`, 'error');
        } finally {
            setCachingSections((prev) => {
                const next = new Set(prev);
                next.delete(section);
                return next;
            });
        }
    };

    const cacheAll = async () => {
        const uncached = sections.filter((s) => !s.isCached).map((s) => s.value);
        const toCache = uncached.length > 0 ? uncached : sections.map((s) => s.value);

        setCachingSections(new Set(toCache));
        try {
            const res = await fetch('/api/cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections: toCache }),
            });
            if (!res.ok) throw new Error('Cache all failed');
            const data = await res.json();
            const failed = Object.entries(data.results || {})
                .filter(([, v]) => v === 'failed')
                .map(([k]) => k);
            if (failed.length > 0) {
                showToast(`Some sections failed to cache: ${failed.join(', ')}`, 'error');
            } else {
                showToast('All sections cached successfully');
            }
            await fetchCacheStatus();
        } catch {
            showToast('Failed to cache all sections', 'error');
        } finally {
            setCachingSections(new Set());
        }
    };

    const clearSection = async (section: string) => {
        try {
            const res = await fetch(`/api/cache?section=${section}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Clear failed');
            showToast(`${sections.find((s) => s.value === section)?.label} cache cleared`);
            await fetchCacheStatus();
        } catch {
            showToast(`Failed to clear cache for ${section}`, 'error');
        }
    };

    const clearAll = async () => {
        try {
            const res = await fetch('/api/cache?all=true', { method: 'DELETE' });
            if (!res.ok) throw new Error('Clear all failed');
            showToast('All cache cleared');
            await fetchCacheStatus();
        } catch {
            showToast('Failed to clear all cache', 'error');
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleString();
        } catch {
            return dateStr;
        }
    };

    const cachedCount = sections.filter((s) => s.isCached).length;

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.cache}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Cache Manager</h1>
                    <p>
                        Cache section data to a local file so the landing page loads from cache
                        instead of querying the database. {cachedCount} of {sections.length} sections
                        cached.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.cacheAllBtn}
                        onClick={cacheAll}
                        disabled={cachingSections.size > 0}
                    >
                        <FiZap size={16} />
                        {cachedCount === sections.length ? 'Refresh All' : 'Cache All'}
                    </button>
                    <button
                        className={styles.clearAllBtn}
                        onClick={clearAll}
                        disabled={cachedCount === 0 || cachingSections.size > 0}
                    >
                        <FiTrash2 size={16} />
                        Clear All
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className={styles.infoBanner}>
                <FiInfo size={20} />
                <div>
                    When a section is cached, the public API routes will serve data from
                    <code> cache.json</code> instead of querying the database — making the landing
                    page load significantly faster. Admin routes always query the database for
                    real-time editing. Use <strong>Cache</strong> to save current DB data, and
                    <strong> Refresh</strong> to update the cache with fresh data.
                </div>
            </div>

            {/* Section Grid */}
            <div className={styles.sectionGrid}>
                {sections.map((section) => {
                    const isCaching = cachingSections.has(section.value);
                    return (
                        <div
                            key={section.value}
                            className={`${styles.sectionCard} ${section.isCached ? styles.cached : ''}`}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardInfo}>
                                    <div
                                        className={`${styles.cardIcon} ${
                                            section.isCached ? styles.cached : styles.notCached
                                        }`}
                                    >
                                        {SECTION_ICONS[section.value] || <FiDatabase size={18} />}
                                    </div>
                                    <div>
                                        <div className={styles.cardTitle}>{section.label}</div>
                                        {section.cachedAt && (
                                            <div className={styles.cardMeta}>
                                                Cached: {formatDate(section.cachedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span
                                    className={`${styles.statusBadge} ${
                                        section.isCached ? styles.cached : styles.notCached
                                    }`}
                                >
                                    <span
                                        className={`${styles.statusDot} ${
                                            section.isCached ? styles.cached : styles.notCached
                                        }`}
                                    />
                                    {section.isCached ? 'Cached' : 'Not Cached'}
                                </span>
                            </div>

                            <div className={styles.cardActions}>
                                {section.isCached ? (
                                    <>
                                        <button
                                            className={`${styles.cacheBtn} ${styles.refresh}`}
                                            onClick={() => cacheSection(section.value)}
                                            disabled={isCaching}
                                        >
                                            {isCaching ? (
                                                <FiRefreshCw size={14} className="spinner" />
                                            ) : (
                                                <FiRefreshCw size={14} />
                                            )}
                                            Refresh
                                        </button>
                                        <button
                                            className={styles.clearBtn}
                                            onClick={() => clearSection(section.value)}
                                            disabled={isCaching}
                                        >
                                            <FiTrash2 size={14} />
                                            Clear
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className={styles.cacheBtn}
                                        onClick={() => cacheSection(section.value)}
                                        disabled={isCaching}
                                    >
                                        {isCaching ? (
                                            <FiRefreshCw size={14} className="spinner" />
                                        ) : (
                                            <FiSave size={14} />
                                        )}
                                        Cache Section
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>
                    {toast.type === 'success' ? (
                        <FiCheck size={18} />
                    ) : (
                        <FiAlertCircle size={18} />
                    )}
                    {toast.message}
                </div>
            )}
        </div>
    );
}
