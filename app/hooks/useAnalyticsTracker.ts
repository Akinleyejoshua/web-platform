'use client';

import React, { useEffect, useCallback, useRef } from 'react';

// Types for tracking events
type TrackingType = 'pageView' | 'sectionView' | 'click';

// Generate or get session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
}

// Get today's date as string for daily tracking
function getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
}

// Check if event was already tracked today
function wasTrackedToday(type: TrackingType, target: string): boolean {
    if (typeof window === 'undefined') return true;

    const key = `analytics_${type}_${target}_${getTodayKey()}`;
    return localStorage.getItem(key) === 'true';
}

// Mark event as tracked for today
function markAsTracked(type: TrackingType, target: string): void {
    if (typeof window === 'undefined') return;

    const key = `analytics_${type}_${target}_${getTodayKey()}`;
    localStorage.setItem(key, 'true');
}

// Clean up old tracking data (older than 7 days)
function cleanupOldTracking(): void {
    if (typeof window === 'undefined') return;

    const today = new Date();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('analytics_')) {
            const parts = key.split('_');
            const dateStr = parts[parts.length - 1];

            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const trackDate = new Date(dateStr);
                const daysDiff = Math.floor((today.getTime() - trackDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff > 7) {
                    keysToRemove.push(key);
                }
            }
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Send tracking event to server
async function sendTrackingEvent(type: TrackingType, target: string): Promise<void> {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                target,
                sessionId: getSessionId(),
                timestamp: Date.now(),
            }),
        });
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

/**
 * Hook for tracking page views with localStorage deduplication
 */
export function usePageViewTracker(pageName: string = 'home') {
    useEffect(() => {
        cleanupOldTracking();

        if (!wasTrackedToday('pageView', pageName)) {
            markAsTracked('pageView', pageName);
            sendTrackingEvent('pageView', pageName);
        }
    }, [pageName]);
}

/**
 * Hook for tracking section views using Intersection Observer
 * Uses localStorage to avoid duplicate tracking per day
 */
export function useSectionViewTracker(sectionId: string, elementRef: React.RefObject<HTMLElement | null>) {
    const hasTracked = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Check if already tracked today (from localStorage)
        if (wasTrackedToday('sectionView', sectionId)) {
            hasTracked.current = true;
            return;
        }

        // Wait for element to be available
        const checkElement = () => {
            const element = elementRef.current;
            if (!element) {
                // Retry after a short delay if element isn't ready yet
                const timeoutId = setTimeout(checkElement, 100);
                return () => clearTimeout(timeoutId);
            }

            if (hasTracked.current) return;

            // Clean up previous observer if any
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasTracked.current) {
                            hasTracked.current = true;
                            markAsTracked('sectionView', sectionId);
                            sendTrackingEvent('sectionView', sectionId);
                            console.log(`[Analytics] Section viewed: ${sectionId}`);
                            // Disconnect after tracking
                            observerRef.current?.disconnect();
                        }
                    });
                },
                { threshold: 0.3, rootMargin: '0px' }
            );

            observerRef.current.observe(element);
        };

        checkElement();

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [sectionId, elementRef]);
}

/**
 * Hook for tracking clicks
 */
export function useClickTracker(targetId: string, deduplicatePerDay: boolean = false) {
    const trackClick = useCallback(() => {
        if (deduplicatePerDay && wasTrackedToday('click', targetId)) return;
        if (deduplicatePerDay) markAsTracked('click', targetId);
        sendTrackingEvent('click', targetId);
    }, [targetId, deduplicatePerDay]);

    return trackClick;
}

/**
 * Standalone function to track a click
 */
export function trackClick(targetId: string, deduplicatePerDay: boolean = false): void {
    if (deduplicatePerDay && wasTrackedToday('click', targetId)) return;
    if (deduplicatePerDay) markAsTracked('click', targetId);
    sendTrackingEvent('click', targetId);
}
