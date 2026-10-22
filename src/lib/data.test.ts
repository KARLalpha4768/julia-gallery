import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  artworks,
  getAllSeries,
  getArtworkById,
  getArtworkBySlug,
  getArtworksBySeries,
} from "@/lib/data";

// Data-quality checks for the artwork catalogue (src/lib/data.ts).
// The catalogue is hand-edited, so these tests act as a schema/contract gate:
// a bad slug, duplicate id, or mismatched price fails CI instead of production.

const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

describe("artwork catalogue integrity", () => {
  it("is not empty", () => {
    expect(artworks.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = artworks.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique, URL-safe kebab-case slugs", () => {
    const slugs = artworks.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it.each(artworks.map((a) => [a.slug, a] as const))(
    "%s has valid required fields",
    (_slug, a) => {
      expect(Number.isInteger(a.id) && a.id > 0).toBe(true);
      expect(a.title.trim()).not.toBe("");
      expect(a.series.trim()).not.toBe("");
      expect(a.description.trim()).not.toBe("");
      expect(Number.isInteger(a.price) && a.price > 0).toBe(true);
      expect(a.year).toBeGreaterThanOrEqual(2000);
      expect(a.year).toBeLessThanOrEqual(new Date().getFullYear() + 1);
      expect(Array.isArray(a.materials)).toBe(true);
      expect(typeof a.framed).toBe("boolean");
      expect(typeof a.available).toBe("boolean");
    },
  );

  it.each(artworks.map((a) => [a.slug, a] as const))(
    "%s priceFormatted matches price (en-US USD)",
    (_slug, a) => {
      expect(a.priceFormatted).toBe(usd.format(a.price));
    },
  );

  it.each(artworks.map((a) => [a.slug, a] as const))(
    "%s image files exist under public/",
    (_slug, a) => {
      for (const src of [a.src, ...(a.images ?? [])]) {
        expect(src.startsWith("/"), src).toBe(true);
        expect(existsSync(path.join(PUBLIC_DIR, src)), src).toBe(true);
      }
    },
  );

  it("location URLs, when present, are https", () => {
    for (const a of artworks) {
      if (a.locationUrl) expect(new URL(a.locationUrl).protocol).toBe("https:");
    }
  });
});

describe("catalogue lookup helpers", () => {
  const first = artworks[0];

  it("getArtworkBySlug finds by slug and returns undefined for unknown", () => {
    expect(getArtworkBySlug(first.slug)).toBe(first);
    expect(getArtworkBySlug("does-not-exist")).toBeUndefined();
  });

  it("getArtworkById finds by id and returns undefined for unknown", () => {
    expect(getArtworkById(first.id)).toBe(first);
    expect(getArtworkById(-1)).toBeUndefined();
  });

  it("getAllSeries returns each series once, and every series is non-empty", () => {
    const series = getAllSeries();
    expect(new Set(series).size).toBe(series.length);
    for (const s of series) {
      const items = getArtworksBySeries(s);
      expect(items.length).toBeGreaterThan(0);
      expect(items.every((a) => a.series === s)).toBe(true);
    }
    const total = series.reduce((n, s) => n + getArtworksBySeries(s).length, 0);
    expect(total).toBe(artworks.length);
  });

  it("getArtworksBySeries returns [] for an unknown series", () => {
    expect(getArtworksBySeries("No Such Series")).toEqual([]);
  });
});