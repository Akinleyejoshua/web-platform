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

    const goTo = useCallback((index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    }, [maxIndex]);

    const goNext = useCallback(() => {
        goTo(currentIndex + 1);
    }, [currentIndex, goTo]);

    const goPrev = useCallback(() => {
        goTo(currentIndex - 1);
    }, [currentIndex, goTo]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            if (currentIndex >= maxIndex) {
                setCurrentIndex(0);
            } else {
                goNext();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, currentIndex, maxIndex, goNext]);

    // Reset index when children change
    useEffect(() => {
        setCurrentIndex(0);
    }, [children.length]);

    const translateX = -(currentIndex * (100 / slidesPerView));

    return (
        <div className={styles.carousel}>
            <div
                className={styles.track}
                style={{ transform: `translateX(${translateX}%)` }}
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
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
