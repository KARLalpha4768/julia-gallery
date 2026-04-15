"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./ImageZoom.module.css";

interface ImageZoomProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageZoom({ src, alt, onClose }: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(1, Math.min(5, s - e.deltaY * 0.002)));
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
    },
    [scale]
  );

  const handleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setOrigin({ x: 50, y: 50 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close zoom">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className={styles.hint}>
        {scale <= 1 ? "Click to zoom · Scroll to adjust" : "Click to reset · Drag to explore"}
      </div>

      <div
        ref={containerRef}
        className={styles.imageContainer}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onMouseMove={handleMove}
        onWheel={handleWheel}
        style={{
          cursor: scale > 1 ? "zoom-out" : "zoom-in",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          quality={95}
          priority
          className={styles.image}
          style={{
            objectFit: "contain",
            transform: `scale(${scale})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />
      </div>
    </div>
  );
}
