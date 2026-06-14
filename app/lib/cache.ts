import { promises as fs } from 'fs';
import path from 'path';

export type CacheableSection =
    | 'hero'
    | 'about'
    | 'contact'
    | 'skills'
    | 'experience'
    | 'projects'
    | 'product-projects'
    | 'blog'
    | 'settings'
    | 'resume'
    | 'cover-letter';

export const CACHEABLE_SECTIONS: { value: CacheableSection; label: string }[] = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' },
    { value: 'skills', label: 'Skills' },
    { value: 'experience', label: 'Experience' },
    { value: 'projects', label: 'Projects' },
    { value: 'product-projects', label: 'Products' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'settings', label: 'Settings' },
    { value: 'resume', label: 'Resume' },
    { value: 'cover-letter', label: 'Cover Letter' },
];

const CACHE_FILE = path.resolve(process.cwd(), 'cache.json');

/**
 * Read the cache file and return its contents.
 * Returns null if the file doesn't exist or on error.
 */
export async function readCache(): Promise<Record<string, unknown>> {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf-8');
        return JSON.parse(data) || {};
    } catch {
        return {};
    }
}

/**
 * Write the cache file with the provided data.
 */
export async function writeCache(data: Record<string, unknown>): Promise<void> {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Get the cached data for a specific section.
 * Returns null if not found.
 */
export async function getCachedSection<T>(section: CacheableSection): Promise<T | null> {
    try {
        const cache = await readCache();
        return (cache[section] as T) ?? null;
    } catch {
        return null;
    }
}

/**
 * Set cache data for a specific section.
 */
export async function setCachedSection<T>(section: CacheableSection, data: T): Promise<void> {
    const cache = await readCache();
    cache[section] = data as unknown;
    await writeCache(cache);
}

/**
 * Clear a specific section from the cache.
 */
export async function clearCacheSection(section: CacheableSection): Promise<void> {
    const cache = await readCache();
    if (section in cache) {
        delete cache[section];
        await writeCache(cache);
    }
}

/**
 * Clear all cache.
 */
export async function clearAllCache(): Promise<void> {
    await writeCache({});
}

/**
 * List all currently cached sections.
 */
export async function listCachedSections(): Promise<CacheableSection[]> {
    const cache = await readCache();
    return Object.keys(cache) as CacheableSection[];
}
