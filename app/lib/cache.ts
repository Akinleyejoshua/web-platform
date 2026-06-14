import connectDB from '@/app/lib/db';
import CacheModel, { ICache } from '@/app/lib/models/cache';

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

/**
 * Get the cached data for a specific section from MongoDB.
 * Returns null if not found.
 */
export async function getCachedSection<T>(section: CacheableSection): Promise<T | null> {
    try {
        await connectDB();
        const entry = await CacheModel.findOne({ section }).lean<ICache>();
        if (!entry) return null;
        return entry.data as T;
    } catch (error) {
        console.error(`Cache get error for ${section}:`, error);
        return null;
    }
}

/**
 * Set cache data for a specific section in MongoDB.
 */
export async function setCachedSection<T>(section: CacheableSection, data: T): Promise<void> {
    try {
        await connectDB();
        await CacheModel.updateOne(
            { section },
            {
                $set: {
                    data: data as object,
                    cachedAt: new Date(),
                },
            },
            { upsert: true }
        );
    } catch (error) {
        console.error(`Cache set error for ${section}:`, error);
        throw error;
    }
}

/**
 * Clear a specific section from the cache.
 */
export async function clearCacheSection(section: CacheableSection): Promise<void> {
    try {
        await connectDB();
        await CacheModel.deleteOne({ section });
    } catch (error) {
        console.error(`Cache delete error for ${section}:`, error);
    }
}

/**
 * Clear all cache.
 */
export async function clearAllCache(): Promise<void> {
    try {
        await connectDB();
        await CacheModel.deleteMany({});
    } catch (error) {
        console.error('Cache delete all error:', error);
    }
}

/**
 * List all currently cached sections from MongoDB.
 */
export async function listCachedSections(): Promise<CacheableSection[]> {
    try {
        await connectDB();
        const entries = await CacheModel.find({}).lean<ICache>();
        return entries.map((e) => e.section as CacheableSection);
    } catch (error) {
        console.error('Cache list error:', error);
        return [];
    }
}

/**
 * Get cache metadata for all sections (used by admin UI).
 */
export async function getCacheMetadata(): Promise<Array<{ section: CacheableSection; cachedAt: string | null }>> {
    try {
        await connectDB();
        const entries = await CacheModel.find({}).lean<ICache>();
        return entries.map((e) => ({
            section: e.section as CacheableSection,
            cachedAt: e.cachedAt?.toISOString() || null,
        }));
    } catch (error) {
        console.error('Cache metadata error:', error);
        return [];
    }
}
