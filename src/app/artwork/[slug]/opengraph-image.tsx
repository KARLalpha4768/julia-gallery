import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getArtworkBySlug, artworks } from "@/lib/data";

export const alt = "Julia Art — Original Watercolour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Julia Art
        </div>
      ),
      { ...size }
    );
  }

  // Read the artwork image from public directory
  let imgSrc = "";
  try {
    const imgPath = join(process.cwd(), "public", artwork.src);
    const imgData = await readFile(imgPath, "base64");
    const ext = artwork.src.endsWith(".png") ? "png" : "jpeg";
    imgSrc = `data:image/${ext};base64,${imgData}`;
  } catch {
    // silently skip if image not readable
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
        }}
      >
        {/* Artwork image — left half */}
        <div
          style={{
            width: imgSrc ? "50%" : "0",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "#111",
          }}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              alt={artwork.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* Details — right half */}
        <div
          style={{
            width: imgSrc ? "50%" : "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 600,
              color: "#d4af37",
              letterSpacing: "0.12em",
              marginBottom: 24,
            }}
          >
            JULIA ART — ORIGINAL WATERCOLOUR
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 42,
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {artwork.title}
          </div>

          {/* Series */}
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#999",
              marginBottom: 32,
            }}
          >
            {artwork.series}
          </div>

          {/* Specs */}
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#666",
            }}
          >
            {artwork.medium} · {artwork.dimensions} · {artwork.year}
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 600,
              color: "#d4af37",
              marginTop: 32,
            }}
          >
            {artwork.priceFormatted}
          </div>

          {/* URL */}
          <div
            style={{
              display: "flex",
              fontSize: 13,
              color: "#555",
              marginTop: "auto",
            }}
          >
            Julia Art
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
