"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { artworks, type Artwork } from "@/lib/data";
import styles from "./RecentlyViewed.module.css";

const STORAGE_KEY = "julia-recently-viewed";
const MAX_ITEMS = 6;

function loadRecent(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Call this on artwork detail pages to record a view */
export function recordView(artworkId: number) {
  if (typeof window === "undefined") return;
  try {
    const ids = loadRecent().filter((id) => id !== artworkId);
    ids.unshift(artworkId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
  } catch { /* quota */ }
}

export function RecentlyViewed() {
  const [items, setItems] = useState<Artwork[]>([]);

  useEffect(() => {
    const ids = loadRecent();
    const resolved = ids
      .map((id) => artworks.find((a) => a.id === id))
      .filter(Boolean) as Artwork[];
    setItems(resolved);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h3 className={styles.heading}>Recently Viewed</h3>
        <div className={styles.strip}>
          {items.map((art) => (
            <Link
              key={art.id}
              href={`/artwork/${art.slug}`}
              className={styles.card}
            >
              <div className={styles.thumb}>
                <Image
                  src={art.src}
                  alt={art.title}
                  fill
                  sizes="120px"
                  quality={70}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className={styles.title}>{art.title}</span>
              <span className={styles.price}>{art.priceFormatted}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
