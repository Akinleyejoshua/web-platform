/**
 * Utility function to rewrite Next.js optimized image URLs
 * to request smaller, mobile-friendly widths (e.g., 640px instead of 3840px).
 */
export function optimizeImageUrl(url: string | undefined, width = 640): string {
    if (!url) return '';
    
    // Check if the URL has a Next.js width parameter (w=3840, etc.)
    if (url.includes('w=')) {
        return url.replace(/w=\d+/, `w=${width}`);
    }
    
    return url;
}
