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
/** Pixels per frame at 60fps, speed 1x → ~50 words/minute reading pace */
const BASE_SPEED = 0.55;
/** Milliseconds of idle scroll before auto-scroll resumes */
const RESUME_DELAY = 3000;

export function NovelReader() {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1x
  const [activeChapter, setActiveChapter] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastScrollTime = useRef(0);
  const userScrolling = useRef(false);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const speed = SPEEDS[speedIdx];

  // ── Auto-scroll loop ──
  const tick = useCallback(() => {
    if (!playing || userScrolling.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    window.scrollBy(0, BASE_SPEED * speed);
    // Stop at bottom
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setPlaying(false);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [playing, speed]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // ── Detect manual scroll → pause auto, resume after idle ──
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const now = Date.now();
      // If user scrolled (not our auto-scroll)
      if (now - lastScrollTime.current > 50) {
        userScrolling.current = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          userScrolling.current = false;
        }, RESUME_DELAY);
      }
      lastScrollTime.current = now;
    };

    const onWheel = () => {
      userScrolling.current = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        userScrolling.current = false;
      }, RESUME_DELAY);
    };

    const onTouch = () => {
      userScrolling.current = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        userScrolling.current = false;
      }, RESUME_DELAY);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
      clearTimeout(timeout);
    };
  }, []);

  // ── Track active chapter ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = chapterRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (idx !== -1) setActiveChapter(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Keyboard shortcuts ──
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

  const cycleSpeed = () => {
    setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  };

  const scrollToChapter = (idx: number) => {
    const el = chapterRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.container} ref={scrollRef}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.flourish} />
        <h1 className={styles.heroTitle}>{NOVEL_TITLE}</h1>
        <p className={styles.heroSubtitle}>{NOVEL_SUBTITLE}</p>
        <p className={styles.heroAuthor}>by {NOVEL_AUTHOR}</p>
        <div className={styles.flourish} />
        <blockquote className={styles.epigraph}>
          {NOVEL_EPIGRAPH}
        </blockquote>
        <p className={styles.scrollHint}>
          Press space to begin reading · Scroll to navigate
        </p>
      </section>

      <ArtCollageBorder />

      {/* ── Novel Text ── */}
      <div className={styles.reader}>
        {NOVEL_CHAPTERS.map((chapter, ci) => (
          <div
            key={ci}
            className={styles.chapter}
            ref={(el) => { chapterRefs.current[ci] = el; }}
          >
            <h2 className={styles.chapterTitle}>{chapter.title}</h2>
            <div className={styles.chapterDivider} />
            {chapter.paragraphs.map((para, pi) => (
              <p key={pi} className={styles.paragraph}>
                {para}
              </p>
            ))}
            {ci < NOVEL_CHAPTERS.length - 1 && (
              <ArtCollageBorder thin />
            )}
          </div>
        ))}

        {/* Link to Criticism page */}
        <div className={styles.linkSection}>
          <ArtCollageBorder />
          <div style={{ height: "2rem" }} />
          <a href="/criticism" className={styles.linkBtn}>
            Continue to Critical Reflections →
          </a>
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
            onClick={() => scrollToChapter(i)}
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
          aria-label={playing ? "Pause auto-scroll" : "Start auto-scroll"}
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
