"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CRITICISM_TITLE,
  CRITICISM_SUBTITLE,
  CRITICISM_EXCERPTS,
} from "@/lib/criticism-text";
import { ArtCollageBorder } from "./ArtCollageBorder";
import styles from "./CriticismReader.module.css";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
const BASE_SPEED = 0.55;
const RESUME_DELAY = 3000;

function isDirectQuote(author: string): boolean {
  return !author.startsWith("On ") && author !== "Critical Commentary";
}

export function CriticismReader() {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const userScrolling = useRef(false);

  const speed = SPEEDS[speedIdx];

  const getMaxOffset = useCallback(() => {
    if (!trackRef.current || !viewportRef.current) return 0;
    return Math.max(
      0,
      trackRef.current.scrollHeight - viewportRef.current.clientHeight
    );
  }, []);

  const applyOffset = useCallback(
    (newOffset: number) => {
      const max = getMaxOffset();
      const clamped = Math.max(0, Math.min(newOffset, max));
      offsetRef.current = clamped;
      if (trackRef.current) {
        trackRef.current.style.top = `-${clamped}px`;
      }
      if (max > 0) setScrollProgress(clamped / max);
    },
    [getMaxOffset]
  );

  const tick = useCallback(() => {
    if (playing && !userScrolling.current) {
      const newOffset = offsetRef.current + BASE_SPEED * speed;
      const max = getMaxOffset();
      if (newOffset >= max) {
        applyOffset(max);
        setPlaying(false);
      } else {
        applyOffset(newOffset);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [playing, speed, applyOffset, getMaxOffset]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      userScrolling.current = true;
      applyOffset(offsetRef.current + e.deltaY);
      clearTimeout(timeout);
      timeout = setTimeout(() => { userScrolling.current = false; }, RESUME_DELAY);
    };
    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      userScrolling.current = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      applyOffset(offsetRef.current + dy);
    };
    const onTouchEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => { userScrolling.current = false; }, RESUME_DELAY);
    };
    const vp = viewportRef.current;
    if (vp) {
      vp.addEventListener("wheel", onWheel, { passive: false });
      vp.addEventListener("touchstart", onTouchStart, { passive: true });
      vp.addEventListener("touchmove", onTouchMove, { passive: false });
      vp.addEventListener("touchend", onTouchEnd, { passive: true });
    }
    return () => {
      if (vp) {
        vp.removeEventListener("wheel", onWheel);
        vp.removeEventListener("touchstart", onTouchStart);
        vp.removeEventListener("touchmove", onTouchMove);
        vp.removeEventListener("touchend", onTouchEnd);
      }
      clearTimeout(timeout);
    };
  }, [applyOffset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  const categoryLabels = {
    literary: "Literary Criticism",
    art: "Art Criticism",
    poetics: "Poetics",
  };

  return (
    <div className={styles.page}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track} ref={trackRef} style={{ top: 0 }}>
          <section className={styles.hero}>
            <div className={styles.flourish} />
            <h1 className={styles.heroTitle}>{CRITICISM_TITLE}</h1>
            <p className={styles.heroSubtitle}>{CRITICISM_SUBTITLE}</p>
            <div className={styles.flourish} />
          </section>

          <ArtCollageBorder />

          {CRITICISM_EXCERPTS.map((excerpt, i) => (
            <div key={i}>
              <div className={styles.excerpt}>
                <span className={styles.categoryTag}>
                  {categoryLabels[excerpt.category]}
                </span>
                <span className={styles.quoteOpen}>&ldquo;</span>
                <p
                  className={`${styles.excerptText} ${
                    isDirectQuote(excerpt.author) ? styles.excerptTextQuote : ""
                  }`}
                >
                  {excerpt.text}
                </p>
                <div className={styles.attribution}>
                  <span className={styles.author}>{excerpt.author}</span>
                  <span className={styles.source}>{excerpt.source}</span>
                </div>
              </div>
              {i < CRITICISM_EXCERPTS.length - 1 && <ArtCollageBorder thin />}
            </div>
          ))}

          <div className={styles.linkSection}>
            <ArtCollageBorder />
            <div style={{ height: "2rem" }} />
            <a href="/novel" className={styles.linkBtn}>
              ← Return to the Novel
            </a>
          </div>

          <div className={styles.endSpacer} />
        </div>

        <div className={styles.scrollbar}>
          <div
            className={styles.scrollThumb}
            style={{
              height: "8%",
              top: `${scrollProgress * 92}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${styles.playBtn}`}
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause" : "Play"}
          title="Space"
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div className={styles.dividerLine} />
        <button
          className={styles.controlBtn}
          onClick={cycleSpeed}
          aria-label="Change speed"
        >
          ⏱
        </button>
        <span className={styles.speedLabel}>{speed}×</span>
      </div>
    </div>
  );
}
