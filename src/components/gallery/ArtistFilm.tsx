"use client";

import { useRef, useState } from "react";
import styles from "./ArtistFilm.module.css";

export function ArtistFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  function handleClick() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <section className={styles.section} id="film">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>The Artist at Work</span>
          <h2 className={styles.heading}>
            Painting the Indian Ocean
          </h2>
          <p className={styles.subheading}>
            On location — the act of making, in Mauritian light.
          </p>
        </div>

        <div className={styles.videoWrap} onClick={handleClick}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/artist-film.mp4"
            playsInline
            loop
            autoPlay
            muted
            poster="/artwork/piece-new-16.jpeg"
          />
          {!playing && (
            <div className={styles.playOverlay}>
              <div className={styles.playBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <span className={styles.playLabel}>Watch the process</span>
            </div>
          )}
        </div>

        <div className={styles.caption}>
          <p className={styles.captionText}>
            &ldquo;I don&rsquo;t illustrate the island. I let it paint through me.&rdquo;
          </p>
          <span className={styles.captionMeta}>Tamarin Bay, Mauritius · 2026</span>
        </div>
      </div>
    </section>
  );
}
