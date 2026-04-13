"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ArtworkCarousel.module.css";

interface ArtworkCarouselProps {
  images: string[];
  title: string;
}

export function ArtworkCarousel({ images, title }: ArtworkCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);
  const isSingle = images.length <= 1;

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (isAnimating || index === activeIndex) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsAnimating(false);
      }, 320);
    },
    [isAnimating, activeIndex]
  );

  const prev = useCallback(() => {
    const newIndex = (activeIndex - 1 + images.length) % images.length;
    goTo(newIndex, "prev");
  }, [activeIndex, images.length, goTo]);

  const next = useCallback(() => {
    const newIndex = (activeIndex + 1) % images.length;
    goTo(newIndex, "next");
  }, [activeIndex, images.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (isSingle) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, isSingle]);

  // Touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className={styles.carousel}>
      {/* Main Viewer */}
      <div
        className={styles.frame}
        onTouchStart={isSingle ? undefined : handleTouchStart}
        onTouchEnd={isSingle ? undefined : handleTouchEnd}
        aria-label={`Image ${activeIndex + 1} of ${images.length}: ${title}`}
        role="img"
      >
        <div
          className={`${styles.slide} ${
            isAnimating
              ? direction === "next"
                ? styles.exitLeft
                : styles.exitRight
              : ""
          }`}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} — view ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            quality={92}
            priority={activeIndex === 0}
            className={styles.image}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Prev / Next Arrows — only if multiple images */}
        {!isSingle && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={prev}
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={next}
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Image counter */}
            <div className={styles.counter}>
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {!isSingle && (
        <div className={styles.dots} role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View image ${i + 1}`}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i, i > activeIndex ? "next" : "prev")}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip — only if 2+ images */}
      {images.length > 1 && (
        <div className={styles.thumbnails} role="list" aria-label="Image thumbnails">
          {images.map((src, i) => (
            <button
              key={i}
              role="listitem"
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ""}`}
              onClick={() => goTo(i, i > activeIndex ? "next" : "prev")}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                quality={70}
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
