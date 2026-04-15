"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  NOVEL_TITLE,
  NOVEL_SUBTITLE,
  NOVEL_AUTHOR,
  NOVEL_EPIGRAPH,
  NOVEL_CHAPTERS,
} from "@/lib/novel-text";
import {
  CRITICISM_TITLE,
  CRITICISM_SUBTITLE,
  CRITICISM_EXCERPTS,
} from "@/lib/criticism-text";
import { ArtCollageBorder } from "./ArtCollageBorder";
import styles from "./NovelReader.module.css";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
const BASE_SPEED = 0.55;
const RESUME_DELAY = 3000;

function isDirectQuote(author: string): boolean {
  return !author.startsWith("On ") && author !== "Critical Commentary";
}

const categoryLabels: Record<string, string> = {
  literary: "Literary Criticism",
  art: "Art Criticism",
  poetics: "Poetics",
  philosophy: "Philosophy of Art",
};

/**
 * Teleprompter pane — drives a single scrolling track
 */
function useScrollPane() {
  const trackRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  const getMax = useCallback(() => {
    if (!trackRef.current || !paneRef.current) return 0;
    return Math.max(
      0,
      trackRef.current.scrollHeight - paneRef.current.clientHeight
    );
  }, []);

  const apply = useCallback(
    (val: number) => {
      const max = getMax();
      const clamped = Math.max(0, Math.min(val, max));
      offsetRef.current = clamped;
      if (trackRef.current) {
        trackRef.current.style.top = `-${clamped}px`;
      }
      return clamped >= max;
    },
    [getMax]
  );

  return { trackRef, paneRef, offsetRef, getMax, apply };
}

export function NovelReader() {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [visible, setVisible] = useState(false);
  const [showLeftBanner, setShowLeftBanner] = useState(false);
  const [showRightBanner, setShowRightBanner] = useState(false);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const rafRef = useRef<number>(0);
  const userScrollingLeft = useRef(false);
  const userScrollingRight = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTitleRef = useRef<HTMLHeadingElement>(null);
  const rightTitleRef = useRef<HTMLHeadingElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const left = useScrollPane();
  const right = useScrollPane();

  const speed = SPEEDS[speedIdx];

  // ── Jump to a specific chapter ──
  const jumpToChapter = useCallback(
    (index: number) => {
      const el = chapterRefs.current[index];
      if (!el) return;
      // The chapter's offsetTop within the track, minus some top padding
      const target = Math.max(0, el.offsetTop - 60);
      left.apply(target);
      userScrollingLeft.current = true;
      // Resume auto-scroll after delay
      setTimeout(() => {
        userScrollingLeft.current = false;
      }, RESUME_DELAY);
      setTocOpen(false);
    },
    [left]
  );

  // ── Auto-scroll tick — both panes scroll together ──
  const tick = useCallback(() => {
    const delta = BASE_SPEED * speed;
    if (playing) {
      let leftDone = false;
      let rightDone = false;
      if (!userScrollingLeft.current) {
        leftDone = left.apply(left.offsetRef.current + delta);
      }
      if (!userScrollingRight.current) {
        rightDone = right.apply(right.offsetRef.current + delta);
      }
      if (leftDone && rightDone) {
        setPlaying(false);
      }
    }

    // ── Check if titles have scrolled past ──
    if (leftTitleRef.current) {
      const el = leftTitleRef.current;
      const gone = left.offsetRef.current > el.offsetTop + el.offsetHeight;
      setShowLeftBanner(gone);
    }
    if (rightTitleRef.current) {
      const el = rightTitleRef.current;
      const gone = right.offsetRef.current > el.offsetTop + el.offsetHeight;
      setShowRightBanner(gone);
    }

    // ── Update scroll progress ──
    const leftMax = left.getMax();
    const rightMax = right.getMax();
    setLeftProgress(leftMax > 0 ? left.offsetRef.current / leftMax : 0);
    setRightProgress(rightMax > 0 ? right.offsetRef.current / rightMax : 0);

    rafRef.current = requestAnimationFrame(tick);
  }, [playing, speed, left, right]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // ── Wire up wheel/touch for each pane ──
  const wirePane = useCallback(
    (
      paneEl: HTMLDivElement | null,
      applyFn: (v: number) => boolean,
      offsetRef: React.MutableRefObject<number>,
      userScrolling: React.MutableRefObject<boolean>
    ) => {
      if (!paneEl) return () => {};
      let timeout: ReturnType<typeof setTimeout>;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        userScrolling.current = true;
        applyFn(offsetRef.current + e.deltaY);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          userScrolling.current = false;
        }, RESUME_DELAY);
      };

      let lastY = 0;
      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        lastY = e.touches[0].clientY;
        userScrolling.current = true;
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dy = lastY - e.touches[0].clientY;
        lastY = e.touches[0].clientY;
        applyFn(offsetRef.current + dy);
      };
      const onTouchEnd = (e: TouchEvent) => {
        e.stopPropagation();
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          userScrolling.current = false;
        }, RESUME_DELAY);
      };

      paneEl.addEventListener("wheel", onWheel, { passive: false });
      paneEl.addEventListener("touchstart", onTouchStart, { passive: false });
      paneEl.addEventListener("touchmove", onTouchMove, { passive: false });
      paneEl.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        paneEl.removeEventListener("wheel", onWheel);
        paneEl.removeEventListener("touchstart", onTouchStart);
        paneEl.removeEventListener("touchmove", onTouchMove);
        paneEl.removeEventListener("touchend", onTouchEnd);
        clearTimeout(timeout);
      };
    },
    []
  );

  useEffect(() => {
    const cleanL = wirePane(
      left.paneRef.current,
      left.apply,
      left.offsetRef,
      userScrollingLeft
    );
    const cleanR = wirePane(
      right.paneRef.current,
      right.apply,
      right.offsetRef,
      userScrollingRight
    );
    return () => {
      cleanL();
      cleanR();
    };
  }, [wirePane, left, right]);

  // ── Start scrolling when section is visible ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          setPlaying(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

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

  // ── Close TOC on outside click ──
  useEffect(() => {
    if (!tocOpen) return;
    const handleClick = () => setTocOpen(false);
    setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => document.removeEventListener("click", handleClick);
  }, [tocOpen]);

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  return (
    <div className={styles.wrapper} id="novel">
      {/* ── Philosophical Introduction ── */}
      <section className={styles.intro}>
        <p className={styles.introKicker}>The Source &amp; The Reflection</p>
        <h2 className={styles.introTitle}>
          Where the Painter&rsquo;s Eye Meets the Critic&rsquo;s Word
        </h2>
        <div className={styles.introFlourish} />
        <p className={styles.introBody}>
          Every painting begins twice: once in the act of seeing, and again in
          the language that tries to hold what was seen. Julia Andrasy&rsquo;s
          canvases are born from a journey — not merely across an ocean to
          Mauritius, but inward, through the ancient dialogue between
          <span className={styles.introBodyAccent}>
            {" "}experience and understanding, colour and meaning, the hand that
            paints and the mind that asks why.
          </span>
        </p>
        <p className={styles.introBody}>
          What follows is that dialogue made visible. On one side, the novel —
          the raw encounter, the artist&rsquo;s eye absorbing a world of
          seven-coloured earth, coral lagoons, cyclones, and sacred light. On
          the other, the accumulated wisdom of those who have thought most
          deeply about what it means to see, to create, and to render the
          transient permanent: Walcott on the sea as history, Rilke on
          attention as devotion, Ruskin on sight as prophecy, Gauguin on the
          courage to stay.
        </p>
        <p className={styles.introBody}>
          Together, these scrolls form the philosophical bedrock beneath every
          brushstroke in the gallery above — the lived experience and the
          learned tradition, moving in parallel, neither complete without the
          other.
        </p>
        <div className={styles.introColumns}>
          <div className={styles.introCol}>
            <p className={styles.introColTitle}>← The Novel</p>
            <p className={styles.introColText}>
              Seven Coloured Earth — Julia&rsquo;s journey through Mauritius.
              The raw material of vision: landscape, encounter, solitude, and
              the stubborn act of making paint from earth and saffron when no
              art shop exists. This is where the paintings are born.
            </p>
          </div>
          <div className={styles.introCol}>
            <p className={styles.introColTitle}>The Critique →</p>
            <p className={styles.introColText}>
              Voices from the traditions of literary criticism, art history,
              and poetics — placing Julia&rsquo;s work alongside Monet&rsquo;s
              haystacks, Baudelaire&rsquo;s voyages, and Walcott&rsquo;s
              island memory. The frame through which the paintings speak.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.bannerBar}>
        <ArtCollageBorder />
        <div className={styles.bannerTitles}>
          <div className={`${styles.bannerTitle} ${showLeftBanner ? styles.bannerTitleVisible : ''}`}>
            {NOVEL_TITLE}
            <span className={styles.bannerSubtitle}>Novel</span>
          </div>
          <div className={`${styles.bannerTitle} ${showRightBanner ? styles.bannerTitleVisible : ''}`}>
            {CRITICISM_TITLE}
            <span className={styles.bannerSubtitle}>Critique</span>
          </div>
        </div>
      </div>

      {/* ── Dueling Scroll Panes ── */}
      <div className={styles.page} ref={containerRef}>
        {/* ── LEFT PANE: Novel ── */}
      <div className={styles.paneLeft} ref={left.paneRef}>
        {/* Scroll progress bar */}
        <div className={styles.scrollBarLeft}>
          <div
            className={styles.scrollThumbLeft}
            style={{ top: `${leftProgress * 100}%` }}
          />
        </div>

        <div className={styles.track} ref={left.trackRef} style={{ top: 0 }}>
          <h1 className={styles.novelTitle} ref={leftTitleRef}>{NOVEL_TITLE}</h1>
          <p className={styles.novelSubtitle}>{NOVEL_SUBTITLE}</p>
          <p className={styles.novelAuthor}>by {NOVEL_AUTHOR}</p>
          <div className={styles.flourish} />
          <blockquote className={styles.epigraph}>{NOVEL_EPIGRAPH}</blockquote>

          {NOVEL_CHAPTERS.map((chapter, ci) => (
            <div
              key={ci}
              ref={(el) => { chapterRefs.current[ci] = el; }}
            >
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
              <div className={styles.chapterDivider} />
              {chapter.paragraphs.map((para, pi) => (
                <p key={pi} className={styles.paragraph}>
                  {para}
                </p>
              ))}
            </div>
          ))}
          <div className={styles.endSpacer} />
        </div>
      </div>

      {/* ── CENTER: Art Collage Border ── */}
      <div className={styles.borderColumn}>
        <ArtCollageBorder vertical />
      </div>

      {/* ── RIGHT PANE: Criticism ── */}
      <div className={styles.paneRight} ref={right.paneRef}>
        {/* Scroll progress bar */}
        <div className={styles.scrollBarRight}>
          <div
            className={styles.scrollThumbRight}
            style={{ top: `${rightProgress * 100}%` }}
          />
        </div>

        <div className={styles.track} ref={right.trackRef} style={{ top: 0 }}>
          <h1 className={styles.criticismTitle} ref={rightTitleRef}>{CRITICISM_TITLE}</h1>
          <p className={styles.criticismSubtitle}>{CRITICISM_SUBTITLE}</p>

          {CRITICISM_EXCERPTS.map((excerpt, i) => (
            <div key={i} className={styles.excerpt}>
              <span className={styles.categoryTag}>
                {categoryLabels[excerpt.category]}
              </span>
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
          ))}
          <div className={styles.endSpacer} />
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
        <div className={styles.divider} />
        <button
          className={`${styles.controlBtn} ${styles.labeledBtn}`}
          onClick={cycleSpeed}
          aria-label="Change speed"
        >
          ⏱
          <span className={styles.btnLabel}>Speed</span>
        </button>
        <span className={styles.speedLabel}>{speed}×</span>
        <div className={styles.divider} />

        {/* Chapter Directory Button */}
        <div className={styles.tocContainer}>
          <button
            className={`${styles.controlBtn} ${styles.labeledBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              setTocOpen((p) => !p);
            }}
            aria-label="Chapter directory"
            title="Jump to chapter"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span className={styles.btnLabel}>Chapters</span>
          </button>

          {/* TOC Dropdown */}
          {tocOpen && (
            <div
              className={styles.tocDropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.tocHeader}>
                <span className={styles.tocLabel}>Chapters</span>
                <span className={styles.tocBookTitle}>{NOVEL_TITLE}</span>
              </div>
              <ul className={styles.tocList}>
                {NOVEL_CHAPTERS.map((chapter, i) => (
                  <li key={i}>
                    <button
                      className={styles.tocItem}
                      onClick={() => jumpToChapter(i)}
                    >
                      <span className={styles.tocNumber}>{i + 1}</span>
                      <span className={styles.tocChapterTitle}>{chapter.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
