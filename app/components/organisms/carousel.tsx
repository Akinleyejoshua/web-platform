'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './carousel.module.css';

interface CarouselProps {
    children: React.ReactNode[];
    autoPlay?: boolean;
    interval?: number;
}

export function Carousel({ children, autoPlay = false, interval = 5000 }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(1);
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Responsive slides per view
    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth >= 1024) {
                setSlidesPerView(3);
            } else if (window.innerWidth >= 640) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };

        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);

    const maxIndex = Math.max(0, children.length - slidesPerView);

    const scrollToSlide = useCallback((index: number) => {
        if (trackRef.current) {
            const slideWidth = trackRef.current.scrollWidth / children.length;
            trackRef.current.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
        }
    }, [children.length]);

    const handleScroll = useCallback(() => {
        if (trackRef.current) {
            const slideWidth = trackRef.current.scrollWidth / children.length;
            const newIndex = Math.round(trackRef.current.scrollLeft / slideWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex <= maxIndex) {
                setCurrentIndex(newIndex);
            }
        }
    }, [children.length, currentIndex, maxIndex]);

    const goNext = useCallback(() => {
        const nextIndex = Math.min(currentIndex + 1, maxIndex);
        scrollToSlide(nextIndex);
    }, [currentIndex, maxIndex, scrollToSlide]);

    const goPrev = useCallback(() => {
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToSlide(prevIndex);
    }, [currentIndex, scrollToSlide]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            if (currentIndex >= maxIndex) {
                scrollToSlide(0);
            } else {
                goNext();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, currentIndex, maxIndex, goNext, scrollToSlide]);

    // Reset scroll when children change
    useEffect(() => {
        if (trackRef.current) {
            trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
            setCurrentIndex(0);
        }
    }, [children.length]);

    return (
        <div className={styles.carousel}>
            <div
                ref={trackRef}
                className={styles.track}
                onScroll={handleScroll}
            >
                {children.map((child, index) => (
                    <div key={index} className={styles.slide}>
                        {child}
                    </div>
                ))}
            </div>

            {children.length > slidesPerView && (
                <>
                    <div className={styles.controls}>
                        <button
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className={styles.controlBtn}
                            aria-label="Previous"
                        >
                            <FiChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goNext}
                            disabled={currentIndex >= maxIndex}
                            className={styles.controlBtn}
                            aria-label="Next"
                        >
                            <FiChevronRight size={24} />
                        </button>
                    </div>

                    <div className={styles.dots}>
                        {Array.from({ length: maxIndex + 1 }, (_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
                                onClick={() => scrollToSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
