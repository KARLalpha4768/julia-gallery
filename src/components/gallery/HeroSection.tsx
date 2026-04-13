"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} id="hero-section">
      {/* Full-bleed artwork */}
      <div className={styles.imageWrapper}>
        <Image
          src="/artwork/piece-7.jpeg"
          alt="Featured artwork — abstract composition in cerulean blue, charcoal and gold"
          fill
          sizes="100vw"
          priority
          quality={90}
          className={`${styles.heroImage} ${loaded ? styles.loaded : ""}`}
          style={{ objectFit: "cover" }}
        />
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={`${styles.content} ${loaded ? styles.contentLoaded : ""}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Featured Work
        </div>
        <h1 className={styles.title}>
          Where Color
          <br />
          <em>Becomes Territory</em>
        </h1>
        <p className={styles.subtitle}>
          Original contemporary paintings exploring the boundaries between
          landscape, memory, and abstraction. Each work is a window into the
          chromatic language of the Indo-Pacific.
        </p>
        <div className={styles.ctas}>
          <a href="/#collection" className={styles.primaryCta} id="hero-view-collection">
            View Collection
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a href="/#about" className={styles.secondaryCta} id="hero-about-artist">
            About the Artist
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
