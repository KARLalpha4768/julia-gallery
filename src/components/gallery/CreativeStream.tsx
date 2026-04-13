"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CreativeStream.module.css";
import { artworks, getAllSeries } from "@/lib/data";

const series = ["All", ...getAllSeries()];

export function CreativeStream() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === "All"
    ? artworks
    : artworks.filter((a) => a.series === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"));
            setVisibleItems((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    const cards = gridRef.current?.querySelectorAll("[data-id]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filtered]);

  return (
    <section className={styles.section} id="collection">
      <div className={styles.inner}>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.label}>Collection</span>
          <h2 className={styles.heading}>
            Original Works
          </h2>
          <p className={styles.description}>
            Each painting is a unique, museum-grade original. Explore by series
            or browse the full body of work.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters} id="collection-filters">
          {series.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${activeFilter === s ? styles.filterActive : ""}`}
              onClick={() => setActiveFilter(s)}
            >
              {s}
              {activeFilter === s && (
                <span className={styles.filterCount}>
                  {s === "All" ? artworks.length : artworks.filter((a) => a.series === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid} ref={gridRef}>
          {filtered.map((artwork, index) => (
            <Link
              href={`/artwork/${artwork.slug}`}
              key={artwork.id}
              className={styles.cardLink}
            >
              <article
                className={`${styles.card} ${visibleItems.has(artwork.id) ? styles.cardVisible : ""}`}
                data-id={artwork.id}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={artwork.src}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    className={styles.img}
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.cardOverlay}>
                    <span className={styles.quickView}>
                      View Details
                    </span>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.series}>{artwork.series}</span>
                  <h3 className={styles.cardTitle}>{artwork.title}</h3>
                  <div className={styles.cardMeta}>
                    <span>{artwork.medium}</span>
                    <span className={styles.dot}>·</span>
                    <span>{artwork.dimensions}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{artwork.priceFormatted}</span>
                    <span className={styles.inquireBtn}>
                      View
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
