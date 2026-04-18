"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    quote:
      "The Chromatic Territories series brought an emotional depth to our Umhlanga project that no European import could match. Our client had honeymooned in Mauritius — when she saw the painting, she cried. That's what great art procurement looks like.",
    name: "Naledi Mthembu",
    title: "Principal Designer",
    firm: "MAD Design Studios",
    location: "Durban",
  },
  {
    quote:
      "We've placed three Julia Art originals in a Clifton residence this year. The colour fields read beautifully against Cape Town light, and the provenance story — a working artist in Mauritius, not a factory edition — is exactly what our collectors want at this price point.",
    name: "Carla van Rensburg",
    title: "Gallery Director",
    firm: "Louise Decor & Design",
    location: "Cape Town",
  },
  {
    quote:
      "What struck me was the turnkey experience. We specified a palette, Julia delivered a bespoke commission, and AGS handled the crating and transit from Port Louis to Johannesburg without a single issue. For a R42,000 original, the value is extraordinary.",
    name: "Thando Osei",
    title: "Senior Interior Architect",
    firm: "Vérelüxe Interiors",
    location: "Johannesburg",
  },
  {
    quote:
      "Mauritius sits at the crossroads of Africa and the Indian Ocean — that's a story our collectors deeply understand. Julia's work bridges both worlds with an authenticity we rarely find at accessible price points.",
    name: "Amahle Dlamini",
    title: "Curator & Buyer",
    firm: "EBONY/CURATED",
    location: "Johannesburg",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const t = testimonials[active];

  return (
    <section
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      ref={sectionRef}
      id="testimonials"
    >
      <div className={styles.inner}>
        <span className={styles.label}>Trusted By</span>
        <h2 className={styles.heading}>What Designers Say</h2>

        <div className={styles.card} key={active}>
          <blockquote className={styles.quote}>
            <svg
              className={styles.quoteIcon}
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              opacity="0.12"
            >
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className={styles.attribution}>
            <div className={styles.avatar}>
              {t.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className={styles.name}>{t.name}</div>
              <div className={styles.role}>
                {t.title}, {t.firm}
              </div>
              <div className={styles.location}>{t.location}</div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
