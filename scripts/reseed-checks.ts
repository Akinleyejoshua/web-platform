/**
 * reseed-checks.ts
 * 
 * This script automatically generates catchy checks/features for projects and products
 * based on their existing descriptions. It extracts key points and categorizes them
 * as features, goals, or archived items.
 * 
 * Usage: npx tsx scripts/reseed-checks.ts
 */

import mongoose from 'mongoose';
import connectDB from '../app/lib/db';
import Project from '../app/lib/models/project';
import ProductProject from '../app/lib/models/productProject';

// Common action verbs that indicate a feature or achievement
const ACTION_VERBS = [
    'built', 'developed', 'created', 'designed', 'implemented', 'launched',
    'deployed', 'integrated', 'automated', 'optimized', 'improved', 'enhanced',
    'reduced', 'increased', 'delivered', 'shipped', 'published', 'released',
    'configured', 'setup', 'architected', 'engineered', 'produced', 'generated',
    'enabled', 'powered', 'supported', 'handled', 'managed', 'processed',
    'transformed', 'converted', 'migrated', 'upgraded', 'modernized',
];

// Goal-related keywords
const GOAL_KEYWORDS = [
    'goal', 'aim', 'objective', 'target', 'purpose', 'mission', 'vision',
    'intention', 'aspiration', 'ambition', 'desired', 'plan', 'strategy',
    'to improve', 'to reduce', 'to increase', 'to achieve', 'to enable',
    'to empower', 'to help', 'to assist', 'to support', 'to provide',
    'to solve', 'to address', 'to tackle', 'to overcome', 'to eliminate',
];

// Archive indicators
const ARCHIVE_INDICATORS = [
    'deprecated', 'legacy', 'old', 'previous', 'older', 'past', 'former',
    'retired', 'replaced', 'sunset', 'archived', 'discontinued', 'end-of-life',
    'no longer', 'not maintained', 'outdated', 'phase out', 'phase-out',
];

/**
 * Extract sentences from a description that look like features/achievements
 */
function extractAchievementSentences(description: string): string[] {
    // Split by sentence boundaries
    const sentences = description
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20); // Filter out very short fragments

    return sentences.filter(sentence => {
        const lower = sentence.toLowerCase();
        
        // Check if sentence contains action verbs or achievement indicators
        const hasAction = ACTION_VERBS.some(verb => lower.includes(verb));
        const hasTechnicalContent = /[\w-]+(\s*[:\-]\s*)?[\w-]+/.test(sentence) && 
                                   (lower.includes('using') || lower.includes('with') || 
                                    lower.includes('via') || lower.includes('through') ||
                                    lower.includes('based on') || lower.includes('powered by'));
        
        return hasAction || hasTechnicalContent;
    });
}

/**
 * Generate checks from a description
 */
function generateChecks(description: string): Array<{ type: 'feature' | 'goal' | 'archive'; label: string; description?: string }> {
    const checks: Array<{ type: 'feature' | 'goal' | 'archive'; label: string; description?: string }> = [];
    
    if (!description) return checks;

    const lower = description.toLowerCase();

    // Check for archive indicators first
    const hasArchiveIndicator = ARCHIVE_INDICATORS.some(ind => lower.includes(ind));
    if (hasArchiveIndicator) {
        checks.push({
            type: 'archive',
            label: 'Legacy/Deprecated',
            description: 'This item contains legacy or deprecated components'
        });
    }

    // Extract achievement sentences as features
    const achievements = extractAchievementSentences(description);
    
    achievements.slice(0, 5).forEach(achievement => {
        // Clean up the achievement text
        let label = achievement
            .replace(/^[^a-zA-Z]+/, '') // Remove leading non-alpha chars
            .replace(/\s+/g, ' ') // Normalize spaces
            .replace(/[.!?]+$/, '') // Remove trailing punctuation
            .substring(0, 100); // Truncate long labels

        // Check if this seems like a goal
        const isGoal = GOAL_KEYWORDS.some(kw => lower.includes(kw)) && 
                       (label.includes('to ') || label.includes('for '));

        checks.push({
            type: isGoal && !label.toLowerCase().includes('built') && !label.toLowerCase().includes('developed') 
                ? 'goal' 
                : 'feature',
            label: label.charAt(0).toUpperCase() + label.slice(1),
            description: achievement.length > 100 ? undefined : achievement
        });
    });

    // If we have tech mentions, add a tech-focused feature
    const techMentions = description.match(/(?:using|with|via|through|based on|powered by)\s+([A-Z][a-zA-Z0-9\s,+]+)/gi);
    if (techMentions && techMentions.length > 0 && checks.length < 5) {
        const techStack = techMentions[0]
            .replace(/^(?:using|with|via|through|based on|powered by)\s+/i, '')
            .substring(0, 80);
        
        checks.push({
            type: 'feature',
            label: `Powered by ${techStack.split(',')[0].trim()}`,
            description: techStack.length > 100 ? undefined : techStack
        });
    }

    // Ensure we have at least 2 checks for meaningful content
    if (checks.length === 0 && description.length > 0) {
        // Generate generic feature from description length/complexity
        if (description.length > 200) {
            checks.push({
                type: 'feature',
                label: 'Comprehensive Solution',
                description: 'A full-featured implementation addressing multiple requirements'
            });
        }
        
        if (description.includes('user') || description.includes('customer') || description.includes('client')) {
            checks.push({
                type: 'feature',
                label: 'User-Centric Design',
                description: 'Built with end-user experience as a primary focus'
            });
        }
    }

    return checks.slice(0, 6); // Max 6 checks
}

async function run() {
    try {
        await connectDB();

        console.log('🔄 Starting checks generation for projects and products...\n');

        // Process Projects
        console.log('📋 Processing Projects...');
        const projects = await Project.find({ description: { $exists: true, $ne: '' } });
        let projectCount = 0;
        
        for (const project of projects) {
            if (!project.checks || project.checks.length === 0) {
                const newChecks = generateChecks(project.description);
                if (newChecks.length > 0) {
                    project.checks = newChecks;
                    await project.save();
                    projectCount++;
                    console.log(`  ✓ ${project.title}: ${newChecks.length} checks generated`);
                }
            }
        }
        console.log(`  Total: ${projectCount} projects updated\n`);

        // Process Products
        console.log('📦 Processing Products...');
        const products = await ProductProject.find({ description: { $exists: true, $ne: '' } });
        let productCount = 0;
        
        for (const product of products) {
            if (!product.checks || product.checks.length === 0) {
                const newChecks = generateChecks(product.description);
                if (newChecks.length > 0) {
                    product.checks = newChecks;
                    await product.save();
                    productCount++;
                    console.log(`  ✓ ${product.title}: ${newChecks.length} checks generated`);
                }
            }
        }
        console.log(`  Total: ${productCount} products updated\n`);

        console.log('✅ Checks generation complete!');
        console.log(`   Projects updated: ${projectCount}`);
        console.log(`   Products updated: ${productCount}`);
        
    } catch (error) {
        console.error('❌ Error during checks generation:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

run();
