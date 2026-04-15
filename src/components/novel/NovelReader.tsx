"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  NOVEL_TITLE,
  NOVEL_SUBTITLE,
  NOVEL_AUTHOR,
  NOVEL_EPIGRAPH,
  NOVEL_CHAPTERS,
} from "@/lib/novel-text";
import { ArtCollageBorder } from "./ArtCollageBorder";
import styles from "./NovelReader.module.css";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
/** Pixels per frame at 60fps. 1x ≈ 50 wpm reading pace */
const BASE_SPEED = 0.55;
const RESUME_DELAY = 3000;

export function NovelReader() {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const userScrolling = useRef(false);
  const chapterOffsets = useRef<number[]>([]);

  const speed = SPEEDS[speedIdx];

  // ── Measure chapter positions once track is rendered ──
  useEffect(() => {
    if (!trackRef.current) return;
    const chapters = trackRef.current.querySelectorAll("[data-chapter]");
    chapterOffsets.current = Array.from(chapters).map(
      (el) => (el as HTMLElement).offsetTop
    );
  }, []);

  // ── Get max scroll distance ──
  const getMaxOffset = useCallback(() => {
    if (!trackRef.current || !viewportRef.current) return 0;
    return Math.max(
      0,
      trackRef.current.scrollHeight - viewportRef.current.clientHeight
    );
  }, []);

  // ── Apply offset to track position ──
  const applyOffset = useCallback(
    (newOffset: number) => {
      const max = getMaxOffset();
      const clamped = Math.max(0, Math.min(newOffset, max));
      offsetRef.current = clamped;

      if (trackRef.current) {
        trackRef.current.style.top = `-${clamped}px`;
      }

      // Update progress
      if (max > 0) {
        setScrollProgress(clamped / max);
      }

      // Update active chapter
      const offsets = chapterOffsets.current;
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (clamped >= offsets[i] - 200) {
          setActiveChapter(i);
          break;
        }
      }
    },
    [getMaxOffset]
  );

  // ── Auto-scroll tick ──
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

  // ── Mouse wheel / touch to manually scroll ──
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      userScrolling.current = true;
      applyOffset(offsetRef.current + e.deltaY);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        userScrolling.current = false;
      }, RESUME_DELAY);
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
      timeout = setTimeout(() => {
        userScrolling.current = false;
      }, RESUME_DELAY);
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

  // ── Keyboard ──
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

  const jumpToChapter = (idx: number) => {
    const offset = chapterOffsets.current[idx];
    if (offset !== undefined) {
      applyOffset(offset);
    }
  };

  // Scrollbar thumb height
  const thumbHeight = Math.max(30, (1 / (NOVEL_CHAPTERS.length + 1)) * 100);

  return (
    <div className={styles.page}>
      {/* ── Viewport ── */}
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track} ref={trackRef} style={{ top: 0 }}>
          {/* Hero */}
          <section className={styles.hero}>
            <div className={styles.flourish} />
            <h1 className={styles.heroTitle}>{NOVEL_TITLE}</h1>
            <p className={styles.heroSubtitle}>{NOVEL_SUBTITLE}</p>
            <p className={styles.heroAuthor}>by {NOVEL_AUTHOR}</p>
            <div className={styles.flourish} />
            <blockquote className={styles.epigraph}>{NOVEL_EPIGRAPH}</blockquote>
          </section>

          <ArtCollageBorder />

          {/* Chapters */}
          {NOVEL_CHAPTERS.map((chapter, ci) => (
            <div key={ci} data-chapter={ci}>
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
              <div className={styles.chapterDivider} />
              {chapter.paragraphs.map((para, pi) => (
                <p key={pi} className={styles.paragraph}>
                  {para}
                </p>
              ))}
              {ci < NOVEL_CHAPTERS.length - 1 && <ArtCollageBorder thin />}
            </div>
          ))}

          {/* Link to Criticism */}
          <div className={styles.linkSection}>
            <ArtCollageBorder />
            <div style={{ height: "2rem" }} />
            <a href="/criticism" className={styles.linkBtn}>
              Continue to Critical Reflections →
            </a>
          </div>

          {/* Spacer so last text can scroll fully through the viewport */}
          <div className={styles.endSpacer} />
        </div>

        {/* Custom scrollbar */}
        <div className={styles.scrollbar}>
          <div
            className={styles.scrollThumb}
            style={{
              height: `${thumbHeight}%`,
              top: `${scrollProgress * (100 - thumbHeight)}%`,
            }}
          />
        </div>
      </div>

      {/* ── Chapter Progress Rail ── */}
      <div className={styles.progressRail}>
        {NOVEL_CHAPTERS.map((chapter, i) => (
          <button
            key={i}
            className={`${styles.progressDot} ${
              i === activeChapter ? styles.progressDotActive : ""
            }`}
            onClick={() => jumpToChapter(i)}
            title={chapter.title}
            aria-label={`Jump to ${chapter.title}`}
          />
        ))}
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${styles.playBtn}`}
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause" : "Play"}
          title="Space"
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div className={styles.divider} />
        <button
          className={styles.controlBtn}
          onClick={cycleSpeed}
          aria-label="Change speed"
          title="Reading speed"
        >
          ⏱
        </button>
        <span className={styles.speedLabel}>{speed}×</span>
      </div>
    </div>
  );
}
