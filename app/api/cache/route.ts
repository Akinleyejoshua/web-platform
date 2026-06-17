import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import {
    CacheableSection,
    CACHEABLE_SECTIONS,
    readCache,
    clearCacheSection,
    clearAllCache,
    listCachedSections,
    setCachedSection,
    writeCache,
} from '@/app/lib/cache';
import Hero from '@/app/lib/models/hero';
import About from '@/app/lib/models/about';
import Contact from '@/app/lib/models/contact';
import Skill from '@/app/lib/models/skill';
import Experience from '@/app/lib/models/experience';
import Project from '@/app/lib/models/project';
import ProductProject from '@/app/lib/models/productProject';
import BlogPost from '@/app/lib/models/blogPost';
import Settings from '@/app/lib/models/settings';
import Resume from '@/app/lib/models/resume';
import CoverLetter from '@/app/lib/models/coverLetter';

/**
 * Fetch data from DB for a specific section (public/non-admin data).
 */
async function fetchSectionData(section: CacheableSection): Promise<unknown> {
    switch (section) {
        case 'hero': {
            let hero = await Hero.findOne().lean();
            if (!hero) hero = await Hero.create({});
            return hero;
        }
        case 'about': {
            let about = await About.findOne().lean();
            if (!about) about = await About.create({});
            return about;
        }
        case 'contact': {
            let contact = await Contact.findOne().lean();
            if (!contact) contact = await Contact.create({});
            return contact;
        }
        case 'skills': {
            return await Skill.find().sort({ order: 1, name: 1 }).lean();
        }
        case 'experience': {
            return await Experience.find().sort({ order: 1, startDate: -1 }).lean();
        }
        case 'projects': {
            return await Project.find({ isVisible: { $ne: false } })
                .sort({ order: 1, createdAt: -1 })
                .lean();
        }
        case 'product-projects': {
            return await ProductProject.find({ isVisible: { $ne: false } })
                .sort({ order: 1, createdAt: -1 })
                .lean();
        }
        case 'blog': {
            return await BlogPost.find({ isVisible: true })
                .sort({ createdAt: -1 })
                .lean();
        }
        case 'settings': {
            let settings = await Settings.findOne().lean();
            if (!settings) settings = await Settings.create({});
            return settings;
        }
        case 'resume': {
            return await Resume.find().sort({ domain: 1 }).lean();
        }
        case 'cover-letter': {
            return await CoverLetter.find().sort({ domain: 1 }).lean();
        }
        default:
            throw new Error(`Unknown section: ${section}`);
    }
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/cache — list cached sections and their metadata
 */
export async function GET() {
    try {
        const cache = await readCache();
        const cachedSections = await listCachedSections();

        const sections = CACHEABLE_SECTIONS.map((s) => {
            const entry = (cache as Record<string, any>)[s.value];
            return {
                ...s,
                isCached: cachedSections.includes(s.value),
                cachedAt: entry?._cachedAt || null,
            };
        });

        return NextResponse.json({ sections }, { status: 200 });
    } catch (error) {
        console.error('Cache GET error:', error);
        return NextResponse.json(
            { error: 'Failed to read cache' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cache — build cache for selected section(s)
 * Body: { sections: CacheableSection[] } or { section: CacheableSection }
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const sections: CacheableSection[] = body.sections || (body.section ? [body.section] : []);

        if (sections.length === 0) {
            return NextResponse.json(
                { error: 'No sections provided' },
                { status: 400 }
            );
        }

        // Validate section names
        const validSections = CACHEABLE_SECTIONS.map((s) => s.value);
        for (const s of sections) {
            if (!validSections.includes(s)) {
                return NextResponse.json(
                    { error: `Invalid section: ${s}` },
                    { status: 400 }
                );
            }
        }

        const cache = await readCache();
        const results: Record<string, string> = {};

        for (const section of sections) {
            try {
                const data = await fetchSectionData(section);
                if (data !== null && data !== undefined) {
                    const isArray = Array.isArray(data);
                    cache[section] = {
                        data,
                        _cachedAt: new Date().toISOString(),
                        _type: isArray ? 'array' : 'object',
                    };
                    results[section] = 'cached';
                } else {
                    results[section] = 'skipped';
                }
            } catch (err) {
                console.error(`Failed to cache section ${section}:`, err);
                results[section] = 'failed';
            }
        }

        await writeCache(cache);

        return NextResponse.json(
            { message: 'Cache updated', results },
            { status: 200 }
        );
    } catch (error) {
        console.error('Cache POST error:', error);
        return NextResponse.json(
            { error: 'Failed to build cache' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cache — clear cache
 * Query params: ?section=projects (single) or ?all=true (all)
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section') as CacheableSection | null;
        const clearAll = searchParams.get('all') === 'true';

        if (clearAll) {
            await clearAllCache();
            return NextResponse.json(
                { message: 'All cache cleared' },
                { status: 200 }
            );
        }

        if (section) {
            await clearCacheSection(section);
            return NextResponse.json(
                { message: `Cache cleared for ${section}` },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Provide ?section=<name> or ?all=true' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Cache DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to clear cache' },
            { status: 500 }
        );
    }
}
