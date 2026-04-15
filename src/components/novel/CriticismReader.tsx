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

/** Check if an excerpt is a direct quotation (from a published source) vs commentary */
function isDirectQuote(author: string): boolean {
  const commentaryPrefixes = ["On ", "Critical Commentary"];
  return !commentaryPrefixes.some(
    (p) => author.startsWith(p) || author === p
  );
}

export function CriticismReader() {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const rafRef = useRef<number>(0);
  const userScrolling = useRef(false);

  const speed = SPEEDS[speedIdx];

  // ── Auto-scroll loop ──
  const tick = useCallback(() => {
    if (!playing || userScrolling.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    window.scrollBy(0, BASE_SPEED * speed);
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setPlaying(false);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [playing, speed]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // ── Manual scroll detection ──
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onInteract = () => {
      userScrolling.current = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        userScrolling.current = false;
      }, RESUME_DELAY);
    };
    window.addEventListener("wheel", onInteract, { passive: true });
    window.addEventListener("touchmove", onInteract, { passive: true });
    return () => {
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchmove", onInteract);
      clearTimeout(timeout);
    };
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

  const categoryLabels = {
    literary: "Literary Criticism",
    art: "Art Criticism",
    poetics: "Poetics",
  };

  return (
    <div className={styles.container}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.flourish} />
        <h1 className={styles.heroTitle}>{CRITICISM_TITLE}</h1>
        <p className={styles.heroSubtitle}>{CRITICISM_SUBTITLE}</p>
        <div className={styles.flourish} />
        <p className={styles.scrollHint}>
          Press space to begin · Scroll to explore
        </p>
      </section>

      <ArtCollageBorder />

      {/* ── Criticism Excerpts ── */}
      <div className={styles.reader}>
        {CRITICISM_EXCERPTS.map((excerpt, i) => (
          <div key={i}>
            <div className={styles.excerpt}>
              <span className={styles.categoryTag}>
                {categoryLabels[excerpt.category]}
              </span>
              <span className={styles.quoteOpen}>&ldquo;</span>
              <p
                className={`${styles.excerptText} ${
                  isDirectQuote(excerpt.author)
                    ? styles.excerptTextQuote
                    : ""
                }`}
              >
                {excerpt.text}
              </p>
              <div className={styles.attribution}>
                <span className={styles.author}>{excerpt.author}</span>
                <span className={styles.source}>{excerpt.source}</span>
              </div>
            </div>
            {i < CRITICISM_EXCERPTS.length - 1 && (
              <ArtCollageBorder thin />
            )}
          </div>
        ))}

        {/* Link back to novel */}
        <div className={styles.linkSection}>
          <ArtCollageBorder />
          <div style={{ height: "2rem" }} />
          <a href="/novel" className={styles.linkBtn}>
            ← Return to the Novel
          </a>
        </div>
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
        <div className={styles.dividerLine} />
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
